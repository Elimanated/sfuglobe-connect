
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Users, Brain, Monitor, Microscope } from 'lucide-react';

// Mock leaderboard data
interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  categoryId: string;
  score: number;
  totalQuestions: number;
  timestamp: Date;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: 'entry1',
    userId: 'user1',
    userName: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    categoryId: 'it-ai',
    score: 9,
    totalQuestions: 10,
    timestamp: new Date('2023-10-01')
  },
  {
    id: 'entry2',
    userId: 'user2',
    userName: 'Jamie Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie',
    categoryId: 'math',
    score: 8,
    totalQuestions: 10,
    timestamp: new Date('2023-10-02')
  },
  {
    id: 'entry3',
    userId: 'user3',
    userName: 'Morgan Lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
    categoryId: 'bio',
    score: 10,
    totalQuestions: 10,
    timestamp: new Date('2023-10-03')
  },
  {
    id: 'entry4',
    userId: 'user4',
    userName: 'Casey Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
    categoryId: 'it-ai',
    score: 7,
    totalQuestions: 10,
    timestamp: new Date('2023-10-04')
  },
  {
    id: 'entry5',
    userId: 'user5',
    userName: 'Taylor Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    categoryId: 'math',
    score: 6,
    totalQuestions: 10,
    timestamp: new Date('2023-10-05')
  },
  {
    id: 'entry6',
    userId: 'user_current',
    userName: 'You',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
    categoryId: 'it-ai',
    score: 8,
    totalQuestions: 10,
    timestamp: new Date('2023-10-05')
  }
];

const categoryIcons: Record<string, React.ElementType> = {
  'it-ai': Monitor,
  'math': Brain,
  'bio': Microscope
};

const categoryNames: Record<string, string> = {
  'it-ai': 'IT & AI',
  'math': 'Mathematics',
  'bio': 'Biology',
  'all': 'All Categories'
};

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Filter entries based on selected category
  const filteredEntries = selectedCategory === 'all'
    ? mockLeaderboard
    : mockLeaderboard.filter(entry => entry.categoryId === selectedCategory);
  
  // Sort entries by score (descending) and timestamp (tie-breaker)
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    // First by score percentage
    const scorePercentA = a.score / a.totalQuestions;
    const scorePercentB = b.score / b.totalQuestions;
    
    if (scorePercentB !== scorePercentA) {
      return scorePercentB - scorePercentA;
    }
    
    // Then by timestamp (most recent first)
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
  
  // Find current user's rank
  const currentUserRank = sortedEntries.findIndex(entry => entry.userId === user?.id) + 1;

  return (
    <div className="animate-page-transition-in">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Users className="w-4 h-4 mr-2 inline-block" />
            All Categories
          </button>
          
          {Object.keys(categoryNames).filter(id => id !== 'all').map(categoryId => {
            const CategoryIcon = categoryIcons[categoryId];
            return (
              <button
                key={categoryId}
                onClick={() => setSelectedCategory(categoryId)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === categoryId
                    ? 'bg-primary text-white'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <CategoryIcon className="w-4 h-4 mr-2 inline-block" />
                {categoryNames[categoryId]}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Top 3 Leaderboard */}
      {sortedEntries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Top Performers</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8">
            {/* Second Place */}
            {sortedEntries.length > 1 && (
              <div className="order-1 md:order-0">
                <div className="glass-card p-4 rounded-lg text-center w-full md:w-48">
                  <div className="relative">
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full">
                      <div className="bg-[#C0C0C0] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                        2
                      </div>
                    </div>
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mt-4 border-4 border-[#C0C0C0]">
                      <img
                        src={sortedEntries[1].avatar}
                        alt={sortedEntries[1].userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-bold mt-3">{sortedEntries[1].userName}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {categoryNames[sortedEntries[1].categoryId]}
                  </p>
                  <p className="font-medium">
                    {sortedEntries[1].score}/{sortedEntries[1].totalQuestions}
                  </p>
                </div>
              </div>
            )}
            
            {/* First Place */}
            <div className="order-0 md:order-1">
              <div className="glass-card p-6 rounded-lg text-center w-full md:w-56 transform md:scale-110 relative z-10">
                <div className="relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 -translate-y-full">
                    <div className="bg-[#FFD700] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mt-4 border-4 border-[#FFD700]">
                    <img
                      src={sortedEntries[0].avatar}
                      alt={sortedEntries[0].userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mt-3">{sortedEntries[0].userName}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {categoryNames[sortedEntries[0].categoryId]}
                </p>
                <p className="font-bold text-lg">
                  {sortedEntries[0].score}/{sortedEntries[0].totalQuestions}
                </p>
              </div>
            </div>
            
            {/* Third Place */}
            {sortedEntries.length > 2 && (
              <div className="order-2">
                <div className="glass-card p-4 rounded-lg text-center w-full md:w-48">
                  <div className="relative">
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full">
                      <div className="bg-[#CD7F32] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                        3
                      </div>
                    </div>
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mt-4 border-4 border-[#CD7F32]">
                      <img
                        src={sortedEntries[2].avatar}
                        alt={sortedEntries[2].userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-bold mt-3">{sortedEntries[2].userName}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {categoryNames[sortedEntries[2].categoryId]}
                  </p>
                  <p className="font-medium">
                    {sortedEntries[2].score}/{sortedEntries[2].totalQuestions}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Full Leaderboard */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Full Rankings</h2>
          <p className="text-muted-foreground mb-6">
            {selectedCategory === 'all'
              ? 'Showing rankings across all quiz categories'
              : `Showing rankings for ${categoryNames[selectedCategory]}`}
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Score</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((entry, index) => {
                  const isCurrentUser = entry.userId === user?.id;
                  const CategoryIcon = categoryIcons[entry.categoryId];
                  
                  return (
                    <tr 
                      key={entry.id} 
                      className={`border-b border-border/40 ${
                        isCurrentUser ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                              index === 0 ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                              index === 1 ? 'bg-[#C0C0C0]/20 text-[#C0C0C0]' :
                              'bg-[#CD7F32]/20 text-[#CD7F32]'
                            }`}>
                              {index === 0 ? <Trophy className="w-4 h-4" /> : index + 1}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-2">
                              {index + 1}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            <img 
                              src={entry.avatar} 
                              alt={entry.userName} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="font-medium">{entry.userName}</p>
                            {isCurrentUser && (
                              <p className="text-xs text-primary">You</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center mr-2">
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                          <span>{categoryNames[entry.categoryId]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{entry.score}/{entry.totalQuestions}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round((entry.score / entry.totalQuestions) * 100)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {entry.timestamp.toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {sortedEntries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No entries found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
