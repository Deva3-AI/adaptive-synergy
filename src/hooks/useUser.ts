
import { useState, useEffect } from 'react';
import { mockUserData } from '@/utils/mockData';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roleDetails?: any;
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
        setTimeout(() => {
          const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
          
          // Find user in mock data
          const foundUser = mockUserData.users.find(u => u.id === numericUserId);
          
          if (foundUser) {
            // Add role details if we have them
            const roleDetails = foundUser.role ? 
              Object.values(mockUserData.roles || [])
                .find(r => r.role_name === foundUser.role) : 
              null;
            
            // Create a user object that matches the User interface
            const userObj: User = {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              role: foundUser.role,
              roleDetails
            };
            
            setUser(userObj);
          } else {
            // Use a real Error object instead of a string
            setError(new Error('User not found'));
          }
          
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching user:', err);
        // Use a real Error object instead of a string
        setError(new Error('Failed to fetch user data'));
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);

  return { user, loading, error };
};

export default useUser;
