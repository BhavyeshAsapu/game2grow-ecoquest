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
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  // Expanded quiz data with diverse categories
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
    },
    {
      id: '3',
      title: 'Renewable Energy',
      category: 'college',
      difficulty: 'hard',
      description: 'Advanced concepts in solar, wind, and other renewable energy sources.',
      icon: '⚡'
    },
    {
      id: '4',
      title: 'Forest Friends',
      category: 'preschool',
      difficulty: 'easy',
      description: 'Fun games about trees, animals, and forest ecosystems.',
      icon: '🌲'
    },
    {
      id: '5',
      title: 'Recycling Champions',
      category: 'middle-school',
      difficulty: 'easy',
      description: 'Learn about waste management and recycling practices.',
      icon: '♻️'
    },
    {
      id: '6',
      title: 'Water Conservation',
      category: 'high-school',
      difficulty: 'medium',
      description: 'Understanding water cycles and conservation methods.',
      icon: '💧'
    },
    {
      id: '7',
      title: 'Wildlife Protection',
      category: 'middle-school',
      difficulty: 'medium',
      description: 'Learn about protecting endangered species and habitats.',
      icon: '🦋'
    },
    {
      id: '8',
      title: 'Green Transportation',
      category: 'high-school',
      difficulty: 'medium',
      description: 'Explore eco-friendly transportation alternatives.',
      icon: '🚲'
    },
    {
      id: '9',
      title: 'Animal Homes',
      category: 'preschool',
      difficulty: 'easy',
      description: 'Learn where different animals live in nature.',
      icon: '🏠'
    },
    {
      id: '10',
      title: 'Environmental Science',
      category: 'college',
      difficulty: 'hard',
      description: 'Advanced environmental science concepts and research.',
      icon: '🔬'
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

  // Shuffle answers only when question changes, not on every render
  useEffect(() => {
    if (questions.length > 0 && currentQuestion < questions.length) {
      const question = questions[currentQuestion];
      const allAnswers = [question.correct_answer, ...question.incorrect_answers];
      const shuffled = [...allAnswers].sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
    }
  }, [currentQuestion, questions]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      // Multiple category support for diverse quizzes
      const categories = {
        'preschool': [17, 22, 23], // Science, Geography, History
        'middle-school': [17, 18, 22, 23], // Science, Computers, Geography, History
        'high-school': [17, 18, 19, 22, 23, 25], // Science, Computers, Math, Geography, History, Art
        'college': [17, 18, 19, 20, 22, 23, 24, 25] // All categories including Politics
      };
      
      const quizCategories = categories[quiz?.category as keyof typeof categories] || [17];
      const randomCategory = quizCategories[Math.floor(Math.random() * quizCategories.length)];
      
      // Try multiple API sources for better question variety
      let apiResponse;
      let questionsData = [];
      
      // Primary: Open Trivia DB
      try {
        apiResponse = await fetch(
          `https://opentdb.com/api.php?amount=10&category=${randomCategory}&difficulty=${selectedDifficulty}&type=multiple`
        );
        const data = await apiResponse.json();
        if (data.results && data.results.length > 0) {
          questionsData = data.results;
        }
      } catch (error) {
        console.log('Primary API failed, trying fallbacks...');
      }
      
      // If no questions from API, use comprehensive fallback questions
      if (questionsData.length === 0) {
        questionsData = getAIGeneratedQuestions(quiz?.category || 'middle-school', selectedDifficulty);
      }
      
      const processedQuestions = questionsData.map((q: any) => ({
        ...q,
        question: typeof q.question === 'string' ? decodeHTML(q.question) : q.question,
        correct_answer: typeof q.correct_answer === 'string' ? decodeHTML(q.correct_answer) : q.correct_answer,
        incorrect_answers: Array.isArray(q.incorrect_answers) 
          ? q.incorrect_answers.map((ans: string) => typeof ans === 'string' ? decodeHTML(ans) : ans)
          : q.incorrect_answers
      }));
      
      setQuestions(processedQuestions);
      setGameState('playing');
      setTimeLeft(30);
      
    } catch (error) {
      toast({
        title: "Loading AI-generated questions",
        description: "Using our curated environmental quiz content.",
      });
      
      // Use AI-generated fallback questions
      const aiQuestions = getAIGeneratedQuestions(quiz?.category || 'middle-school', selectedDifficulty);
      setQuestions(aiQuestions);
      setGameState('playing');
      setTimeLeft(30);
    }
    setIsLoading(false);
  };

  // Comprehensive environmental education question database
  const getAIGeneratedQuestions = (category: string, difficulty: string): Question[] => {
    const questionSets = {
      'preschool': {
        'easy': [
          {
            question: "What color are most healthy leaves?",
            correct_answer: "Green",
            incorrect_answers: ["Blue", "Purple", "Orange"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Where do fish live?",
            correct_answer: "In water",
            incorrect_answers: ["In trees", "In the sky", "Underground"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do we put trash in?",
            correct_answer: "Trash can",
            incorrect_answers: ["River", "Forest", "Sky"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What gives us light during the day?",
            correct_answer: "The Sun",
            incorrect_answers: ["The Moon", "Stars", "Flashlight"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do plants need to grow?",
            correct_answer: "Water and sunlight",
            incorrect_answers: ["Only candy", "Only toys", "Only music"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which animal gives us milk?",
            correct_answer: "Cow",
            incorrect_answers: ["Fish", "Bird", "Cat"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do bees make?",
            correct_answer: "Honey",
            incorrect_answers: ["Milk", "Juice", "Bread"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Where do birds build their homes?",
            correct_answer: "In trees",
            incorrect_answers: ["Under water", "In the ground", "In cars"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What falls from the sky when it rains?",
            correct_answer: "Water drops",
            incorrect_answers: ["Leaves", "Toys", "Food"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which one grows in the ground?",
            correct_answer: "Carrot",
            incorrect_answers: ["Apple", "Banana", "Orange"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do we breathe?",
            correct_answer: "Air",
            incorrect_answers: ["Water", "Food", "Toys"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which season comes after winter?",
            correct_answer: "Spring",
            incorrect_answers: ["Summer", "Fall", "Christmas"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do flowers need to grow?",
            correct_answer: "Soil and water",
            incorrect_answers: ["Ice cream", "Toys", "TV"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which animal says 'moo'?",
            correct_answer: "Cow",
            incorrect_answers: ["Dog", "Cat", "Bird"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What color is the sky on a sunny day?",
            correct_answer: "Blue",
            incorrect_answers: ["Red", "Green", "Purple"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Where do apples grow?",
            correct_answer: "On trees",
            incorrect_answers: ["Underground", "In water", "In the sky"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do we use to water plants?",
            correct_answer: "Watering can",
            incorrect_answers: ["Hammer", "Book", "Toy"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which insect helps flowers?",
            correct_answer: "Bee",
            incorrect_answers: ["Fly", "Mosquito", "Spider"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do we call baby cats?",
            correct_answer: "Kittens",
            incorrect_answers: ["Puppies", "Chicks", "Cubs"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Where do penguins live?",
            correct_answer: "Cold places",
            incorrect_answers: ["Hot places", "In trees", "In cars"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do worms help make?",
            correct_answer: "Good soil",
            incorrect_answers: ["Toys", "Books", "Cars"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which one is recycled?",
            correct_answer: "Paper",
            incorrect_answers: ["Dirt", "Air", "Sunlight"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What sound do ducks make?",
            correct_answer: "Quack",
            incorrect_answers: ["Moo", "Woof", "Meow"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Where do fish swim?",
            correct_answer: "In water",
            incorrect_answers: ["In air", "On land", "In trees"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What makes plants green?",
            correct_answer: "Chlorophyll",
            incorrect_answers: ["Paint", "Magic", "Mud"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which animal hops?",
            correct_answer: "Rabbit",
            incorrect_answers: ["Fish", "Snake", "Turtle"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do pandas eat?",
            correct_answer: "Bamboo",
            incorrect_answers: ["Pizza", "Cake", "Ice cream"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Where do ants live?",
            correct_answer: "In colonies",
            incorrect_answers: ["In trees only", "In water only", "In the sky"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What helps us see at night?",
            correct_answer: "Moon and stars",
            incorrect_answers: ["Only sun", "Only clouds", "Only rain"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which one is good for Earth?",
            correct_answer: "Planting trees",
            incorrect_answers: ["Littering", "Wasting water", "Breaking plants"],
            type: "multiple",
            difficulty: "easy"
          }
        ]
      },
      'middle-school': {
        'easy': [
          {
            question: "What is recycling?",
            correct_answer: "Reusing materials to make new things",
            incorrect_answers: ["Throwing everything away", "Burning all trash", "Burying waste"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which of these is a renewable energy source?",
            correct_answer: "Solar power",
            incorrect_answers: ["Coal", "Oil", "Natural gas"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What causes air pollution?",
            correct_answer: "Burning fossil fuels",
            incorrect_answers: ["Planting trees", "Using solar panels", "Recycling paper"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do we call animals that eat only plants?",
            correct_answer: "Herbivores",
            incorrect_answers: ["Carnivores", "Omnivores", "Parasites"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which gas do plants absorb from the air?",
            correct_answer: "Carbon dioxide",
            incorrect_answers: ["Oxygen", "Nitrogen", "Hydrogen"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is composting?",
            correct_answer: "Breaking down organic waste into soil",
            incorrect_answers: ["Burning waste", "Burying plastic", "Mixing chemicals"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which ocean is the largest?",
            correct_answer: "Pacific Ocean",
            incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is biodiversity?",
            correct_answer: "Variety of life in an ecosystem",
            incorrect_answers: ["Number of trees", "Amount of water", "Size of animals"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which material takes longest to decompose?",
            correct_answer: "Plastic",
            incorrect_answers: ["Paper", "Food scraps", "Wood"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is photosynthesis?",
            correct_answer: "Plants making food from sunlight",
            incorrect_answers: ["Animals hunting prey", "Water evaporating", "Rocks forming"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which action saves water?",
            correct_answer: "Taking shorter showers",
            incorrect_answers: ["Leaving taps running", "Washing cars daily", "Watering plants at noon"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is an ecosystem?",
            correct_answer: "Living and non-living things interacting",
            incorrect_answers: ["Only plants", "Only animals", "Only rocks"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which energy source is unlimited?",
            correct_answer: "Wind power",
            incorrect_answers: ["Coal", "Oil", "Natural gas"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is deforestation?",
            correct_answer: "Cutting down forests",
            incorrect_answers: ["Planting new trees", "Protecting forests", "Cleaning forests"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which animal is a pollinator?",
            correct_answer: "Butterfly",
            incorrect_answers: ["Snake", "Fish", "Turtle"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What causes global warming?",
            correct_answer: "Too much carbon dioxide in air",
            incorrect_answers: ["Too much oxygen", "Too much water", "Too many trees"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which is a sustainable practice?",
            correct_answer: "Using reusable bags",
            incorrect_answers: ["Using plastic bags once", "Throwing batteries in trash", "Wasting food"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is the water cycle?",
            correct_answer: "Water moving between earth, air, and back",
            incorrect_answers: ["Water staying in one place", "Water disappearing forever", "Water only in oceans"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which habitat do polar bears need?",
            correct_answer: "Arctic ice",
            incorrect_answers: ["Tropical forests", "Deserts", "Grasslands"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is acid rain caused by?",
            correct_answer: "Air pollution mixing with rain",
            incorrect_answers: ["Too much sunlight", "Ocean water", "Plant growth"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which transportation produces least pollution?",
            correct_answer: "Bicycle",
            incorrect_answers: ["Car", "Airplane", "Motorcycle"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What do coral reefs provide?",
            correct_answer: "Homes for many sea creatures",
            incorrect_answers: ["Only food for fish", "Nothing important", "Problems for oceans"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which practice helps soil stay healthy?",
            correct_answer: "Adding compost",
            incorrect_answers: ["Using only chemicals", "Never watering", "Removing all plants"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is smog?",
            correct_answer: "Polluted air that's hard to see through",
            incorrect_answers: ["Clean mountain air", "Ocean mist", "Plant pollen"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which animals migrate long distances?",
            correct_answer: "Birds flying south for winter",
            incorrect_answers: ["House cats", "Pet dogs", "Goldfish"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is conservation?",
            correct_answer: "Protecting and saving natural resources",
            incorrect_answers: ["Using everything quickly", "Ignoring nature", "Building everywhere"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which gas do we breathe out?",
            correct_answer: "Carbon dioxide",
            incorrect_answers: ["Oxygen", "Nitrogen", "Hydrogen"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What is a food chain?",
            correct_answer: "How energy passes from one living thing to another",
            incorrect_answers: ["A chain made of food", "Where food is stored", "How food is cooked"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "Which material can be recycled many times?",
            correct_answer: "Aluminum cans",
            incorrect_answers: ["Styrofoam", "Dirty diapers", "Broken glass mixed with other materials"],
            type: "multiple",
            difficulty: "easy"
          },
          {
            question: "What helps prevent erosion?",
            correct_answer: "Plant roots holding soil",
            incorrect_answers: ["Removing all plants", "Adding more water", "Making slopes steeper"],
            type: "multiple",
            difficulty: "easy"
          }
        ],
        'medium': [
          {
            question: "What is the greenhouse effect?",
            correct_answer: "When gases trap heat in Earth's atmosphere",
            incorrect_answers: ["When plants grow in greenhouses", "When ice melts", "When it rains heavily"],
            type: "multiple",
            difficulty: "medium"
          },
          {
            question: "Which gas is most responsible for global warming?",
            correct_answer: "Carbon dioxide",
            incorrect_answers: ["Oxygen", "Nitrogen", "Argon"],
            type: "multiple",
            difficulty: "medium"
          },
          {
            question: "What is eutrophication?",
            correct_answer: "Excess nutrients causing algae blooms in water",
            incorrect_answers: ["Fish migration patterns", "Ocean current changes", "Coral bleaching"],
            type: "multiple",
            difficulty: "medium"
          },
          {
            question: "Which layer of atmosphere contains the ozone layer?",
            correct_answer: "Stratosphere",
            incorrect_answers: ["Troposphere", "Mesosphere", "Thermosphere"],
            type: "multiple",
            difficulty: "medium"
          },
          {
            question: "What is biomagnification?",
            correct_answer: "Toxins concentrating as they move up the food chain",
            incorrect_answers: ["Animals getting larger over time", "Plants growing faster", "Ecosystems expanding"],
            type: "multiple",
            difficulty: "medium"
          }
        ]
      },
      'high-school': {
        'medium': [
          {
            question: "What is a carbon footprint?",
            correct_answer: "The amount of carbon dioxide produced by activities",
            incorrect_answers: ["Footprint made of carbon", "Black footprints on ground", "Fossil remains in rocks"],
            type: "multiple",
            difficulty: "medium"
          },
          {
            question: "Which renewable energy source has highest efficiency?",
            correct_answer: "Hydroelectric power",
            incorrect_answers: ["Solar panels", "Wind turbines", "Geothermal"],
            type: "multiple",
            difficulty: "medium"
          },
          {
            question: "What is the main cause of species extinction today?",
            correct_answer: "Habitat destruction",
            incorrect_answers: ["Natural disasters", "Disease", "Predation"],
            type: "multiple",
            difficulty: "medium"
          },
          {
            question: "What is bioaccumulation?",
            correct_answer: "Toxins building up in organism tissues over time",
            incorrect_answers: ["Animals gathering in groups", "Plants storing energy", "Soil formation"],
            type: "multiple",
            difficulty: "medium"
          },
          {
            question: "Which climate factor affects ocean currents most?",
            correct_answer: "Temperature and salinity differences",
            incorrect_answers: ["Wind patterns only", "Moon phases", "Mountain ranges"],
            type: "multiple",
            difficulty: "medium"
          }
        ],
        'hard': [
          {
            question: "What is the primary cause of ocean acidification?",
            correct_answer: "Absorption of CO2 from the atmosphere",
            incorrect_answers: ["Industrial waste dumping", "Oil spills", "Plastic pollution"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is the albedo effect?",
            correct_answer: "Reflection of solar radiation by Earth's surface",
            incorrect_answers: ["Absorption of heat by oceans", "Greenhouse gas emissions", "Ozone formation"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "Which climate feedback loop accelerates global warming?",
            correct_answer: "Ice-albedo feedback",
            incorrect_answers: ["Cloud formation feedback", "Forest growth feedback", "Ocean circulation feedback"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is nitrogen fixation?",
            correct_answer: "Converting atmospheric nitrogen to usable forms",
            incorrect_answers: ["Removing nitrogen from soil", "Creating nitrogen gas", "Storing nitrogen in rocks"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What causes thermal stratification in lakes?",
            correct_answer: "Temperature differences creating distinct layers",
            incorrect_answers: ["Chemical pollution", "Fish migration", "Seasonal rainfall"],
            type: "multiple",
            difficulty: "hard"
          }
        ]
      },
      'college': {
        'hard': [
          {
            question: "What is the thermohaline circulation?",
            correct_answer: "Global ocean circulation driven by temperature and salinity",
            incorrect_answers: ["Atmospheric pressure systems", "Tidal movements", "Wind-driven surface currents only"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "Which climate sensitivity parameter is most uncertain in models?",
            correct_answer: "Cloud feedback mechanisms",
            incorrect_answers: ["Solar radiation variations", "Ocean heat capacity", "Land surface albedo"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is environmental justice?",
            correct_answer: "Fair treatment of all people regardless of race or income in environmental matters",
            incorrect_answers: ["Legal system for environmental crimes", "Justice for animals only", "Court system for pollution cases"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is the tragedy of the commons?",
            correct_answer: "Overuse of shared resources due to individual self-interest",
            incorrect_answers: ["Accidental resource destruction", "Government resource control", "Natural resource depletion by nature"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is ecosystem resilience?",
            correct_answer: "Ability to recover from disturbances and maintain function",
            incorrect_answers: ["Resistance to any change", "Maximum biodiversity possible", "Largest size an ecosystem can reach"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is the IPAT equation used for?",
            correct_answer: "Calculating environmental impact from population and technology",
            incorrect_answers: ["Measuring biodiversity", "Calculating carbon sequestration", "Determining species extinction rates"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is a tipping point in climate systems?",
            correct_answer: "Threshold beyond which changes become irreversible",
            incorrect_answers: ["Maximum temperature increase", "Point of optimal climate conditions", "Average global temperature"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is biogeochemical cycling?",
            correct_answer: "Movement of chemical elements through living and non-living components",
            incorrect_answers: ["Only biological processes", "Only geological processes", "Only chemical reactions"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is adaptive management in conservation?",
            correct_answer: "Management that adjusts based on monitoring and learning",
            incorrect_answers: ["Fixed management strategies", "Only reactive management", "Management without monitoring"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is the precautionary principle?",
            correct_answer: "Taking preventive action despite scientific uncertainty",
            incorrect_answers: ["Waiting for complete scientific proof", "Ignoring potential risks", "Only acting on proven facts"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is ecological footprint analysis?",
            correct_answer: "Measuring human demand on ecosystems in terms of biologically productive area",
            incorrect_answers: ["Counting animal footprints", "Measuring actual land area used", "Calculating population density"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is the concept of planetary boundaries?",
            correct_answer: "Earth system processes that define safe operating space for humanity",
            incorrect_answers: ["Physical borders between countries", "Limits of space exploration", "Boundaries between ecosystems"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is environmental economics externality?",
            correct_answer: "Cost or benefit affecting parties not involved in economic transaction",
            incorrect_answers: ["All environmental costs", "Government regulations only", "International trade effects only"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is metapopulation dynamics?",
            correct_answer: "Interactions between separated populations connected by migration",
            incorrect_answers: ["Large population growth only", "Single isolated populations", "Populations above carrying capacity"],
            type: "multiple",
            difficulty: "hard"
          },
          {
            question: "What is the concept of natural capital?",
            correct_answer: "Stock of natural resources that provide ecosystem services",
            incorrect_answers: ["Money invested in nature", "Number of natural areas", "Government environmental funding"],
            type: "multiple",
            difficulty: "hard"
          }
        ]
      }
    };

    const categoryQuestions = questionSets[category as keyof typeof questionSets];
    if (!categoryQuestions) return [];
    
    const difficultyQuestions = categoryQuestions[difficulty as keyof typeof categoryQuestions];
    if (!difficultyQuestions) {
      // Fallback to available difficulty
      const availableDiffs = Object.keys(categoryQuestions);
      return categoryQuestions[availableDiffs[0] as keyof typeof categoryQuestions] || [];
    }
    
    // Shuffle and return up to 10 questions
    const shuffled = [...difficultyQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
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
              {shuffledAnswers.map((answer, index) => (
                <Button
                  key={`${currentQuestion}-${index}`}
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