
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, PieChart, TrendingUp, TrendingDown, DollarSign, Calendar, Download } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const revenueData = [
  { name: "Jan", revenue: 45000, expenses: 30000, profit: 15000 },
  { name: "Feb", revenue: 52000, expenses: 32000, profit: 20000 },
  { name: "Mar", revenue: 48000, expenses: 31000, profit: 17000 },
  { name: "Apr", revenue: 61000, expenses: 35000, profit: 26000 },
  { name: "May", revenue: 58000, expenses: 36000, profit: 22000 },
  { name: "Jun", revenue: 68000, expenses: 38000, profit: 30000 },
];

const expenseBreakdownData = [
  { name: "Payroll", value: 55 },
  { name: "Operations", value: 20 },
  { name: "Marketing", value: 10 },
  { name: "Software", value: 8 },
  { name: "Office", value: 7 },
];

const FinanceDashboard = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Track financial performance and key metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Q2 2023
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$342,500</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              12% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$202,000</div>
            <p className="text-xs text-red-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              8% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$140,500</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              18% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41%</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              3% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Revenue vs Expenses"
          icon={<LineChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={revenueData} 
            height={300}
            defaultType="line"
          />
        </DashboardCard>

        <DashboardCard
          title="Expense Breakdown"
          icon={<PieChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={expenseBreakdownData} 
            height={300}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Financial Health Indicators"
          icon={<TrendingUp className="h-5 w-5" />}
        >
          <div className="space-y-5">
            {[
              { name: "Current Ratio", value: "2.4", status: "good", description: "Assets to liabilities ratio" },
              { name: "Quick Ratio", value: "1.8", status: "good", description: "Ability to pay short-term obligations" },
              { name: "Debt to Equity", value: "0.32", status: "good", description: "Debt against shareholder equity" },
              { name: "Gross Margin", value: "68%", status: "good", description: "Revenue after COGS" },
              { name: "Operating Margin", value: "41%", status: "good", description: "Profit from operations" }
            ].map((metric, index) => (
              <div key={index} className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-3 ${
                  metric.status === "good" ? "bg-green-500" : 
                  metric.status === "warning" ? "bg-amber-500" : "bg-red-500"
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{metric.name}</p>
                    <p className="font-bold">{metric.value}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Cash Flow Forecast"
          icon={<LineChart className="h-5 w-5" />}
        >
          <div className="space-y-5">
            {[
              { month: "July", forecast: "$72,000", status: "increase" },
              { month: "August", forecast: "$75,000", status: "increase" },
              { month: "September", forecast: "$78,000", status: "increase" },
              { month: "October", forecast: "$80,000", status: "increase" },
              { month: "November", forecast: "$74,000", status: "decrease" }
            ].map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full mr-3 flex items-center justify-center ${
                    month.status === "increase" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {month.status === "increase" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{month.month}</p>
                    <p className="text-xs text-muted-foreground">Projected</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{month.forecast}</p>
                  <p className="text-xs text-muted-foreground">
                    {month.status === "increase" ? "+" : "-"}
                    {index > 0 ? `${Math.abs(parseInt(month.forecast.replace(/[^0-9]/g, '')) - parseInt(revenueData[revenueData.length-1].revenue)).toLocaleString()}` : "0"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default FinanceDashboard;
