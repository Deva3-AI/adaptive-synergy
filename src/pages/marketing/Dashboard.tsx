
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart, LineChart, TrendingUp, Users, Mail, Calendar } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const monthlyOutreachData = [
  { name: "Jan", emails: 120, calls: 45, meetings: 15 },
  { name: "Feb", emails: 145, calls: 53, meetings: 18 },
  { name: "Mar", emails: 132, calls: 48, meetings: 14 },
  { name: "Apr", emails: 165, calls: 58, meetings: 22 },
  { name: "May", emails: 178, calls: 65, meetings: 24 },
  { name: "Jun", emails: 150, calls: 55, meetings: 20 },
  { name: "Jul", emails: 187, calls: 68, meetings: 25 },
  { name: "Aug", emails: 192, calls: 72, meetings: 28 },
  { name: "Sep", emails: 170, calls: 62, meetings: 23 },
];

const conversionRateData = [
  { name: "Initial Contact", value: 100 },
  { name: "Follow-up", value: 68 },
  { name: "Proposal", value: 42 },
  { name: "Closing", value: 28 },
  { name: "Retention", value: 22 },
];

const MarketingDashboard = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor campaigns, leads, and marketing performance
          </p>
        </div>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">392</div>
            <p className="text-xs text-muted-foreground">68% open rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Next: Tomorrow at 10 AM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Monthly Outreach Activities"
          icon={<LineChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={monthlyOutreachData} 
            height={250}
            defaultType="line"
          />
        </DashboardCard>

        <DashboardCard
          title="Conversion Funnel"
          icon={<PieChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={conversionRateData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>
      </div>
    </div>
  );
};

export default MarketingDashboard;
