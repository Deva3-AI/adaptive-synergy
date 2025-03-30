
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Eye, Edit, PlusCircle } from "lucide-react";

interface Employee {
  user_id: number;
  name: string;
  email: string;
  roles: {
    role_name: string;
  };
}

const EmployeesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch employees directly from Supabase
  const { data: employees, isLoading, error, refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        console.log('Fetching employees from Supabase...');
        // Query employees from users table joined with roles
        const { data, error } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            roles (
              role_name
            )
          `)
          .order('name');
        
        if (error) throw error;
        
        console.log('Fetched employees:', data);
        
        // Format data to match our expected structure
        return data.map((employee: Employee) => ({
          user_id: employee.user_id,
          name: employee.name,
          email: employee.email,
          role_name: employee.roles?.role_name || 'Unknown Role'
        }));
      } catch (error) {
        console.error('Error fetching employees from Supabase:', error);
        throw error;
      }
    }
  });

  useEffect(() => {
    // Force refetch on mount to ensure latest data
    refetch();
  }, [refetch]);

  // Filter employees based on search term
  const filteredEmployees = employees?.filter((employee) => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get role color
  const getRoleColor = (role: string): string => {
    if (role.includes('CEO') || role.includes('Chief')) return 'bg-red-100 text-red-800';
    if (role.includes('Sr.')) return 'bg-blue-100 text-blue-800';
    if (role.includes('Jr.')) return 'bg-green-100 text-green-800';
    if (role.includes('HR')) return 'bg-purple-100 text-purple-800';
    if (role.includes('Design')) return 'bg-yellow-100 text-yellow-800';
    if (role.includes('Development')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Something went wrong loading employee data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
            Error loading employees: {(error as Error).message}
          </div>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>View and manage your team members</CardDescription>
          </div>
          <Button className="gap-1">
            <PlusCircle className="h-4 w-4" />
            New Employee
          </Button>
        </div>
        <div className="mt-2">
          <Input 
            placeholder="Search employees..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees?.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.user_id}>
                      <TableCell className="font-medium">
                        <Link to={`/employee/profile/${employee.user_id}`} className="hover:underline">
                          {employee.name}
                        </Link>
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleColor(employee.role_name)}`}>
                          {employee.role_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      {employees?.length === 0 ? 'No employees found. Add your first employee to get started.' : 'No employees match your search term.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeesList;
