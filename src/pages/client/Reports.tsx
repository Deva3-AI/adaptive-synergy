
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, BarChart, PieChart, LineChart, Clock, Users, FileText } from "lucide-react";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const monthlyHoursData = [
  { name: "Jan", hours: 120 },
  { name: "Feb", hours: 145 },
  { name: "Mar", hours: 132 },
  { name: "Apr", hours: 165 },
  { name: "May", hours: 178 },
  { name: "Jun", hours: 150 },
  { name: "Jul", hours: 187 },
  { name: "Aug", hours: 192 },
  { name: "Sep", hours: 170 },
];

const taskStatusData = [
  { name: "Completed", value: 48 },
  { name: "In Progress", value: 32 },
  { name: "Pending", value: 18 },
  { name: "Cancelled", value: 2 },
];

const timeAllocationData = [
  { name: "Design", value: 35 },
  { name: "Development", value: 42 },
  { name: "Research", value: 12 },
  { name: "Meetings", value: 8 },
  { name: "Admin", value: 3 },
];

const teamPerformanceData = [
  { name: "John", tasks: 24, hours: 145 },
  { name: "Sarah", tasks: 18, hours: 132 },
  { name: "Michael", tasks: 32, hours: 187 },
  { name: "Lisa", tasks: 22, hours: 165 },
  { name: "David", tasks: 28, hours: 178 },
];

// Sample report data
const reportsList = [
  {
    id: 1,
    title: "September 2023 Project Summary",
    description: "Monthly summary of all project activities, tasks, and hours",
    type: "monthly",
    date: "2023-09-30",
    fileSize: "3.2 MB",
    format: "PDF"
  },
  {
    id: 2,
    title: "Q3 2023 Performance Report",
    description: "Quarterly analysis of project performance, team efficiency, and cost metrics",
    type: "quarterly",
    date: "2023-10-02",
    fileSize: "4.8 MB",
    format: "PDF"
  },
  {
    id: 3,
    title: "Website Redesign Project Report",
    description: "Comprehensive report on the website redesign project tasks and outcomes",
    type: "project",
    date: "2023-09-25",
    fileSize: "2.7 MB",
    format: "PDF"
  },
  {
    id: 4,
    title: "August 2023 Project Summary",
    description: "Monthly summary of all project activities, tasks, and hours",
    type: "monthly",
    date: "2023-08-31",
    fileSize: "3.5 MB",
    format: "PDF"
  },
  {
    id: 5,
    title: "Mobile App Development Progress Report",
    description: "Detailed report on the mobile app development project progress",
    type: "project",
    date: "2023-09-15",
    fileSize: "5.1 MB",
    format: "PDF"
  }
];

const ClientReports = () => {
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
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Review project performance, task metrics, and generated reports
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
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 active, 4 completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">186</div>
            <p className="text-xs text-muted-foreground">48 completed this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,432</div>
            <p className="text-xs text-muted-foreground">170 hours this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across 4 departments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Hours</CardTitle>
            <CardDescription>Time spent on projects over the last 9 months</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={monthlyHoursData}
              height={250}
              defaultType="bar"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Current status of all project tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={taskStatusData}
              height={250}
              defaultType="pie"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Task completion and hours worked by team member</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={teamPerformanceData}
            height={300}
            defaultType="bar"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Time Allocation by Category</CardTitle>
            <CardDescription>Distribution of hours across different categories</CardDescription>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="website">Website Redesign</SelectItem>
              <SelectItem value="mobile">Mobile App Dev</SelectItem>
              <SelectItem value="brand">Brand Guidelines</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={timeAllocationData}
            height={250}
            defaultType="donut"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Download past reports and analytics</CardDescription>
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
                  <SelectItem value="project">Project</SelectItem>
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

export default ClientReports;
