
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/api/authService';
import { toast } from 'sonner';

// Define the user type
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// Define the authentication context type
export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  loading: boolean;
  isEmployee: boolean;
  isClient: boolean;
  isMarketing: boolean;
  isHR: boolean;
  isFinance: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoggedIn: false,
  loading: true,
  isEmployee: false,
  isClient: false,
  isMarketing: false,
  isHR: false,
  isFinance: false,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
});

// Create the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in from localStorage or token
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      // Get the current user after login
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Navigate based on user role
        if (currentUser.role === 'admin') {
          navigate('/app');
        } else if (['employee', 'client', 'marketing', 'hr', 'finance'].includes(currentUser.role)) {
          navigate(`/app/${currentUser.role}/dashboard`);
        } else {
          navigate('/app');
        }
        
        toast.success(`Welcome back, ${currentUser.name}!`);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
    toast.info('You have been logged out');
  };
  
  // Signup function
  const signup = async (userData: any) => {
    setLoading(true);
    try {
      await authService.register(
        userData.name, 
        userData.email, 
        userData.password,
        userData.role || 'employee'
      );
      
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Role check helper functions
  const isAuthenticated = !!user;
  const isEmployee = user?.role === 'employee';
  const isClient = user?.role === 'client';
  const isMarketing = user?.role === 'marketing';
  const isHR = user?.role === 'hr';
  const isFinance = user?.role === 'finance';
  const isAdmin = user?.role === 'admin';
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoggedIn: !!user,
        loading,
        isEmployee,
        isClient,
        isMarketing,
        isHR,
        isFinance,
        isAdmin,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);
