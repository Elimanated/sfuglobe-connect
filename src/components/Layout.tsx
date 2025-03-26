
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Book, 
  Users, 
  FileQuestion, 
  Trophy, 
  Gamepad2, 
  ClipboardCheck, 
  ShoppingBag, 
  Bell,
  LogOut,
  User
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/home', icon: Home },
  { name: 'Study', path: '/study', icon: Book },
  { name: 'Club', path: '/club', icon: Users },
  { name: 'Quiz', path: '/quiz', icon: FileQuestion },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Games', path: '/games', icon: Gamepad2 },
  { name: 'Attendance', path: '/attendance', icon: ClipboardCheck },
  { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  { name: 'Newsfeed', path: '/newsfeed', icon: Bell },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  // Animation mounting effect
  useEffect(() => {
    setMounted(false);
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container px-4 mx-auto flex items-center justify-between h-16">
          <Link to="/home" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SFU Study Buddy</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path 
                    ? 'text-white before:bg-white' 
                    : 'text-white/60 hover:text-white/90'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 p-1 rounded-full border border-white/20 hover:border-white/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="object-cover w-full h-full" />
                  ) : (
                    <User className="w-4 h-4 text-white/70" />
                  )}
                </div>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-black border border-white/10 opacity-0 invisible 
                group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-white/5 text-white/80 hover:text-white">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-sm hover:bg-white/5 text-white/80 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-white/10 backdrop-blur-md">
        <div className="flex justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-md ${
                location.pathname === item.path ? 'text-white' : 'text-white/60'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
          
          <div className="relative group">
            <button className="flex flex-col items-center p-2 text-white/60">
              <span className="w-5 h-5 flex items-center justify-center">⋯</span>
              <span className="text-xs mt-1">More</span>
            </button>
            
            <div className="absolute bottom-full right-0 mb-2 w-48 origin-bottom-right rounded-md shadow-lg bg-black border border-white/10 opacity-0 invisible 
              group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                {navItems.slice(5).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-4 py-2 text-sm hover:bg-white/5 text-white/80 hover:text-white"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm hover:bg-white/5 text-white/80 hover:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-white/5 text-white/80 hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className={`flex-1 container px-4 py-6 mx-auto transition-opacity duration-500 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
