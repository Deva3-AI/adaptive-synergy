
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { mockUserData } from '@/utils/mockData';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch the current user session
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          // Get user details from our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select(`
              user_id,
              name,
              email,
              role_id,
              roles (
                role_name
              )
            `)
            .eq('email', session.user.email)
            .single();
          
          if (userError) {
            throw userError;
          }
          
          if (userData) {
            const foundRole = mockUserData.roles.find(r => r.role_id === userData.role_id);
            const userInfo = {
              id: userData.user_id,
              name: userData.name,
              email: userData.email,
              role: foundRole?.role_name || 'unknown'
            };
            
            setUser(userInfo);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          fetchUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};

export default useUser;
