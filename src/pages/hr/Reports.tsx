
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart, TrendingUp, Download, Filter, FileText, Calendar } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
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

const HrReports = () => {
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
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 6 Months
          </Button>
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Headcount</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-green-500">+10 (23.8%) since January</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Tenure</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 years</div>
            <p className="text-xs text-muted-foreground">Industry avg: 2.1 years</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.0%</div>
            <p className="text-xs text-muted-foreground">Industry avg: 1.3%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Headcount Trend"
          icon={<LineChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={headcountTrendData} 
            height={300}
            defaultType="line"
          />
          <div className="mt-2 grid grid-cols-3 text-center text-sm">
            <div>
              <div className="font-medium">+10</div>
              <div className="text-xs text-muted-foreground">New Hires YTD</div>
            </div>
            <div>
              <div className="font-medium">23.8%</div>
              <div className="text-xs text-muted-foreground">Growth Rate</div>
            </div>
            <div>
              <div className="font-medium">2</div>
              <div className="text-xs text-muted-foreground">Departures YTD</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Department Distribution"
          icon={<PieChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={departmentDistributionData} 
            height={300}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Monthly Turnover Rate"
        icon={<BarChart className="h-5 w-5" />}
      >
        <AnalyticsChart 
          data={turnoverRateData} 
          height={300}
          defaultType="line"
        />
      </DashboardCard>

      <DashboardCard
        title="Available Reports"
        icon={<FileText className="h-5 w-5" />}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              title: "Headcount Report", 
              description: "Full employee headcount breakdown by department, role, and location",
              update: "Updated daily",
              type: "Standard"
            },
            { 
              title: "Compensation Analysis", 
              description: "Salary distribution, pay equity, and benchmarking data",
              update: "Updated monthly",
              type: "Confidential"
            },
            { 
              title: "Turnover Report", 
              description: "Employee turnover trends and exit interview insights",
              update: "Updated monthly",
              type: "Standard"
            },
            { 
              title: "Recruitment Metrics", 
              description: "Hiring funnel, time-to-fill, and candidate source analysis",
              update: "Updated weekly",
              type: "Standard"
            },
            { 
              title: "Diversity & Inclusion", 
              description: "Workforce diversity metrics and inclusion initiatives",
              update: "Updated quarterly",
              type: "Confidential"
            },
            { 
              title: "Employee Engagement", 
              description: "Results from pulse surveys and engagement initiatives",
              update: "Updated quarterly",
              type: "Standard"
            },
          ].map((report, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground">{report.update}</span>
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                    {report.type}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  View Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default HrReports;
