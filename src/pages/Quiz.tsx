import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Trophy, 
  Star, 
  CheckCircle, 
  X, 
  RotateCcw,
  Brain,
  Target,
  Zap
} from 'lucide-react';

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  type: string;
  difficulty: string;
}

interface QuizData {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  icon: string;
  questions?: Question[];
}

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updatePoints, addAchievement, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<{ question: string; selected: string; correct: string; isCorrect: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample quiz data
  const sampleQuizzes: QuizData[] = [
    {
      id: '1',
      title: 'Climate Change Basics',
      category: 'high-school',
      difficulty: 'medium',
      description: 'Learn about the causes and effects of climate change on our planet.',
      icon: '🌡️'
    },
    {
      id: '2',
      title: 'Ocean Conservation',
      category: 'middle-school',
      difficulty: 'easy',
      description: 'Discover marine life and how we can protect our oceans.',
      icon: '🌊'
    }
  ];

  useEffect(() => {
    const foundQuiz = sampleQuizzes.find(q => q.id === id);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      setSelectedDifficulty(foundQuiz.difficulty);
    }
  }, [id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      // Using Open Trivia DB API
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=17&difficulty=${selectedDifficulty}&type=multiple`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const processedQuestions = data.results.map((q: any) => ({
          ...q,
          question: decodeHTML(q.question),
          correct_answer: decodeHTML(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(decodeHTML)
        }));
        setQuestions(processedQuestions);
        setGameState('playing');
        setTimeLeft(30);
      } else {
        throw new Error('No questions received');
      }
    } catch (error) {
      toast({
        title: "Failed to load questions",
        description: "Using sample questions instead.",
        variant: "destructive"
      });
      
      // Fallback sample questions
      const sampleQuestions: Question[] = [
        {
          question: "What is the main cause of global warming?",
          correct_answer: "Greenhouse gas emissions",
          incorrect_answers: ["Solar radiation", "Ocean currents", "Volcanic activity"],
          type: "multiple",
          difficulty: selectedDifficulty
        },
        {
          question: "Which renewable energy source uses the sun?",
          correct_answer: "Solar power",
          incorrect_answers: ["Wind power", "Hydroelectric", "Geothermal"],
          type: "multiple",
          difficulty: selectedDifficulty
        },
        {
          question: "What percentage of Earth's surface is covered by oceans?",
          correct_answer: "About 71%",
          incorrect_answers: ["About 50%", "About 85%", "About 60%"],
          type: "multiple",
          difficulty: selectedDifficulty
        }
      ];
      setQuestions(sampleQuestions);
      setGameState('playing');
      setTimeLeft(30);
    }
    setIsLoading(false);
  };

  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct_answer;
    
    setAnswers(prev => [...prev, {
      question: currentQ.question,
      selected: selectedAnswer || 'No answer',
      correct: currentQ.correct_answer,
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setGameState('finished');
    
    if (isAuthenticated) {
      // Calculate points based on difficulty and score
      const basePoints = {
        'easy': 10,
        'medium': 15,
        'hard': 25
      };
      
      const pointsPerQuestion = basePoints[selectedDifficulty];
      const totalPoints = (score + (selectedAnswer === questions[currentQuestion]?.correct_answer ? 1 : 0)) * pointsPerQuestion;
      
      updatePoints(totalPoints);
      
      // Award achievements
      if (score + (selectedAnswer === questions[currentQuestion]?.correct_answer ? 1 : 0) === questions.length) {
        addAchievement('perfect-score');
        toast({
          title: "Perfect Score! 🌟",
          description: "You got every question right and earned the 'Perfect Score' achievement!"
        });
      }
      
      if (user && user.points + totalPoints >= 1000) {
        addAchievement('eco-warrior');
        toast({
          title: "Eco Warrior! 🌱",
          description: "You've earned over 1000 points and unlocked the 'Eco Warrior' achievement!"
        });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer('');
    setAnswers([]);
    setGameState('setup');
    setTimeLeft(30);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
          <Button onClick={() => navigate('/games')}>Back to Games</Button>
        </div>
      </div>
    );
  }

  if (gameState === 'setup') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{quiz.icon}</div>
            <CardTitle className="text-3xl mb-2">{quiz.title}</CardTitle>
            <p className="text-muted-foreground text-lg">{quiz.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium">10 Questions</p>
                <p className="text-sm text-muted-foreground">Multiple choice</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-medium">30s per question</p>
                <p className="text-sm text-muted-foreground">Think fast!</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="font-medium">Earn Points</p>
                <p className="text-sm text-muted-foreground">Based on difficulty</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Select Difficulty Level</label>
              <Select value={selectedDifficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setSelectedDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-level-beginner"></div>
                      <span>Easy - 10 points per correct answer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-level-intermediate"></div>
                      <span>Medium - 15 points per correct answer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hard">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-level-advanced"></div>
                      <span>Hard - 25 points per correct answer</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!isAuthenticated && (
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground text-center">
                  💡 <strong>Tip:</strong> Create a free account to save your progress and earn achievements!
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={fetchQuestions} 
                className="flex-1" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Brain className="w-5 h-5 mr-2 animate-spin" />
                    Loading Questions...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Start Quiz
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/games')}
                size="lg"
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'playing' && questions.length > 0) {
    const question = questions[currentQuestion];
    const allAnswers = [question.correct_answer, ...question.incorrect_answers]
      .sort(() => Math.random() - 0.5);
    
    const progress = ((currentQuestion) / questions.length) * 100;

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress and Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              timeLeft <= 10 ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {question.question}
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge className={`
                ${selectedDifficulty === 'easy' ? 'bg-level-beginner/20 text-level-beginner' : ''}
                ${selectedDifficulty === 'medium' ? 'bg-level-intermediate/20 text-level-intermediate' : ''}
                ${selectedDifficulty === 'hard' ? 'bg-level-advanced/20 text-level-advanced' : ''}
              `}>
                {selectedDifficulty}
              </Badge>
              <span className="text-sm text-muted-foreground">Score: {score}/{currentQuestion}</span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {allAnswers.map((answer, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === answer ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => handleAnswerSelect(answer)}
                >
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{answer}</span>
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/games')}
              >
                Quit Quiz
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'finished') {
    const finalScore = score + (selectedAnswer === questions[currentQuestion - 1]?.correct_answer ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);
    const pointsEarned = finalScore * (selectedDifficulty === 'easy' ? 10 : selectedDifficulty === 'medium' ? 15 : 25);

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🌟' : '🌱'}
            </div>
            <CardTitle className="text-3xl mb-2">
              {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Learning!'}
            </CardTitle>
            <p className="text-muted-foreground">
              You completed the {quiz.title} quiz
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Score Summary */}
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                  {finalScore}/{questions.length}
                </div>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                  {percentage}%
                </div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold mb-2 text-primary">
                  {isAuthenticated ? pointsEarned : 0}
                </div>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Review Your Answers</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {answers.map((answer, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    answer.isCorrect ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'
                  }`}>
                    <p className="font-medium mb-1">{answer.question}</p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2">
                        {answer.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <X className="w-4 h-4 text-destructive" />
                        )}
                        <span>Your answer: <strong>{answer.selected}</strong></span>
                      </div>
                      {!answer.isCorrect && (
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <div className="w-4 h-4"></div>
                          <span>Correct answer: <strong>{answer.correct}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isAuthenticated && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">Want to save your progress?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Create a free account to track your scores, earn achievements, and compete on the leaderboard!
                </p>
                <Button size="sm" asChild>
                  <a href="/register">Create Account</a>
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={restartQuiz} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => navigate('/games')} className="flex-1">
                More Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Quiz;