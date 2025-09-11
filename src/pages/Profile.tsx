import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Trophy, 
  Star,
  Target,
  Zap,
  Leaf,
  Award
} from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      'preschool': 'Preschool (3-5 years)',
      'middle-school': 'Middle School (6-10 years)',
      'high-school': 'High School (11-17 years)',
      'college': 'College (18+ years)'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getLevelProgress = () => {
    const currentLevelPoints = user.points % 100;
    const progressPercentage = (currentLevelPoints / 100) * 100;
    return { currentLevelPoints, progressPercentage, nextLevelPoints: 100 - currentLevelPoints };
  };

  const { currentLevelPoints, progressPercentage, nextLevelPoints } = getLevelProgress();

  // Sample achievements data
  const allAchievements = [
    { id: 'first-quiz', name: 'First Steps', description: 'Complete your first quiz', icon: Award, earned: true },
    { id: 'quiz-master', name: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: Star, earned: false },
    { id: 'eco-warrior', name: 'Eco Warrior', description: 'Earn 1000 points', icon: Leaf, earned: user.points >= 1000 },
    { id: 'speed-demon', name: 'Speed Demon', description: 'Complete a quiz in under 2 minutes', icon: Zap, earned: false },
    { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Try all game categories', icon: Target, earned: false },
    { id: 'champion', name: 'Champion', description: 'Reach level 10', icon: Trophy, earned: user.level >= 10 }
  ];

  const earnedAchievements = allAchievements.filter(achievement => achievement.earned);
  const availableAchievements = allAchievements.filter(achievement => !achievement.earned);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <p className="text-xl text-muted-foreground">
          Manage your account and track your environmental learning progress
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg">{user.fullName} {user.surname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nickname</label>
                  <p className="text-lg">{user.nickname}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p>{user.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Learning Category</label>
                  <p className="text-lg">{getCategoryLabel(user.category)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Joined</label>
                    <p>{new Date(user.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Achievements ({earnedAchievements.length}/{allAchievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {earnedAchievements.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {earnedAchievements.map((achievement) => (
                      <div 
                        key={achievement.id}
                        className="flex items-center space-x-3 p-3 bg-success/10 border border-success/20 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                          <achievement.icon className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-success">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {availableAchievements.length > 0 && (
                    <>
                      <h4 className="font-medium text-muted-foreground mb-3">Available Achievements</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {availableAchievements.map((achievement) => (
                          <div 
                            key={achievement.id}
                            className="flex items-center space-x-3 p-3 border border-border rounded-lg opacity-60"
                          >
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              <achievement.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{achievement.name}</p>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements earned yet</p>
                  <p className="text-sm text-muted-foreground">Start playing quizzes to unlock achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-primary" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Level {user.level}</div>
                <p className="text-muted-foreground">Environmental Explorer</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {user.level + 1}</span>
                  <span>{currentLevelPoints}/100 XP</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {nextLevelPoints} more points to next level
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Learning Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  <span>Total Points</span>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {user.points}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  <span>Achievements</span>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {earnedAchievements.length}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-accent" />
                  <span>Current Level</span>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {user.level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <a href="/games">Start New Quiz</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/achievements">View All Achievements</a>
              </Button>
              <Button variant="outline" className="w-full">
                Download Progress Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;