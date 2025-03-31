import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { authService } from '@/services/api';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  roles: any[];
  permissions: any[];
  hasPermission: (permission: string) => boolean;
  userRole: string | undefined;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
  roles: [],
  permissions: [],
  hasPermission: () => false,
  userRole: undefined,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          const user = JSON.parse(userStr);
          setUser(user);
          setToken(token);

          // Fetch roles and permissions
          try {
            const rolesResponse = await authService.getUserRoles();
            setRoles(rolesResponse);

            const permissionsResponse = await authService.getUserPermissions(user.id);
            setPermissions(permissionsResponse);
          } catch (error) {
            console.error('Failed to fetch roles or permissions:', error);
            toast.error('Failed to fetch roles or permissions.');
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        toast.error('Failed to load user data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromLocalStorage();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);

      const userResponse = {
        id: data.user_id,
        name: data.name,
        email: data.email,
        role_id: data.role,
      };
      setUser(userResponse);
      localStorage.setItem('user', JSON.stringify(userResponse));

      // Fetch roles and permissions
      try {
        const rolesResponse = await authService.getUserRoles();
        setRoles(rolesResponse);

        const permissionsResponse = await authService.getUserPermissions(data.user_id);
        setPermissions(permissionsResponse);
      } catch (error) {
        console.error('Failed to fetch roles or permissions:', error);
        toast.error('Failed to fetch roles or permissions.');
      }

      const role = roles.find(r => r.role_id === userResponse.role_id)?.role_name;

      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error?.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPermissions([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    toast.success('Logged out successfully!');
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const userRole = roles.find(r => r.role_id === user?.role_id)?.role_name;

  const value: AuthContextProps = {
    user,
    token,
    login,
    logout,
    isLoading,
    roles,
    permissions,
    hasPermission,
    userRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
