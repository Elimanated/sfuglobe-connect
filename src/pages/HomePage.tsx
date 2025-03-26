
import { useAuth } from '../context/AuthContext';
import { Book, Users, FileQuestion, Trophy, Gamepad2, ClipboardCheck, ShoppingBag, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, path }) => (
  <Link to={path} className="glass-card rounded-xl overflow-hidden card-hover block">
    <div className="p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  </Link>
);

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Study Connect',
      description: 'Find and connect with other students for study sessions and collaboration.',
      icon: <Book className="text-white" size={20} />,
      path: '/study'
    },
    {
      title: 'Clubs',
      description: 'Join student clubs and organizations based on your interests.',
      icon: <Users className="text-white" size={20} />,
      path: '/club'
    },
    {
      title: 'Quizzes',
      description: 'Test your knowledge with quizzes in various subjects and track your progress.',
      icon: <FileQuestion className="text-white" size={20} />,
      path: '/quiz'
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank against other students based on quiz scores.',
      icon: <Trophy className="text-white" size={20} />,
      path: '/leaderboard'
    },
    {
      title: 'Games',
      description: 'Take a break and enjoy some fun games with your friends.',
      icon: <Gamepad2 className="text-white" size={20} />,
      path: '/games'
    },
    {
      title: 'Attendance',
      description: 'Track your attendance for classes and events.',
      icon: <ClipboardCheck className="text-white" size={20} />,
      path: '/attendance'
    },
    {
      title: 'Marketplace',
      description: 'Buy and sell textbooks, supplies, and other items with fellow students.',
      icon: <ShoppingBag className="text-white" size={20} />,
      path: '/marketplace'
    },
    {
      title: 'Newsfeed',
      description: 'Stay updated with the latest campus news and events.',
      icon: <Bell className="text-white" size={20} />,
      path: '/newsfeed'
    }
  ];

  return (
    <div className="animate-page-transition-in">
      {/* Welcome Section */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-6 border-2 border-white/20">
            <img 
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anon'} 
              alt={user?.name || 'User'} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name || 'Student'}</h1>
            <p className="text-white/70">
              {user?.studentId ? `Student ID: ${user.studentId}` : 'Complete your profile to get the most out of SFU Study Buddy'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            path={feature.path}
          />
        ))}
      </div>
      
      {/* Recent Activity Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="glass-card rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                <FileQuestion className="text-white/70" size={18} />
              </div>
              <div>
                <p className="text-sm text-white/70">Upcoming Quiz</p>
                <p className="font-medium">Introduction to AI - Friday, 3:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-center border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                <Users className="text-white/70" size={18} />
              </div>
              <div>
                <p className="text-sm text-white/70">Club Meeting</p>
                <p className="font-medium">Basketball Club - Thursday, 5:30 PM</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                <Book className="text-white/70" size={18} />
              </div>
              <div>
                <p className="text-sm text-white/70">Study Group</p>
                <p className="font-medium">Mathematics 101 - Today, 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
