import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  CreditCard,
  DollarSign,
  Users,
  Activity,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { userService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import LineChart from "@/components/ui/charts/LineChart";
import DonutChart from "@/components/ui/charts/DonutChart";
import BarChartComponent from "@/components/ui/charts/BarChart";
import { Badge } from "@/components/ui/badge";
import EmployeeWorkTracker from '@/components/employee/EmployeeWorkTracker';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [todayHours, setTodayHours] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch data based on user role
        const data = await userService.getDashboardData(user?.id);
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    // Mock function to check if the employee is currently working
    const checkIsWorking = () => {
      // In a real implementation, you would check the database or local storage
      // to see if the employee has an active work session
      // For this example, we'll just return a random value
      const isCurrentlyWorking = Math.random() < 0.5;
      setIsWorking(isCurrentlyWorking);
      if (isCurrentlyWorking) {
        setStartTime(new Date()); // Set the start time to now
      }
    };

    checkIsWorking();
  }, []);

  const handleStartWork = () => {
    setIsWorking(true);
    setStartTime(new Date());
    // In a real implementation, you would save the start time to the database
  };

  const handleEndWork = () => {
    setIsWorking(false);
    // In a real implementation, you would save the end time to the database
    // and calculate the total hours worked
    const endTime = new Date();
    const hoursWorked = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    setTodayHours(hoursWorked);
  };

  // Function to render the appropriate dashboard cards based on user role
  const renderDashboardCards = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // If no data, return default cards
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +5 new since last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              +13% from last week
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Fix LineChart and other chart components
  const productivityData = [
    { date: 'Mon', value: 6.5 },
    { date: 'Tue', value: 7.2 },
    { date: 'Wed', value: 8.1 },
    { date: 'Thu', value: 7.8 },
    { date: 'Fri', value: 8.5 },
    { date: 'Sat', value: 4.0 },
    { date: 'Sun', value: 2.5 }
  ];

  const clientDistribution = [
    { name: 'Client A', value: 25 },
    { name: 'Client B', value: 18 },
    { name: 'Client C', value: 15 },
    { name: 'Client D', value: 12 },
    { name: 'Others', value: 30 }
  ];

  const weeklyTasksData = [
    { day: 'Mon', value: 15 },
    { day: 'Tue', value: 12 },
    { day: 'Wed', value: 18 },
    { day: 'Thu', value: 22 },
    { day: 'Fri', value: 10 },
    { day: 'Sat', value: 5 },
    { day: 'Sun', value: 3 }
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <EmployeeWorkTracker
          isWorking={isWorking}
          onStartWork={handleStartWork}
          onEndWork={handleEndWork}
          startTime={startTime}
          todayHours={todayHours}
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <LineChart
              data={productivityData}
              xAxisKey="date"
              series={[{ key: "value", color: "#10b981" }]}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Distribution</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <DonutChart
              data={[
                { name: "Completed", value: 63, color: "#10b981" },
                { name: "In Progress", value: 25, color: "#3b82f6" },
                { name: "Pending", value: 12, color: "#f97316" }
              ]}
              height={200}
            />
            <div className="flex items-center justify-center space-x-4 text-sm mt-4">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                <span>In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                <span>Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={weeklyTasksData}
              xAxisKey="day"
              series={[{ key: "value", color: "#3b82f6" }]}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Distribution</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={clientDistribution}
              xAxisKey="name"
              series={[{ key: "value", color: "#8884d8" }]}
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Website Redesign</p>
                  <p className="text-xs text-muted-foreground">Due: July 15, 2024</p>
                </div>
                <Badge variant="outline">
                  Pending Client Review
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Mobile App Development</p>
                  <p className="text-xs text-muted-foreground">Due: August 1, 2024</p>
                </div>
                <Badge variant="outline">
                  In Progress
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Task Completion Rate</p>
                  <p className="text-xs text-muted-foreground">85%</p>
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Client Satisfaction</p>
                  <p className="text-xs text-muted-foreground">4.8/5</p>
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
