
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, LineChart, ArrowUpRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { SalesGrowthTrackingProps } from '@/types';

interface GrowthData {
  name: string;
  value: number;
  prevValue: number;
  percentChange: number;
}

interface SalesGrowthData {
  trends?: {
    name: string;
    value: number;
    prevValue?: number;
  }[];
  currentPeriod?: {
    revenue: number;
    prevRevenue: number;
    percentChange: number;
    target: number;
    percentToTarget: number;
  };
  growthDrivers?: {
    name: string;
    value: number;
    change: number;
  }[];
  chart?: any[];
  insights?: string[];
}

const SalesGrowthTracking: React.FC<SalesGrowthTrackingProps> = ({ period = 'month', dateRange }) => {
  // Fetch sales growth data
  const { data: salesGrowth, isLoading: isGrowthLoading } = useQuery({
    queryKey: ['sales-growth', period],
    queryFn: () => financeService.getSalesGrowthData(period),
  });

  const growthData = salesGrowth as SalesGrowthData || {};
  
  // Ensure we have arrays for charts
  const trendsData = growthData?.trends || [];
  const driversData = growthData?.growthDrivers || [];
  const chartData = growthData?.chart || [];
  const insights = growthData?.insights || [];
  const currentPeriod = growthData?.currentPeriod || {
    revenue: 0,
    prevRevenue: 0,
    percentChange: 0,
    target: 0,
    percentToTarget: 0
  };

  // Format as currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  };

  // Format percentage
  const formatPercent = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Sales Growth Trends"
          icon={<TrendingUp className="h-5 w-5" />}
          badgeText={`${period === 'month' ? 'Monthly' : period === 'quarter' ? 'Quarterly' : 'Yearly'}`}
          badgeVariant="outline"
        >
          {isGrowthLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : (
            <div className="h-[250px]">
              <AnalyticsChart 
                data={trendsData} 
                height={250}
                defaultType="line"
              />
            </div>
          )}
        </DashboardCard>
        
        <DashboardCard
          title="Current Period Performance"
          icon={<BarChart className="h-5 w-5" />}
          badgeText={`${period === 'month' ? 'Monthly' : period === 'quarter' ? 'Quarterly' : 'Yearly'}`}
          badgeVariant="outline"
        >
          {isGrowthLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Current Revenue</div>
                  <div className="flex items-center">
                    <span className={`text-xs font-medium ${currentPeriod.percentChange >= 0 ? 'text-green-500' : 'text-red-500'} mr-1`}>
                      {formatPercent(currentPeriod.percentChange)}
                    </span>
                    <span>vs previous {period}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(currentPeriod.revenue)}</div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Target Progress</div>
                  <div className="text-sm">{formatCurrency(currentPeriod.revenue)} / {formatCurrency(currentPeriod.target)}</div>
                </div>
                <Progress value={currentPeriod.percentToTarget} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {currentPeriod.percentToTarget}% of {period} target
                </div>
              </div>
            </div>
          )}
        </DashboardCard>
      </div>
      
      <DashboardCard
        title="Growth Drivers"
        icon={<TrendingUp className="h-5 w-5" />}
        badgeText={`${period === 'month' ? 'Monthly' : period === 'quarter' ? 'Quarterly' : 'Yearly'}`}
        badgeVariant="outline"
      >
        {isGrowthLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AnalyticsChart 
                data={chartData} 
                height={200}
                defaultType="bar"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Top Contributors to Growth</h4>
              <div className="space-y-4">
                {driversData.map((driver, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `hsl(${210 + idx * 30}, 70%, 55%)` }}></div>
                      <span className="text-sm">{driver.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{formatCurrency(driver.value)}</span>
                      <span className={`ml-2 text-xs ${driver.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {driver.change > 0 && '+'}{driver.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DashboardCard>
      
      <DashboardCard
        title="AI Growth Insights"
        icon={<LineChart className="h-5 w-5" />}
        badgeText="AI Generated"
        badgeVariant="outline"
      >
        {isGrowthLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <ul className="space-y-3">
            {Array.isArray(insights) && insights.map((insight, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        )}
      </DashboardCard>
    </div>
  );
};

export default SalesGrowthTracking;
