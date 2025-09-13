import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Leaf, 
  Trophy, 
  Users, 
  Brain, 
  Gamepad2, 
  Target,
  Star,
  Award,
  BookOpen,
  Zap,
  Globe,
  ChevronRight
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Personalized quiz recommendations based on your age group and learning progress.',
      color: 'text-accent'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Earn badges, unlock levels, and compete with friends on the leaderboard.',
      color: 'text-warning'
    },
    {
      icon: Gamepad2,
      title: 'Interactive Games',
      description: 'Engaging environmental quizzes and challenges for all age groups.',
      color: 'text-primary'
    },
    {
      icon: Globe,
      title: 'Real Impact',
      description: 'Learn about real environmental issues and how you can make a difference.',
      color: 'text-success'
    }
  ];

  const topGames = [
    {
      id: '1',
      title: 'Climate Champions',
      category: 'High School',
      difficulty: 'Medium',
      participants: 1250,
      description: 'Learn about climate change and renewable energy sources.',
      icon: '🌡️'
    },
    {
      id: '2',
      title: 'Ocean Guardians',
      category: 'Middle School',
      difficulty: 'Easy',
      participants: 890,
      description: 'Discover marine life and ocean conservation.',
      icon: '🌊'
    },
    {
      id: '3',
      title: 'Forest Friends',
      category: 'Preschool',
      difficulty: 'Easy',
      participants: 567,
      description: 'Fun games about trees, animals, and nature.',
      icon: '🌲'
    },
    {
      id: '4',
      title: 'Sustainable Future',
      category: 'College',
      difficulty: 'Hard',
      participants: 432,
      description: 'Advanced concepts in environmental science and policy.',
      icon: '♻️'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'EcoWarrior23', points: 2850, badge: 'gold' },
    { rank: 2, name: 'GreenThumb', points: 2640, badge: 'silver' },
    { rank: 3, name: 'NatureLover', points: 2420, badge: 'bronze' },
    { rank: 4, name: 'ClimateChamp', points: 2100, badge: null },
    { rank: 5, name: 'TreeHugger', points: 1950, badge: null },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {isAuthenticated && (
                <div className="animate-float">
                  <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Welcome back,</p>
                          <h3 className="text-lg font-semibold text-primary">{user?.username}!</h3>
                          <p className="text-sm">Level {user?.level} • {user?.points} points</p>
                        </div>
                        <div className="flex items-center space-x-1 text-primary">
                          <Leaf className="w-5 h-5" />
                          <Zap className="w-5 h-5 animate-bounce-gentle" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gradient-hero">Game2Grow</span>
                  <br />
                  <span className="text-foreground">Learn. Play. Impact.</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Join the gamified environmental education revolution! Learn about sustainability, 
                  climate change, and conservation through interactive games designed for every age group.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {!isAuthenticated ? (
                  <>
                    <Button size="lg" className="text-lg px-8 animate-glow" asChild>
                      <Link to="/register">
                        Start Your Journey
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                      <Link to="/games">
                        Explore Games
                        <Gamepad2 className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" className="text-lg px-8 animate-glow" asChild>
                      <Link to="/games">
                        Continue Learning
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                      <Link to="/achievements">
                        View Achievements
                        <Trophy className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="animate-float">
                <img 
                  src={heroImage} 
                  alt="Environmental Learning" 
                  className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg animate-bounce-gentle">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6" />
                  <div>
                    <p className="text-sm font-medium">10,000+</p>
                    <p className="text-xs opacity-90">Active Learners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Game2Grow?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of environmental education with our innovative platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="interactive-card group">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-background ${feature.color} mb-4 group-hover:animate-bounce-gentle`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Games Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Popular Games</h2>
              <p className="text-xl text-muted-foreground">
                Discover our most engaging environmental learning experiences
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/games">
                View All Games
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topGames.map((game) => (
              <Card key={game.id} className="game-card group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{game.icon}</span>
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${game.difficulty === 'Easy' ? 'bg-level-beginner/20 text-level-beginner' : ''}
                        ${game.difficulty === 'Medium' ? 'bg-level-intermediate/20 text-level-intermediate' : ''}
                        ${game.difficulty === 'Hard' ? 'bg-level-advanced/20 text-level-advanced' : ''}
                      `}
                    >
                      {game.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {game.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{game.category}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{game.participants}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard & Achievements */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Leaderboard */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">🏆 Leaderboard</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/achievements">View Full</Link>
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  {leaderboard.map((player, index) => (
                    <div 
                      key={player.rank} 
                      className={`flex items-center justify-between p-4 ${
                        index !== leaderboard.length - 1 ? 'border-b border-border' : ''
                      } ${player.rank <= 3 ? 'bg-muted/50' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                          ${player.rank === 1 ? 'bg-achievement-gold text-white' : ''}
                          ${player.rank === 2 ? 'bg-achievement-silver text-white' : ''}
                          ${player.rank === 3 ? 'bg-achievement-bronze text-white' : ''}
                          ${player.rank > 3 ? 'bg-muted text-muted-foreground' : ''}
                        `}>
                          {player.rank}
                        </div>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">{player.points} points</p>
                        </div>
                      </div>
                      {player.badge && (
                        <Badge 
                          className={`
                            ${player.badge === 'gold' ? 'bg-achievement-gold text-white' : ''}
                            ${player.badge === 'silver' ? 'bg-achievement-silver text-white' : ''}
                            ${player.badge === 'bronze' ? 'bg-achievement-bronze text-white' : ''}
                          `}
                        >
                          {player.badge}
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Achievement Preview */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">🎖️ Achievements</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/achievements">View All</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="interactive-card">
                  <CardContent className="p-6 text-center">
                    <Award className="w-12 h-12 text-achievement-gold mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">First Steps</h3>
                    <p className="text-sm text-muted-foreground">Complete your first quiz</p>
                  </CardContent>
                </Card>
                
                <Card className="interactive-card">
                  <CardContent className="p-6 text-center">
                    <Star className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Quiz Master</h3>
                    <p className="text-sm text-muted-foreground">Score 100% on 5 quizzes</p>
                  </CardContent>
                </Card>
                
                <Card className="interactive-card">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 text-accent mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Knowledge Seeker</h3>
                    <p className="text-sm text-muted-foreground">Play games from all categories</p>
                  </CardContent>
                </Card>
                
                <Card className="interactive-card">
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-success mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Eco Champion</h3>
                    <p className="text-sm text-muted-foreground">Reach 1000 total points</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-success/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Ready to Start Your Environmental Journey?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of students already learning and making a difference for our planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 animate-glow" asChild>
                  <Link to="/register">
                    Create Free Account
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link to="/games">
                    Explore Games First
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;