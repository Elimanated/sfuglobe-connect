
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
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

      {/* Auth Form */}
      <div className="w-full md:w-2/5 p-8 flex items-center justify-center">
        <div className="w-full max-w-md glass-card p-8 rounded-lg animate-scale-in">
          <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@sfu.ca"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            </TabsContent>
            
            <TabsContent value="signup">
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
                    placeholder="John Smith"
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
                    placeholder="your.email@sfu.ca"
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
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary py-2"
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Create an account or sign in to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
