
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, UserPlus, Clock, Calendar, Briefcase, PieChart, BarChart, TrendingUp, 
  Download, Filter, FileText, ArrowUpRight, DollarSign, Book
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { format, subMonths } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { hrService } from "@/services/api/hrService";

// Sample chart data
const headcountTrendData = [
  { name: "Jan", count: 42 },
  { name: "Feb", count: 45 },
  { name: "Mar", count: 48 },
  { name: "Apr", count: 48 },
  { name: "May", count: 50 },
  { name: "Jun", count: 52 },
];

const departmentDistributionData = [
  { name: "Engineering", value: 18 },
  { name: "Marketing", value: 12 },
  { name: "Design", value: 8 },
  { name: "Sales", value: 6 },
  { name: "HR", value: 4 },
  { name: "Finance", value: 4 },
];

const turnoverRateData = [
  { name: "Jan", rate: 1.2 },
  { name: "Feb", rate: 0.8 },
  { name: "Mar", rate: 1.5 },
  { name: "Apr", rate: 0.5 },
  { name: "May", rate: 1.0 },
  { name: "Jun", rate: 0.7 },
];

const attendanceDataByDepartment = [
  { name: "Engineering", present: 95, late: 3, absent: 2 },
  { name: "Marketing", present: 92, late: 5, absent: 3 },
  { name: "Design", present: 94, late: 4, absent: 2 },
  { name: "Sales", present: 90, late: 6, absent: 4 },
  { name: "HR", present: 98, late: 1, absent: 1 },
  { name: "Finance", present: 96, late: 2, absent: 2 },
];

const HrReports = () => {
  const [timeframe, setTimeframe] = useState<string>("month");
  
  const startDate = format(subMonths(new Date(), 6), 'yyyy-MM-dd');
  const endDate = format(new Date(), 'yyyy-MM-dd');
  
  // Get HR metrics data
  const { data: hrMetrics } = useQuery({
    queryKey: ['hr-metrics', timeframe],
    queryFn: () => hrService.getHRMetrics(timeframe as any),
  });

  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Reports</h1>
          <p className="text-muted-foreground">
            Analyze HR metrics and generate insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="headcount">Headcount</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Headcount</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.headcount || 52}</div>
                <div className="flex items-center pt-1 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+{hrMetrics?.headcount_change || 4} since last {timeframe}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.average_attendance_rate?.toFixed(1) || "94.5"}%</div>
                <div className="mt-1">
                  <Progress value={hrMetrics?.average_attendance_rate || 94.5} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.open_positions || 8}</div>
                <p className="text-xs text-muted-foreground">{hrMetrics?.urgent_positions || 3} urgent hires</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.turnover_rate?.toFixed(1) || "1.2"}%</div>
                <p className="text-xs text-muted-foreground">Industry avg: 1.8%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <DashboardCard
              title="Headcount Trend"
              icon={<TrendingUp className="h-5 w-5" />}
              className="md:col-span-4"
            >
              <AnalyticsChart 
                data={headcountTrendData} 
                height={250}
                defaultType="line"
              />
              <div className="mt-2 grid grid-cols-3 text-center text-sm">
                <div>
                  <div className="font-medium">+{hrMetrics?.new_hires_ytd || 10}</div>
                  <div className="text-xs text-muted-foreground">New Hires YTD</div>
                </div>
                <div>
                  <div className="font-medium">{hrMetrics?.growth_rate || "23.8"}%</div>
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
                </div>
                <div>
                  <div className="font-medium">{hrMetrics?.departures_ytd || 2}</div>
                  <div className="text-xs text-muted-foreground">Departures YTD</div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Department Distribution"
              icon={<PieChart className="h-5 w-5" />}
              className="md:col-span-3"
            >
              <AnalyticsChart 
                data={departmentDistributionData} 
                height={250}
                defaultType="pie"
              />
            </DashboardCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DashboardCard
              title="Time to Hire"
              icon={<Clock className="h-5 w-5" />}
            >
              <div className="p-4">
                <div className="text-3xl font-bold mb-4">{hrMetrics?.time_to_hire || 18.5} days</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Engineering</span>
                      <span>22.3 days</span>
                    </div>
                    <Progress value={22.3/30*100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Design</span>
                      <span>15.7 days</span>
                    </div>
                    <Progress value={15.7/30*100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Marketing</span>
                      <span>12.8 days</span>
                    </div>
                    <Progress value={12.8/30*100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Sales</span>
                      <span>18.2 days</span>
                    </div>
                    <Progress value={18.2/30*100} className="h-2" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Industry average: 25 days
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Monthly Turnover Rate"
              icon={<BarChart className="h-5 w-5" />}
            >
              <AnalyticsChart 
                data={turnoverRateData} 
                height={250}
                defaultType="line"
              />
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="headcount" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Growth</CardTitle>
                <CardDescription>Year-to-date headcount changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-5xl font-bold mb-2">{hrMetrics?.headcount || 52}</div>
                  <div className="text-sm text-muted-foreground">Current employees</div>
                  <div className="mt-4 flex justify-center gap-8">
                    <div>
                      <div className="text-xl font-bold text-green-600">+{hrMetrics?.new_hires_ytd || 10}</div>
                      <div className="text-xs text-muted-foreground">New hires</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-red-600">-{hrMetrics?.departures_ytd || 2}</div>
                      <div className="text-xs text-muted-foreground">Departures</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Headcount by Department</CardTitle>
                <CardDescription>Employee distribution and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentDistributionData.map((dept) => (
                    <div key={dept.name}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{dept.name}</span>
                        <span>{dept.value}</span>
                      </div>
                      <div className="flex items-center">
                        <Progress value={(dept.value / 52) * 100} className="h-2 flex-1 mr-3" />
                        <span className="text-xs text-green-600">+1</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Employee Tenure</CardTitle>
              <CardDescription>Distribution by years at company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                [Employee Tenure Chart - Would display tenure distribution]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.average_attendance_rate?.toFixed(1) || "94.5"}%</div>
                <div className="mt-1">
                  <Progress value={hrMetrics?.average_attendance_rate || 94.5} className="h-1.5" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {timeframe === "week" ? "Past 7 days" : 
                   timeframe === "month" ? "Past 30 days" : 
                   timeframe === "quarter" ? "Past quarter" : "Past year"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.on_time_rate?.toFixed(1) || "91.2"}%</div>
                <div className="mt-1">
                  <Progress value={hrMetrics?.on_time_rate || 91.2} className="h-1.5" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Employees arriving on time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Absence Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.absence_rate?.toFixed(1) || "2.3"}%</div>
                <div className="mt-1">
                  <Progress value={hrMetrics?.absence_rate || 2.3} className="h-1.5" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Unplanned absences
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Department</CardTitle>
              <CardDescription>
                Department attendance breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {attendanceDataByDepartment.map((dept) => (
                  <div key={dept.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{dept.name}</span>
                      <div className="flex gap-4">
                        <span className="text-green-600">{dept.present}% Present</span>
                        <span className="text-amber-600">{dept.late}% Late</span>
                        <span className="text-red-600">{dept.absent}% Absent</span>
                      </div>
                    </div>
                    <div className="w-full flex h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full" 
                        style={{ width: `${dept.present}%` }}
                      />
                      <div 
                        className="bg-amber-500 h-full" 
                        style={{ width: `${dept.late}%` }}
                      />
                      <div 
                        className="bg-red-500 h-full" 
                        style={{ width: `${dept.absent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Pattern</CardTitle>
              <CardDescription>
                Attendance trends by day of week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                [Weekly Pattern Chart - Would display attendance by day of week]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recruitment" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.time_to_hire || 18.5} days</div>
                <p className="text-xs text-muted-foreground">Industry avg: 25 days</p>
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-600/20">
                  26% faster
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Application-to-Hire Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.application_to_hire_ratio || "12:1"}</div>
                <p className="text-xs text-muted-foreground">Industry avg: 18:1</p>
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-600/20">
                  Better efficiency
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cost per Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${hrMetrics?.cost_per_hire?.toLocaleString() || "2,850"}</div>
                <p className="text-xs text-muted-foreground">Industry avg: $4,200</p>
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-600/20">
                  32% savings
                </Badge>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Pipeline</CardTitle>
              <CardDescription>
                Application flow across all positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                [Recruitment Funnel Chart - Would display conversion rates]
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Sources</CardTitle>
                <CardDescription>
                  Where our applicants come from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Pie Chart - Would display source breakdown]
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Efficiency</CardTitle>
                <CardDescription>
                  Key recruitment metrics by position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Bar Chart - Would display position comparison]
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="payroll" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${hrMetrics?.total_payroll?.toLocaleString() || "187,500"}</div>
                <p className="text-xs text-muted-foreground">
                  {timeframe === "week" ? "Past week" : 
                   timeframe === "month" ? "Past month" : 
                   timeframe === "quarter" ? "Past quarter" : "Past year"}
                </p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  4.5% from previous {timeframe}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${hrMetrics?.average_salary?.toLocaleString() || "4,250"}</div>
                <p className="text-xs text-muted-foreground">
                  Per month per employee
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Salary Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hrMetrics?.salary_growth?.toFixed(1) || "5.2"}%</div>
                <p className="text-xs text-muted-foreground">
                  Year-over-year increase
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Payroll Trends</CardTitle>
              <CardDescription>
                Monthly payroll over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                [Line Chart - Would display payroll over time]
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll by Department</CardTitle>
                <CardDescription>
                  Department distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Bar Chart - Would display department distribution]
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Compensation Components</CardTitle>
                <CardDescription>
                  Breakdown of total compensation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Pie Chart - Would display compensation breakdown]
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <DashboardCard
        title="HR Insights & Recommendations"
        icon={<Book className="h-5 w-5" />}
      >
        <div className="space-y-5 p-4">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Headcount Optimization</h4>
              <p className="text-sm text-muted-foreground mt-1">
                The Engineering department has the highest growth rate (15%) but also the longest time-to-hire (22.3 days).
                Consider creating a talent pipeline for engineering roles to reduce hiring time.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View Detailed Analysis
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Attendance Patterns</h4>
              <p className="text-sm text-muted-foreground mt-1">
                There's a consistent pattern of lower attendance on Mondays (89%) compared to mid-week (96%).
                Consider implementing flexible Monday schedules or team-building activities to improve engagement.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View Attendance Analysis
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Compensation Strategy</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Market analysis shows our design department compensation is 8% below industry average,
                which may be contributing to the higher turnover rate in that department (2.1% vs. company average of 1.2%).
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View Compensation Analysis
              </Button>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default HrReports;
