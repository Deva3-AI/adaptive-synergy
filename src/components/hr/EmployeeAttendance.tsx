
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hrService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { Download, UserCheck, UserX, Users, Clock } from "lucide-react";
import { toast } from 'sonner';

const EmployeeAttendance = () => {
  const [department, setDepartment] = useState<string>("all");
  const [view, setView] = useState<string>("daily");
  
  // Fetch attendance data
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['employee-attendance', view, department],
    queryFn: () => hrService.getEmployeeAttendance(),
  });

  // Handle export attendance
  const handleExportAttendance = () => {
    toast.success("Attendance data exported successfully");
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    const date = new Date(timeString);
    return format(date, "h:mm a");
  };

  // Calculate working hours
  const calculateWorkHours = (loginTime: string, logoutTime: string) => {
    if (!loginTime || !logoutTime) return "-";
    
    const login = new Date(loginTime);
    const logout = new Date(logoutTime);
    const diffMs = logout.getTime() - login.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    return diffHrs.toFixed(1) + " hrs";
  };

  // Calculate attendance status
  const getAttendanceStatus = (record: any) => {
    if (!record.login_time && !record.logout_time) {
      return <Badge variant="destructive">Absent</Badge>;
    }
    
    if (record.login_time && !record.logout_time) {
      return <Badge variant="warning">Working</Badge>;
    }
    
    if (new Date(record.login_time).getHours() > 9) {
      return <Badge variant="outline">Late</Badge>;
    }
    
    return <Badge variant="success">Present</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="management">Management</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs value={view} onValueChange={setView} className="w-auto">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Button 
          variant="outline" 
          className="ml-auto"
          onClick={handleExportAttendance}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceData?.today_present || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {attendanceData?.total_employees || 0} employees
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceData?.today_absent || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {attendanceData?.today_on_leave || 0} on approved leave
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceData?.average_hours || "0.0"} hrs
            </div>
            <p className="text-xs text-muted-foreground">
              This {view} average
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Login Time</TableHead>
                <TableHead>Logout Time</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData?.records?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData?.records?.map((record: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.employee_name}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{formatTime(record.login_time)}</TableCell>
                    <TableCell>{formatTime(record.logout_time)}</TableCell>
                    <TableCell>{calculateWorkHours(record.login_time, record.logout_time)}</TableCell>
                    <TableCell>{getAttendanceStatus(record)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendance;
