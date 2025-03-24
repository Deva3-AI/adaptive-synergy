
import { createContext, useContext, useState, useEffect } from 'react';

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
  
  useEffect(() => {
    // Check if user is logged in from localStorage or token
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
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
      // Mock login - in a real app, this would call your auth API
      const mockUser = {
        id: 1,
        name: 'Test User',
        email,
        role: 'admin',
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  
  // Signup function
  const signup = async (userData: any) => {
    setLoading(true);
    try {
      // Mock signup - in a real app, this would call your auth API
      const mockUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        role: 'user',
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Added isAuthenticated property
  const isAuthenticated = !!user;
  
  // Role check helper functions
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
