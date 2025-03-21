
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart, TrendingUp, Calendar, Filter, Download, Brain } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import AIInsightCard from "@/components/ai/AIInsightCard";
import { generateMarketingInsights } from "@/utils/aiUtils";
import { toast } from "sonner";

// Sample data for charts
const campaignPerformanceData = [
  { name: "Jan", impressions: 12500, clicks: 3200, conversions: 980 },
  { name: "Feb", impressions: 14800, clicks: 3900, conversions: 1100 },
  { name: "Mar", impressions: 13200, clicks: 3500, conversions: 950 },
  { name: "Apr", impressions: 15600, clicks: 4100, conversions: 1250 },
  { name: "May", impressions: 17900, clicks: 4800, conversions: 1450 },
  { name: "Jun", impressions: 16700, clicks: 4400, conversions: 1350 },
];

const channelBreakdownData = [
  { name: "Organic Search", value: 42 },
  { name: "Social Media", value: 28 },
  { name: "Email", value: 15 },
  { name: "Paid Search", value: 10 },
  { name: "Direct", value: 5 },
];

const MarketingAnalytics = () => {
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  const generateInsights = async () => {
    setIsLoadingInsights(true);
    try {
      // Create sample campaign data object
      const campaignData = {
        performance: campaignPerformanceData,
        channels: channelBreakdownData,
        conversionRate: 5.8,
        monthlyGrowth: 12.3,
        topPerformingChannel: "Organic Search"
      };
      
      const results = await generateMarketingInsights(campaignData, "B2B Technology");
      setInsights(results);
      toast.success("Marketing insights generated successfully");
    } catch (error) {
      console.error("Error generating marketing insights:", error);
      toast.error("Failed to generate marketing insights");
    } finally {
      setIsLoadingInsights(false);
    }
  };

  React.useEffect(() => {
    // Generate insights automatically when component mounts
    if (!insights) {
      generateInsights();
    }
  }, []);

  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Analytics</h1>
          <p className="text-muted-foreground">
            Track performance and gain AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 6 Months
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125.7k</div>
            <p className="text-xs text-green-500">+18.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.4k</div>
            <p className="text-xs text-green-500">+9.7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.8k</div>
            <p className="text-xs text-green-500">+12.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Campaign Performance"
          icon={<LineChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={campaignPerformanceData} 
            height={300}
            defaultType="line"
          />
        </DashboardCard>

        <DashboardCard
          title="Channel Breakdown"
          icon={<PieChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={channelBreakdownData} 
            height={300}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoadingInsights || !insights ? (
          <AIInsightCard
            title="AI Marketing Insights"
            insights={["Analyzing marketing data to generate insights..."]}
            icon={<Brain className="h-4 w-4" />}
            isLoading={isLoadingInsights}
            className="md:col-span-2"
          />
        ) : (
          <>
            <AIInsightCard
              title="Performance Analysis"
              insights={
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Strengths:</h4>
                    <ul className="space-y-1 list-disc pl-5">
                      {insights.performance_analysis.strengths.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Weaknesses:</h4>
                    <ul className="space-y-1 list-disc pl-5">
                      {insights.performance_analysis.weaknesses.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              }
              type="info"
            />
            
            <AIInsightCard
              title="Trend Identification"
              insights={insights.trend_identification}
              type="warning"
            />
            
            <AIInsightCard
              title="Optimization Suggestions"
              insights={insights.optimization_suggestions.map((item: any) => `${item.area}: ${item.suggestion}`)}
              type="success"
              className="md:col-span-2"
              footer={
                <div className="pt-4 w-full flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateInsights}
                    disabled={isLoadingInsights}
                  >
                    <Brain className="h-3.5 w-3.5 mr-1.5" />
                    Refresh Insights
                  </Button>
                </div>
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MarketingAnalytics;
