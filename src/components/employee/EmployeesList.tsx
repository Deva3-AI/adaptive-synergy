
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEmployees } from "@/utils/apiUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Employee } from "@/utils/apiUtils";

const EmployeesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: employees, isLoading, error } = useEmployees();

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
            Error loading employees. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>View and manage your team members</CardDescription>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees?.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.user_id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleColor(employee.role_name)}`}>
                          {employee.role_name}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      No employees found. Try a different search term.
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
