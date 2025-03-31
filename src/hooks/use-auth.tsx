
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/api';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { mockUserData } from '@/utils/mockData';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  client_id?: number;
  roles?: { role_name: any; role_id?: number }[];
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isClient: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isMarketing: boolean;
  isHR: boolean;
  isFinance: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  resetPassword: (email: string) => Promise<any>;
  setNewPassword: (token: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isClient: false,
  isAdmin: false,
  isEmployee: false,
  isMarketing: false,
  isHR: false,
  isFinance: false,
  hasRole: () => false,
  hasPermission: () => false,
  login: async () => ({}),
  register: async () => ({}),
  logout: () => {},
  resetPassword: async () => ({}),
  setNewPassword: async () => ({}),
  signup: async () => ({}),
  requestPasswordReset: async () => ({}),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    
    // First check if user.role is directly what we're looking for
    if (user.role === role) return true;
    
    // If user has a roles array, check there too
    if (user.roles && user.roles.length > 0) {
      // Check if role exists in the array
      return user.roles.some(r => r.role_name === role);
    }
    
    return false;
  };
  
  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // First check if we have user info in localStorage
        const storedUser = authService.getCurrentUser();
        
        if (storedUser) {
          // User is already authenticated according to localStorage
          setUser(storedUser);
          
          // Optionally refresh or verify token here
          // ...
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear potentially corrupt localStorage data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.data) {
        // Set user in state
        const userData = {
          id: result.data.user_id || result.data.id,
          name: result.data.name,
          email: result.data.email,
          role: result.data.role,
        };
        
        setUser(userData);
        return result;
      } else {
        throw new Error(result.error || 'Failed to login');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.register(name, email, password);
      
      if (result.success) {
        toast.success('Registration successful! Please verify your email.');
        return result;
      } else {
        throw new Error(result.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  const resetPassword = async (email: string) => {
    try {
      return await authService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };
  
  const setNewPassword = async (token: string, password: string) => {
    try {
      return await authService.setNewPassword(token, password);
    } catch (error) {
      console.error('Set new password error:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isClient = user?.role === 'client';
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const isMarketing = user?.role === 'marketing';
  const isHR = user?.role === 'hr';
  const isFinance = user?.role === 'finance';
  
  // Adding aliases for backward compatibility
  const signup = register;
  const requestPasswordReset = resetPassword;
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated,
      isClient,
      isAdmin,
      isEmployee,
      isMarketing,
      isHR,
      isFinance,
      hasRole,
      hasPermission,
      login, 
      register,
      logout,
      resetPassword,
      setNewPassword,
      signup,
      requestPasswordReset
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
