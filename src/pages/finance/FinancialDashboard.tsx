
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { ArrowDown, ArrowUp, CreditCard, DollarSign, Users, FileText, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TeamCostsAnalysis from '@/components/finance/TeamCostsAnalysis';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const FinancialDashboard = () => {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    handleDateChange(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    handleDateChange(subMonths(selectedDate, -1));
  };

  // Overview data
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['financial-overview'],
    queryFn: () => financeService.getFinancialOverview()
  });

  // Financial metrics
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['financial-metrics', period],
    queryFn: () => financeService.getFinancialMetrics(period)
  });

  // Financial records
  const { data: financialRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['financial-records', period],
    queryFn: () => financeService.getFinancialRecords(undefined, startDate, endDate)
  });

  // Upsell opportunities
  const { data: upsellOpportunities, isLoading: upsellLoading } = useQuery({
    queryKey: ['upsell-opportunities'],
    queryFn: () => financeService.getUpsellOpportunities()
  });

  // Add type assertions for growth_rate
  const getGrowthIndicator = (value: number) => {
    if (value > 0) {
      return <span className="text-green-500">&#9650;</span>;
    } else if (value < 0) {
      return <span className="text-red-500">&#9660;</span>;
    } else {
      return <span>&#8212;</span>;
    }
  };

  const renderMetricCard = (title: string, value: string | number, change: number) => {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {typeof change === 'number' && (
            <p className={`text-xs flex items-center mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {getGrowthIndicator(change)}
              {Math.abs(change)}% from last {period}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  // Cast growth_rate to handle the type safety
  const renderMetricsSection = () => {
    if (metricsLoading) {
      return <div>Loading metrics...</div>;
    }

    if (!metricsData) {
      return <div>No metrics data available</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(metricsData).map(([key, metric]: [string, any]) => {
          // Safely cast the growth_rate
          const growthRate = typeof metric.growth_rate === 'number' ? metric.growth_rate : 0;
          
          return renderMetricCard(
            metric.label || key,
            metric.formatted_value || metric.value || 0,
            growthRate
          );
        })}
      </div>
    );
  };

  const renderFinancialRecords = () => {
    if (recordsLoading) {
      return <div>Loading financial records...</div>;
    }

    if (!financialRecords) {
      return <div>No financial records available</div>;
    }

    return (
      <ul>
        {financialRecords.map((record) => (
          <li key={record.id}>
            {record.description} - {record.amount}
          </li>
        ))}
      </ul>
    );
  };

  const renderUpsellOpportunities = () => {
    if (upsellLoading) {
      return <div>Loading upsell opportunities...</div>;
    }

    if (!upsellOpportunities) {
      return <div>No upsell opportunities available</div>;
    }

    return (
      <ul>
        {upsellOpportunities.map((opportunity) => (
          <li key={opportunity.clientId}>
            {opportunity.clientName} - ${opportunity.potentialRevenue.toLocaleString()}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Financial Dashboard</h1>
        <div className="flex items-center">
          <Button size="sm" onClick={handlePrevMonth}>
            Previous
          </Button>
          <span className="mx-2">{format(selectedDate, 'MMMM yyyy')}</span>
          <Button size="sm" onClick={handleNextMonth}>
            Next
          </Button>
        </div>
      </div>

      {renderMetricsSection()}
      
      {/* Add TeamCostsAnalysis with required period prop */}
      <div className="mt-6">
        <TeamCostsAnalysis period={period} />
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Upsell Opportunities</CardTitle>
            <CardDescription>Potential revenue from existing clients</CardDescription>
          </CardHeader>
          <CardContent>
            {renderUpsellOpportunities()}
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Recent Financial Activities</CardTitle>
            <CardDescription>Latest transactions and financial events</CardDescription>
          </CardHeader>
          <CardContent>
            {renderFinancialRecords()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
