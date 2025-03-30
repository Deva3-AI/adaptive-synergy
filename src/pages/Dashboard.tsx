
import React, { useState } from 'react';
import { Briefcase, LineChart as LineChartIcon, BarChart as BarChartIcon, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buttonVariants } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import DashboardCard from '@/components/dashboard/DashboardCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const Dashboard = () => {
  const [chartType, setChartType] = useState('line');
  const { user, isAdmin, isEmployee, isClient, isMarketing, isHR, isFinance } = useAuth();

  const mockData = [
    { month: 'Jan', revenue: 10000, expenses: 8000, tasks: 45, completed: 40 },
    { month: 'Feb', revenue: 15000, expenses: 10000, tasks: 55, completed: 48 },
    { month: 'Mar', revenue: 12000, expenses: 9000, tasks: 50, completed: 45 },
    { month: 'Apr', revenue: 18000, expenses: 12000, tasks: 60, completed: 52 },
    { month: 'May', revenue: 20000, expenses: 14000, tasks: 65, completed: 58 },
    { month: 'Jun', revenue: 22000, expenses: 15000, tasks: 70, completed: 63 },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'User'}! Here's an overview of your workspace.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Revenue" 
          value="$45,231" 
          description="+20.1% from last month" 
          icon={<DollarSign className="h-4 w-4" />}
        />
        <DashboardCard 
          title="Active Clients" 
          value="12" 
          description="2 new this month" 
          icon={<Users className="h-4 w-4" />}
        />
        <DashboardCard 
          title="Total Projects" 
          value="64" 
          description="8 added this month" 
          icon={<Briefcase className="h-4 w-4" />}
        />
        <DashboardCard 
          title="Task Completion" 
          value="89%" 
          description="Higher than average" 
          icon={<BarChartIcon className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select 
              defaultValue={chartType} 
              onValueChange={setChartType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
            <a 
              href="#" 
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden sm:flex gap-1 items-center"
              )}
            >
              <LineChartIcon className="h-4 w-4 mr-1" />
              Download Report
            </a>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart 
                  data={mockData}
                  defaultType={chartType}
                  xAxisKey="month"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Task Completion</CardTitle>
                <CardDescription>Task status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-muted-foreground">Task completion chart</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed analytics of your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart 
                data={mockData}
                defaultType={chartType}
                xAxisKey="month"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>View and generate reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Reports will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>AI-powered insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">AI insights will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
