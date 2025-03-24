
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { financeService } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  LineChart,
  TrendingUp,
  Users,
} from "lucide-react";
import SalesTrackingAnalysis from "@/components/finance/sales/SalesTrackingAnalysis";
import SalesGrowthTracking from "@/components/finance/sales/SalesGrowthTracking";
import SalesFollowUp from "@/components/finance/sales/SalesFollowUp";
import SalesReports from "@/components/finance/sales/SalesReports";
import DashboardCard from "@/components/dashboard/DashboardCard";

const SalesDashboard = () => {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const [activeTab, setActiveTab] = useState("tracking");

  // Fetch sales metrics data
  const { data: salesMetrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ["sales-metrics", dateRange],
    queryFn: () => financeService.getSalesMetrics(dateRange),
  });

  // Calculate date range for display
  const getDateRangeLabel = () => {
    const today = new Date();
    switch (dateRange) {
      case "week":
        return `${format(subDays(today, 7), "MMM d")} - ${format(today, "MMM d, yyyy")}`;
      case "month":
        return format(today, "MMMM yyyy");
      case "quarter":
        const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
        const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1);
        const quarterEnd = new Date(today.getFullYear(), quarterStartMonth + 3, 0);
        return `${format(quarterStart, "MMM d")} - ${format(quarterEnd, "MMM d, yyyy")}`;
      case "year":
        return format(today, "yyyy");
      default:
        return format(today, "MMMM yyyy");
    }
  };

  // Handle report export
  const handleExportReport = () => {
    toast.success("Sales report has been exported");
    // In a real implementation, this would trigger the download of a PDF or Excel file
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Track sales performance, monitor growth, and analyze trends
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={dateRange === "week" ? "default" : "outline"}
            onClick={() => setDateRange("week")}
            size="sm"
          >
            Weekly
          </Button>
          <Button
            variant={dateRange === "month" ? "default" : "outline"}
            onClick={() => setDateRange("month")}
            size="sm"
          >
            Monthly
          </Button>
          <Button
            variant={dateRange === "quarter" ? "default" : "outline"}
            onClick={() => setDateRange("quarter")}
            size="sm"
          >
            Quarterly
          </Button>
          <Button
            variant={dateRange === "year" ? "default" : "outline"}
            onClick={() => setDateRange("year")}
            size="sm"
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Sales Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  ${salesMetrics?.totalSales.toLocaleString() || "0"}
                </div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>{salesMetrics?.salesGrowth || 0}%</span>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">{getDateRangeLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {salesMetrics?.newCustomers || 0}
                </div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>{salesMetrics?.customerGrowth || 0}%</span>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">{getDateRangeLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {salesMetrics?.conversionRate || 0}%
                </div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+{salesMetrics?.conversionGrowth || 0}%</span>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Leads to customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  ${salesMetrics?.averageSale.toLocaleString() || "0"}
                </div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>{salesMetrics?.averageSaleGrowth || 0}%</span>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="tracking">Sales Tracking</TabsTrigger>
            <TabsTrigger value="growth">Growth Analytics</TabsTrigger>
            <TabsTrigger value="followup">Follow-ups</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="pt-4">
            <SalesTrackingAnalysis dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="growth" className="pt-4">
            <SalesGrowthTracking dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="followup" className="pt-4">
            <SalesFollowUp />
          </TabsContent>

          <TabsContent value="reports" className="pt-4">
            <div className="flex justify-end mb-4">
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
            <SalesReports dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SalesDashboard;
