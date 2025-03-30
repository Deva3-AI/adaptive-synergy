
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => Promise<void>;
  
  // Role checking methods
  isAdmin: boolean;
  isEmployee: boolean;
  isClient: boolean;
  isMarketing: boolean;
  isHR: boolean;
  isFinance: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user details from users table
          const { data, error } = await supabase
            .from('users')
            .select(`
              user_id,
              name,
              email,
              roles (role_name)
            `)
            .eq('user_id', session.user.id)
            .single();
            
          if (data && !error) {
            setUser({
              id: data.user_id,
              name: data.name,
              email: data.email,
              role: data.roles?.role_name || 'user',
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data, error } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            roles (role_name)
          `)
          .eq('user_id', session.user.id)
          .single();
          
        if (data && !error) {
          setUser({
            id: data.user_id,
            name: data.name,
            email: data.email,
            role: data.roles?.role_name || 'user',
          });
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
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Get user details from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            roles (role_name)
          `)
          .eq('user_id', data.user.id)
          .single();
          
        if (userError) throw userError;
        
        if (userData) {
          setUser({
            id: userData.user_id,
            name: userData.name,
            email: userData.email,
            role: userData.roles?.role_name || 'user',
          });
          
          // Determine redirect based on role
          const role = userData.roles?.role_name;
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'employee') {
            navigate('/employee/dashboard');
          } else if (role === 'client') {
            navigate('/client/dashboard');
          } else if (role === 'marketing') {
            navigate('/marketing/dashboard');
          } else if (role === 'hr') {
            navigate('/hr/dashboard');
          } else if (role === 'finance') {
            navigate('/finance/dashboard');
          } else {
            navigate('/dashboard');
          }
          
          toast.success('Logged in successfully');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      setIsLoading(true);
      
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Get role_id for the specified role
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('role_id')
          .eq('role_name', userData.role)
          .single();
          
        if (roleError) throw roleError;
        
        // Create user record in users table
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            user_id: data.user.id,
            name: userData.name,
            email: userData.email,
            role_id: roleData.role_id,
          })
          .select()
          .single();
          
        if (userError) throw userError;
        
        setUser({
          id: newUser.user_id,
          name: newUser.name,
          email: newUser.email,
          role: userData.role,
        });
        
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  // Role checking properties
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const isClient = user?.role === 'client';
  const isMarketing = user?.role === 'marketing';
  const isHR = user?.role === 'hr';
  const isFinance = user?.role === 'finance';
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        isAdmin,
        isEmployee,
        isClient,
        isMarketing,
        isHR,
        isFinance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
