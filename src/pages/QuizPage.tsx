
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, Monitor, Brain, Microscope, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Quiz types and mock data
interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

interface QuizResult {
  userId: string;
  userName: string;
  quizId: string;
  categoryId: string;
  score: number;
  totalQuestions: number;
  timestamp: Date;
}

// Quiz categories
const quizCategories: QuizCategory[] = [
  {
    id: 'it-ai',
    name: 'IT & AI',
    icon: Monitor,
    description: 'Test your knowledge of information technology and artificial intelligence.',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: Brain,
    description: 'Challenge yourself with mathematics problems ranging from algebra to calculus.',
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'bio',
    name: 'Biology',
    icon: Microscope,
    description: 'Explore the science of life from molecular biology to ecosystems.',
    color: 'bg-green-100 text-green-700'
  }
];

// Question banks
const questionBanks: Record<string, QuizQuestion[]> = {
  'it-ai': [
    {
      id: 'q1',
      text: 'What does CPU stand for?',
      options: [
        'Central Processing Unit',
        'Computer Personal Unit',
        'Central Processor Utility',
        'Central Program Unit'
      ],
      correctAnswer: 0
    },
    {
      id: 'q2',
      text: 'Which programming language is known as the "mother of all languages"?',
      options: ['Java', 'C', 'Python', 'FORTRAN'],
      correctAnswer: 1
    },
    {
      id: 'q3',
      text: 'What is the primary function of an API?',
      options: [
        'To create user interfaces',
        'To allow different software applications to communicate',
        'To secure databases',
        'To optimize code execution'
      ],
      correctAnswer: 1
    },
    {
      id: 'q4',
      text: 'Which of the following is NOT a type of machine learning?',
      options: [
        'Supervised Learning',
        'Unsupervised Learning',
        'Reinforcement Learning',
        'Directive Learning'
      ],
      correctAnswer: 3
    },
    {
      id: 'q5',
      text: 'What is the purpose of a neural network in AI?',
      options: [
        'To store data efficiently',
        'To mimic human brain functioning for problem-solving',
        'To secure data transmissions',
        'To improve hardware performance'
      ],
      correctAnswer: 1
    },
    {
      id: 'q6',
      text: 'Which company developed GPT (Generative Pre-trained Transformer)?',
      options: ['Google', 'Microsoft', 'OpenAI', 'Facebook'],
      correctAnswer: 2
    },
    {
      id: 'q7',
      text: 'What does IoT stand for?',
      options: [
        'Internet of Technology',
        'Internet of Things',
        'Integration of Technology',
        'Interfacing of Things'
      ],
      correctAnswer: 1
    },
    {
      id: 'q8',
      text: 'What is the primary purpose of a firewall in computer systems?',
      options: [
        'To provide power protection',
        'To increase processing speed',
        'To monitor and filter network traffic',
        'To backup important data'
      ],
      correctAnswer: 2
    },
    {
      id: 'q9',
      text: 'Which of these is a popular framework for deep learning?',
      options: ['Angular', 'React', 'TensorFlow', 'Django'],
      correctAnswer: 2
    },
    {
      id: 'q10',
      text: 'What is cloud computing?',
      options: [
        'Computing performed on smartphones',
        'Delivery of computing services over the internet',
        'Computing performed in cold environments',
        'A type of weather forecasting'
      ],
      correctAnswer: 1
    }
  ],
  'math': [
    {
      id: 'q1',
      text: 'What is the value of π (pi) to two decimal places?',
      options: ['3.14', '3.16', '3.12', '3.18'],
      correctAnswer: 0
    },
    {
      id: 'q2',
      text: 'What is the derivative of x²?',
      options: ['x', '2x', '2x²', 'x⁻¹'],
      correctAnswer: 1
    },
    {
      id: 'q3',
      text: 'Which of the following is the quadratic formula?',
      options: [
        'x = (-b ± √(b² + 4ac)) / 2a',
        'x = (-b ± √(b² - 4ac)) / 2a', 
        'x = (b ± √(b² - 4ac)) / 2a',
        'x = (-b ± √(b² - 4ac)) / a'
      ],
      correctAnswer: 1
    },
    {
      id: 'q4',
      text: 'The graphs of y = x² and y = 2x intersect at which points?',
      options: [
        '(0, 0) and (2, 4)',
        '(0, 0) only',
        '(2, 4) only',
        '(0, 0) and (4, 8)'
      ],
      correctAnswer: 0
    },
    {
      id: 'q5',
      text: 'What is the integral of 2x?',
      options: ['x² + C', 'x² / 2 + C', 'x³ / 3 + C', '2 ln(x) + C'],
      correctAnswer: 0
    },
    {
      id: 'q6',
      text: 'What is the sum of the first 10 positive integers?',
      options: ['45', '50', '55', '60'],
      correctAnswer: 2
    },
    {
      id: 'q7',
      text: 'If A and B are two events such that P(A) = 0.6, P(B) = 0.3, and P(A∩B) = 0.2, what is P(A|B)?',
      options: ['0.5', '0.6', '0.67', '0.8'],
      correctAnswer: 2
    },
    {
      id: 'q8',
      text: 'What is the value of i³ where i = √-1?',
      options: ['i', '-i', '1', '-1'],
      correctAnswer: 1
    },
    {
      id: 'q9',
      text: 'What is the determinant of the matrix [[1, 2], [3, 4]]?',
      options: ['-2', '-1', '1', '2'],
      correctAnswer: 0
    },
    {
      id: 'q10',
      text: 'What is the limit of (sin x)/x as x approaches 0?',
      options: ['0', '1', '-1', 'undefined'],
      correctAnswer: 1
    }
  ],
  'bio': [
    {
      id: 'q1',
      text: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
      correctAnswer: 1
    },
    {
      id: 'q2',
      text: 'Which of the following is NOT a nucleotide base found in DNA?',
      options: ['Adenine', 'Cytosine', 'Uracil', 'Guanine'],
      correctAnswer: 2
    },
    {
      id: 'q3',
      text: 'What is the process by which plants make food?',
      options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Fermentation'],
      correctAnswer: 1
    },
    {
      id: 'q4',
      text: 'Which of the following is the correct sequence of taxonomy from broadest to most specific?',
      options: [
        'Kingdom, Phylum, Class, Order, Family, Genus, Species',
        'Species, Genus, Family, Order, Class, Phylum, Kingdom',
        'Domain, Kingdom, Phylum, Class, Family, Genus, Species',
        'Kingdom, Domain, Phylum, Order, Class, Family, Species'
      ],
      correctAnswer: 0
    },
    {
      id: 'q5',
      text: 'What is the main function of red blood cells?',
      options: [
        'Clotting',
        'Fighting infection',
        'Carrying oxygen',
        'Producing antibodies'
      ],
      correctAnswer: 2
    },
    {
      id: 'q6',
      text: 'Which of the following is the site of protein synthesis in cells?',
      options: ['Mitochondria', 'Golgi apparatus', 'Ribosomes', 'Lysosomes'],
      correctAnswer: 2
    },
    {
      id: 'q7',
      text: 'Which hormone is responsible for regulating blood sugar levels?',
      options: ['Estrogen', 'Insulin', 'Testosterone', 'Thyroxine'],
      correctAnswer: 1
    },
    {
      id: 'q8',
      text: 'What is the name of the process by which cells divide to form two identical daughter cells?',
      options: ['Meiosis', 'Mitosis', 'Binary fission', 'Budding'],
      correctAnswer: 1
    },
    {
      id: 'q9',
      text: 'Which of the following is NOT an example of a genetic disease?',
      options: ['Down syndrome', 'Malaria', 'Cystic fibrosis', 'Sickle cell anemia'],
      correctAnswer: 1
    },
    {
      id: 'q10',
      text: 'What is the role of enzymes in biological reactions?',
      options: [
        'They provide energy',
        'They act as catalysts',
        'They are the building blocks of proteins',
        'They store genetic information'
      ],
      correctAnswer: 1
    }
  ]
};

// Mock quiz results storage
let quizResults: QuizResult[] = [];

const QuizPage = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Function to select a category and start quiz
  const startQuiz = (category: QuizCategory) => {
    // Get questions for the selected category
    const questions = questionBanks[category.id];
    
    // Randomly select 5 questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    setSelectedCategory(category);
    setCurrentQuestions(selected);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  // Function to handle answer selection
  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(optionIndex);
  };

  // Function to submit answer and move to next question
  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    setIsAnswerSubmitted(true);
    
    // Automatically move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
      } else {
        completeQuiz();
      }
    }, 1500);
  };

  // Function to complete the quiz and record results
  const completeQuiz = () => {
    setQuizComplete(true);
    
    if (selectedCategory) {
      const result: QuizResult = {
        userId: user?.id || '',
        userName: user?.name || '',
        quizId: `quiz_${Date.now()}`,
        categoryId: selectedCategory.id,
        score,
        totalQuestions: currentQuestions.length,
        timestamp: new Date()
      };
      
      // Add to mock storage
      quizResults = [result, ...quizResults];
      
      toast.success('Quiz completed! Your score has been recorded.');
    }
  };

  // Function to reset the quiz
  const resetQuiz = () => {
    setSelectedCategory(null);
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  return (
    <div className="animate-page-transition-in">
      {/* Quiz Selection Screen */}
      {!selectedCategory && (
        <>
          <h1 className="text-3xl font-bold mb-6">Choose a Quiz Category</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizCategories.map(category => (
              <div
                key={category.id}
                className="glass-card p-6 rounded-lg card-hover cursor-pointer"
                onClick={() => startQuiz(category)}
              >
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-4`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <button
                  onClick={() => startQuiz(category)}
                  className="btn-primary w-full mt-2"
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Quiz In Progress */}
      {selectedCategory && !quizComplete && (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={resetQuiz}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Quiz
            </button>
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${selectedCategory.color} flex items-center justify-center mr-3`}>
                <selectedCategory.icon className="w-4 h-4" />
              </div>
              <h2 className="font-semibold">{selectedCategory.name} Quiz</h2>
            </div>
          </div>
          
          {/* Quiz Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
              <span className="text-sm font-medium">Score: {score}</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((currentQuestionIndex) / currentQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Question Card */}
          <div className="glass-card p-6 rounded-lg mb-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-6">{currentQuestions[currentQuestionIndex]?.text}</h3>
            
            <div className="space-y-3">
              {currentQuestions[currentQuestionIndex]?.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswer === index
                      ? isAnswerSubmitted
                        ? index === currentQuestions[currentQuestionIndex].correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : 'bg-primary border-primary text-white'
                      : isAnswerSubmitted && index === currentQuestions[currentQuestionIndex].correctAnswer
                        ? 'bg-green-100 border-green-500'
                        : 'hover:bg-secondary/70'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center mr-3">
                      {['A', 'B', 'C', 'D'][index]}
                    </div>
                    <span>{option}</span>
                    
                    {isAnswerSubmitted && index === currentQuestions[currentQuestionIndex].correctAnswer && (
                      <CheckCircle className="ml-auto w-5 h-5 text-green-600" />
                    )}
                    
                    {isAnswerSubmitted && selectedAnswer === index && index !== currentQuestions[currentQuestionIndex].correctAnswer && (
                      <XCircle className="ml-auto w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-end">
            <button
              onClick={submitAnswer}
              disabled={selectedAnswer === null || isAnswerSubmitted}
              className="btn-primary"
            >
              {isAnswerSubmitted 
                ? currentQuestionIndex < currentQuestions.length - 1 
                  ? 'Next Question' 
                  : 'Finish Quiz'
                : 'Submit Answer'
              }
              {!isAnswerSubmitted && <ArrowRight className="ml-2 w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
      
      {/* Quiz Results Screen */}
      {quizComplete && (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-xl mb-2">
              Your score: <span className="font-bold">{score}</span> out of {currentQuestions.length}
            </p>
            <p className="text-muted-foreground">
              ({Math.round((score / currentQuestions.length) * 100)}%)
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Results Breakdown</h3>
            
            <div className="space-y-4">
              {currentQuestions.map((question, index) => (
                <div key={question.id} className="border-b border-border/40 pb-4 last:border-0">
                  <div className="flex items-start mb-2">
                    <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="font-medium">{question.text}</p>
                  </div>
                  
                  <div className="ml-9">
                    <p className="text-sm mb-1">
                      Correct Answer: <span className="font-medium">{question.options[question.correctAnswer]}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={resetQuiz}
              className="btn-secondary"
            >
              Back to Categories
            </button>
            
            <button
              onClick={() => startQuiz(selectedCategory!)}
              className="btn-primary"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for the icon
const Trophy = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default QuizPage;
