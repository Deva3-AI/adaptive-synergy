
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BarChart, Target, Calendar, Mail, Users, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const campaignPerformanceData = [
  { name: "Jan", impressions: 12500, clicks: 3200, conversions: 980 },
  { name: "Feb", impressions: 14800, clicks: 3900, conversions: 1100 },
  { name: "Mar", impressions: 13200, clicks: 3500, conversions: 950 },
  { name: "Apr", impressions: 15600, clicks: 4100, conversions: 1250 },
  { name: "May", impressions: 17900, clicks: 4800, conversions: 1450 },
  { name: "Jun", impressions: 16700, clicks: 4400, conversions: 1350 },
];

const MarketingCampaigns = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage all your marketing campaigns
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">4 ending this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65.2k</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.8%</div>
            <div className="mt-1">
              <Progress value={58} className="h-1.5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+0.6% from last month</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCard
        title="Campaign Performance"
        icon={<BarChart className="h-5 w-5" />}
      >
        <AnalyticsChart 
          data={campaignPerformanceData} 
          height={300}
          defaultType="bar"
        />
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Active Campaigns"
          icon={<Mail className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {[
              {
                name: "Summer Product Launch",
                type: "Email Campaign",
                status: "active",
                progress: 68,
                date: "Ends in 12 days"
              },
              {
                name: "Q3 Engagement Drive",
                type: "Social Media",
                status: "active",
                progress: 42,
                date: "Ends in 23 days"
              },
              {
                name: "Customer Feedback Survey",
                type: "Email Campaign",
                status: "active",
                progress: 84,
                date: "Ends in 5 days"
              },
              {
                name: "Feature Announcement",
                type: "Multi-channel",
                status: "active",
                progress: 33,
                date: "Ends in 28 days"
              }
            ].map((campaign, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-4 flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center`}>
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{campaign.type}</p>
                    <p className="text-xs font-medium">{campaign.date}</p>
                  </div>
                  <Progress value={campaign.progress} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Upcoming Campaigns"
          icon={<Calendar className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {[
              {
                name: "Holiday Sale Campaign",
                type: "Multi-channel",
                date: "Starts in 14 days",
                status: "draft"
              },
              {
                name: "Product Webinar Series",
                type: "Email + Webinar",
                date: "Starts in 7 days",
                status: "planning"
              },
              {
                name: "Customer Testimonials",
                type: "Social Media",
                date: "Starts in 21 days",
                status: "draft"
              }
            ].map((campaign, index) => (
              <div key={index} className="flex items-center p-3 border border-border rounded-lg">
                <div className="mr-4 flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center`}>
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{campaign.type}</p>
                    <p className="text-xs font-medium">{campaign.date}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Schedule New Campaign
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default MarketingCampaigns;
