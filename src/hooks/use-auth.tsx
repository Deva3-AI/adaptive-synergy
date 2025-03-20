
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isClient: boolean;
  isMarketing: boolean;
  isHR: boolean;
  isFinance: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = authService.getCurrentUser();
        
        // For development purposes, simulate a logged-in user if none exists
        // REMOVE THIS IN PRODUCTION
        if (!currentUser) {
          console.log('Using mock user for development');
          const mockUser = {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin'
          };
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('token', 'mock-token');
          setUser(mockUser);
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For development purposes, use a mock login if backend is not available
      // In real deployment, this should be removed
      if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
        console.log('Using mock login for development');
        
        // Map employee emails to mock roles
        let mockRole = 'employee';
        if (email.includes('raje') || email.includes('charan') || email.includes('gopal')) {
          mockRole = 'admin';
        } else if (email.includes('athira') || email.includes('shalini')) {
          mockRole = 'hr';
        } else if (email.includes('priya') || email.includes('vishnu')) {
          mockRole = 'marketing';
        } else if (email.includes('@client')) {
          mockRole = 'client';
        }
        
        const mockUser = {
          id: 1,
          name: email.split('@')[0],
          email: email,
          role: mockRole,
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'mock-token');
        setUser(mockUser);
        
        // Redirect based on role
        redirectBasedOnRole(mockRole);
        
        toast({
          title: 'Login Successful (Development Mode)',
          description: `Welcome, ${mockUser.name}!`,
        });
        
        setIsLoading(false);
        return;
      }
      
      // Real login process
      const data = await authService.login(email, password);
      setUser({
        id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      
      // Redirect based on role
      redirectBasedOnRole(data.role);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${data.name}!`,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      // For development, allow login if the backend is not available
      if (error.message === 'Network Error' && import.meta.env.DEV) {
        console.log('Backend not available, using mock login');
        
        // Determine role based on email
        let mockRole = 'employee';
        if (email.includes('raje') || email.includes('charan') || email.includes('gopal')) {
          mockRole = 'admin';
        } else if (email.includes('athira') || email.includes('shalini')) {
          mockRole = 'hr';
        } else if (email.includes('priya') || email.includes('vishnu')) {
          mockRole = 'marketing';
        } else if (email.includes('@client')) {
          mockRole = 'client';
        }
        
        const mockUser = {
          id: 1,
          name: email.split('@')[0],
          email: email,
          role: mockRole,
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'mock-token');
        setUser(mockUser);
        
        redirectBasedOnRole(mockRole);
        
        toast({
          title: 'Development Mode Login',
          description: 'Logged in with mock user (backend not available)',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: error.response?.data?.detail || 'Invalid credentials',
        });
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    if (role === 'admin') {
      navigate('/dashboard');
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
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const isAuthenticated = !!user;
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
        login,
        logout,
        isAuthenticated,
        isLoading,
        isAdmin,
        isEmployee,
        isClient,
        isMarketing,
        isHR,
        isFinance,
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

export default useAuth;
