
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Mail, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  ChevronRight, 
  BarChart, 
  LineChart,
  PieChart,
  BriefcaseBusiness
} from "lucide-react";
import { toast } from "sonner";
import { marketingService } from "@/services/api";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import MarketingEmailOutreach from "@/components/marketing/MarketingEmailOutreach";
import MarketingMeetings from "@/components/marketing/MarketingMeetings";
import MarketingLeads from "@/components/marketing/MarketingLeads";
import MarketingTrends from "@/components/marketing/MarketingTrends";
import MarketingPlans from "@/components/marketing/MarketingPlans";

const MarketingDashboard = () => {
  const [metricsTimeframe, setMetricsTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  const { data: emailOutreach, isLoading: isLoadingEmails } = useQuery({
    queryKey: ['marketing', 'email-outreach'],
    queryFn: () => marketingService.getEmailOutreach(),
  });
  
  const { data: meetings, isLoading: isLoadingMeetings } = useQuery({
    queryKey: ['marketing', 'meetings'],
    queryFn: () => marketingService.getMeetings(),
  });
  
  const { data: leads, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['marketing', 'leads'],
    queryFn: () => marketingService.getLeads(),
  });
  
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['marketing', 'metrics', metricsTimeframe],
    queryFn: () => marketingService.getMarketingMetrics(metricsTimeframe),
  });
  
  // Generate summary metrics from the data
  const summaryMetrics = {
    totalEmails: emailOutreach?.length || 0,
    openRate: metrics?.emailOpenRate || 0,
    responseRate: metrics?.emailResponseRate || 0,
    upcomingMeetings: meetings?.filter((m: any) => 
      m.status === 'scheduled' && new Date(m.scheduledTime) > new Date()
    ).length || 0,
    activeLeads: leads?.filter((l: any) => 
      ['contacted', 'meeting_scheduled', 'proposal_sent'].includes(l.status)
    ).length || 0,
    leadConversionRate: metrics?.meetingConversionRate || 0
  };
  
  // Prepare chart data for email metrics
  const emailMetricsData = [
    { name: 'Mon', sent: 12, opened: 8, replied: 3 },
    { name: 'Tue', sent: 18, opened: 11, replied: 5 },
    { name: 'Wed', sent: 15, opened: 9, replied: 4 },
    { name: 'Thu', sent: 22, opened: 14, replied: 7 },
    { name: 'Fri', sent: 20, opened: 12, replied: 6 },
    { name: 'Sat', sent: 5, opened: 3, replied: 1 },
    { name: 'Sun', sent: 3, opened: 2, replied: 0 },
  ];
  
  // Prepare chart data for lead sources
  const leadSourcesData = [
    { name: 'BNI', value: 32 },
    { name: 'Master Networks', value: 28 },
    { name: 'Website', value: 15 },
    { name: 'Referrals', value: 18 },
    { name: 'Other', value: 7 },
  ];
  
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Dashboard</h1>
          <p className="text-muted-foreground">
            Track outreach, meetings, and marketing performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            New Email
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Outreach</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.totalEmails}</div>
            <p className="text-xs text-muted-foreground">{Math.round(summaryMetrics.responseRate * 100)}% response rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground">Next: {meetings && meetings.length > 0 ? format(new Date(meetings[0].scheduledTime), 'MMM dd, h:mm a') : 'None scheduled'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.activeLeads}</div>
            <p className="text-xs text-muted-foreground">{leads?.length || 0} total leads in database</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(summaryMetrics.leadConversionRate * 100)}%</div>
            <p className="text-xs text-muted-foreground">From meetings to clients</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Weekly Email Performance"
          icon={<LineChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={emailMetricsData} 
            height={250}
            defaultType="line"
            options={{
              lineKeys: ['sent', 'opened', 'replied'],
              lineColors: ['#2563eb', '#10b981', '#f59e0b']
            }}
          />
        </DashboardCard>

        <DashboardCard
          title="Lead Sources"
          icon={<PieChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={leadSourcesData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>
      </div>
      
      <Tabs defaultValue="outreach" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="outreach">Email Outreach</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="leads">Lead Management</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
          <TabsTrigger value="plans">Marketing Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="outreach">
          <MarketingEmailOutreach />
        </TabsContent>
        
        <TabsContent value="meetings">
          <MarketingMeetings />
        </TabsContent>
        
        <TabsContent value="leads">
          <MarketingLeads />
        </TabsContent>
        
        <TabsContent value="trends">
          <MarketingTrends />
        </TabsContent>
        
        <TabsContent value="plans">
          <MarketingPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingDashboard;
