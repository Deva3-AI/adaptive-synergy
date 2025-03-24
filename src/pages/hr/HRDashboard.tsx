
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, UserPlus, Clock, Calendar, Briefcase, PieChart, BarChart, TrendingUp, 
  FileSpreadsheet, FileClock, Building
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { hrService } from "@/services/api/hrService";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import AttendanceTracker from "@/components/hr/AttendanceTracker";
import RecruitmentTracker from "@/components/hr/RecruitmentTracker";
import PayrollManagement from "@/components/hr/PayrollManagement";
import TasksManagement from "@/components/hr/TasksManagement";

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
  const [activeTab, setActiveTab] = useState('overview');
  
  // For the overview tab
  const startDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');
  const endDate = format(new Date(), 'yyyy-MM-dd');
  
  // Get HR metrics
  const { data: hrMetrics } = useQuery({
    queryKey: ['hr-metrics', 'month'],
    queryFn: () => hrService.getHRMetrics('month'),
  });
  
  // Get attendance stats
  const { data: attendanceStats } = useQuery({
    queryKey: ['hr-attendance-stats', startDate, endDate],
    queryFn: () => hrService.getAttendanceStats(startDate, endDate),
    enabled: activeTab === 'overview',
  });
  
  // Get HR trends
  const { data: hrTrends } = useQuery({
    queryKey: ['hr-trends'],
    queryFn: () => hrService.getHRTrends(),
    enabled: activeTab === 'overview',
  });
  
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground">
            Manage employees, track attendance, and view HR metrics
          </p>
        </div>
        <Button onClick={() => setActiveTab('recruitment')}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">
            <Building className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Clock className="h-4 w-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="recruitment">
            <UserPlus className="h-4 w-4 mr-2" />
            Recruitment
          </TabsTrigger>
          <TabsTrigger value="payroll">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Payroll
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.headcount || "52"}</div>
                <p className="text-xs text-muted-foreground">{departmentData.length} departments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceStats?.daily_stats?.slice(-1)[0]?.present || "47"}/
                  {hrMetrics?.headcount || "52"}
                </div>
                <div className="mt-1">
                  <Progress 
                    value={
                      attendanceStats?.daily_stats?.slice(-1)[0]?.attendance_rate || 
                      ((47 / 52) * 100)
                    } 
                    className="h-1.5" 
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {attendanceStats?.daily_stats?.slice(-1)[0]?.attendance_rate?.toFixed(1) || "90"}% present
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.open_positions || "8"}</div>
                <p className="text-xs text-muted-foreground">{hrMetrics?.urgent_positions || "3"} urgent hires</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">HR Tasks</CardTitle>
                <FileClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.pending_tasks || "12"}</div>
                <p className="text-xs text-muted-foreground">Pending tasks</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 mt-4 md:grid-cols-7">
            <DashboardCard
              title="Weekly Attendance"
              icon={<BarChart className="h-5 w-5" />}
              className="md:col-span-4"
            >
              <AnalyticsChart 
                data={attendanceStats?.daily_stats || attendanceData} 
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
            className="mt-4"
          >
            <div className="space-y-5 p-4">
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
          
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <DashboardCard
              title="HR Tasks"
              icon={<FileClock className="h-5 w-5" />}
            >
              <div className="p-4">
                <TasksManagement />
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="HR Trends"
              icon={<TrendingUp className="h-5 w-5" />}
            >
              <div className="p-4 space-y-4">
                {hrTrends ? (
                  hrTrends.slice(0, 3).map((trend: any) => (
                    <Card key={trend.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{trend.title}</h4>
                          <div className={`text-xs px-2 py-0.5 rounded-full ${ 
                            trend.relevance === 'high' ? 'bg-red-500/10 text-red-600' : 
                            trend.relevance === 'medium' ? 'bg-amber-500/10 text-amber-600' : 
                            'bg-green-500/10 text-green-600' 
                          }`}>
                            {trend.relevance.charAt(0).toUpperCase() + trend.relevance.slice(1)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {trend.description}
                        </p>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {trend.source}
                          </span>
                          <span className="text-muted-foreground">
                            {format(new Date(trend.discovered_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="space-y-4">
                    <Card className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Remote Work Policy Updates</h4>
                          <div className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600">
                            High
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Companies are updating remote work policies, hybrid working is becoming standard. Consider reviewing our policy.
                        </p>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            HR Executive Magazine
                          </span>
                          <span className="text-muted-foreground">
                            May 15, 2023
                          </span>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Recruiting AI Tools</h4>
                          <div className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                            Medium
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          AI-powered recruiting tools gaining traction, showing 35% reduction in time-to-hire for tech positions.
                        </p>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            HR Tech Weekly
                          </span>
                          <span className="text-muted-foreground">
                            Jun 2, 2023
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
                <Button variant="outline" className="w-full">View All Trends</Button>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance">
          <AttendanceTracker />
        </TabsContent>
        
        <TabsContent value="recruitment">
          <RecruitmentTracker />
        </TabsContent>
        
        <TabsContent value="payroll">
          <PayrollManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HrDashboard;
