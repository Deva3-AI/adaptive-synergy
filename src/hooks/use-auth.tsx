
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
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
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
      const data = await authService.login(email, password);
      setUser({
        id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      
      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/dashboard');
      } else if (data.role === 'employee') {
        navigate('/employee/dashboard');
      } else if (data.role === 'client') {
        navigate('/client/dashboard');
      } else if (data.role === 'marketing') {
        navigate('/marketing/dashboard');
      } else if (data.role === 'hr') {
        navigate('/hr/dashboard');
      } else if (data.role === 'finance') {
        navigate('/finance/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${data.name}!`,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.response?.data?.detail || 'Invalid credentials',
      });
      throw error;
    } finally {
      setIsLoading(false);
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
