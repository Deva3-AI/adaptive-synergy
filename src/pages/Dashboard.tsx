import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, FileCheck, Users, Activity, DollarSign, PieChart, UserCheck } from 'lucide-react';
import userService from '@/services/api/userService';

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);
  const [clientCount, setClientCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await userService.getDashboardData();
        setEmployeeCount(dashboardData.employeeCount);
        setClientCount(dashboardData.clientCount);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employeeCount !== null ? (
              <div className="text-2xl font-bold">{employeeCount}</div>
            ) : (
              <Skeleton className="h-6 w-20" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientCount !== null ? (
              <div className="text-2xl font-bold">{clientCount}</div>
            ) : (
              <Skeleton className="h-6 w-20" />
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Summary</CardTitle>
            </CardHeader>
            <CardContent>
              Tasks content goes here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              Recent Activity content goes here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              Financial Summary content goes here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clients Overview</CardTitle>
            </CardHeader>
            <CardContent>
              Clients Overview content goes here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              Notifications content goes here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Calendar Events</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarDays className="mr-2 h-4 w-4" /> Calendar content goes here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              Team Performance content goes here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              Marketing Metrics content goes here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recruitment">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              Recruitment Metrics content goes here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
