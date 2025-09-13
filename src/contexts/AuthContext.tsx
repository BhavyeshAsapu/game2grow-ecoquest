import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export type UserCategory = 'student' | 'teacher' | 'parent' | 'other';

export interface User {
  id: string;
  user_id: string;
  username: string;
  email: string;
  category: UserCategory;
  points: number;
  level: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  earned_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { username: string; email: string; password: string; category: UserCategory }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  addAchievement: (title: string, description?: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (userData: { username: string; email: string; password: string; category: UserCategory }): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: userData.username,
            category: userData.category
          }
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
  };

  const updatePoints = async (points: number): Promise<void> => {
    if (user && session) {
      const newPoints = user.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          points: newPoints,
          level: newLevel
        })
        .eq('user_id', session.user.id);
      
      if (!error) {
        setUser({ ...user, points: newPoints, level: newLevel });
        toast({
          title: "Points Updated!",
          description: `You earned ${points} points!`,
        });
      }
    }
  };

  const addAchievement = async (title: string, description?: string): Promise<void> => {
    if (user && session) {
      const { error } = await supabase
        .from('achievements')
        .insert({
          user_id: session.user.id,
          title,
          description
        });
      
      if (!error) {
        toast({
          title: "Achievement Unlocked!",
          description: `You earned: ${title}`,
        });
      }
    }
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    register,
    logout,
    updatePoints,
    addAchievement,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};