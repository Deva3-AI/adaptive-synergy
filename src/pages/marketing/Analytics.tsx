
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BarChart, LineChart, PieChart, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const channelPerformanceData = [
  { name: "Email", value: 42 },
  { name: "Social", value: 28 },
  { name: "Search", value: 15 },
  { name: "Direct", value: 10 },
  { name: "Referral", value: 5 },
];

const conversionTrendsData = [
  { name: "Jan", leads: 230, conversions: 45 },
  { name: "Feb", leads: 245, conversions: 52 },
  { name: "Mar", leads: 278, conversions: 58 },
  { name: "Apr", leads: 290, conversions: 63 },
  { name: "May", leads: 330, conversions: 72 },
  { name: "Jun", leads: 390, conversions: 88 },
  { name: "Jul", leads: 420, conversions: 98 },
  { name: "Aug", leads: 450, conversions: 108 },
  { name: "Sep", leads: 470, conversions: 115 },
];

const campaignRoiData = [
  { name: "Product Launch", roi: 320 },
  { name: "Email Drip", roi: 240 },
  { name: "Social Ads", roi: 180 },
  { name: "Content Series", roi: 290 },
  { name: "Partner Promo", roi: 140 },
];

const MarketingAnalytics = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Analytics</h1>
          <p className="text-muted-foreground">
            Analyze campaign performance and marketing trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 90 Days
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
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
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.8%</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              4.2% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Lead</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28.50</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              $3.25 from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245%</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              18% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Lead Conversion Trends"
          icon={<LineChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={conversionTrendsData} 
            height={300}
            defaultType="line"
          />
        </DashboardCard>

        <DashboardCard
          title="Traffic Sources"
          icon={<PieChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={channelPerformanceData} 
            height={300}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Campaign ROI"
        icon={<BarChart className="h-5 w-5" />}
      >
        <AnalyticsChart 
          data={campaignRoiData} 
          height={300}
          defaultType="bar"
        />
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Key Metrics"
          icon={<TrendingUp className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {[
              { name: "Click-Through Rate", value: "5.8%", change: "+0.7%", trend: "up" },
              { name: "Email Open Rate", value: "32.1%", change: "+2.3%", trend: "up" },
              { name: "Social Engagement", value: "12.4%", change: "+0.9%", trend: "up" },
              { name: "Bounce Rate", value: "38.6%", change: "-2.1%", trend: "down" },
              { name: "Average Session Duration", value: "2m 45s", change: "+15s", trend: "up" }
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.name}</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{metric.value}</span>
                  <span className={`text-xs flex items-center ${
                    metric.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}>
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Top Performing Content"
          icon={<BarChart className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {[
              { title: "10 Ways to Boost Your Marketing ROI", type: "Blog Post", views: 4280, conversion: 3.8 },
              { title: "Ultimate Guide to Digital Marketing", type: "Whitepaper", views: 3150, conversion: 5.2 },
              { title: "Marketing Automation Introduction", type: "Webinar", views: 2870, conversion: 6.5 },
              { title: "Social Media Strategy for 2023", type: "Video", views: 2540, conversion: 4.1 },
              { title: "Email Marketing Best Practices", type: "Ebook", views: 2210, conversion: 4.7 }
            ].map((content, index) => (
              <div key={index} className="border border-border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{content.title}</h3>
                    <span className="text-xs text-muted-foreground">{content.type}</span>
                  </div>
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                    {content.conversion}% conversion
                  </span>
                </div>
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <span>{content.views.toLocaleString()} views</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default MarketingAnalytics;
