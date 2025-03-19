
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, FileText, BarChart, PieChart, FileBarChart, FilePieChart, FileLineChart, FilterX } from "lucide-react";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const monthlyRevenueData = [
  { name: "Jan", amount: 42000 },
  { name: "Feb", amount: 48000 },
  { name: "Mar", amount: 52000 },
  { name: "Apr", amount: 58000 },
  { name: "May", amount: 56000 },
  { name: "Jun", amount: 62000 },
  { name: "Jul", amount: 68000 },
  { name: "Aug", amount: 72000 },
  { name: "Sep", amount: 75000 },
];

const monthlyCostData = [
  { name: "Jan", amount: 35000 },
  { name: "Feb", amount: 38000 },
  { name: "Mar", amount: 40000 },
  { name: "Apr", amount: 44000 },
  { name: "May", amount: 42000 },
  { name: "Jun", amount: 45000 },
  { name: "Jul", amount: 48000 },
  { name: "Aug", amount: 52000 },
  { name: "Sep", amount: 56000 },
];

const financialMetrics = [
  { name: "Revenue Growth", value: 12.3 },
  { name: "Profit Margin", value: 25.0 },
  { name: "Operating Margin", value: 18.4 },
  { name: "Cash Flow", value: 22.8 },
  { name: "ROI", value: 15.6 },
];

// Sample report data
const reportsList = [
  {
    id: 1,
    title: "Monthly Financial Statement - September 2023",
    description: "Comprehensive income statement, balance sheet, and cash flow analysis",
    type: "monthly",
    date: "2023-09-30",
    fileSize: "2.8 MB",
    format: "PDF"
  },
  {
    id: 2,
    title: "Q3 2023 Financial Performance",
    description: "Quarterly financial analysis with year-over-year comparison",
    type: "quarterly",
    date: "2023-10-05",
    fileSize: "4.2 MB",
    format: "PDF"
  },
  {
    id: 3,
    title: "Revenue Analysis by Service",
    description: "Detailed breakdown of revenue streams by service category",
    type: "monthly",
    date: "2023-09-30",
    fileSize: "1.9 MB",
    format: "PDF"
  },
  {
    id: 4,
    title: "Expense Report - September 2023",
    description: "Detailed analysis of all company expenses by category",
    type: "monthly",
    date: "2023-09-30",
    fileSize: "2.1 MB",
    format: "PDF"
  },
  {
    id: 5,
    title: "Client Revenue Analysis",
    description: "Revenue breakdown by client with year-over-year comparison",
    type: "quarterly",
    date: "2023-10-02",
    fileSize: "3.4 MB",
    format: "PDF"
  },
  {
    id: 6,
    title: "Profit & Loss Summary",
    description: "Year-to-date profit and loss summary with projections",
    type: "ytd",
    date: "2023-09-30",
    fileSize: "2.5 MB",
    format: "PDF"
  },
  {
    id: 7,
    title: "Cash Flow Statement",
    description: "Detailed cash flow analysis and projections",
    type: "monthly",
    date: "2023-09-30",
    fileSize: "1.8 MB",
    format: "PDF"
  },
  {
    id: 8,
    title: "Annual Budget vs. Actual - YTD",
    description: "Comparison of budget versus actual expenses year-to-date",
    type: "ytd",
    date: "2023-09-30",
    fileSize: "3.2 MB",
    format: "PDF"
  },
];

const FinanceReports = () => {
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
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">
            Generate and access comprehensive financial reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Quick Reports</CardTitle>
            <FilterX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <FileBarChart className="h-4 w-4 mr-2" />
                Income Statement
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FilePieChart className="h-4 w-4 mr-2" />
                Balance Sheet
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileLineChart className="h-4 w-4 mr-2" />
                Cash Flow
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart className="h-4 w-4 mr-2" />
                Revenue by Service
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <PieChart className="h-4 w-4 mr-2" />
                Expense Breakdown
              </Button>
              <hr className="my-2" />
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Custom Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue & Cost</CardTitle>
            <CardDescription>Year-to-date overview of revenue and costs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
                <TabsTrigger value="combined">Combined</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue">
                <AnalyticsChart 
                  data={monthlyRevenueData} 
                  height={250}
                  defaultType="bar"
                />
              </TabsContent>
              <TabsContent value="costs">
                <AnalyticsChart 
                  data={monthlyCostData} 
                  height={250}
                  defaultType="bar"
                />
              </TabsContent>
              <TabsContent value="combined">
                <div className="rounded-md border p-8 text-center">
                  <h3 className="font-medium">Combined View</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Combined revenue and cost chart would appear here
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Financial Metrics</CardTitle>
          <CardDescription>Year-to-date performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {financialMetrics.map((metric) => (
              <div 
                key={metric.name} 
                className="flex flex-col items-center justify-center p-4 border rounded-lg"
              >
                <div className="text-3xl font-bold mb-2">
                  {metric.value}%
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  {metric.name}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Access previously generated reports</CardDescription>
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
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
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

export default FinanceReports;
