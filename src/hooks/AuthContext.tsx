import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';
import { toast } from "sonner";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roles?: string[];
  permissions?: string[];
  client_id?: number;
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
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  
  // Role-specific flags
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const isClient = user?.role === 'client';
  const isMarketing = user?.role === 'marketing';
  const isHR = user?.role === 'hr';
  const isFinance = user?.role === 'finance';
  
  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    
    // Check direct role
    if (user.role === role) return true;
    
    // Check roles array
    if (user.roles && user.roles.length > 0) {
      return user.roles.includes(role);
    }
    
    return false;
  };
  
  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  useEffect(() => {
    // Check for user on initial load
    const checkUser = async () => {
      try {
        console.info('Auth state:', { isAuthenticated, user, loading });
        
        // Check localStorage for user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.info('User found in localStorage:', parsedUser);
          setUser(parsedUser);
        }
        
        // Additional auth checks can go here
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await authService.login(email, password);
      
      if (result.success && result.data) {
        const userData = {
          id: result.data.user_id || result.data.id,
          name: result.data.name,
          email: result.data.email,
          role: result.data.role
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Logged in successfully!');
      } else {
        throw new Error(result.error || 'Failed to login');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const result = await authService.register(name, email, password);
      
      if (result.success) {
        toast.success('Signup successful! Please check your email for verification.');
      } else {
        throw new Error(result.error || 'Failed to create account');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      authService.logout();
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await authService.resetPassword(email);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Password reset request error:', error);
      throw error;
    }
  };

  const resetPassword = async (password: string) => {
    try {
      await authService.setNewPassword('token', password);
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (error: any) {
      console.error('Password reset error:', error);
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
        isFinance,
        hasRole,
        hasPermission
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
