
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock user data
interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar: string;
  bio?: string;
  program?: string;
  year?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('sfu_globe_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll accept any email/password
      // In a real app, you would validate credentials with a backend
      const newUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' '),
        email,
        studentId: Math.floor(Math.random() * 900000 + 100000).toString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(newUser);
      localStorage.setItem('sfu_globe_user', JSON.stringify(newUser));
      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sfu_globe_user');
    toast.info('Logged out successfully');
    navigate('/');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('sfu_globe_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
