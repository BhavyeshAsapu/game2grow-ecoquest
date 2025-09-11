import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  Star,
  Brain,
  Zap,
  Trophy,
  Target,
  Play
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  duration: number;
  description: string;
  icon: string;
  points: number;
  recommended?: boolean;
}

const Games = () => {
  const { user, isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Expanded quiz data with AI-curated content
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Climate Change Basics',
      category: 'high-school',
      difficulty: 'medium',
      participants: 1250,
      duration: 15,
      description: 'Learn about the causes and effects of climate change on our planet.',
      icon: '🌡️',
      points: 150,
      recommended: true
    },
    {
      id: '2',
      title: 'Ocean Conservation',
      category: 'middle-school',
      difficulty: 'easy',
      participants: 890,
      duration: 10,
      description: 'Discover marine life and how we can protect our oceans.',
      icon: '🌊',
      points: 100
    },
    {
      id: '3',
      title: 'Renewable Energy',
      category: 'college',
      difficulty: 'hard',
      participants: 432,
      duration: 20,
      description: 'Advanced concepts in solar, wind, and other renewable energy sources.',
      icon: '⚡',
      points: 200,
      recommended: true
    },
    {
      id: '4',
      title: 'Forest Friends',
      category: 'preschool',
      difficulty: 'easy',
      participants: 567,
      duration: 5,
      description: 'Fun games about trees, animals, and forest ecosystems.',
      icon: '🌲',
      points: 75
    },
    {
      id: '5',
      title: 'Recycling Champions',
      category: 'middle-school',
      difficulty: 'easy',
      participants: 756,
      duration: 8,
      description: 'Learn about waste management and recycling practices.',
      icon: '♻️',
      points: 100
    },
    {
      id: '6',
      title: 'Water Conservation',
      category: 'high-school',
      difficulty: 'medium',
      participants: 643,
      duration: 12,
      description: 'Understanding water cycles and conservation methods.',
      icon: '💧',
      points: 125
    },
    {
      id: '7',
      title: 'Wildlife Protection',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 542,
      duration: 12,
      description: 'Learn about protecting endangered species and habitats.',
      icon: '🦋',
      points: 120
    },
    {
      id: '8',
      title: 'Green Transportation',
      category: 'high-school',
      difficulty: 'medium',
      participants: 521,
      duration: 10,
      description: 'Explore eco-friendly transportation alternatives.',
      icon: '🚲',
      points: 130
    },
    {
      id: '9',
      title: 'Animal Homes',
      category: 'preschool',
      difficulty: 'easy',
      participants: 689,
      duration: 8,
      description: 'Learn where different animals live in nature.',
      icon: '🏠',
      points: 80
    },
    {
      id: '10',
      title: 'Environmental Science',
      category: 'college',
      difficulty: 'hard',
      participants: 298,
      duration: 25,
      description: 'Advanced environmental science concepts and research.',
      icon: '🔬',
      points: 250,
      recommended: true
    },
    {
      id: '11',
      title: 'Plant Power',
      category: 'preschool',
      difficulty: 'easy',
      participants: 445,
      duration: 6,
      description: 'Discover how plants help our environment and grow.',
      icon: '🌱',
      points: 70
    },
    {
      id: '12',
      title: 'Pollution Prevention',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 678,
      duration: 14,
      description: 'Learn about different types of pollution and prevention methods.',
      icon: '🏭',
      points: 140
    },
    {
      id: '13',
      title: 'Sustainable Living',
      category: 'high-school',
      difficulty: 'hard',
      participants: 387,
      duration: 18,
      description: 'Advanced concepts in sustainable lifestyle choices.',
      icon: '🌍',
      points: 180
    },
    {
      id: '14',
      title: 'Weather Wonders',
      category: 'preschool',
      difficulty: 'easy',
      participants: 523,
      duration: 7,
      description: 'Fun facts about weather patterns and seasons.',
      icon: '🌤️',
      points: 85
    },
    {
      id: '15',
      title: 'Ecosystem Balance',
      category: 'college',
      difficulty: 'hard',
      participants: 234,
      duration: 22,
      description: 'Understanding complex ecosystem interactions and balance.',
      icon: '⚖️',
      points: 220
    },
    {
      id: '16',
      title: 'Green Technology',
      category: 'high-school',
      difficulty: 'hard',
      participants: 345,
      duration: 16,
      description: 'Explore cutting-edge environmental technologies.',
      icon: '💻',
      points: 160
    },
    {
      id: '17',
      title: 'Nature Sounds',
      category: 'preschool',
      difficulty: 'easy',
      participants: 612,
      duration: 5,
      description: 'Learn about sounds animals and nature make.',
      icon: '🎵',
      points: 65
    },
    {
      id: '18',
      title: 'Earth Day Heroes',
      category: 'middle-school',
      difficulty: 'easy',
      participants: 834,
      duration: 11,
      description: 'Learn about environmental heroes and their contributions.',
      icon: '🦸',
      points: 110
    },
    {
      id: '19',
      title: 'Carbon Cycle',
      category: 'college',
      difficulty: 'medium',
      participants: 456,
      duration: 19,
      description: 'Understanding the carbon cycle and its environmental impact.',
      icon: '🔄',
      points: 190
    },
    {
      id: '20',
      title: 'Biodiversity Basics',
      category: 'high-school',
      difficulty: 'medium',
      participants: 567,
      duration: 13,
      description: 'Explore the importance of biodiversity in ecosystems.',
      icon: '🐛',
      points: 135
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let processedQuizzes = [...sampleQuizzes];

      // AI-powered recommendations based on user category
      if (isAuthenticated && user) {
        processedQuizzes = processedQuizzes.map(quiz => ({
          ...quiz,
          recommended: quiz.category === user.category || 
                      (user.category === 'middle-school' && quiz.category === 'preschool') ||
                      (user.category === 'high-school' && ['middle-school', 'preschool'].includes(quiz.category)) ||
                      (user.category === 'college' && ['high-school', 'middle-school'].includes(quiz.category))
        }));

        // Sort recommended quizzes first
        processedQuizzes.sort((a, b) => {
          if (a.recommended && !b.recommended) return -1;
          if (!a.recommended && b.recommended) return 1;
          return 0;
        });
      }

      setQuizzes(processedQuizzes);
      setFilteredQuizzes(processedQuizzes);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, user]);

  useEffect(() => {
    let filtered = [...quizzes];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty);
    }

    setFilteredQuizzes(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, quizzes]);

  const getCategoryLabel = (category: string) => {
    const labels = {
      'preschool': 'Preschool (3-5)',
      'middle-school': 'Middle School (6-10)',
      'high-school': 'High School (11-17)',
      'college': 'College (18+)'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'easy': 'bg-level-beginner/20 text-level-beginner',
      'medium': 'bg-level-intermediate/20 text-level-intermediate',
      'hard': 'bg-level-advanced/20 text-level-advanced'
    };
    return colors[difficulty as keyof typeof colors] || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg font-medium">Loading quizzes...</p>
          <p className="text-muted-foreground">AI is preparing personalized recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Environmental Games</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Discover engaging quizzes and games designed to teach environmental awareness. 
          {isAuthenticated && ' AI has personalized these recommendations based on your learning level.'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Search Quizzes
            </label>
            <Input
              placeholder="Search by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Category
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="preschool">Preschool (3-5)</SelectItem>
                <SelectItem value="middle-school">Middle School (6-10)</SelectItem>
                <SelectItem value="high-school">High School (11-17)</SelectItem>
                <SelectItem value="college">College (18+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Difficulty
            </label>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Results</label>
            <div className="flex items-center space-x-2 h-10">
              <span className="text-2xl font-bold text-primary">{filteredQuizzes.length}</span>
              <span className="text-sm text-muted-foreground">quizzes found</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Banner */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Zap className="w-6 h-6 text-primary mt-1 animate-pulse" />
            <div>
              <h3 className="font-semibold text-primary mb-1">AI Recommendations for {user?.nickname}</h3>
              <p className="text-sm text-muted-foreground">
                Based on your {getCategoryLabel(user?.category || '')} level, we've highlighted the most suitable quizzes for you. 
                Recommended quizzes are marked with a ⭐ and appear first in the list.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className={`game-card group cursor-pointer ${quiz.recommended ? 'ring-2 ring-primary/30' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{quiz.icon}</span>
                    <div>
                      {quiz.recommended && (
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="text-xs font-medium text-warning">AI Recommended</span>
                        </div>
                      )}
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {quiz.title}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(quiz.difficulty)}>
                    {quiz.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{getCategoryLabel(quiz.category)}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{quiz.participants}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{quiz.duration}min</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">{quiz.points} points</span>
                  </div>
                  <Button size="sm" className="group-hover:animate-bounce-gentle" asChild>
                    <Link to={`/quiz/${quiz.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters to find more quizzes.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Call to Action */}
      {!isAuthenticated && (
        <div className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want Personalized Recommendations?</h3>
          <p className="text-muted-foreground mb-6">
            Create a free account to get AI-powered quiz recommendations based on your age and learning level!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">Create Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Already Have Account?</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;