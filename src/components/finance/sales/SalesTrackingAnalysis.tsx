
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, CheckSquare, Calendar, TrendingUp, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";

interface SalesTrackingAnalysisProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

const SalesTrackingAnalysis = ({ dateRange }: SalesTrackingAnalysisProps) => {
  // Fetch sales trend data
  const { data: salesTrends, isLoading: isTrendsLoading } = useQuery({
    queryKey: ["sales-trends", dateRange],
    queryFn: () => financeService.getSalesTrends(),
  });

  // Fetch sales by channel data
  const { data: salesByChannel, isLoading: isChannelLoading } = useQuery({
    queryKey: ["sales-by-channel", dateRange],
    queryFn: () => financeService.getSalesByChannel(),
  });

  // Fetch top products/services data
  const { data: topProducts, isLoading: isProductsLoading } = useQuery({
    queryKey: ["top-products", dateRange],
    queryFn: () => financeService.getTopProducts(),
  });

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Ensure we have arrays for charts
  const trendsData = Array.isArray(salesTrends) ? salesTrends : [];
  const channelData = Array.isArray(salesByChannel) ? salesByChannel : [];
  const productData = Array.isArray(topProducts) ? topProducts : [];
  
  // Safely get insights and activities from salesTrends
  const insights = salesTrends && typeof salesTrends === 'object' && 'insights' in salesTrends 
    ? salesTrends.insights as string[] 
    : [];
    
  const activities = salesTrends && typeof salesTrends === 'object' && 'activities' in salesTrends 
    ? salesTrends.activities as any[] 
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Sales Trend"
          icon={<LineChart className="h-5 w-5" />}
          badgeText={dateRange}
          badgeVariant="outline"
          className="lg:col-span-2"
        >
          {isTrendsLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <AnalyticsChart 
              data={trendsData} 
              height={300}
              defaultType="line"
            />
          )}
        </DashboardCard>

        <DashboardCard
          title="Sales by Channel"
          icon={<BarChart className="h-5 w-5" />}
          badgeText={dateRange}
          badgeVariant="outline"
        >
          {isChannelLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <AnalyticsChart 
              data={channelData} 
              height={300}
              defaultType="pie"
            />
          )}
        </DashboardCard>
      </div>

      <DashboardCard
        title="Top Products/Services"
        icon={<TrendingUp className="h-5 w-5" />}
        badgeText={dateRange}
        badgeVariant="outline"
      >
        {isProductsLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product/Service</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Units</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell>{product.units}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end ${product.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.growth >= 0 ? 
                        <TrendingUp className="h-4 w-4 mr-1" /> : 
                        <Activity className="h-4 w-4 mr-1" />}
                      <span>{product.growth}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DashboardCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Sales Summary Insights"
          icon={<CheckSquare className="h-5 w-5" />}
          badgeText="AI Generated"
          badgeVariant="outline"
        >
          {isTrendsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Based on your sales data, here are key insights:</p>
              <ul className="space-y-2">
                {insights.map((insight: string, index: number) => (
                  <li key={index} className="text-sm flex items-start">
                    <CheckSquare className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          title="Upcoming Sales Activities"
          icon={<Calendar className="h-5 w-5" />}
          badgeText="Next 7 Days"
          badgeVariant="outline"
        >
          {isTrendsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{activity.date} · {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default SalesTrackingAnalysis;
