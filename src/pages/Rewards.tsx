import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  image_url: string;
  active: boolean;
}

interface RewardPurchase {
  id: string;
  reward_id: string;
  created_at: string;
}

const Rewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [purchases, setPurchases] = useState<RewardPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const { user, isAuthenticated, updatePoints } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRewards();
    if (isAuthenticated) {
      fetchPurchases();
    }
  }, [isAuthenticated]);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('cost', { ascending: true });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast({
        title: "Error",
        description: "Failed to load rewards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reward_purchases')
        .select('*')
        .eq('user_id', user.user_id);

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const handlePurchase = async (rewardId: string, cost: number) => {
    if (!user || !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to redeem rewards",
        variant: "destructive",
      });
      return;
    }

    if (user.points < cost) {
      toast({
        title: "Insufficient points",
        description: `You need ${cost - user.points} more points to redeem this reward`,
        variant: "destructive",
      });
      return;
    }

    setPurchasing(rewardId);

    try {
      const { data, error } = await supabase
        .rpc('redeem_reward', { p_reward_id: rewardId });

      if (error) throw error;

      if (data && data.length > 0) {
        const { purchase_id, new_points } = data[0];
        
        // Update local state
        setPurchases(prev => [...prev, {
          id: purchase_id,
          reward_id: rewardId,
          created_at: new Date().toISOString()
        }]);

        // Update user points in context
        await updatePoints(-(cost));

        toast({
          title: "Reward redeemed!",
          description: "Your reward has been successfully redeemed.",
        });
      }
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Redemption failed",
        description: error.message || "Failed to redeem reward",
        variant: "destructive",
      });
    } finally {
      setPurchasing(null);
    }
  };

  const isPurchased = (rewardId: string) => {
    return purchases.some(purchase => purchase.reward_id === rewardId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Rewards Store
        </h1>
        <p className="text-muted-foreground mb-4">
          Use your earned points to redeem educational rewards!
        </p>
        {isAuthenticated && user && (
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
            <span className="text-sm font-medium">Your Points:</span>
            <Badge variant="secondary" className="text-primary font-bold">
              {user.points}
            </Badge>
          </div>
        )}
      </div>

      {!isAuthenticated && (
        <Card className="max-w-md mx-auto mb-8">
          <CardContent className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Login Required</h3>
            <p className="text-muted-foreground mb-4">
              Please log in to view and redeem rewards
            </p>
            <Button asChild>
              <a href="/auth">Login</a>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const purchased = isPurchased(reward.id);
          const canAfford = user ? user.points >= reward.cost : false;
          const isLoading = purchasing === reward.id;

          return (
            <Card key={reward.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img
                  src={reward.image_url}
                  alt={reward.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                {purchased && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Owned
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{reward.title}</CardTitle>
                <CardDescription>{reward.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className="text-primary border-primary"
                  >
                    {reward.cost} points
                  </Badge>
                  
                  <Button
                    onClick={() => handlePurchase(reward.id, reward.cost)}
                    disabled={!isAuthenticated || purchased || !canAfford || isLoading}
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : purchased ? (
                      'Redeemed'
                    ) : !isAuthenticated ? (
                      'Login Required'
                    ) : !canAfford ? (
                      'Insufficient Points'
                    ) : (
                      'Redeem'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {rewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No rewards available
          </h3>
          <p className="text-muted-foreground">
            Check back later for new educational rewards!
          </p>
        </div>
      )}
    </div>
  );
};

export default Rewards;