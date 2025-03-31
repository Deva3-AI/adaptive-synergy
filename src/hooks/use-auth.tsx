
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { mockUserData } from '@/utils/mockData';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  isAdmin: boolean;
  isHR: boolean;
  isFinance: boolean;
  isMarketing: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (session?.user) {
          // Get user details from our database
          const { data, error: userError } = await supabase
            .from('users')
            .select(`
              user_id,
              name,
              email,
              role_id,
              roles:role_id(role_name)
            `)
            .eq('email', session.user.email)
            .single();
          
          if (userError) {
            console.error('Error fetching user data:', userError);
            
            // For demo, use mock data
            const mockUser = mockUserData.users.find(u => u.email === session.user?.email);
            
            if (mockUser) {
              const mockRole = mockUserData.roles.find(r => r.role_id === mockUser.role_id);
              
              setUser({
                id: mockUser.user_id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockRole?.role_name || 'unknown'
              });
            } else {
              throw userError;
            }
          } else if (data) {
            setUser({
              id: data.user_id,
              name: data.name,
              email: data.email,
              role: data.roles?.role_name || 'unknown'
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error in auth check:', err);
        setError(err instanceof Error ? err : new Error('Authentication error'));
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select(`
              user_id,
              name,
              email,
              role_id,
              roles:role_id(role_name)
            `)
            .eq('email', session.user.email)
            .single();
          
          if (error) {
            console.error('Error fetching user data after sign in:', error);
            
            // For demo, use mock data
            const mockUser = mockUserData.users.find(u => u.email === session.user?.email);
            
            if (mockUser) {
              const mockRole = mockUserData.roles.find(r => r.role_id === mockUser.role_id);
              
              setUser({
                id: mockUser.user_id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockRole?.role_name || 'unknown'
              });
            } else {
              throw error;
            }
          } else if (data) {
            setUser({
              id: data.user_id,
              name: data.name,
              email: data.email,
              role: data.roles?.role_name || 'unknown'
            });
          }
        } catch (err) {
          console.error('Error handling sign in:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // For demo purposes, let's simulate fetching user data
        const mockUser = mockUserData.users.find(u => u.email === email);
        
        if (mockUser) {
          const mockRole = mockUserData.roles.find(r => r.role_id === mockUser.role_id);
          
          setUser({
            id: mockUser.user_id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockRole?.role_name || 'unknown'
          });
          
          toast.success('Logged in successfully!');
          navigate('/dashboard');
          return { success: true };
        } else {
          // If we don't have mock data for this user, create a default one
          setUser({
            id: Date.now(),
            name: email.split('@')[0],
            email,
            role: 'employee'
          });
          
          toast.success('Logged in successfully!');
          navigate('/dashboard');
          return { success: true };
        }
      }
      
      return { success: false, error: 'Unknown error occurred' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      // In a real app, we would insert the user into our users table here
      // For demo, we'll just set the user
      if (data.user) {
        setUser({
          id: Date.now(),
          name,
          email,
          role: 'employee' // Default role for new users
        });
        
        toast.success('Registration successful!');
        navigate('/dashboard');
        return { success: true };
      }
      
      return { success: false, error: 'Unknown error occurred' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
      toast.error('Error logging out');
    }
  };

  // Role-based helper properties
  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr' || isAdmin;
  const isFinance = user?.role === 'finance' || isAdmin;
  const isMarketing = user?.role === 'marketing' || isAdmin;
  const isEmployee = !!user; // All authenticated users are at least employees

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        isAdmin,
        isHR,
        isFinance,
        isMarketing,
        isEmployee
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
