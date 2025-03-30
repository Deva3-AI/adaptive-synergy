
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hrService } from '@/services/api';
import PayrollManagement from '@/components/hr/PayrollManagement';
import RecruitmentTracker from '@/components/hr/RecruitmentTracker';
import EmployeeAttendance from '@/components/hr/EmployeeAttendance';

const HRDashboard = () => {
  const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => hrService.getEmployeeAttendance(),
  });
  
  const { data: payrollData, isLoading: loadingPayroll } = useQuery({
    queryKey: ['payroll'],
    queryFn: () => hrService.getPayroll(),
  });
  
  const { data: recruitmentData, isLoading: loadingRecruitment } = useQuery({
    queryKey: ['recruitment'],
    queryFn: () => hrService.getRecruitment(),
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceData?.total_employees || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {attendanceData?.departments?.length || 0} departments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recruitmentData?.openPositions?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {recruitmentData?.applicationStats?.total || 0} candidates in pipeline
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceData?.today_present || 0}/{attendanceData?.total_employees || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {attendanceData?.today_wfh || 0} working from home
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="attendance">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance">
          <EmployeeAttendance />
        </TabsContent>
        
        <TabsContent value="payroll">
          <PayrollManagement />
        </TabsContent>
        
        <TabsContent value="recruitment">
          <RecruitmentTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRDashboard;
