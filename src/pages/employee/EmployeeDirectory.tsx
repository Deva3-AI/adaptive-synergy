
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeesList from '@/components/employee/EmployeesList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

const EmployeeDirectory = () => {
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 since last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Departments</CardTitle>
            <CardDescription>Team organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary">Development</Badge>
              <Badge variant="secondary">Design</Badge>
              <Badge variant="secondary">Marketing</Badge>
              <Badge variant="secondary">HR</Badge>
              <Badge variant="secondary">Finance</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Average Tenure</CardTitle>
            <CardDescription>Team stability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8 years</div>
            <p className="text-xs text-muted-foreground mt-1">
              +0.2 years since last quarter
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Open Positions</CardTitle>
            <CardDescription>Current openings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge>Sr. Developer</Badge>
              <Badge>UI/UX Designer</Badge>
              <Badge>Marketing Specialist</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <EmployeesList />
    </div>
  );
};

export default EmployeeDirectory;
