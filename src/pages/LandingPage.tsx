
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '@/components/ui/input';
import { X, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(email, password, name, studentId);
      setActiveTab("login");
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">SFU Study Buddy</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 rounded-xl border border-white/10 backdrop-blur-md bg-white/5">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome</h2>
              <p className="text-white/70">Connect with fellow students and excel in your studies</p>
            </div>

            {/* Tab Selection */}
            <div className="flex border-b border-white/10 mb-6">
              <button
                className={`flex-1 pb-3 font-medium transition-colors ${
                  activeTab === 'login' 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-white/50 hover:text-white/80'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`flex-1 pb-3 font-medium transition-colors ${
                  activeTab === 'signup' 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-white/50 hover:text-white/80'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-white/90 py-2 rounded-md font-medium mt-2 flex items-center justify-center transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Logging in...</span>
                  ) : (
                    <span className="flex items-center">Login <ChevronRight className="ml-1 h-4 w-4" /></span>
                  )}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="student-id" className="block text-sm font-medium mb-1">
                    Student ID
                  </label>
                  <Input
                    id="student-id"
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="301xxxxxx"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-white/90 py-2 rounded-md font-medium mt-2 flex items-center justify-center transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Creating account...</span>
                  ) : (
                    <span className="flex items-center">Sign Up <ChevronRight className="ml-1 h-4 w-4" /></span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 p-4 text-center text-white/50">
        <p>© {new Date().getFullYear()} SFU Study Buddy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
