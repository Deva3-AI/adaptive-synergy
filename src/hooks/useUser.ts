
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  client_id?: number;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user from localStorage first (for quick loading)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    
    // Then check with Supabase for the current session
    const checkUser = async () => {
      try {
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
            
          if (error) throw error;
          
          const userData: User = {
            id: data.user_id,
            name: data.name,
            email: data.email,
            role: data.roles?.role_name || 'user',
          };
          
          // Store updated user in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  return { user, loading };
};

export default useUser;
