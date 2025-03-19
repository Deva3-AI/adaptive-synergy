
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, ChevronDown, LineChart, PieChart, Download } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample chart data
const performanceData = [
  { name: "Jan", leads: 120, conversions: 24, revenue: 12000 },
  { name: "Feb", leads: 145, conversions: 28, revenue: 14200 },
  { name: "Mar", leads: 132, conversions: 22, revenue: 11500 },
  { name: "Apr", leads: 165, conversions: 33, revenue: 16800 },
  { name: "May", leads: 178, conversions: 38, revenue: 19500 },
  { name: "Jun", leads: 150, conversions: 30, revenue: 15200 },
  { name: "Jul", leads: 187, conversions: 42, revenue: 21400 },
  { name: "Aug", leads: 192, conversions: 45, revenue: 22800 },
  { name: "Sep", leads: 170, conversions: 36, revenue: 18500 },
];

const channelData = [
  { name: "Email", value: 32 },
  { name: "Social", value: 27 },
  { name: "Organic", value: 18 },
  { name: "Referral", value: 14 },
  { name: "Direct", value: 9 },
];

const campaignPerformanceData = [
  { name: "Summer Promo", leads: 75, conversions: 18, roi: 320 },
  { name: "Product Launch", leads: 120, conversions: 32, roi: 480 },
  { name: "Q3 Newsletter", leads: 45, conversions: 8, roi: 180 },
  { name: "Social Contest", leads: 95, conversions: 22, roi: 350 },
  { name: "Referral Program", leads: 65, conversions: 14, roi: 290 },
];

const MarketingAnalytics = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Analyze marketing performance and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
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
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12.5%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>0.8%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Lead</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28.50</div>
            <div className="flex items-center pt-1 text-xs text-red-500">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>2.3%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">315%</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>18%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Marketing Performance"
          icon={<LineChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Leads</Button>
              <Button variant="outline" size="sm">Conversions</Button>
              <Button variant="outline" size="sm">Revenue</Button>
            </div>
            <Select defaultValue="3m">
              <SelectTrigger className="h-8 w-[110px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AnalyticsChart 
            data={performanceData} 
            height={250}
            defaultType="line"
          />
        </DashboardCard>

        <DashboardCard
          title="Lead Sources"
          icon={<PieChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={channelData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Campaign Performance"
        icon={<BarChart3 className="h-5 w-5" />}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Metrics
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="completed">Completed Only</SelectItem>
              <SelectItem value="email">Email Campaigns</SelectItem>
              <SelectItem value="social">Social Campaigns</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AnalyticsChart 
          data={campaignPerformanceData} 
          height={300}
          defaultType="bar"
        />
      </DashboardCard>
    </div>
  );
};

export default MarketingAnalytics;
