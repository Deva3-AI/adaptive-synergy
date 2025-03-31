import { useState, useEffect } from 'react';
import { mockUserData } from '@/utils/mockData';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const useUser = (userId: number | string | undefined) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now we're mocking with static data
        setTimeout(() => {
          const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
          
          // Find user in mock data
          const foundUser = mockUserData.users.find(u => u.id === numericUserId);
          
          if (foundUser) {
            // Add role details if we have them
            let roleDetails = null;
            if (foundUser.role) {
              // Find the role by name
              roleDetails = Object.values(mockUserData.roles || [])
                .find(r => r.role_name === foundUser.role);
            }
            
            setUser({
              ...foundUser,
              roleDetails
            });
          } else {
            setError('User not found');
          }
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);

  return { user, loading, error };
};

export default useUser;
