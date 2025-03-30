
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Mail, Phone, User } from 'lucide-react';

interface Employee {
  user_id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  avatar_url?: string;
}

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            roles (role_name)
          `)
          .order('name');
          
        if (error) throw error;
        
        return data.map((user: any) => ({
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.roles?.role_name || 'employee',
          department: 'Design', // Mock data
          position: 'Designer', // Mock data
          avatar_url: '', // Mock empty URL
        }));
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
    }
  });

  const filteredEmployees = React.useMemo(() => {
    if (!searchTerm.trim()) return employees;
    
    const term = searchTerm.toLowerCase();
    return employees.filter((employee: Employee) => 
      employee.name.toLowerCase().includes(term) || 
      employee.email.toLowerCase().includes(term) ||
      (employee.position && employee.position.toLowerCase().includes(term)) ||
      (employee.department && employee.department.toLowerCase().includes(term))
    );
  }, [employees, searchTerm]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Employee Directory</h1>
          <p className="text-muted-foreground">Browse and connect with your colleagues</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search employees..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>Failed to load employees. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No employees found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or check back later
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee: Employee) => (
          <Card key={employee.user_id} className="overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <Badge variant="outline">{employee.role}</Badge>
                {employee.department && (
                  <Badge variant="secondary">{employee.department}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={employee.avatar_url} alt={employee.name} />
                  <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{employee.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{employee.position || 'Employee'}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{employee.email}</span>
                </div>
                {employee.department && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">+1 (555) 123-4567</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/employee/profile/${employee.user_id}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
