
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart, LineChart, TrendingUp, TrendingDown, DollarSign, Briefcase, Calendar, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const costBreakdownData = [
  { name: "Salaries", value: 55 },
  { name: "Operations", value: 15 },
  { name: "Marketing", value: 10 },
  { name: "Software", value: 8 },
  { name: "Office", value: 7 },
  { name: "Other", value: 5 },
];

const costTrendsData = [
  { name: "Jan", costs: 30000 },
  { name: "Feb", costs: 32000 },
  { name: "Mar", costs: 31000 },
  { name: "Apr", costs: 35000 },
  { name: "May", costs: 36000 },
  { name: "Jun", costs: 38000 },
];

const departmentCostsData = [
  { name: "Engineering", value: 125000 },
  { name: "Marketing", value: 65000 },
  { name: "Sales", value: 85000 },
  { name: "Design", value: 45000 },
  { name: "Operations", value: 55000 },
  { name: "HR", value: 35000 },
];

const FinanceCostAnalysis = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cost Analysis</h1>
          <p className="text-muted-foreground">
            Analyze expenses and identify cost optimization opportunities
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

      <div className="grid gap-4 md:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Cost Per Employee</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,885</div>
            <p className="text-xs text-red-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              3.2% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expense Ratio</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">59%</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              2% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Cost Breakdown"
          icon={<PieChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={costBreakdownData} 
            height={300}
            defaultType="pie"
          />
        </DashboardCard>

        <DashboardCard
          title="Monthly Cost Trends"
          icon={<LineChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={costTrendsData} 
            height={300}
            defaultType="line"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Department Costs"
        icon={<Briefcase className="h-5 w-5" />}
      >
        <AnalyticsChart 
          data={departmentCostsData} 
          height={300}
          defaultType="bar"
        />
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Cost KPIs"
          icon={<DollarSign className="h-5 w-5" />}
        >
          <div className="space-y-5">
            {[
              { 
                name: "Cost to Revenue Ratio", 
                value: "59%", 
                target: "55%", 
                progress: 55, 
                status: "warning", 
                description: "4% above target" 
              },
              { 
                name: "Operating Expense Ratio", 
                value: "35%", 
                target: "33%", 
                progress: 70, 
                status: "warning", 
                description: "2% above target" 
              },
              { 
                name: "Marketing ROI", 
                value: "285%", 
                target: "250%", 
                progress: 95, 
                status: "success", 
                description: "35% above target" 
              },
              { 
                name: "Employee Productivity Ratio", 
                value: "$6,580", 
                target: "$6,000", 
                progress: 90, 
                status: "success", 
                description: "$580 above target" 
              },
              { 
                name: "Software Expense per Employee", 
                value: "$485", 
                target: "$500", 
                progress: 85, 
                status: "success", 
                description: "$15 below target" 
              }
            ].map((kpi, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">{kpi.name}</div>
                  <div className="text-sm font-medium">{kpi.value}</div>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs text-muted-foreground">Target: {kpi.target}</div>
                  <div className={`text-xs ${
                    kpi.status === "success" ? "text-green-500" : 
                    kpi.status === "warning" ? "text-amber-500" : "text-red-500"
                  }`}>
                    {kpi.description}
                  </div>
                </div>
                <Progress value={kpi.progress} className={`h-1.5 ${
                  kpi.status === "success" ? "bg-green-100 dark:bg-green-900/30" : 
                  kpi.status === "warning" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-red-100 dark:bg-red-900/30"
                }`} />
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Cost Optimization Recommendations"
          icon={<TrendingDown className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {[
              { 
                title: "Software License Audit", 
                impact: "High", 
                savings: "$12,500 annually", 
                effort: "Medium",
                description: "Review all software subscriptions and eliminate redundant tools."
              },
              { 
                title: "Optimize Cloud Resources", 
                impact: "High", 
                savings: "$8,200 annually", 
                effort: "Medium",
                description: "Resize underutilized cloud instances and implement auto-scaling."
              },
              { 
                title: "Renegotiate Vendor Contracts", 
                impact: "Medium", 
                savings: "$15,000 annually", 
                effort: "High",
                description: "Review and negotiate better terms with top 5 vendors."
              },
              { 
                title: "Reduce Office Space", 
                impact: "Medium", 
                savings: "$32,000 annually", 
                effort: "High",
                description: "Implement hot desking and reduce office footprint by 20%."
              },
              { 
                title: "Implement Energy Efficiency", 
                impact: "Low", 
                savings: "$3,800 annually", 
                effort: "Low",
                description: "Install smart lighting and HVAC controls in office spaces."
              }
            ].map((recommendation, index) => (
              <div key={index} className="border border-border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{recommendation.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    recommendation.impact === "High" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                    recommendation.impact === "Medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {recommendation.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="font-medium">Potential Savings: {recommendation.savings}</div>
                  <div>Effort: {recommendation.effort}</div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default FinanceCostAnalysis;
