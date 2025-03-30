
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import hrServiceSupabase from '@/services/api/hrServiceSupabase';
import PayrollManagement from '@/components/hr/PayrollManagement';
import RecruitmentTracker from '@/components/hr/RecruitmentTracker';
import EmployeeAttendance from '@/components/hr/EmployeeAttendance';
import HRTaskManagement from '@/components/hr/HRTaskManagement';
import { Button } from '@/components/ui/button';
import { CalendarClock, Users, DollarSign, GraduationCap, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { transformSupabaseData } from '@/utils/supabaseUtils';

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("attendance");
  
  // Fetch attendance data from Supabase
  const { data: attendanceData, isLoading: attendanceLoading, refetch: refetchAttendance } = useQuery({
    queryKey: ['employee-attendance-supabase'],
    queryFn: () => hrServiceSupabase.getEmployeeAttendance(),
  });
  
  // Fetch employees from Supabase
  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees-supabase'],
    queryFn: async () => {
      // Using supabase client directly for this specific query
      const { data, error } = await supabase
        .from('users')
        .select(`
          user_id,
          name,
          email,
          role_id,
          roles(role_name),
          employee_details(joining_date, employee_id, date_of_birth)
        `);
      
      if (error) throw error;
      
      // Format the data to match our Employee interface
      return data.map(item => {
        const roleData = transformSupabaseData.getRoleName(item.roles);
        const employeeDetails = transformSupabaseData.getEmployeeDetails(item.employee_details);
        
        return {
          user_id: item.user_id,
          name: item.name,
          email: item.email,
          role_id: item.role_id,
          role_name: roleData,
          joining_date: employeeDetails.joining_date,
          employee_id: employeeDetails.employee_id,
          date_of_birth: employeeDetails.date_of_birth
        };
      });
    }
  });

  // Count tasks by status for metrics
  const { data: hrTasks } = useQuery({
    queryKey: ['hr-tasks-count'],
    queryFn: () => {
      // This would normally call an API
      return new Promise<{total: number, pending: number, completed: number}>((resolve) => {
        setTimeout(() => {
          resolve({
            total: 5,
            pending: 3,
            completed: 2
          });
        }, 500);
      });
    }
  });
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground">
            Manage employee data, attendance, recruitment, and payroll.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Today: {format(new Date(), 'PPP')}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeesLoading ? "Loading..." : (employeesData?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceLoading ? "Loading..." : (attendanceData?.today_present || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {attendanceData?.total_employees || 0} employees
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceLoading ? "Loading..." : `${attendanceData?.average_hours || 0} hrs`}
            </div>
            <p className="text-xs text-muted-foreground">
              Per employee this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Applications pending: 12
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">HR Tasks</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hrTasks ? hrTasks.pending : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending tasks of {hrTasks ? hrTasks.total : '0'} total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-[500px]">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="mt-6">
          <EmployeeAttendance 
            attendanceData={attendanceData}
            isLoading={attendanceLoading}
            refetch={refetchAttendance}
          />
        </TabsContent>
        
        <TabsContent value="recruitment" className="mt-6">
          <RecruitmentTracker />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <HRTaskManagement />
        </TabsContent>
        
        <TabsContent value="payroll" className="mt-6">
          <PayrollManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRDashboard;
