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

  // Comprehensive environmental education quiz data
  const sampleQuizzes: Quiz[] = [
    // Preschool Quizzes (Ages 3-5) - 15 Quizzes
    {
      id: '1',
      title: 'Nature Colors',
      category: 'preschool',
      difficulty: 'easy',
      participants: 1250,
      duration: 5,
      description: 'Learn about colors we see in nature like green leaves and blue sky.',
      icon: '🌈',
      points: 75,
      recommended: true
    },
    {
      id: '2',
      title: 'Animal Homes',
      category: 'preschool',
      difficulty: 'easy',
      participants: 890,
      duration: 5,
      description: 'Discover where different animals live - forests, oceans, and gardens.',
      icon: '🏠',
      points: 75
    },
    {
      id: '3',
      title: 'Plant Friends',
      category: 'preschool',
      difficulty: 'easy',
      participants: 832,
      duration: 5,
      description: 'Meet different plants - trees, flowers, and vegetables that help us.',
      icon: '🌱',
      points: 75
    },
    {
      id: '4',
      title: 'Weather Fun',
      category: 'preschool',
      difficulty: 'easy',
      participants: 756,
      duration: 5,
      description: 'Learn about sunny, rainy, and snowy weather.',
      icon: '🌤️',
      points: 75
    },
    {
      id: '5',
      title: 'Clean Up Heroes',
      category: 'preschool',
      difficulty: 'easy',
      participants: 945,
      duration: 5,
      description: 'Help keep our world clean by putting trash in the right place.',
      icon: '🧹',
      points: 75
    },
    {
      id: '6',
      title: 'Water Drops',
      category: 'preschool',
      difficulty: 'easy',
      participants: 623,
      duration: 5,
      description: 'Learn about water - in rivers, lakes, and rain.',
      icon: '💧',
      points: 75
    },
    {
      id: '7',
      title: 'Butterfly Garden',
      category: 'preschool',
      difficulty: 'easy',
      participants: 567,
      duration: 5,
      description: 'Meet beautiful butterflies and learn how they help plants.',
      icon: '🦋',
      points: 75
    },
    {
      id: '8',
      title: 'Recycling Bins',
      category: 'preschool',
      difficulty: 'easy',
      participants: 789,
      duration: 5,
      description: 'Learn to sort different materials into the right colored bins.',
      icon: '♻️',
      points: 75
    },
    {
      id: '9',
      title: 'Forest Animals',
      category: 'preschool',
      difficulty: 'easy',
      participants: 654,
      duration: 5,
      description: 'Discover animals that live in the forest like bears and rabbits.',
      icon: '🐻',
      points: 75
    },
    {
      id: '10',
      title: 'Ocean Friends',
      category: 'preschool',
      difficulty: 'easy',
      participants: 543,
      duration: 5,
      description: 'Meet fish, whales, and other animals that live in the ocean.',
      icon: '🐠',
      points: 75
    },
    {
      id: '11',
      title: 'Garden Helpers',
      category: 'preschool',
      difficulty: 'easy',
      participants: 432,
      duration: 5,
      description: 'Learn about bees, worms, and other helpers in the garden.',
      icon: '🐝',
      points: 75
    },
    {
      id: '12',
      title: 'Tree Friends',
      category: 'preschool',
      difficulty: 'easy',
      participants: 678,
      duration: 5,
      description: 'Discover different types of trees and how they help us.',
      icon: '🌳',
      points: 75
    },
    {
      id: '13',
      title: 'Seasons Fun',
      category: 'preschool',
      difficulty: 'easy',
      participants: 598,
      duration: 5,
      description: 'Learn about spring, summer, fall, and winter changes.',
      icon: '🍂',
      points: 75
    },
    {
      id: '14',
      title: 'Save Energy',
      category: 'preschool',
      difficulty: 'easy',
      participants: 465,
      duration: 5,
      description: 'Learn to turn off lights and save energy at home.',
      icon: '💡',
      points: 75
    },
    {
      id: '15',
      title: 'Earth Care',
      category: 'preschool',
      difficulty: 'easy',
      participants: 723,
      duration: 5,
      description: 'Simple ways to take care of our beautiful Earth.',
      icon: '🌍',
      points: 75
    },

    // Middle School Quizzes (Ages 6-10) - 15 Quizzes
    {
      id: '16',
      title: 'Recycling Champions',
      category: 'middle-school',
      difficulty: 'easy',
      participants: 1156,
      duration: 8,
      description: 'Master the art of recycling and learn about waste reduction.',
      icon: '♻️',
      points: 100,
      recommended: true
    },
    {
      id: '17',
      title: 'Ocean Conservation',
      category: 'middle-school',
      difficulty: 'easy',
      participants: 987,
      duration: 10,
      description: 'Discover marine ecosystems and how to protect ocean life.',
      icon: '🌊',
      points: 100
    },
    {
      id: '18',
      title: 'Wildlife Protection',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 856,
      duration: 12,
      description: 'Learn about endangered species and habitat conservation.',
      icon: '🦋',
      points: 120
    },
    {
      id: '19',
      title: 'Solar Power Kids',
      category: 'middle-school',
      difficulty: 'easy',
      participants: 743,
      duration: 8,
      description: 'Explore how solar energy works and helps our planet.',
      icon: '☀️',
      points: 100
    },
    {
      id: '20',
      title: 'Water Cycle Wonder',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 654,
      duration: 10,
      description: 'Journey through evaporation, condensation, and precipitation.',
      icon: '🌧️',
      points: 120
    },
    {
      id: '21',
      title: 'Pollution Fighters',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 612,
      duration: 12,
      description: 'Learn about different types of pollution and prevention.',
      icon: '🏭',
      points: 120
    },
    {
      id: '22',
      title: 'Ecosystem Explorers',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 589,
      duration: 10,
      description: 'Discover how plants and animals depend on each other.',
      icon: '🌿',
      points: 120
    },
    {
      id: '23',
      title: 'Green Transportation',
      category: 'middle-school',
      difficulty: 'easy',
      participants: 467,
      duration: 8,
      description: 'Explore eco-friendly ways to travel and reduce emissions.',
      icon: '🚲',
      points: 100
    },
    {
      id: '24',
      title: 'Composting Magic',
      category: 'middle-school',
      difficulty: 'easy',
      participants: 523,
      duration: 8,
      description: 'Learn how organic waste becomes valuable soil.',
      icon: '🌱',
      points: 100
    },
    {
      id: '25',
      title: 'Climate Heroes',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 698,
      duration: 12,
      description: 'Meet young activists making a difference for climate.',
      icon: '🦸',
      points: 120
    },
    {
      id: '26',
      title: 'Forest Guardians',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 445,
      duration: 10,
      description: 'Understand deforestation and forest conservation efforts.',
      icon: '🌲',
      points: 120
    },
    {
      id: '27',
      title: 'Air Quality Detectives',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 376,
      duration: 10,
      description: 'Investigate air pollution sources and clean air solutions.',
      icon: '💨',
      points: 120
    },
    {
      id: '28',
      title: 'Renewable Energy Quest',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 598,
      duration: 12,
      description: 'Explore wind, water, and solar power technologies.',
      icon: '⚡',
      points: 120
    },
    {
      id: '29',
      title: 'Biodiversity Basics',
      category: 'middle-school',
      difficulty: 'easy',
      participants: 657,
      duration: 8,
      description: 'Discover the amazing variety of life on Earth.',
      icon: '🐛',
      points: 100
    },
    {
      id: '30',
      title: 'Sustainable Living',
      category: 'middle-school',
      difficulty: 'medium',
      participants: 412,
      duration: 10,
      description: 'Learn practical ways to live more sustainably.',
      icon: '🌍',
      points: 120
    },

    // High School Quizzes (Ages 11-17) - 15 Quizzes
    {
      id: '31',
      title: 'Climate Change Science',
      category: 'high-school',
      difficulty: 'medium',
      participants: 1432,
      duration: 15,
      description: 'Deep dive into greenhouse gases, global warming, and climate data.',
      icon: '🌡️',
      points: 150,
      recommended: true
    },
    {
      id: '32',
      title: 'Carbon Footprint Analysis',
      category: 'high-school',
      difficulty: 'hard',
      participants: 876,
      duration: 18,
      description: 'Calculate and analyze personal and industrial carbon emissions.',
      icon: '👣',
      points: 180
    },
    {
      id: '33',
      title: 'Renewable Energy Technologies',
      category: 'high-school',
      difficulty: 'hard',
      participants: 654,
      duration: 20,
      description: 'Advanced study of solar, wind, hydro, and geothermal systems.',
      icon: '⚡',
      points: 180
    },
    {
      id: '34',
      title: 'Ecosystem Dynamics',
      category: 'high-school',
      difficulty: 'medium',
      participants: 598,
      duration: 15,
      description: 'Study food webs, energy flow, and ecological relationships.',
      icon: '🔗',
      points: 150
    },
    {
      id: '35',
      title: 'Water Resource Management',
      category: 'high-school',
      difficulty: 'medium',
      participants: 743,
      duration: 12,
      description: 'Analyze water scarcity, conservation, and treatment methods.',
      icon: '💧',
      points: 150
    },
    {
      id: '36',
      title: 'Sustainable Agriculture',
      category: 'high-school',
      difficulty: 'hard',
      participants: 467,
      duration: 16,
      description: 'Explore organic farming, permaculture, and food security.',
      icon: '🚜',
      points: 180
    },
    {
      id: '37',
      title: 'Environmental Policy',
      category: 'high-school',
      difficulty: 'hard',
      participants: 389,
      duration: 18,
      description: 'Study environmental laws, regulations, and policy making.',
      icon: '📋',
      points: 180
    },
    {
      id: '38',
      title: 'Green Chemistry',
      category: 'high-school',
      difficulty: 'hard',
      participants: 332,
      duration: 20,
      description: 'Learn about environmentally friendly chemical processes.',
      icon: '🧪',
      points: 180
    },
    {
      id: '39',
      title: 'Waste Management Systems',
      category: 'high-school',
      difficulty: 'medium',
      participants: 523,
      duration: 14,
      description: 'Study waste hierarchy, circular economy, and zero waste goals.',
      icon: '🗂️',
      points: 150
    },
    {
      id: '40',
      title: 'Conservation Biology',
      category: 'high-school',
      difficulty: 'hard',
      participants: 456,
      duration: 16,
      description: 'Examine species preservation and habitat restoration strategies.',
      icon: '🐾',
      points: 180
    },
    {
      id: '41',
      title: 'Environmental Impact Assessment',
      category: 'high-school',
      difficulty: 'hard',
      participants: 298,
      duration: 18,
      description: 'Analyze how human activities affect the environment.',
      icon: '📊',
      points: 180
    },
    {
      id: '42',
      title: 'Green Building Design',
      category: 'high-school',
      difficulty: 'medium',
      participants: 412,
      duration: 14,
      description: 'Study sustainable architecture and LEED certification.',
      icon: '🏢',
      points: 150
    },
    {
      id: '43',
      title: 'Ocean Acidification',
      category: 'high-school',
      difficulty: 'hard',
      participants: 367,
      duration: 16,
      description: 'Understand pH changes in oceans and marine ecosystem impacts.',
      icon: '🌊',
      points: 180
    },
    {
      id: '44',
      title: 'Atmospheric Science',
      category: 'high-school',
      difficulty: 'medium',
      participants: 489,
      duration: 15,
      description: 'Study ozone depletion, air quality, and atmospheric layers.',
      icon: '🌫️',
      points: 150
    },
    {
      id: '45',
      title: 'Environmental Ethics',
      category: 'high-school',
      difficulty: 'medium',
      participants: 534,
      duration: 12,
      description: 'Explore moral obligations to nature and future generations.',
      icon: '⚖️',
      points: 150
    },

    // College Quizzes (Ages 18+) - 15 Quizzes
    {
      id: '46',
      title: 'Global Climate Models',
      category: 'college',
      difficulty: 'hard',
      participants: 623,
      duration: 25,
      description: 'Advanced climate modeling, IPCC reports, and prediction accuracy.',
      icon: '🌐',
      points: 250,
      recommended: true
    },
    {
      id: '47',
      title: 'Environmental Economics',
      category: 'college',
      difficulty: 'hard',
      participants: 498,
      duration: 22,
      description: 'Cost-benefit analysis, carbon pricing, and green investments.',
      icon: '💰',
      points: 250
    },
    {
      id: '48',
      title: 'Advanced Ecology Theory',
      category: 'college',
      difficulty: 'hard',
      participants: 387,
      duration: 28,
      description: 'Population dynamics, succession, and community ecology.',
      icon: '🔬',
      points: 250
    },
    {
      id: '49',
      title: 'Environmental Toxicology',
      category: 'college',
      difficulty: 'hard',
      participants: 312,
      duration: 24,
      description: 'Study of pollutant effects on organisms and ecosystems.',
      icon: '☠️',
      points: 250
    },
    {
      id: '50',
      title: 'Sustainable Development Goals',
      category: 'college',
      difficulty: 'hard',
      participants: 567,
      duration: 20,
      description: 'UN SDGs, implementation strategies, and global progress.',
      icon: '🎯',
      points: 250
    },
    {
      id: '51',
      title: 'Life Cycle Assessment',
      category: 'college',
      difficulty: 'hard',
      participants: 234,
      duration: 26,
      description: 'Comprehensive analysis of product environmental impacts.',
      icon: '🔄',
      points: 250
    },
    {
      id: '52',
      title: 'Environmental Genomics',
      category: 'college',
      difficulty: 'hard',
      participants: 189,
      duration: 30,
      description: 'Genetic responses to environmental stressors and adaptation.',
      icon: '🧬',
      points: 250
    },
    {
      id: '53',
      title: 'Climate Justice',
      category: 'college',
      difficulty: 'hard',
      participants: 445,
      duration: 22,
      description: 'Equity issues in climate change impacts and solutions.',
      icon: '⚖️',
      points: 250
    },
    {
      id: '54',
      title: 'Industrial Ecology',
      category: 'college',
      difficulty: 'hard',
      participants: 298,
      duration: 24,
      description: 'Circular economy principles and industrial symbiosis.',
      icon: '🏭',
      points: 250
    },
    {
      id: '55',
      title: 'Environmental Remote Sensing',
      category: 'college',
      difficulty: 'hard',
      participants: 167,
      duration: 26,
      description: 'Satellite data analysis for environmental monitoring.',
      icon: '🛰️',
      points: 250
    },
    {
      id: '56',
      title: 'Biogeochemical Cycles',
      category: 'college',
      difficulty: 'hard',
      participants: 356,
      duration: 28,
      description: 'Carbon, nitrogen, phosphorus, and sulfur cycling systems.',
      icon: '⚛️',
      points: 250
    },
    {
      id: '57',
      title: 'Environmental Risk Assessment',
      category: 'college',
      difficulty: 'hard',
      participants: 278,
      duration: 24,
      description: 'Probabilistic analysis of environmental hazards.',
      icon: '⚠️',
      points: 250
    },
    {
      id: '58',
      title: 'Green Technology Innovation',
      category: 'college',
      difficulty: 'hard',
      participants: 423,
      duration: 22,
      description: 'Emerging technologies for environmental solutions.',
      icon: '💻',
      points: 250
    },
    {
      id: '59',
      title: 'Environmental Law and Policy',
      category: 'college',
      difficulty: 'hard',
      participants: 334,
      duration: 25,
      description: 'Legal frameworks, case studies, and international treaties.',
      icon: '⚖️',
      points: 250
    },
    {
      id: '60',
      title: 'Ecosystem Services Valuation',
      category: 'college',
      difficulty: 'hard',
      participants: 189,
      duration: 27,
      description: 'Economic valuation of natural capital and ecosystem functions.',
      icon: '🌿',
      points: 250
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
          recommended: quiz.category === user.category
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
              <h3 className="font-semibold text-primary mb-1">AI Recommendations for {user?.username}</h3>
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