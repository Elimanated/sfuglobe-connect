
import { useAuth } from '../context/AuthContext';
import { Book, Users, Trophy, FileQuestion, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickAccessCard = ({ title, description, icon: Icon, to }: {
  title: string;
  description: string;
  icon: React.ElementType;
  to: string;
}) => (
  <Link to={to} className="block">
    <div className="glass-card rounded-lg p-6 card-hover h-full">
      <div className="flex items-center mb-4">
        <div className="bg-primary/10 text-primary rounded-full p-2 mr-3">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </Link>
);

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="animate-page-transition-in space-y-8">
      <section className="glass-card rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">
              Student ID: {user?.studentId}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAccessCard
            title="Study"
            description="Search for students and connect with them for study sessions."
            icon={Book}
            to="/study"
          />
          <QuickAccessCard
            title="Clubs"
            description="Discover and join clubs that match your interests."
            icon={Users}
            to="/club"
          />
          <QuickAccessCard
            title="Quizzes"
            description="Test your knowledge in various subjects and compete with others."
            icon={FileQuestion}
            to="/quiz"
          />
          <QuickAccessCard
            title="Leaderboard"
            description="See where you stand among your peers in quiz rankings."
            icon={Trophy}
            to="/leaderboard"
          />
          <QuickAccessCard
            title="Games"
            description="Take a break and enjoy some fun games with other students."
            icon={Gamepad2}
            to="/games"
          />
        </div>
      </section>

      <section className="glass-card rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          <div className="flex items-center p-3 border border-border/40 rounded-md hover:bg-secondary/50 transition-colors">
            <div className="text-primary mr-3">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm">You ranked #5 in the latest IT quiz</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 border border-border/40 rounded-md hover:bg-secondary/50 transition-colors">
            <div className="text-primary mr-3">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm">Your request to join Basketball Club is pending</p>
              <p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
