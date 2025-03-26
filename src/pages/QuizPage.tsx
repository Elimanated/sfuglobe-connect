
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileQuestion, Check, X, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';

// Types
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizCategory {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  correctAnswers: number[];
  userAnswers: (number | null)[];
}

// Mock quiz data
const quizCategories: QuizCategory[] = [
  {
    id: 'it-ai',
    name: 'IT & AI',
    description: 'Test your knowledge about information technology and artificial intelligence concepts.',
    questions: [
      {
        id: 'q1',
        question: 'What does AI stand for?',
        options: [
          'Artificial Intelligence',
          'Automated Integration',
          'Advanced Interface',
          'Application Infrastructure'
        ],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'Which programming language is commonly used for machine learning?',
        options: [
          'Java',
          'Python',
          'C#',
          'Ruby'
        ],
        correctAnswer: 1
      },
      {
        id: 'q3',
        question: 'What is the term for an AI system that can perform tasks that normally require human intelligence?',
        options: [
          'Machine Learning',
          'Deep Learning',
          'Reinforcement Learning',
          'Artificial General Intelligence'
        ],
        correctAnswer: 3
      },
      {
        id: 'q4',
        question: 'Which company developed ChatGPT?',
        options: [
          'Google',
          'Microsoft',
          'OpenAI',
          'Amazon'
        ],
        correctAnswer: 2
      },
      {
        id: 'q5',
        question: 'What does CPU stand for?',
        options: [
          'Central Processing Unit',
          'Computer Processing Unit',
          'Central Program Utility',
          'Core Processing Unit'
        ],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Challenge yourself with math problems ranging from algebra to calculus.',
    questions: [
      {
        id: 'q1',
        question: 'What is the value of π (pi) to two decimal places?',
        options: [
          '3.14',
          '3.16',
          '3.12',
          '3.18'
        ],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'What is the derivative of x²?',
        options: [
          'x',
          '2x',
          'x²',
          '2'
        ],
        correctAnswer: 1
      },
      {
        id: 'q3',
        question: 'What is the Pythagorean theorem?',
        options: [
          'a + b = c',
          'a × b = c²',
          'a² + b² = c²',
          'a² - b² = c'
        ],
        correctAnswer: 2
      },
      {
        id: 'q4',
        question: 'What is the value of 5!?',
        options: [
          '25',
          '120',
          '60',
          '720'
        ],
        correctAnswer: 1
      },
      {
        id: 'q5',
        question: 'What is the area of a circle with radius r?',
        options: [
          '2πr',
          'πr',
          'πr²',
          '2πr²'
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'bio',
    name: 'Biology',
    description: 'Explore questions about cells, genetics, and the human body.',
    questions: [
      {
        id: 'q1',
        question: 'What is the powerhouse of the cell?',
        options: [
          'Nucleus',
          'Mitochondria',
          'Endoplasmic Reticulum',
          'Golgi Apparatus'
        ],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'What is DNA?',
        options: [
          'Deoxyribonucleic Acid',
          'Diribonucleic Acid',
          'Deoxyribose Nucleic Acid',
          'Deoxyribonucleotide Acid'
        ],
        correctAnswer: 0
      },
      {
        id: 'q3',
        question: 'How many chromosomes do humans have?',
        options: [
          '23',
          '42',
          '46',
          '48'
        ],
        correctAnswer: 2
      },
      {
        id: 'q4',
        question: 'What is the largest organ in the human body?',
        options: [
          'Liver',
          'Heart',
          'Brain',
          'Skin'
        ],
        correctAnswer: 3
      },
      {
        id: 'q5',
        question: 'What process do plants use to make their own food?',
        options: [
          'Photosynthesis',
          'Respiration',
          'Digestion',
          'Fermentation'
        ],
        correctAnswer: 0
      }
    ]
  }
];

// Mock high scores
const mockHighScores = [
  { name: 'Alex Johnson', score: 95 },
  { name: 'Taylor Brown', score: 90 },
  { name: 'Morgan Lee', score: 85 },
  { name: 'Casey Williams', score: 80 },
  { name: 'Jamie Smith', score: 75 }
];

const QuizPage = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Shuffle questions on category selection
  useEffect(() => {
    if (selectedCategory) {
      // Reset state for new quiz
      setCurrentQuestionIndex(0);
      setUserAnswers(new Array(selectedCategory.questions.length).fill(null));
      setQuizCompleted(false);
      setQuizResult(null);
      
      // Set timer for 60 seconds per question
      setTimeLeft(selectedCategory.questions.length * 60);
      
      // Start timer
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            if (!quizCompleted) {
              handleQuizSubmit();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(countdown);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [selectedCategory]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < (selectedCategory?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle quiz submission
  const handleQuizSubmit = () => {
    if (!selectedCategory) return;
    
    // Stop timer
    if (timer) {
      clearInterval(timer);
    }
    
    // Calculate results
    const correctAnswers = selectedCategory.questions.map(q => q.correctAnswer);
    let score = 0;
    
    userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        score++;
      }
    });
    
    const percentage = Math.round((score / selectedCategory.questions.length) * 100);
    
    setQuizResult({
      score,
      total: selectedCategory.questions.length,
      percentage,
      correctAnswers,
      userAnswers
    });
    
    setQuizCompleted(true);
  };

  // Start a new quiz
  const startNewQuiz = () => {
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
    setTimeLeft(0);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  return (
    <div className="animate-page-transition-in">
      {!selectedCategory ? (
        // Quiz Category Selection
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Quizzes</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizCategories.map(category => (
              <div 
                key={category.id}
                className="glass-card rounded-xl overflow-hidden card-hover cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                    <FileQuestion className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">{category.questions.length} questions</span>
                    <button className="text-sm px-3 py-1 bg-white text-black rounded hover:bg-white/90 transition-colors">
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !quizCompleted ? (
        // Quiz Taking Interface
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">{selectedCategory.name} Quiz</h2>
              <p className="text-white/70">Question {currentQuestionIndex + 1} of {selectedCategory.questions.length}</p>
            </div>
            <div className="flex items-center">
              <div className={`text-lg font-mono ${timeLeft < 30 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="text-lg font-medium mb-4">
              {selectedCategory.questions[currentQuestionIndex].question}
            </div>
            
            <div className="space-y-3">
              {selectedCategory.questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      userAnswers[currentQuestionIndex] === index
                        ? 'bg-black text-white'
                        : 'bg-white/10'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={goToPrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center ${
                currentQuestionIndex === 0 
                  ? 'text-white/40 cursor-not-allowed' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              <ArrowLeft size={16} className="mr-1" /> Previous
            </button>
            
            {currentQuestionIndex < selectedCategory.questions.length - 1 ? (
              <button
                onClick={goToNextQuestion}
                className="btn-primary"
              >
                Next <ArrowRight size={16} className="ml-1" />
              </button>
            ) : (
              <button
                onClick={handleQuizSubmit}
                className="btn-primary"
              >
                Submit Quiz
              </button>
            )}
          </div>
          
          <div className="mt-8">
            <div className="flex justify-center">
              <div className="flex space-x-2">
                {selectedCategory.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      currentQuestionIndex === index
                        ? 'bg-white text-black'
                        : userAnswers[index] !== null
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-white'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Quiz Results
        <div className="glass-card rounded-xl p-6">
          <div className="text-center mb-8">
            <div className="mb-4">
              <Trophy className="h-16 w-16 mx-auto text-white" />
            </div>
            <h2 className="text-2xl font-bold">Quiz Completed!</h2>
            <p className="text-white/70">Your score: {quizResult?.score} out of {quizResult?.total}</p>
            <div className="mt-4 mb-6">
              <div className="relative h-4 w-full max-w-md mx-auto bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full ${
                    quizResult?.percentage && quizResult.percentage >= 70
                      ? 'bg-green-500'
                      : quizResult?.percentage && quizResult.percentage >= 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${quizResult?.percentage || 0}%` }}
                />
              </div>
              <p className="mt-2 font-bold text-lg">{quizResult?.percentage}%</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Review Your Answers</h3>
            <div className="space-y-6">
              {selectedCategory.questions.map((question, qIndex) => (
                <div key={qIndex} className="border border-white/10 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {quizResult?.userAnswers[qIndex] === quizResult?.correctAnswers[qIndex] ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check size={14} className="text-black" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                          <X size={14} className="text-black" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{question.question}</p>
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, oIndex) => (
                          <div 
                            key={oIndex} 
                            className={`px-3 py-1.5 text-sm rounded ${
                              oIndex === quizResult?.userAnswers[qIndex] && oIndex === quizResult?.correctAnswers[qIndex]
                                ? 'bg-green-500/20 text-green-300'
                                : oIndex === quizResult?.userAnswers[qIndex]
                                  ? 'bg-red-500/20 text-red-300'
                                  : oIndex === quizResult?.correctAnswers[qIndex]
                                    ? 'bg-green-500/10 text-green-400/70'
                                    : ''
                            }`}
                          >
                            <span className="mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                            {option}
                            {oIndex === quizResult?.correctAnswers[qIndex] && (
                              <span className="ml-2 text-xs">(Correct Answer)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="space-y-3">
                {mockHighScores.map((scorer, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <span className="font-medium">{scorer.name}</span>
                    </div>
                    <div className="font-mono">{scorer.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={startNewQuiz}
              className="btn-primary"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
