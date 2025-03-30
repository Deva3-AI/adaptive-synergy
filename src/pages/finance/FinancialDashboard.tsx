import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, DollarSign, CalendarClock, Clock, Users, AlertTriangle, TrendingUp } from "lucide-react";
import FinancialInsightsCard from "@/components/ai/FinancialInsightsCard";
import SalesDashboard from "@/components/finance/SalesDashboard";
import InvoicesDashboard from "@/components/finance/InvoicesDashboard";
import ExpensesDashboard from "@/components/finance/ExpensesDashboard";
import TeamCostsAnalysis from "@/components/finance/TeamCostsAnalysis";
import FinancialMetricsCard from "@/components/finance/FinancialMetricsCard";
import { Link } from "react-router-dom";

const FinanceDashboard = () => {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['financial-overview'],
    queryFn: financeService.getFinancialOverview
  });

  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['financial-metrics', timeframe],
    queryFn: () => financeService.getFinancialMetrics(timeframe)
  });

  const { data: financialRecords, isLoading: isRecordsLoading } = useQuery({
    queryKey: ['financial-records'],
    queryFn: () => financeService.getFinancialRecords()
  });

  const { data: upsellOpportunities, isLoading: isUpsellLoading } = useQuery({
    queryKey: ['upsell-opportunities'],
    queryFn: financeService.getUpsellOpportunities
  });

  // Type safe handling of financial overview data
  const formatFinancialOverview = (data: any) => {
    return {
      monthly_revenue: data?.monthly_revenue || 0,
      growth_rate: data?.growth_rate || 0,
      expenses: data?.expenses || 0,
      profit: data?.profit || 0
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor financial performance, track revenue, and analyze sales data
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={timeframe === 'month' ? 'default' : 'outline'} 
            onClick={() => setTimeframe('month')}
          >
            Monthly
          </Button>
          <Button 
            variant={timeframe === 'quarter' ? 'default' : 'outline'} 
            onClick={() => setTimeframe('quarter')}
          >
            Quarterly
          </Button>
          <Button 
            variant={timeframe === 'year' ? 'default' : 'outline'} 
            onClick={() => setTimeframe('year')}
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isOverviewLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  ${formatFinancialOverview(overview).monthly_revenue.toLocaleString()}
                </div>
                <div className={`flex items-center text-xs ${overview?.growth_rate > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {overview?.growth_rate > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(formatFinancialOverview(overview).growth_rate)}%
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {metrics?.summary?.profit_margin.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Target: 40%
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  ${metrics?.invoices?.pending_invoices.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3 mr-1" />
                  Due soon
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {metrics?.invoices?.collection_rate.toFixed(1)}%
                </div>
                <div className={`flex items-center text-xs ${metrics?.invoices?.collection_rate > 85 ? 'text-green-500' : 'text-amber-500'}`}>
                  {metrics?.invoices?.collection_rate > 85 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {metrics?.invoices?.collection_rate > 85 ? 'Good' : 'Needs attention'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Tabs defaultValue="sales">
            <TabsList>
              <TabsTrigger value="sales">Sales Dashboard</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="team-costs">Team Costs</TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="pt-4">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-muted-foreground">Overview of recent sales performance</p>
                <Button asChild>
                  <Link to="/app/finance/sales">View Full Sales Dashboard</Link>
                </Button>
              </div>
              <SalesDashboard />
            </TabsContent>
            <TabsContent value="invoices" className="pt-4">
              <InvoicesDashboard />
            </TabsContent>
            <TabsContent value="expenses" className="pt-4">
              <ExpensesDashboard />
            </TabsContent>
            <TabsContent value="team-costs" className="pt-4">
              <TeamCostsAnalysis period="month" />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <FinancialMetricsCard metrics={metrics} isLoading={isMetricsLoading} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upsell Opportunities</CardTitle>
              <CardDescription>
                Potential additional services for existing clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isUpsellLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              ) : (
                <div className="space-y-4">
                  {(upsellOpportunities && Array.isArray(upsellOpportunities) ? 
                    upsellOpportunities.slice(0, 3) : 
                    []).map((opportunity: any, index: number) => (
                    <div key={opportunity.client_id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{opportunity.client_name}</span>
                        <span className="text-sm text-muted-foreground">
                          ${opportunity.potential_value.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Currently using: {opportunity.current_services.join(", ")}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-1.5 py-0.5 bg-primary/10 rounded-full">
                          {opportunity.suggested_services[0]}
                        </span>
                        {opportunity.suggested_services.length > 1 && (
                          <span className="text-xs px-1.5 py-0.5 bg-primary/10 rounded-full">
                            {opportunity.suggested_services[1]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View all opportunities
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <FinancialInsightsCard 
        financialRecords={financialRecords || []} 
        isLoading={isRecordsLoading} 
      />
    </div>
  );
};

export default FinanceDashboard;
