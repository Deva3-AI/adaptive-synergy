
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import { SalesData } from '@/utils/apiUtils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

const SalesDashboard = () => {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [chartType, setChartType] = useState<string>('line');
  
  // Get current date for filter defaults
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  
  // Default date range is current month
  const [dateRange, setDateRange] = useState({
    startDate: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`,
    endDate: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${new Date(currentYear, currentMonth, 0).getDate()}`
  });

  // Fetch sales data
  const { data: salesData, isLoading, error } = useQuery<SalesData>({
    queryKey: ['salesData', timeframe, dateRange],
    queryFn: () => financeService.getSalesMetrics(timeframe, dateRange.startDate, dateRange.endDate),
  });

  // Helper function to determine growth badge
  const getGrowthBadge = (growth: number) => {
    if (growth > 0) {
      return <Badge className="ml-2 bg-green-100 text-green-800">+{growth}%</Badge>;
    } else if (growth < 0) {
      return <Badge className="ml-2 bg-red-100 text-red-800">{growth}%</Badge>;
    }
    return <Badge className="ml-2 bg-gray-100 text-gray-800">0%</Badge>;
  };

  // Create dummy data for display when real data is not available
  const dummySalesData: SalesData = {
    monthly_revenue: 125000,
    annual_target: 1500000,
    growth_rate: 12.5,
    client_acquisition: 15,
    conversion_rate: 32,
    avg_deal_size: 8500,
    top_clients: [
      { client_id: 1, client_name: 'Acme Corp', revenue: 42000, growth: 15 },
      { client_id: 2, client_name: 'TechGiant Inc', revenue: 38000, growth: 8 },
      { client_id: 3, client_name: 'Innovate LLC', revenue: 26000, growth: 22 },
      { client_id: 4, client_name: 'Global Solutions', revenue: 19000, growth: -3 }
    ],
    monthly_trend: [
      { month: 'Jan', revenue: 98000, target: 100000 },
      { month: 'Feb', revenue: 105000, target: 100000 },
      { month: 'Mar', revenue: 112000, target: 110000 },
      { month: 'Apr', revenue: 118000, target: 110000 },
      { month: 'May', revenue: 125000, target: 120000 },
      { month: 'Jun', revenue: 132000, target: 120000 }
    ],
    sales_by_service: [
      { service: 'Consulting', value: 45 },
      { service: 'Development', value: 30 },
      { service: 'Maintenance', value: 15 },
      { service: 'Training', value: 10 }
    ]
  };

  // Use dummy data when loading or error occurs
  const displayData = salesData || dummySalesData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <div className="flex space-x-2">
          <Tabs defaultValue={timeframe} onValueChange={(value) => setTimeframe(value as 'month' | 'quarter' | 'year')}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-2xl font-bold">{formatCurrency(displayData.monthly_revenue)}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  vs Target: {formatCurrency(displayData.annual_target / 12)}
                  {getGrowthBadge(displayData.monthly_revenue / (displayData.annual_target / 12) * 100 - 100)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-2xl font-bold">{displayData.growth_rate}%</div>
                <p className="text-xs text-muted-foreground">
                  Year over Year {getGrowthBadge(displayData.growth_rate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-2xl font-bold">{displayData.client_acquisition}</div>
                <p className="text-xs text-muted-foreground">
                  Conversion Rate: {displayData.conversion_rate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-2xl font-bold">{formatCurrency(displayData.avg_deal_size)}</div>
                <p className="text-xs text-muted-foreground">
                  Per client project
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <Tabs defaultValue="line" onValueChange={setChartType}>
                <TabsList>
                  <TabsTrigger value="line"><BarChart3 className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="bar"><BarChart3 className="h-4 w-4" /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {chartType === 'line' ? (
              <LineChart width={500} height={300} data={displayData.monthly_trend}>
                {/* Chart configuration here */}
              </LineChart>
            ) : (
              <BarChart width={500} height={300} data={displayData.monthly_trend}>
                {/* Chart configuration here */}
              </BarChart>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={500} height={300}>
              {/* Chart configuration here */}
            </PieChart>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">Growth</th>
                </tr>
              </thead>
              <tbody>
                {displayData.top_clients.map((client) => (
                  <tr key={client.client_id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{client.client_name}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(client.revenue)}</td>
                    <td className="text-right py-3 px-4 flex justify-end">
                      {client.growth}%
                      {getGrowthBadge(client.growth)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
