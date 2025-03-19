
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CalendarDays, Download, BarChart, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const monthlyRevenueExpenseData = [
  { name: "Jan", revenue: 42000, expenses: 35000, profit: 7000 },
  { name: "Feb", revenue: 48000, expenses: 38000, profit: 10000 },
  { name: "Mar", revenue: 52000, expenses: 40000, profit: 12000 },
  { name: "Apr", revenue: 58000, expenses: 44000, profit: 14000 },
  { name: "May", revenue: 56000, expenses: 42000, profit: 14000 },
  { name: "Jun", revenue: 62000, expenses: 45000, profit: 17000 },
  { name: "Jul", revenue: 68000, expenses: 48000, profit: 20000 },
  { name: "Aug", revenue: 72000, expenses: 52000, profit: 20000 },
  { name: "Sep", revenue: 75000, expenses: 56000, profit: 19000 },
];

const serviceRevenueData = [
  { name: "Design Services", value: 325000 },
  { name: "Development", value: 280000 },
  { name: "Consulting", value: 125000 },
  { name: "Maintenance", value: 95000 },
];

const clientRevenueData = [
  { name: "ABC Corporation", revenue: 85000 },
  { name: "XYZ Limited", revenue: 72000 },
  { name: "123 Industries", revenue: 68000 },
  { name: "Tech Solutions Inc", revenue: 95000 },
  { name: "Creative Agency Co", revenue: 55000 },
];

const quarterlyGrowthData = [
  { name: "Q1 2022", growth: 5.2 },
  { name: "Q2 2022", growth: 7.1 },
  { name: "Q3 2022", growth: 4.8 },
  { name: "Q4 2022", growth: 6.5 },
  { name: "Q1 2023", growth: 8.2 },
  { name: "Q2 2023", growth: 9.5 },
  { name: "Q3 2023", growth: 7.8 },
];

// Financial metrics
const financialMetrics = [
  {
    id: 1,
    name: "Gross Profit Margin",
    current: 32.5,
    previous: 30.2,
    target: 35,
    change: 2.3,
  },
  {
    id: 2,
    name: "Operating Margin",
    current: 18.4,
    previous: 16.8,
    target: 20,
    change: 1.6,
  },
  {
    id: 3,
    name: "Net Profit Margin",
    current: 14.2,
    previous: 13.1,
    target: 15,
    change: 1.1,
  },
  {
    id: 4,
    name: "Cash Flow",
    current: 22.8,
    previous: 20.5,
    target: 25,
    change: 2.3,
  },
];

const FinancePerformance = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Performance</h1>
          <p className="text-muted-foreground">
            Track revenue, profitability, and financial health
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="quarter">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$533,000</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12.3%</span>
              <span className="text-muted-foreground ml-1">vs last year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$400,000</div>
            <div className="flex items-center pt-1 text-xs text-red-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8.4%</span>
              <span className="text-muted-foreground ml-1">vs last year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$133,000</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>24.6%</span>
              <span className="text-muted-foreground ml-1">vs last year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8%</div>
            <p className="text-xs text-muted-foreground">Q3 2023</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCard
        title="Revenue, Expenses & Profit"
        icon={<LineChart className="h-5 w-5" />}
      >
        <Tabs defaultValue="monthly">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="revenue">Revenue Only</SelectItem>
                <SelectItem value="expenses">Expenses Only</SelectItem>
                <SelectItem value="profit">Profit Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="monthly">
            <AnalyticsChart 
              data={monthlyRevenueExpenseData} 
              height={300}
              defaultType="line"
            />
          </TabsContent>
          <TabsContent value="quarterly">
            <div className="rounded-md border p-8 text-center">
              <h3 className="font-medium">Quarterly View</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Quarterly data view would appear here
              </p>
            </div>
          </TabsContent>
          <TabsContent value="yearly">
            <div className="rounded-md border p-8 text-center">
              <h3 className="font-medium">Yearly View</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Yearly data view would appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Revenue by Service"
          icon={<PieChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={serviceRevenueData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>

        <DashboardCard
          title="Top Client Revenue"
          icon={<BarChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={clientRevenueData} 
            height={250}
            defaultType="bar"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Quarterly Growth Rate"
        icon={<TrendingUp className="h-5 w-5" />}
      >
        <AnalyticsChart 
          data={quarterlyGrowthData} 
          height={250}
          defaultType="line"
        />
      </DashboardCard>

      <Card>
        <CardHeader>
          <CardTitle>Financial Metrics</CardTitle>
          <CardDescription>Key performance indicators and ratios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {financialMetrics.map((metric) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{metric.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{metric.current}%</span>
                    <div className={`flex items-center text-xs ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change > 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                </div>
                <Progress value={metric.current} max={metric.target} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Previous: {metric.previous}%</span>
                  <span>Target: {metric.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancePerformance;
