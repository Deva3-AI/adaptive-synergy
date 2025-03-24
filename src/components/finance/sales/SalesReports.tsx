
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileText, BarChart, BarChart3, TrendingUp, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface SalesReportsProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

const SalesReports = ({ dateRange }: SalesReportsProps) => {
  const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
  
  // Fetch weekly reports data
  const { data: weeklyReports, isLoading: isWeeklyLoading } = useQuery({
    queryKey: ["weekly-reports"],
    queryFn: () => financeService.getWeeklyReports(),
  });
  
  // Fetch monthly reports data
  const { data: monthlyReports, isLoading: isMonthlyLoading } = useQuery({
    queryKey: ["monthly-reports"],
    queryFn: () => financeService.getMonthlyReports(),
  });

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle report download
  const handleDownloadReport = (reportId: number) => {
    toast.success("Report downloaded successfully");
    // In a real implementation, this would trigger the download of a PDF or Excel file
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" onValueChange={(value) => setReportType(value as "weekly" | "monthly")}>
        <TabsList>
          <TabsTrigger value="weekly">Weekly Reports</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="pt-4">
          {isWeeklyLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <div className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(weeklyReports || []).map((report: any) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          {report.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {report.period}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(report.sales)}</TableCell>
                      <TableCell>{formatCurrency(report.target)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={report.progress} className="h-2 w-24" />
                          <span className="text-sm">{report.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {weeklyReports && weeklyReports.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DashboardCard
                    title="Weekly Performance"
                    icon={<BarChart3 className="h-5 w-5" />}
                    badgeText="Current Week"
                    badgeVariant="outline"
                  >
                    <AnalyticsChart 
                      data={weeklyReports[0].performanceData || []} 
                      height={300}
                      defaultType="bar"
                    />
                  </DashboardCard>
                  
                  <DashboardCard
                    title="Key Metrics"
                    icon={<TrendingUp className="h-5 w-5" />}
                    badgeText="Weekly Overview"
                    badgeVariant="outline"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">Conversion Rate</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="text-2xl font-bold">{weeklyReports[0].metrics.conversionRate}%</div>
                          <p className="text-xs text-muted-foreground">vs {weeklyReports[0].metrics.prevConversionRate}% last week</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">Avg. Sale Value</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="text-2xl font-bold">${weeklyReports[0].metrics.avgSaleValue}</div>
                          <p className="text-xs text-muted-foreground">vs ${weeklyReports[0].metrics.prevAvgSaleValue} last week</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">New Leads</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="text-2xl font-bold">{weeklyReports[0].metrics.newLeads}</div>
                          <p className="text-xs text-muted-foreground">vs {weeklyReports[0].metrics.prevNewLeads} last week</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">Closed Deals</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="text-2xl font-bold">{weeklyReports[0].metrics.closedDeals}</div>
                          <p className="text-xs text-muted-foreground">vs {weeklyReports[0].metrics.prevClosedDeals} last week</p>
                        </CardContent>
                      </Card>
                    </div>
                  </DashboardCard>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="monthly" className="pt-4">
          {isMonthlyLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <div className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(monthlyReports || []).map((report: any) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          {report.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {report.period}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(report.sales)}</TableCell>
                      <TableCell>{formatCurrency(report.target)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={report.progress} className="h-2 w-24" />
                          <span className="text-sm">{report.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {monthlyReports && monthlyReports.length > 0 && (
                <div>
                  <DashboardCard
                    title="Monthly Sales Performance"
                    icon={<BarChart className="h-5 w-5" />}
                    badgeText="12-Month View"
                    badgeVariant="outline"
                  >
                    <AnalyticsChart 
                      data={monthlyReports[0].yearlyTrend || []} 
                      height={300}
                      defaultType="bar"
                    />
                  </DashboardCard>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesReports;
