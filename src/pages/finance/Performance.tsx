
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, TrendingUp, TrendingDown, DollarSign, Target, ArrowUpRight, Calendar, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const revenueGrowthData = [
  { name: "Jan", value: 45000 },
  { name: "Feb", value: 52000 },
  { name: "Mar", value: 48000 },
  { name: "Apr", value: 61000 },
  { name: "May", value: 58000 },
  { name: "Jun", value: 68000 },
];

const yearlyComparisonData = [
  { name: "Jan", current: 45000, previous: 32000 },
  { name: "Feb", current: 52000, previous: 38000 },
  { name: "Mar", current: 48000, previous: 42000 },
  { name: "Apr", current: 61000, previous: 45000 },
  { name: "May", current: 58000, previous: 48000 },
  { name: "Jun", current: 68000, previous: 52000 },
];

const productPerformanceData = [
  { name: "Product A", revenue: 135000 },
  { name: "Product B", revenue: 98000 },
  { name: "Product C", revenue: 65000 },
  { name: "Product D", revenue: 44500 },
];

const FinancePerformance = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Performance</h1>
          <p className="text-muted-foreground">
            Track revenue growth and sales performance
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
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,450</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              8% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Acquisition Cost</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              5% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$52,800</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              7% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Revenue Growth"
          icon={<LineChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={revenueGrowthData} 
            height={300}
            defaultType="line"
          />
        </DashboardCard>

        <DashboardCard
          title="Year-over-Year Comparison"
          icon={<BarChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={yearlyComparisonData} 
            height={300}
            defaultType="bar"
          />
          <div className="flex items-center justify-between text-sm mt-4">
            <div className="flex items-center">
              <div className="bg-primary h-3 w-3 rounded-sm mr-2"></div>
              <span>2023</span>
            </div>
            <div className="flex items-center">
              <div className="bg-muted h-3 w-3 rounded-sm mr-2"></div>
              <span>2022</span>
            </div>
            <div>
              <span className="text-green-500">+25.4% growth</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="Product Performance"
        icon={<BarChart className="h-5 w-5" />}
      >
        <AnalyticsChart 
          data={productPerformanceData} 
          height={300}
          defaultType="bar"
        />
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Sales Performance Metrics"
          icon={<Target className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <div className="space-y-5">
            {[
              { 
                name: "Customer Retention Rate", 
                value: "92%", 
                target: "90%", 
                progress: 92, 
                status: "success", 
                description: "2% above target" 
              },
              { 
                name: "Sales Conversion Rate", 
                value: "28%", 
                target: "25%", 
                progress: 88, 
                status: "success", 
                description: "3% above target" 
              },
              { 
                name: "Sales Cycle Length", 
                value: "38 days", 
                target: "35 days", 
                progress: 85, 
                status: "warning", 
                description: "3 days longer than target" 
              },
              { 
                name: "Lead-to-Customer Ratio", 
                value: "12%", 
                target: "15%", 
                progress: 80, 
                status: "warning", 
                description: "3% below target" 
              },
              { 
                name: "Cross-selling Rate", 
                value: "34%", 
                target: "30%", 
                progress: 90, 
                status: "success", 
                description: "4% above target" 
              }
            ].map((metric, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">{metric.name}</div>
                  <div className="text-sm font-medium">{metric.value}</div>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs text-muted-foreground">Target: {metric.target}</div>
                  <div className={`text-xs ${
                    metric.status === "success" ? "text-green-500" : 
                    metric.status === "warning" ? "text-amber-500" : "text-red-500"
                  }`}>
                    {metric.description}
                  </div>
                </div>
                <Progress value={metric.progress} className={`h-1.5 ${
                  metric.status === "success" ? "bg-green-100 dark:bg-green-900/30" : 
                  metric.status === "warning" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-red-100 dark:bg-red-900/30"
                }`} />
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Revenue Opportunities"
          icon={<TrendingUp className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <div className="space-y-4">
            {[
              { 
                title: "Upsell Premium Features", 
                impact: "High", 
                revenue: "$45,000", 
                probability: "75%",
                description: "Target customers using basic plan for over 6 months."
              },
              { 
                title: "Enterprise Contract Renewals", 
                impact: "High", 
                revenue: "$120,000", 
                probability: "90%",
                description: "5 enterprise contracts due for renewal in Q3."
              },
              { 
                title: "New Product Launch", 
                impact: "Medium", 
                revenue: "$65,000", 
                probability: "60%",
                description: "Projected revenue from Product E launch in August."
              },
              { 
                title: "Expand to New Market", 
                impact: "High", 
                revenue: "$85,000", 
                probability: "65%",
                description: "Market entry planned for Q4, initial projections."
              },
              { 
                title: "Partnership Program", 
                impact: "Medium", 
                revenue: "$38,000", 
                probability: "80%",
                description: "Revenue sharing from new channel partners."
              }
            ].map((opportunity, index) => (
              <div key={index} className="border border-border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{opportunity.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    opportunity.impact === "High" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}>
                    {opportunity.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{opportunity.description}</p>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <div className="font-medium">Potential: {opportunity.revenue}</div>
                  <div>Probability: {opportunity.probability}</div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default FinancePerformance;
