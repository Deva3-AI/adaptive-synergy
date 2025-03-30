
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeesList from '@/components/employee/EmployeesList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const EmployeeDirectory = () => {
  // Get employee metrics from Supabase
  const { data: employeeMetrics, isLoading } = useQuery({
    queryKey: ['employee-metrics'],
    queryFn: async () => {
      try {
        // Get total employees count
        const { count: totalEmployees, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        
        // Get departments (unique role names)
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('role_name');
        
        if (rolesError) throw rolesError;
        
        const departments = rolesData.map(role => role.role_name);
        
        // Calculate average tenure (example - in a real app this would be based on join dates)
        // Here we're just returning a static value since we don't have actual join dates
        const averageTenure = "1.8 years";
        
        // Get open positions (mock data - in a real app this would be from a jobs table)
        const openPositions = [
          { id: 1, title: "Sr. Developer" },
          { id: 2, title: "UI/UX Designer" },
          { id: 3, title: "Marketing Specialist" }
        ];
        
        return {
          totalEmployees,
          departments,
          averageTenure,
          openPositions
        };
      } catch (error) {
        console.error('Error fetching employee metrics:', error);
        throw error;
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their roles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Employees</CardTitle>
            <CardDescription>Active team members</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{employeeMetrics?.totalEmployees || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +2 since last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Departments</CardTitle>
            <CardDescription>Team organization</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {employeeMetrics?.departments.map((dept, index) => (
                  <Badge key={index} variant="secondary">{dept}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Average Tenure</CardTitle>
            <CardDescription>Team stability</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{employeeMetrics?.averageTenure}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +0.2 years since last quarter
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Open Positions</CardTitle>
            <CardDescription>Current openings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{employeeMetrics?.openPositions.length || 0}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {employeeMetrics?.openPositions.map((position) => (
                    <Badge key={position.id}>{position.title}</Badge>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <EmployeesList />
    </div>
  );
};

export default EmployeeDirectory;
