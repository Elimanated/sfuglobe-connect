
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Hero Section */}
      <div className="w-full md:w-3/5 bg-gradient-to-br from-primary/90 to-primary p-8 flex items-center justify-center">
        <div className="max-w-md text-center md:text-left">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to SFU Globe</h1>
            <p className="text-white/80 mb-8">
              Connect with students, join clubs, ace quizzes, and more - all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full md:w-2/5 p-8 flex items-center justify-center">
        <div className="w-full max-w-md glass-card p-8 rounded-lg animate-scale-in">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="your.email@sfu.ca"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-2"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>For demo purposes, you can sign in with any email and password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
