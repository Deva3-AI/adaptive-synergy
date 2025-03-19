
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart, LineChart, TrendingUp, FileText, Download, Filter, Calendar } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const monthlyRevenueData = [
  { name: "Jan", revenue: 45000 },
  { name: "Feb", revenue: 52000 },
  { name: "Mar", revenue: 48000 },
  { name: "Apr", revenue: 61000 },
  { name: "May", revenue: 58000 },
  { name: "Jun", revenue: 68000 },
];

const FinanceReports = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">
            Generate and download detailed financial reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Q2 2023
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <DashboardCard
        title="Monthly Revenue"
        icon={<LineChart className="h-5 w-5" />}
      >
        <AnalyticsChart 
          data={monthlyRevenueData} 
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
              title: "Income Statement", 
              description: "Comprehensive profit and loss report for the current period",
              update: "Updated monthly",
              type: "Standard",
              icon: <BarChart className="h-12 w-12 text-primary/20" />
            },
            { 
              title: "Balance Sheet", 
              description: "Statement of financial position showing assets, liabilities, and equity",
              update: "Updated monthly",
              type: "Standard",
              icon: <PieChart className="h-12 w-12 text-primary/20" />
            },
            { 
              title: "Cash Flow Statement", 
              description: "Analysis of all cash inflows and outflows during the period",
              update: "Updated monthly",
              type: "Standard",
              icon: <LineChart className="h-12 w-12 text-primary/20" />
            },
            { 
              title: "Accounts Receivable Aging", 
              description: "Analysis of unpaid customer invoices and time periods",
              update: "Updated weekly",
              type: "Standard",
              icon: <FileText className="h-12 w-12 text-primary/20" />
            },
            { 
              title: "Revenue by Product", 
              description: "Breakdown of revenue streams by product and service offerings",
              update: "Updated weekly",
              type: "Standard",
              icon: <BarChart className="h-12 w-12 text-primary/20" />
            },
            { 
              title: "Expense Report", 
              description: "Detailed analysis of all company expenses by category",
              update: "Updated weekly",
              type: "Standard",
              icon: <PieChart className="h-12 w-12 text-primary/20" />
            },
            { 
              title: "Budget vs. Actual", 
              description: "Comparison of budgeted figures against actual financial performance",
              update: "Updated monthly",
              type: "Management",
              icon: <BarChart className="h-12 w-12 text-primary/20" />
            },
            { 
              title: "Financial Ratios", 
              description: "Key financial metrics and performance indicators",
              update: "Updated monthly",
              type: "Management",
              icon: <TrendingUp className="h-12 w-12 text-primary/20" />
            },
            { 
              title: "Tax Preparation Report", 
              description: "Documentation and analysis for tax filing preparation",
              update: "Updated quarterly",
              type: "Compliance",
              icon: <FileText className="h-12 w-12 text-primary/20" />
            },
          ].map((report, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute right-2 top-2 opacity-10">
                {report.icon}
              </div>
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
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard
        title="Recent Reports"
        icon={<FileText className="h-5 w-5" />}
      >
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Report Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated On</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { 
                  name: "Income Statement", 
                  date: "June 30, 2023", 
                  period: "June 2023", 
                  type: "Monthly",
                  user: "System" 
                },
                { 
                  name: "Balance Sheet", 
                  date: "June 30, 2023", 
                  period: "As of June 30, 2023", 
                  type: "Monthly",
                  user: "System" 
                },
                { 
                  name: "Q2 Financial Review", 
                  date: "June 28, 2023", 
                  period: "Q2 2023", 
                  type: "Quarterly",
                  user: "John Smith" 
                },
                { 
                  name: "Accounts Receivable Aging", 
                  date: "June 25, 2023", 
                  period: "As of June 25, 2023", 
                  type: "Weekly",
                  user: "System" 
                },
                { 
                  name: "Revenue by Product", 
                  date: "June 25, 2023", 
                  period: "June 2023", 
                  type: "Monthly",
                  user: "Jane Doe" 
                },
                { 
                  name: "Cash Flow Statement", 
                  date: "June 15, 2023", 
                  period: "June 1-15, 2023", 
                  type: "Bi-weekly",
                  user: "System" 
                },
                { 
                  name: "Budget vs. Actual", 
                  date: "June 15, 2023", 
                  period: "YTD June 2023", 
                  type: "Monthly",
                  user: "John Smith" 
                }
              ].map((report, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{report.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {report.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {report.period}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {report.user}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default FinanceReports;
