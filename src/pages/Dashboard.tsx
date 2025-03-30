
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Activity, BarChart3, Calendar, CreditCard, DollarSign, Download, FileText, TrendingUp, UserPlus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { apiService } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

const mockData = {
  metrics: {
    totalTasks: 156,
    completedTasks: 128,
    totalClients: 24,
    activeProjects: 18,
    totalRevenue: 75000,
    growth: 12.5,
    revenueByMonth: [
      { name: "Jan", Revenue: 32000 },
      { name: "Feb", Revenue: 35000 },
      { name: "Mar", Revenue: 30000 },
      { name: "Apr", Revenue: 40000 },
      { name: "May", Revenue: 45000 },
      { name: "Jun", Revenue: 52000 },
      { name: "Jul", Revenue: 48000 },
      { name: "Aug", Revenue: 55000 },
      { name: "Sep", Revenue: 60000 },
      { name: "Oct", Revenue: 65000 },
      { name: "Nov", Revenue: 70000 },
      { name: "Dec", Revenue: 75000 },
    ],
    tasksByStatus: [
      { name: "Completed", value: 128 },
      { name: "In Progress", value: 18 },
      { name: "Pending", value: 10 },
    ],
    clientsByCategory: [
      { name: "E-commerce", value: 8 },
      { name: "SaaS", value: 6 },
      { name: "Healthcare", value: 4 },
      { name: "Finance", value: 3 },
      { name: "Education", value: 3 },
    ],
  },
};

const Dashboard = () => {
  const { user, isLoading: userLoading } = useUser();
  const [period, setPeriod] = useState("year");

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-data", period],
    queryFn: async () => {
      try {
        // In a real application, this would fetch from your API
        const response = await apiService.reportService.getDashboardMetrics(period);
        return response;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to mock data
        return mockData;
      }
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  if (userLoading || isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData?.metrics.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">
                {dashboardData?.metrics.growth || 0}%
              </span>{" "}
              from last {period}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData?.metrics.totalClients || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              in {dashboardData?.metrics.activeProjects || 0} active projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData?.metrics.completedTasks || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              out of {dashboardData?.metrics.totalTasks || 0} total tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData?.metrics.activeProjects || 0)}
            </div>
            <p className="text-xs text-muted-foreground">in progress this {period}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue trends over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AnalyticsChart
              data={dashboardData?.metrics.revenueByMonth || []}
              xAxisKey="name"
              height={350}
              valueFormatter={(value) => formatCurrency(value)}
            />
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>Tasks by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={dashboardData?.metrics.tasksByStatus || []}
              xAxisKey="name"
              height={350}
              valueFormatter={(value) => `${value} tasks`}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="h-4 w-4 mr-2" />
            Clients
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex">
                    <div className="relative mr-4">
                      <div className="p-1 bg-primary text-primary-foreground rounded-full">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="absolute top-7 bottom-0 left-1/2 -translate-x-1/2 w-px bg-muted"></div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New task created</p>
                      <p className="text-xs text-muted-foreground">
                        Website redesign for Client X
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="relative mr-4">
                      <div className="p-1 bg-green-500 text-white rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="absolute top-7 bottom-0 left-1/2 -translate-x-1/2 w-px bg-muted"></div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Task completed</p>
                      <p className="text-xs text-muted-foreground">
                        Logo design for Client Y
                      </p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="relative mr-4">
                      <div className="p-1 bg-blue-500 text-white rounded-full">
                        <UserPlus className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New client added</p>
                      <p className="text-xs text-muted-foreground">
                        Client Z signed up for Premium
                      </p>
                      <p className="text-xs text-muted-foreground">8 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Tasks due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <p className="font-medium">Content writing for Blog A</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due in 2 days
                      </div>
                    </div>
                    <Button size="sm">Start</Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <p className="font-medium">Social media graphics for Client B</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due in 3 days
                      </div>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                  <div className="flex items-center justify-between pb-4">
                    <div className="space-y-1">
                      <p className="font-medium">Email campaign setup for Client C</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due in 5 days
                      </div>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Client Distribution</CardTitle>
                  <CardDescription>Clients by industry category</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <AnalyticsChart
                    data={dashboardData?.metrics.clientsByCategory || []}
                    xAxisKey="name"
                    height={300}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Indicators</CardTitle>
                  <CardDescription>Key metrics compared to last period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Revenue Growth</p>
                        <p className="text-sm font-medium">12.5%</p>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Task Completion Rate</p>
                        <p className="text-sm font-medium">82%</p>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "82%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Client Retention</p>
                        <p className="text-sm font-medium">94%</p>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Team Productivity</p>
                        <p className="text-sm font-medium">87%</p>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "87%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>
                  Download detailed reports for your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Monthly Financial Report</p>
                      <p className="text-sm text-muted-foreground">
                        Detailed revenue, expenses, and profit analysis
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Client Engagement Summary</p>
                      <p className="text-sm text-muted-foreground">
                        Overview of client interactions and satisfaction scores
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <p className="font-medium">Team Performance Review</p>
                      <p className="text-sm text-muted-foreground">
                        Productivity metrics and task completion analysis
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="clients">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Clients by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-lg">1.</span>
                      <div>
                        <p className="font-medium">Client X Corporation</p>
                        <p className="text-sm text-muted-foreground">Technology</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(25000)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-lg">2.</span>
                      <div>
                        <p className="font-medium">Client Y Enterprises</p>
                        <p className="text-sm text-muted-foreground">E-commerce</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(18000)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-lg">3.</span>
                      <div>
                        <p className="font-medium">Client Z Inc</p>
                        <p className="text-sm text-muted-foreground">Healthcare</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(15000)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Need to add missing CheckCircle component
const CheckCircle = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
};

export default Dashboard;
