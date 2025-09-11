import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserCategory = 'preschool' | 'middle-school' | 'high-school' | 'college';

export interface User {
  id: string;
  fullName: string;
  surname: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  category: UserCategory;
  points: number;
  level: number;
  achievements: string[];
  joinedAt: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'points' | 'level' | 'achievements' | 'joinedAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updatePoints: (points: number) => void;
  addAchievement: (achievement: string) => void;
  isAuthenticated: boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user session on app load
    const storedUser = localStorage.getItem('game2grow_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
    
    // Create demo user account if it doesn't exist
    const storedUsers = JSON.parse(localStorage.getItem('game2grow_users') || '[]');
    const demoUserExists = storedUsers.find((u: any) => u.email === 'demo@game2grow.edu');
    
    if (!demoUserExists) {
      const demoUser = {
        id: 'demo-user-1',
        fullName: 'Demo',
        surname: 'User',
        nickname: 'EcoLearner',
        email: 'demo@game2grow.edu',
        phoneNumber: '+91 12345 67890',
        category: 'high-school' as UserCategory,
        password: 'demo123',
        points: 350,
        level: 4,
        achievements: ['first-quiz'],
        joinedAt: new Date('2024-01-15'),
      };
      
      storedUsers.push(demoUser);
      localStorage.setItem('game2grow_users', JSON.stringify(storedUsers));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app, this would be an actual API request
    const storedUsers = JSON.parse(localStorage.getItem('game2grow_users') || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('game2grow_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'points' | 'level' | 'achievements' | 'joinedAt'> & { password: string }): Promise<boolean> => {
    // Simulate API call - in real app, this would be an actual API request
    const storedUsers = JSON.parse(localStorage.getItem('game2grow_users') || '[]');
    
    // Check if user already exists
    if (storedUsers.find((u: any) => u.email === userData.email)) {
      return false;
    }

    const newUser: User & { password: string } = {
      ...userData,
      id: Date.now().toString(),
      points: 0,
      level: 1,
      achievements: [],
      joinedAt: new Date(),
    };

    storedUsers.push(newUser);
    localStorage.setItem('game2grow_users', JSON.stringify(storedUsers));

    // Log the user in immediately
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('game2grow_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('game2grow_user');
  };

  const updatePoints = (points: number) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        points: user.points + points,
        level: Math.floor((user.points + points) / 100) + 1 // Simple level calculation
      };
      setUser(updatedUser);
      localStorage.setItem('game2grow_user', JSON.stringify(updatedUser));
      
      // Update in users list too
      const storedUsers = JSON.parse(localStorage.getItem('game2grow_users') || '[]');
      const userIndex = storedUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        storedUsers[userIndex] = { ...storedUsers[userIndex], points: updatedUser.points, level: updatedUser.level };
        localStorage.setItem('game2grow_users', JSON.stringify(storedUsers));
      }
    }
  };

  const addAchievement = (achievement: string) => {
    if (user && !user.achievements.includes(achievement)) {
      const updatedUser = { 
        ...user, 
        achievements: [...user.achievements, achievement]
      };
      setUser(updatedUser);
      localStorage.setItem('game2grow_user', JSON.stringify(updatedUser));
      
      // Update in users list too
      const storedUsers = JSON.parse(localStorage.getItem('game2grow_users') || '[]');
      const userIndex = storedUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        storedUsers[userIndex] = { ...storedUsers[userIndex], achievements: updatedUser.achievements };
        localStorage.setItem('game2grow_users', JSON.stringify(storedUsers));
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updatePoints,
    addAchievement,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};