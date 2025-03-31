
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import SalesTrackingAnalysis from '@/components/finance/sales/SalesTrackingAnalysis';
import SalesGrowthTracking from '@/components/finance/sales/SalesGrowthTracking';
import SalesReports from '@/components/finance/sales/SalesReports';
import SalesFollowUp from '@/components/finance/sales/SalesFollowUp';
import { CalendarRange } from 'lucide-react';
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker"

const SalesDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Fetch metrics data
  const { data: metricsData, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['sales-metrics'],
    queryFn: () => financeService.getSalesMetrics(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Sales Dashboard</h2>
        <DateRangePicker date={dateRange} setDate={setDateRange} />
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Tracking & Analysis</TabsTrigger>
          <TabsTrigger value="growth">Growth Tracking</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="followup">Follow-Up & Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-4">
          <SalesTrackingAnalysis dateRange="month" />
        </TabsContent>
        
        <TabsContent value="growth" className="space-y-4">
          <SalesGrowthTracking period={period} />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <SalesReports dateRange="month" />
        </TabsContent>
        
        <TabsContent value="followup" className="space-y-4">
          <SalesFollowUp />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesDashboard;
