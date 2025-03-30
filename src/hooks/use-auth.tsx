
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isClient: boolean;
  isMarketing: boolean;
  isHR: boolean;
  isFinance: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  
  // Role-specific flags
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const isClient = user?.role === 'client';
  const isMarketing = user?.role === 'marketing';
  const isHR = user?.role === 'hr';
  const isFinance = user?.role === 'finance';

  useEffect(() => {
    // Check for user on initial load
    const checkUser = async () => {
      try {
        console.info('Auth state:', { isAuthenticated, user, loading });
        
        // First check localStorage for user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.info('User found in localStorage:', parsedUser);
          setUser(parsedUser);
        }
        
        // Then check Supabase for session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user details from our users table
          const { data: userData, error } = await supabase
            .from('users')
            .select(`
              user_id,
              name,
              email,
              roles (
                role_name
              )
            `)
            .eq('email', session.user.email)
            .single();
          
          if (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          } else if (userData) {
            const user = {
              id: userData.user_id,
              name: userData.name,
              email: userData.email,
              role: userData.roles?.role_name || 'unknown'
            };
            
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            // Get user details from our users table
            const { data: userData, error } = await supabase
              .from('users')
              .select(`
                user_id,
                name,
                email,
                roles (
                  role_name
                )
              `)
              .eq('email', session.user.email)
              .single();
            
            if (error) {
              console.error('Error fetching user data on auth change:', error);
              setUser(null);
              localStorage.removeItem('user');
            } else if (userData) {
              const user = {
                id: userData.user_id,
                name: userData.name,
                email: userData.email,
                role: userData.roles?.role_name || 'unknown'
              };
              
              setUser(user);
              localStorage.setItem('user', JSON.stringify(user));
            }
          } catch (error) {
            console.error('Error in auth change handler:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('user');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user details from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          user_id,
          name,
          email,
          roles (
            role_name
          )
        `)
        .eq('email', email)
        .single();
      
      if (userError) throw userError;

      const user = {
        id: userData.user_id,
        name: userData.name,
        email: userData.email,
        role: userData.roles?.role_name || 'unknown'
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Create auth user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Get the default role (probably 'employee')
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('role_id')
        .eq('role_name', 'employee')
        .single();
      
      if (roleError) throw roleError;

      // Create user record in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            email,
            name,
            role_id: roleData.role_id,
            password_hash: 'managed_by_supabase'
          }
        ])
        .select();
      
      if (userError) throw userError;

      toast.success('Signup successful! Please check your email for verification.');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Password reset request error:', error);
      throw error;
    }
  };

  const resetPassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      toast.success('Password updated successfully!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to reset password');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        requestPasswordReset,
        resetPassword,
        loading,
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
