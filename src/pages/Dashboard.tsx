import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, FileText, BarChart3, Calendar } from 'lucide-react';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import DashboardCard from '@/components/dashboard/DashboardCard';
import EmployeeWorkTracker from '@/components/dashboard/EmployeeWorkTracker';
import ClientAIFeatures from '@/components/dashboard/ClientAIFeatures';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your workflow management dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </Button>
          <Button size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-features">AI Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard 
              title="Total Clients" 
              value="12" 
              description="+2 from last month"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard 
              title="Active Projects" 
              value="8" 
              description="3 due this week"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard 
              title="Monthly Revenue" 
              value="$24,582" 
              description="+5.2% from last month"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard 
              title="Team Efficiency" 
              value="93%" 
              description="+2.1% from last month"
              icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Active Employees</CardTitle>
                <CardDescription>Currently working team members</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeWorkTracker />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-features">
          <ClientAIFeatures />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics content kept the same */}
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {/* Tasks content kept the same */}
          <Card>
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>Currently in-progress and pending tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Task content here */}
              <p className="text-muted-foreground">View all current tasks and their statuses</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
