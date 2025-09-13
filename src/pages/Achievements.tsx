import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  Zap, 
  Leaf, 
  Users, 
  Crown,
  Medal,
  CheckCircle,
  Lock
} from 'lucide-react';

const Achievements = () => {
  const { user, isAuthenticated } = useAuth();

  // Sample leaderboard data
  const leaderboard = [
    { rank: 1, name: 'EcoWarrior23', points: 2850, level: 29, category: 'college' },
    { rank: 2, name: 'GreenThumb', points: 2640, level: 27, category: 'high-school' },
    { rank: 3, name: 'NatureLover', points: 2420, level: 25, category: 'college' },
    { rank: 4, name: 'ClimateChamp', points: 2100, level: 22, category: 'high-school' },
    { rank: 5, name: 'TreeHugger', points: 1950, level: 20, category: 'middle-school' },
    { rank: 6, name: 'OceanGuard', points: 1800, level: 19, category: 'college' },
    { rank: 7, name: 'SolarSarah', points: 1650, level: 17, category: 'high-school' },
    { rank: 8, name: 'WindyWill', points: 1500, level: 16, category: 'middle-school' },
  ];

  // Add user to leaderboard if authenticated
  const extendedLeaderboard = isAuthenticated && user ? [
    ...leaderboard,
    { 
      rank: leaderboard.length + 1, 
      name: user.username, 
      points: user.points, 
      level: user.level, 
      category: user.category,
      isCurrentUser: true 
    }
  ].sort((a, b) => b.points - a.points)
    .map((player, index) => ({ ...player, rank: index + 1 })) : leaderboard;

  // Achievement categories
  const achievementCategories = [
    {
      title: 'Learning Milestones',
      icon: Target,
      achievements: [
        { 
          id: 'first-quiz', 
          name: 'First Steps', 
          description: 'Complete your first environmental quiz', 
          icon: Award, 
          points: 50,
          earned: isAuthenticated && user?.points > 0,
          rarity: 'common'
        },
        { 
          id: 'quiz-streak', 
          name: 'Learning Streak', 
          description: 'Complete quizzes for 7 consecutive days', 
          icon: Zap, 
          points: 200,
          earned: false,
          rarity: 'rare'
        },
        { 
          id: 'perfect-score', 
          name: 'Perfect Score', 
          description: 'Achieve 100% on any quiz', 
          icon: Star, 
          points: 150,
          earned: false,
          rarity: 'uncommon'
        }
      ]
    },
    {
      title: 'Environmental Champion',
      icon: Leaf,
      achievements: [
        { 
          id: 'eco-warrior', 
          name: 'Eco Warrior', 
          description: 'Earn 1000 total points learning about the environment', 
          icon: Leaf, 
          points: 300,
          earned: isAuthenticated && user && user.points >= 1000,
          rarity: 'epic'
        },
        { 
          id: 'climate-expert', 
          name: 'Climate Expert', 
          description: 'Master all climate change quizzes', 
          icon: Trophy, 
          points: 500,
          earned: false,
          rarity: 'legendary'
        },
        { 
          id: 'ocean-protector', 
          name: 'Ocean Protector', 
          description: 'Complete all marine conservation challenges', 
          icon: Medal, 
          points: 400,
          earned: false,
          rarity: 'epic'
        }
      ]
    },
    {
      title: 'Social Impact',
      icon: Users,
      achievements: [
        { 
          id: 'team-player', 
          name: 'Team Player', 
          description: 'Participate in 5 collaborative challenges', 
          icon: Users, 
          points: 250,
          earned: false,
          rarity: 'rare'
        },
        { 
          id: 'mentor', 
          name: 'Environmental Mentor', 
          description: 'Help 10 other players learn', 
          icon: Crown, 
          points: 600,
          earned: false,
          rarity: 'legendary'
        }
      ]
    }
  ];

  const getRarityColor = (rarity: string) => {
    const colors = {
      'common': 'bg-muted text-muted-foreground',
      'uncommon': 'bg-level-beginner/20 text-level-beginner',
      'rare': 'bg-level-intermediate/20 text-level-intermediate',
      'epic': 'bg-level-advanced/20 text-level-advanced',
      'legendary': 'bg-achievement-gold/20 text-achievement-gold'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: 'bg-achievement-gold text-white', icon: Crown };
    if (rank === 2) return { color: 'bg-achievement-silver text-white', icon: Medal };
    if (rank === 3) return { color: 'bg-achievement-bronze text-white', icon: Award };
    return { color: 'bg-muted text-muted-foreground', icon: Trophy };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Achievements & Leaderboard</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Track your progress and see how you compare with other environmental learners worldwide
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - Achievements */}
        <div className="lg:col-span-2 space-y-8">
          {achievementCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <category.icon className="w-6 h-6 mr-2 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {category.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
                        achievement.earned 
                          ? 'bg-success/5 border-success/20 shadow-sm' 
                          : 'bg-muted/30 border-border opacity-75'
                      }`}
                    >
                      <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center
                        ${achievement.earned ? 'bg-success/20' : 'bg-muted/50'}
                      `}>
                        {achievement.earned ? (
                          <CheckCircle className="w-8 h-8 text-success" />
                        ) : (
                          <Lock className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${achievement.earned ? 'text-success' : 'text-foreground'}`}>
                            {achievement.name}
                          </h3>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-warning" />
                          <span className="text-sm font-medium">{achievement.points} points</span>
                        </div>
                      </div>

                      {achievement.earned && (
                        <div className="text-right">
                          <Badge variant="secondary" className="bg-success/20 text-success">
                            ✓ Earned
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Achievement Progress Summary */}
          {isAuthenticated && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-2 text-primary" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {achievementCategories.reduce((total, cat) => 
                        total + cat.achievements.filter(a => a.earned).length, 0
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Achievements Earned</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-2">{user?.points || 0}</div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">{user?.level || 1}</div>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Leaderboard */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-6 h-6 mr-2 text-warning" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {extendedLeaderboard.slice(0, 10).map((player) => {
                  const rankBadge = getRankBadge(player.rank);
                  const isCurrentUser = 'isCurrentUser' in player && player.isCurrentUser;
                  
                  return (
                    <div 
                      key={`${player.name}-${player.rank}`}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        isCurrentUser 
                          ? 'bg-primary/10 border border-primary/20 ring-2 ring-primary/30' 
                          : player.rank <= 3 
                            ? 'bg-muted/50' 
                            : 'hover:bg-muted/30'
                      }`}
                    >
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                        ${rankBadge.color}
                      `}>
                        {player.rank <= 3 ? (
                          <rankBadge.icon className="w-4 h-4" />
                        ) : (
                          player.rank
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className={`font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                            {player.name}
                            {isCurrentUser && ' (You)'}
                          </p>
                          <Badge variant="outline">
                            L{player.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {player.points.toLocaleString()} points
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Want to see your ranking?
                  </p>
                  <Button size="sm" asChild>
                    <a href="/register">Join the Leaderboard</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-6 h-6 mr-2 text-accent" />
                Weekly Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Ocean Conservation Week</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete 5 ocean-themed quizzes to earn the special "Marine Guardian" badge
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>2/5 quizzes</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-accent to-primary h-2 rounded-full w-2/5"></div>
                  </div>
                </div>

                <div className="text-center">
                  <Badge className="bg-accent/20 text-accent">
                    🌊 500 Bonus Points
                  </Badge>
                </div>

                {isAuthenticated ? (
                  <Button className="w-full" size="sm" asChild>
                    <a href="/games">Continue Challenge</a>
                  </Button>
                ) : (
                  <Button className="w-full" size="sm" asChild>
                    <a href="/register">Join Challenge</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;