import React from "react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart3, Target, ArrowUpRight, TrendingUp, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";

interface SalesGrowthTrackingProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

const SalesGrowthTracking = ({ dateRange }: SalesGrowthTrackingProps) => {
  // Fetch sales growth data
  const { data: salesGrowth, isLoading: isGrowthLoading } = useQuery({
    queryKey: ["sales-growth", dateRange],
    queryFn: () => financeService.getSalesGrowthData(),
  });

  // Fetch targets data
  const { data: salesTargets, isLoading: isTargetsLoading } = useQuery({
    queryKey: ["sales-targets", dateRange],
    queryFn: () => financeService.getSalesTargets(),
  });

  // Fetch growth forecast
  const { data: growthForecast, isLoading: isForecastLoading } = useQuery({
    queryKey: ["growth-forecast", dateRange],
    queryFn: () => financeService.getGrowthForecast(),
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Sales Growth Trends"
          icon={<LineChart className="h-5 w-5" />}
          badgeText={dateRange}
          badgeVariant="outline"
        >
          {isGrowthLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <AnalyticsChart 
              data={salesGrowth?.trends || []} 
              height={300}
              defaultType="line"
            />
          )}
        </DashboardCard>

        <DashboardCard
          title="Sales vs. Targets"
          icon={<Target className="h-5 w-5" />}
          badgeText={dateRange}
          badgeVariant="outline"
        >
          {isTargetsLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              {(salesTargets || []).map((target: any) => (
                <div key={target.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{target.category}</span>
                        {target.percentage >= 100 ? (
                          <Badge variant="success" className="ml-2">Achieved</Badge>
                        ) : target.percentage >= 80 ? (
                          <Badge variant="warning" className="ml-2">On Track</Badge>
                        ) : (
                          <Badge variant="destructive" className="ml-2">Behind</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        ${target.current.toLocaleString()} of ${target.target.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xl font-semibold">
                      {target.percentage}%
                    </div>
                  </div>
                  <Progress value={target.percentage} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Current Period Growth"
          icon={<TrendingUp className="h-5 w-5" />}
          badgeText="vs. Previous"
          badgeVariant="outline"
        >
          {isGrowthLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Revenue Growth</p>
                  <p className="text-2xl font-bold">
                    {salesGrowth?.currentPeriod?.revenueGrowth || 0}%
                  </p>
                  <div className="flex items-center text-xs text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>vs previous {dateRange}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Customer Growth</p>
                  <p className="text-2xl font-bold">
                    {salesGrowth?.currentPeriod?.customerGrowth || 0}%
                  </p>
                  <div className="flex items-center text-xs text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>New acquisition</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Growth Drivers</p>
                <div className="space-y-3">
                  {(salesGrowth?.growthDrivers || []).map((driver: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${driver.performance === 'positive' ? 'bg-green-500' : driver.performance === 'neutral' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm">{driver.factor}</span>
                      </div>
                      <span className="text-sm font-medium">{driver.impact}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          title="Growth Forecast"
          icon={<BarChart3 className="h-5 w-5" />}
          badgeText="Next Period"
          badgeVariant="outline"
          className="lg:col-span-2"
        >
          {isForecastLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <AnalyticsChart 
                data={growthForecast?.chart || []} 
                height={200}
                defaultType="bar"
              />
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Forecast Insights</p>
                <ul className="space-y-2">
                  {(growthForecast?.insights || []).map((insight: any, index: number) => (
                    <li key={index} className="text-sm flex items-start">
                      {insight.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      )}
                      <span>{insight.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default SalesGrowthTracking;
