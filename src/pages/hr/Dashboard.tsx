
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Clock, Calendar, Briefcase, PieChart, BarChart, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample chart data
const attendanceData = [
  { name: "Mon", present: 48, late: 3, absent: 1 },
  { name: "Tue", present: 50, late: 1, absent: 1 },
  { name: "Wed", present: 49, late: 2, absent: 1 },
  { name: "Thu", present: 47, late: 3, absent: 2 },
  { name: "Fri", present: 45, late: 2, absent: 5 },
];

const departmentData = [
  { name: "Engineering", value: 18 },
  { name: "Marketing", value: 12 },
  { name: "Design", value: 8 },
  { name: "Sales", value: 6 },
  { name: "HR", value: 4 },
  { name: "Finance", value: 4 },
];

const HrDashboard = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground">
            Manage employees, track attendance, and view HR metrics
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">6 departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47/52</div>
            <div className="mt-1">
              <Progress value={90} className="h-1.5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">90% present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 urgent hires</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Leave</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Approved for next week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Weekly Attendance"
          icon={<BarChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={attendanceData} 
            height={250}
            defaultType="bar"
          />
        </DashboardCard>

        <DashboardCard
          title="Department Distribution"
          icon={<PieChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={departmentData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Recent Activities"
        icon={<TrendingUp className="h-5 w-5" />}
      >
        <div className="space-y-5">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-2">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">New Employee Joined</h4>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sarah Johnson has joined as Senior Designer in the Design department.
              </p>
              <div className="mt-2 flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">Sarah Johnson</div>
                  <div className="text-xs text-muted-foreground">Senior Designer</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-2">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">New Position Open</h4>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A new Frontend Developer position has been posted to the careers page.
              </p>
              <Button variant="outline" size="sm" className="mt-2">View Position</Button>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-2">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Leave Request Approved</h4>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Michael Brown's leave request for Sep 25-29 has been approved.
              </p>
              <div className="mt-2 flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">Michael Brown</div>
                  <div className="text-xs text-muted-foreground">Project Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default HrDashboard;
