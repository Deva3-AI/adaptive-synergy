
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, FileClock, ReceiptText, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample chart data
const revenueData = [
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

const expensesData = [
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

const expenseCategoryData = [
  { name: "Salaries", value: 245000 },
  { name: "Marketing", value: 85000 },
  { name: "Tools & Software", value: 42000 },
  { name: "Office & Utilities", value: 28000 },
  { name: "Travel", value: 15000 },
  { name: "Miscellaneous", value: 10000 },
];

const revenueSourceData = [
  { name: "Design Services", value: 325000 },
  { name: "Development", value: 280000 },
  { name: "Consulting", value: 125000 },
  { name: "Maintenance", value: 95000 },
];

const FinanceDashboard = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor financial performance and key metrics
          </p>
        </div>
        <Button>
          <BarChart className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$75,000</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>4.2%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$56,000</div>
            <div className="flex items-center pt-1 text-xs text-red-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>7.7%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$19,000</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>-4.5%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$32,850</div>
            <p className="text-xs text-muted-foreground">8 invoices pending</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCard
        title="Revenue vs Expenses (YTD)"
        icon={<LineChart className="h-5 w-5" />}
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Revenue</h4>
              <span className="text-sm">$533,000</span>
            </div>
            <Progress value={75} className="h-1.5" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Target: $720,000</span>
              <span>74% achieved</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Expenses</h4>
              <span className="text-sm">$400,000</span>
            </div>
            <Progress value={80} className="h-1.5 bg-muted-foreground/20" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Budget: $500,000</span>
              <span>80% used</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Net Profit</h4>
              <span className="text-sm">$133,000</span>
            </div>
            <Progress value={60} className="h-1.5 bg-green-100" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Target: $220,000</span>
              <span>60% achieved</span>
            </div>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Monthly Revenue Trend"
          icon={<LineChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={revenueData} 
            height={250}
            defaultType="line"
          />
        </DashboardCard>

        <DashboardCard
          title="Monthly Expenses Trend"
          icon={<LineChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={expensesData} 
            height={250}
            defaultType="line"
          />
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Expense Breakdown"
          icon={<BarChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={expenseCategoryData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>

        <DashboardCard
          title="Revenue Sources"
          icon={<BarChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={revenueSourceData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>
      </div>
    </div>
  );
};

export default FinanceDashboard;
