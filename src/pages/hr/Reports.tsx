
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, FileText, BarChart, PieChart, Users, Clock, Briefcase } from "lucide-react";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const departmentHeadcountData = [
  { name: "Engineering", count: 18 },
  { name: "Design", count: 8 },
  { name: "Marketing", count: 12 },
  { name: "Sales", count: 6 },
  { name: "HR", count: 4 },
  { name: "Finance", count: 4 },
];

const employeeTurnoverData = [
  { name: "Jan", hires: 2, departures: 1 },
  { name: "Feb", hires: 1, departures: 0 },
  { name: "Mar", hires: 3, departures: 1 },
  { name: "Apr", hires: 1, departures: 1 },
  { name: "May", hires: 0, departures: 2 },
  { name: "Jun", hires: 2, departures: 1 },
  { name: "Jul", hires: 2, departures: 0 },
  { name: "Aug", hires: 2, departures: 1 },
  { name: "Sep", hires: 3, departures: 1 },
];

const overtimeHoursData = [
  { name: "Engineering", hours: 145 },
  { name: "Design", hours: 68 },
  { name: "Marketing", hours: 82 },
  { name: "Sales", hours: 55 },
  { name: "HR", hours: 32 },
  { name: "Finance", hours: 28 },
];

const attendanceRateData = [
  { name: "Jan", rate: 95 },
  { name: "Feb", rate: 96 },
  { name: "Mar", rate: 94 },
  { name: "Apr", rate: 97 },
  { name: "May", rate: 96 },
  { name: "Jun", rate: 95 },
  { name: "Jul", rate: 94 },
  { name: "Aug", rate: 92 },
  { name: "Sep", rate: 93 },
];

// Sample report data
const reportsList = [
  {
    id: 1,
    title: "Monthly Headcount Report - September 2023",
    description: "Employee headcount, turnover, and growth analysis by department",
    type: "monthly",
    date: "2023-09-30",
    fileSize: "2.1 MB",
    format: "PDF"
  },
  {
    id: 2,
    title: "Q3 2023 HR Performance Report",
    description: "Quarterly analysis of hiring efficiency, retention, and HR metrics",
    type: "quarterly",
    date: "2023-10-05",
    fileSize: "3.8 MB",
    format: "PDF"
  },
  {
    id: 3,
    title: "Attendance & Time Off Analysis",
    description: "Monthly breakdown of attendance patterns and leave usage",
    type: "monthly",
    date: "2023-09-30",
    fileSize: "1.8 MB",
    format: "PDF"
  },
  {
    id: 4,
    title: "Recruitment Metrics Report",
    description: "Analysis of recruitment channels, time-to-hire, and candidate sources",
    type: "monthly",
    date: "2023-09-28",
    fileSize: "2.4 MB",
    format: "PDF"
  },
  {
    id: 5,
    title: "Payroll Summary - September 2023",
    description: "Summary of monthly payroll processing and distribution",
    type: "monthly",
    date: "2023-09-30",
    fileSize: "1.5 MB",
    format: "PDF"
  },
  {
    id: 6,
    title: "Employee Benefits Usage Report",
    description: "Analysis of employee benefits utilization and cost",
    type: "quarterly",
    date: "2023-10-02",
    fileSize: "2.7 MB",
    format: "PDF"
  },
];

const HrReports = () => {
  const [reportPeriod, setReportPeriod] = useState("monthly");
  const [reportType, setReportType] = useState("all");

  // Filter reports based on type
  const filteredReports = reportsList.filter(report => {
    if (reportType === "all") return true;
    return report.type === reportType;
  });

  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View and generate HR reports and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">+4.0% from previous quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93%</div>
            <p className="text-xs text-muted-foreground">-1.0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time-to-Hire</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 days</div>
            <p className="text-xs text-muted-foreground">-3 days from Q2 average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 urgent priority</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Headcount</CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={departmentHeadcountData}
              height={250}
              defaultType="pie"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance Rate</CardTitle>
            <CardDescription>Average attendance rate per month</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={attendanceRateData}
              height={250}
              defaultType="line"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employee Turnover</CardTitle>
            <CardDescription>New hires vs departures by month</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={employeeTurnoverData}
              height={250}
              defaultType="bar"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overtime Hours by Department</CardTitle>
            <CardDescription>Total overtime hours in September 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={overtimeHoursData}
              height={250}
              defaultType="bar"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Access previous HR reports</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="space-y-4">
              {filteredReports.map(report => (
                <div 
                  key={report.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{report.fileSize}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{report.format}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map(report => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{report.fileSize}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{report.format}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HrReports;
