
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, MoreHorizontal, Mail, UserRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Employee {
  user_id: number;
  name: string;
  email: string;
  role: string;
  joiningDate?: string | null;
  employeeId?: string | null;
  dateOfBirth?: string | null;
}

interface EmployeeData {
  user_id: any;
  name: any;
  email: any;
  roles: { role_name: any }[];
  employee_details?: { 
    joining_date: any; 
    employee_id: any; 
    date_of_birth: any; 
  } | null;
}

const EmployeesList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: employees = [], isLoading, isError } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            roles (
              role_name
            ),
            employee_details (
              joining_date,
              employee_id,
              date_of_birth
            )
          `);

        if (error) throw error;
        
        return (data || []).map((employee: EmployeeData) => ({
          user_id: employee.user_id,
          name: employee.name,
          email: employee.email,
          role: employee.roles && employee.roles[0] ? employee.roles[0].role_name : 'Unknown',
          joiningDate: employee.employee_details?.joining_date || null,
          employeeId: employee.employee_details?.employee_id || null,
          dateOfBirth: employee.employee_details?.date_of_birth || null
        })) as Employee[];
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
    }
  });

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Employee
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-red-500">
            Error loading employees. Please try again later.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">ID</TableHead>
                <TableHead className="hidden md:table-cell">Joining Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.user_id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {employee.employeeId || '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {employee.joiningDate 
                        ? new Date(employee.joiningDate).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Link to={`/employee/profile/${employee.user_id}`}>
                          <Button variant="ghost" size="icon">
                            <UserRound className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default EmployeesList;
