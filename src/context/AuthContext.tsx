
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name?: string;
  email?: string;
  studentId?: string;
  avatar?: string;
  bio?: string;
  program?: string;
  year?: number;
  username?: string;
}

interface AuthContextType {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, studentId?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
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
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        
        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile:', error);
              return;
            }
            
            if (profile) {
              setUser({
                id: profile.id,
                name: profile.username,
                email: profile.email || session.user.email,
                studentId: profile.student_id,
                avatar: profile.avatar,
                bio: profile.bio,
                program: profile.program,
                year: profile.year,
                username: profile.username
              });
            }
          } catch (error) {
            console.error('Error in auth change handler:', error);
          }
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile:', error);
              return;
            }
            
            if (profile) {
              setUser({
                id: profile.id,
                name: profile.username,
                email: profile.email || session.user.email,
                studentId: profile.student_id,
                avatar: profile.avatar,
                bio: profile.bio,
                program: profile.program,
                year: profile.year,
                username: profile.username
              });
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Login successful!');
      navigate('/home');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, studentId?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            student_id: studentId,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Signup successful! Check your email for verification.');
    } catch (error: any) {
      toast.error(`Signup failed: ${error.message}`);
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user?.id) {
      toast.error('Must be logged in to update profile');
      return;
    }
    
    try {
      setLoading(true);
      
      const updates = {
        username: data.name,
        bio: data.bio,
        program: data.program,
        year: data.year,
        student_id: data.studentId,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      loading, 
      login, 
      signup,
      logout, 
      updateProfile,
      isAuthenticated: !!session
    }}>
      {children}
    </AuthContext.Provider>
  );
};
