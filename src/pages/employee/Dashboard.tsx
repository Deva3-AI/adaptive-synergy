import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, ListChecks, BellRing } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ProgressCircle } from "@/components/ui/progress-circle";
import TaskList from '@/components/employee/TaskList';
import { hrService, employeeService } from '@/services/api';
import { TaskProgressInsights } from "@/components/tasks/TaskProgressInsights";
import TaskAttachmentsPanel from '@/components/employee/TaskAttachmentsPanel';
import ClientRequirementsPanel from '@/components/employee/ClientRequirementsPanel';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const userId = 1; // Replace with actual user ID

  // Fetch employee details
  const { data: employee, isLoading: isEmployeeLoading } = useQuery({
    queryKey: ['employee', userId],
    queryFn: () => employeeService.getEmployeeDetails(userId),
  });

  // Fetch employee attendance
  const { data: attendance, isLoading: isAttendanceLoading } = useQuery({
    queryKey: ['attendance', userId],
    queryFn: () => hrService.getEmployeeAttendance(userId),
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {employee?.name || 'Employee'}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your tasks and projects today.
          </p>
        </div>
        <Button>
          <BellRing className="mr-2 h-4 w-4" />
          Notifications
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {isAttendanceLoading ? (
              <p>Loading attendance...</p>
            ) : (
              <>
                <div className="text-2xl font-bold">Present</div>
                <div className="mt-2">
                  <Clock className="mr-2 inline-block h-4 w-4" />
                  <span>Check-in: 9:00 AM</span>
                </div>
                <div className="mt-2">
                  <Calendar className="mr-2 inline-block h-4 w-4" />
                  <span>Today, November 15, 2023</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Completed</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="mb-4" />
            <div className="flex items-center justify-between">
              <span>Remaining</span>
              <span>25%</span>
            </div>
            <Progress value={25} className="mb-4" />
            <div className="flex justify-center">
              <ProgressCircle value={75} size="lg" showValue />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Project Meeting</span>
              </div>
              <p className="text-sm text-muted-foreground">November 16, 2023, 10:00 AM</p>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Client Demo</span>
              </div>
              <p className="text-sm text-muted-foreground">November 17, 2023, 2:00 PM</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks" onClick={() => setActiveTab("tasks")}>
            <ListChecks className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="insights" onClick={() => setActiveTab("insights")}>
            <PieChart className="mr-2 h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="client-info" onClick={() => setActiveTab("client-info")}>
            <Users className="mr-2 h-4 w-4" />
            Client Info
          </TabsTrigger>
          <TabsTrigger value="attachments" onClick={() => setActiveTab("attachments")}>
            <Paperclip className="mr-2 h-4 w-4" />
            Attachments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <TaskList userId={userId} />
        </TabsContent>
        
        <TabsContent value="insights">
          <TaskProgressInsights userId={userId} />
        </TabsContent>

        <TabsContent value="client-info">
          <ClientRequirementsPanel clientId={1} />
        </TabsContent>

        <TabsContent value="attachments">
          <TaskAttachmentsPanel taskId={1} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
