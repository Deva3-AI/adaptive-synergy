
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, CalendarCheck, ArrowUpRight, Activity, 
  PieChart, Users, Paperclip 
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { ProgressCircle } from '@/components/ui/progress-circle';
import TaskList from '@/components/employee/TaskList';
import TaskProgressInsights from '@/components/tasks/TaskProgressInsights';
import { useToast } from "@/components/ui/use-toast";
import employeeService from '@/services/api/employeeService';
import taskService from '@/services/api/taskService';
import aiService from '@/services/api/aiService';
import { format } from 'date-fns';

const EmployeeDashboard = () => {
  const { toast } = useToast();
  const currentUser = { id: 1 }; // Normally would come from auth context
  
  // Fetch employee details
  const { data: employeeDetails } = useQuery({
    queryKey: ['employee-details', currentUser.id],
    queryFn: () => employeeService.getEmployeeDetails(currentUser.id),
  });
  
  // Fetch today's attendance
  const { data: todayAttendance, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance-today', currentUser.id],
    queryFn: () => employeeService.getTodayAttendance(currentUser.id),
  });
  
  // Fetch today's working hours
  const { data: workHours } = useQuery({
    queryKey: ['work-hours-today', currentUser.id],
    queryFn: () => employeeService.getTodayWorkHours(currentUser.id),
  });
  
  // Handle Work Start/Stop
  const handleStartWork = async () => {
    try {
      await employeeService.startWork(currentUser.id);
      refetchAttendance();
      toast({
        title: "Work Started",
        description: `You've started your work day at ${format(new Date(), 'h:mm a')}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log work start time",
        variant: "destructive"
      });
    }
  };
  
  const handleStopWork = async () => {
    if (!todayAttendance?.attendance_id) return;
    
    try {
      await employeeService.stopWork(currentUser.id, todayAttendance.attendance_id);
      refetchAttendance();
      toast({
        title: "Work Ended",
        description: `You've ended your work day at ${format(new Date(), 'h:mm a')}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log work end time",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {!todayAttendance?.logout_time ? (
          todayAttendance?.login_time ? (
            <Button onClick={handleStopWork}>
              <Clock className="mr-2 h-4 w-4" />
              Stop Work
            </Button>
          ) : (
            <Button onClick={handleStartWork}>
              <Clock className="mr-2 h-4 w-4" />
              Start Work
            </Button>
          )
        ) : (
          <Badge variant="outline" className="bg-muted py-2">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Work Day Completed
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Work Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workHours?.total_hours ? workHours.total_hours.toFixed(1) : '0'} hrs
            </div>
            <p className="text-xs text-muted-foreground">
              {todayAttendance?.login_time ? (
                `Started at ${format(new Date(todayAttendance.login_time), 'h:mm a')}`
              ) : 'Not started yet'}
            </p>
            {workHours?.total_hours > 0 && (
              <div className="mt-4">
                <ProgressCircle 
                  value={(workHours.total_hours / 8) * 100} 
                  size="sm"
                  className="mx-auto"
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Completed Today
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeDetails?.stats?.tasks_completed || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {employeeDetails?.stats?.tasks_in_progress || 0} in progress
            </p>
            {employeeDetails?.stats?.tasks_completed > 0 && (
              <div className="mt-2 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                4% from yesterday
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Focus Time
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              4.2 hrs
            </div>
            <p className="text-xs text-muted-foreground">
              70% of total time
            </p>
            <div className="mt-4">
              <ProgressCircle 
                value={70} 
                size="sm"
                className="mx-auto"
                color="stroke-green-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TaskList />
        </div>
        <div>
          <TaskProgressInsights />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
