
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  client_id?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isEmployee: boolean;
  isClient: boolean;
  isMarketing: boolean;
  isHR: boolean;
  isFinance: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    isEmployee: false,
    isClient: false,
    isMarketing: false,
    isHR: false,
    isFinance: false,
    isAdmin: false,
  });

  useEffect(() => {
    // Try to get user from localStorage first (for quick loading)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthState({
          isAuthenticated: true,
          user: parsedUser,
          loading: false,
          isEmployee: parsedUser.role === 'employee',
          isClient: parsedUser.role === 'client',
          isMarketing: parsedUser.role === 'marketing',
          isHR: parsedUser.role === 'hr',
          isFinance: parsedUser.role === 'finance',
          isAdmin: parsedUser.role === 'admin',
        });
        console.info('User found in localStorage:', parsedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user details from the database
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select(`
                user_id,
                name,
                email,
                roles (role_name)
              `)
              .eq('user_id', session.user.id)
              .single();
            
            if (error) throw error;
            
            const roleName = userData.roles?.role_name || 'user';
            
            const user: User = {
              id: userData.user_id,
              name: userData.name,
              email: userData.email,
              role: roleName,
            };
            
            // Store in localStorage and update state
            localStorage.setItem('user', JSON.stringify(user));
            setAuthState({
              isAuthenticated: true,
              user,
              loading: false,
              isEmployee: roleName === 'employee',
              isClient: roleName === 'client',
              isMarketing: roleName === 'marketing',
              isHR: roleName === 'hr',
              isFinance: roleName === 'finance',
              isAdmin: roleName === 'admin',
            });
          } catch (error) {
            console.error('Error fetching user details:', error);
            setAuthState({
              isAuthenticated: false,
              user: null,
              loading: false,
              isEmployee: false,
              isClient: false,
              isMarketing: false,
              isHR: false,
              isFinance: false,
              isAdmin: false,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('user');
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            isEmployee: false,
            isClient: false,
            isMarketing: false,
            isHR: false,
            isFinance: false,
            isAdmin: false,
          });
        }
      }
    );

    // Cleanup subscription
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

      // User details will be fetched and state updated by the auth listener
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error.message);
      return { 
        success: false, 
        error: error.message || 'Failed to login. Please check your credentials.' 
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        isEmployee: false,
        isClient: false,
        isMarketing: false,
        isHR: false,
        isFinance: false,
        isAdmin: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData: any) => {
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) throw error;

      // Create user record in users table
      const { error: userError } = await supabase.from('users').insert({
        name: userData.name,
        email: userData.email,
        password_hash: userData.password, // In a real app, this should be hashed
        role_id: userData.role_id || 1, // Default role
      });

      if (userError) throw userError;

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error.message);
      return { 
        success: false, 
        error: error.message || 'Failed to register. Please try again.' 
      };
    }
  };

  // Alias for register for compatibility
  const signup = register;

  const value = {
    ...authState,
    login,
    logout,
    register,
    signup,
  };

  console.info('Auth state:', authState);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
