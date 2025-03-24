
import { useState } from 'react';
import { 
  Gamepad2, 
  ArrowLeft,
  RotateCcw,
  X,
  Circle,
  Hand,
  Scissors,
  Square
} from 'lucide-react';
import { toast } from 'sonner';

// Game types
type TicTacToeValue = 'X' | 'O' | null;
type RPSChoice = 'rock' | 'paper' | 'scissors' | null;
type MemoryCardState = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<'tictactoe' | 'rps' | 'memory' | null>(null);
  
  const handleSelectGame = (game: 'tictactoe' | 'rps' | 'memory') => {
    setSelectedGame(game);
  };
  
  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  return (
    <div className="animate-page-transition-in">
      {/* Game Selection Screen */}
      {!selectedGame ? (
        <>
          <h1 className="text-3xl font-bold mb-8">Games</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tic Tac Toe */}
            <div
              className="glass-card p-6 rounded-lg card-hover cursor-pointer"
              onClick={() => handleSelectGame('tictactoe')}
            >
              <div className="bg-blue-100 text-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="grid grid-cols-3 gap-0.5 w-8 h-8">
                  {Array(9).fill(null).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 w-2 flex items-center justify-center ${
                        i === 0 || i === 4 || i === 8 ? 'text-blue-700' : ''
                      }`}
                    >
                      {i === 0 || i === 4 || i === 8 ? '×' : ''}
                    </div>
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Tic Tac Toe</h3>
              <p className="text-muted-foreground text-center mb-4">
                The classic game of X's and O's. Try to get three in a row!
              </p>
              <button
                onClick={() => handleSelectGame('tictactoe')}
                className="btn-primary w-full"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </button>
            </div>
            
            {/* Rock Paper Scissors */}
            <div
              className="glass-card p-6 rounded-lg card-hover cursor-pointer"
              onClick={() => handleSelectGame('rps')}
            >
              <div className="bg-purple-100 text-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="relative">
                  <Hand className="w-8 h-8 absolute -left-3 -top-1 transform rotate-90" />
                  <Scissors className="w-7 h-7 absolute top-1 right-0" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Rock Paper Scissors</h3>
              <p className="text-muted-foreground text-center mb-4">
                Challenge the computer in this game of chance and strategy.
              </p>
              <button
                onClick={() => handleSelectGame('rps')}
                className="btn-primary w-full"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </button>
            </div>
            
            {/* Memory Match */}
            <div
              className="glass-card p-6 rounded-lg card-hover cursor-pointer"
              onClick={() => handleSelectGame('memory')}
            >
              <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="grid grid-cols-2 gap-1 w-8 h-8">
                  {Array(4).fill(null).map((_, i) => (
                    <Square key={i} className="w-3.5 h-3.5" />
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Memory Match</h3>
              <p className="text-muted-foreground text-center mb-4">
                Test your memory by matching pairs of cards. Find them all to win!
              </p>
              <button
                onClick={() => handleSelectGame('memory')}
                className="btn-primary w-full"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </button>
            </div>
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={handleBackToGames}
            className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </button>
          
          {selectedGame === 'tictactoe' && <TicTacToeGame />}
          {selectedGame === 'rps' && <RPSGame />}
          {selectedGame === 'memory' && <MemoryGame />}
        </div>
      )}
    </div>
  );
};

// TicTacToe Game Component
const TicTacToeGame = () => {
  const [board, setBoard] = useState<TicTacToeValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<TicTacToeValue | 'draw' | null>(null);
  
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };
  
  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      toast.success(`${gameWinner} wins!`);
    } else if (newBoard.every(square => square !== null)) {
      setWinner('draw');
      toast.info("It's a draw!");
    } else {
      setIsXNext(!isXNext);
    }
  };
  
  const renderSquare = (index: number) => {
    return (
      <button
        key={index}
        className={`w-full h-20 md:h-24 bg-white/50 border border-border/40 rounded-md flex items-center justify-center text-3xl font-bold transition-all hover:bg-white/80 ${
          board[index] === 'X' ? 'text-blue-600' : 
          board[index] === 'O' ? 'text-red-600' : ''
        }`}
        onClick={() => handleClick(index)}
        disabled={!!board[index] || !!winner}
      >
        {board[index] === 'X' && <X className="w-8 h-8" />}
        {board[index] === 'O' && <Circle className="w-8 h-8" />}
      </button>
    );
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Tic Tac Toe</h1>
      
      <div className="glass-card p-6 rounded-lg mb-6">
        <div className="text-center mb-6">
          {winner ? (
            <div className="mb-4">
              {winner === 'draw' ? (
                <p className="text-xl font-semibold">It's a draw!</p>
              ) : (
                <p className="text-xl font-semibold">
                  Winner: <span className={winner === 'X' ? 'text-blue-600' : 'text-red-600'}>
                    {winner}
                  </span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-xl font-semibold mb-4">
              Next player: <span className={isXNext ? 'text-blue-600' : 'text-red-600'}>
                {isXNext ? 'X' : 'O'}
              </span>
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {Array(9).fill(null).map((_, index) => renderSquare(index))}
        </div>
      </div>
      
      <div className="text-center">
        <button onClick={resetGame} className="btn-primary">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Game
        </button>
      </div>
    </div>
  );
};

// Rock Paper Scissors Game Component
const RPSGame = () => {
  const [playerChoice, setPlayerChoice] = useState<RPSChoice>(null);
  const [computerChoice, setComputerChoice] = useState<RPSChoice>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const choices: RPSChoice[] = ['rock', 'paper', 'scissors'];
  
  const resetRound = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };
  
  const resetGame = () => {
    resetRound();
    setPlayerScore(0);
    setComputerScore(0);
  };
  
  const determineWinner = (player: RPSChoice, computer: RPSChoice): 'win' | 'lose' | 'draw' => {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };
  
  const playGame = (choice: RPSChoice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult(null);
    
    // Simulate computer "thinking"
    const animationInterval = setInterval(() => {
      setComputerChoice(choices[Math.floor(Math.random() * 3)]);
    }, 100);
    
    // After animation, set final result
    setTimeout(() => {
      clearInterval(animationInterval);
      
      const computer = choices[Math.floor(Math.random() * 3)];
      setComputerChoice(computer);
      
      const gameResult = determineWinner(choice, computer);
      setResult(gameResult);
      
      if (gameResult === 'win') {
        setPlayerScore(prev => prev + 1);
        toast.success('You win!');
      } else if (gameResult === 'lose') {
        setComputerScore(prev => prev + 1);
        toast.error('Computer wins!');
      } else {
        toast.info("It's a draw!");
      }
      
      setIsAnimating(false);
    }, 1000);
  };
  
  const getChoiceIcon = (choice: RPSChoice) => {
    switch (choice) {
      case 'rock': return <Hand className="w-8 h-8 transform rotate-90" />;
      case 'paper': return <Square className="w-8 h-8" />;
      case 'scissors': return <Scissors className="w-8 h-8" />;
      default: return <div className="w-8 h-8" />;
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Rock Paper Scissors</h1>
      
      <div className="glass-card p-6 rounded-lg mb-6">
        {/* Score */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <p className="text-lg font-semibold">You</p>
            <p className="text-3xl font-bold">{playerScore}</p>
          </div>
          <div className="text-xs px-3 py-1 bg-secondary rounded-full">VS</div>
          <div className="text-center">
            <p className="text-lg font-semibold">Computer</p>
            <p className="text-3xl font-bold">{computerScore}</p>
          </div>
        </div>
        
        {/* Game Area */}
        <div className="flex justify-between items-center mb-10">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full ${
              playerChoice ? 'bg-primary/10' : 'bg-secondary'
            } flex items-center justify-center mx-auto mb-2`}>
              {playerChoice ? getChoiceIcon(playerChoice) : '?'}
            </div>
            <p className="font-medium">Your Choice</p>
          </div>
          
          <div className="text-2xl font-bold">vs</div>
          
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full ${
              computerChoice ? 'bg-primary/10' : 'bg-secondary'
            } ${isAnimating ? 'animate-pulse' : ''} flex items-center justify-center mx-auto mb-2`}>
              {computerChoice ? getChoiceIcon(computerChoice) : '?'}
            </div>
            <p className="font-medium">Computer</p>
          </div>
        </div>
        
        {/* Result */}
        {result && (
          <div className={`text-center mb-8 p-3 rounded-md ${
            result === 'win' ? 'bg-green-100 text-green-700' :
            result === 'lose' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            <p className="font-bold text-lg">
              {result === 'win' ? 'You Win!' : 
               result === 'lose' ? 'Computer Wins!' : 
               "It's a Draw!"}
            </p>
          </div>
        )}
        
        {/* Choice Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {choices.map(choice => (
            <button
              key={choice}
              onClick={() => playGame(choice)}
              disabled={isAnimating}
              className={`py-3 px-4 rounded-md border border-border/40 flex flex-col items-center transition-colors ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'
              }`}
            >
              <div className="mb-2">{getChoiceIcon(choice)}</div>
              <span className="capitalize">{choice}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <button onClick={resetGame} className="btn-primary">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Game
        </button>
      </div>
    </div>
  );
};

// Memory Match Game Component
const MemoryGame = () => {
  const emojis = ['🚀', '🌟', '🎮', '🎵', '🎨', '🏆', '🍕', '🍦'];
  const [cards, setCards] = useState<MemoryCardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  
  // Initialize game
  const initializeGame = () => {
    // Create pairs of cards
    const newDeck: MemoryCardState[] = [...emojis, ...emojis].map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle cards
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    setCards(newDeck);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsGameComplete(false);
  };
  
  // Initialize on component mount
  useState(() => {
    initializeGame();
  });
  
  // Handle card click
  const handleCardClick = (id: number) => {
    if (isChecking || flippedCards.length >= 2) return;
    
    // Find the clicked card
    const clickedCard = cards.find(card => card.id === id);
    
    // Ignore if card is already flipped or matched
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;
    
    // Flip the card
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    );
    
    setCards(updatedCards);
    setFlippedCards([...flippedCards, id]);
    
    // If this is the second card flipped
    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      setIsChecking(true);
      
      // Get both flipped cards
      const firstCardId = flippedCards[0];
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = updatedCards.find(card => card.id === id);
      
      // Check if they match
      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Cards match
        setTimeout(() => {
          const matchedCards = updatedCards.map(card => 
            (card.id === firstCardId || card.id === id) 
              ? { ...card, isMatched: true } 
              : card
          );
          
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
          setIsChecking(false);
          
          // Check if all pairs are matched
          if (matchedPairs + 1 === emojis.length) {
            setIsGameComplete(true);
            toast.success('Congratulations! You completed the game!');
          }
        }, 500);
      } else {
        // Cards don't match, flip them back
        setTimeout(() => {
          const resetCards = updatedCards.map(card => 
            (card.id === firstCardId || card.id === id) 
              ? { ...card, isFlipped: false } 
              : card
          );
          
          setCards(resetCards);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Memory Match</h1>
      
      <div className="glass-card p-6 rounded-lg mb-6">
        {/* Game Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Moves</p>
            <p className="text-2xl font-bold">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Pairs</p>
            <p className="text-2xl font-bold">{matchedPairs}/{emojis.length}</p>
          </div>
        </div>
        
        {/* Game Complete Message */}
        {isGameComplete && (
          <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6 text-center">
            <p className="font-bold text-lg mb-2">Congratulations!</p>
            <p>You completed the game in {moves} moves.</p>
          </div>
        )}
        
        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-2">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || isChecking || isGameComplete}
              className={`aspect-square rounded-md border transition-all ${
                card.isFlipped || card.isMatched
                  ? 'bg-white rotate-y-180'
                  : 'bg-primary hover:bg-primary/90'
              } ${card.isMatched ? 'border-green-500' : 'border-border/40'}`}
            >
              <div className={`h-full w-full flex items-center justify-center text-2xl ${
                card.isFlipped || card.isMatched ? 'block' : 'hidden'
              }`}>
                {card.emoji}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <button onClick={initializeGame} className="btn-primary">
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </button>
      </div>
    </div>
  );
};

// Helper function to calculate winner for TicTacToe
function calculateWinner(squares: TicTacToeValue[]): TicTacToeValue {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  
  return null;
}

export default GamesPage;
