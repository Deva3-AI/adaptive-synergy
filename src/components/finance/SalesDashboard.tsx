
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/apiUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useClients } from "@/utils/apiUtils";
import {
  CreditCard,
  DollarSign,
  Users,
  Activity,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  BarChart3
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

interface SalesData {
  monthly_revenue: number;
  annual_target: number;
  growth_rate: number;
  client_acquisition: number;
  conversion_rate: number;
  avg_deal_size: number;
  top_clients: Array<{
    client_id: number;
    client_name: string;
    revenue: number;
    growth: number;
  }>;
  monthly_trend: Array<{
    month: string;
    revenue: number;
    target: number;
  }>;
  sales_by_service: Array<{
    service: string;
    value: number;
  }>;
}

const SalesDashboard = () => {
  const { data: clients } = useClients();
  
  // Fetch sales data
  const { data: salesData, isLoading } = useQuery<SalesData>({
    queryKey: ['salesData'],
    queryFn: async () => {
      try {
        if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
          // Mock data for development
          return {
            monthly_revenue: 42500,
            annual_target: 500000,
            growth_rate: 8.5,
            client_acquisition: 3,
            conversion_rate: 18,
            avg_deal_size: 7800,
            top_clients: [
              { client_id: 1, client_name: "Social Land", revenue: 12500, growth: 15 },
              { client_id: 2, client_name: "Koala Digital", revenue: 8700, growth: 5 },
              { client_id: 3, client_name: "AC Digital", revenue: 7300, growth: -2 },
              { client_id: 5, client_name: "Internet People", revenue: 6800, growth: 12 },
              { client_id: 7, client_name: "Website Architect", revenue: 5200, growth: 8 }
            ],
            monthly_trend: [
              { month: "Jan", revenue: 38000, target: 40000 },
              { month: "Feb", revenue: 35000, target: 40000 },
              { month: "Mar", revenue: 42000, target: 40000 },
              { month: "Apr", revenue: 39000, target: 40000 },
              { month: "May", revenue: 45000, target: 42000 },
              { month: "Jun", revenue: 43000, target: 42000 },
              { month: "Jul", revenue: 40000, target: 42000 },
              { month: "Aug", revenue: 42500, target: 42000 }
            ],
            sales_by_service: [
              { service: "Web Design", value: 35 },
              { service: "SEO", value: 25 },
              { service: "Social Media", value: 20 },
              { service: "Content", value: 12 },
              { service: "Other", value: 8 }
            ]
          };
        }
        
        // Regular API call
        const response = await fetchData<SalesData>('/finance/reports/sales');
        return response;
      } catch (error) {
        console.error('Error fetching sales data:', error);
        
        // Fallback to mock data in case of error
        return {
          monthly_revenue: 42500,
          annual_target: 500000,
          growth_rate: 8.5,
          client_acquisition: 3,
          conversion_rate: 18,
          avg_deal_size: 7800,
          top_clients: [
            { client_id: 1, client_name: "Social Land", revenue: 12500, growth: 15 },
            { client_id: 2, client_name: "Koala Digital", revenue: 8700, growth: 5 },
            { client_id: 3, client_name: "AC Digital", revenue: 7300, growth: -2 },
            { client_id: 5, client_name: "Internet People", revenue: 6800, growth: 12 },
            { client_id: 7, client_name: "Website Architect", revenue: 5200, growth: 8 }
          ],
          monthly_trend: [
            { month: "Jan", revenue: 38000, target: 40000 },
            { month: "Feb", revenue: 35000, target: 40000 },
            { month: "Mar", revenue: 42000, target: 40000 },
            { month: "Apr", revenue: 39000, target: 40000 },
            { month: "May", revenue: 45000, target: 42000 },
            { month: "Jun", revenue: 43000, target: 42000 },
            { month: "Jul", revenue: 40000, target: 42000 },
            { month: "Aug", revenue: 42500, target: 42000 }
          ],
          sales_by_service: [
            { service: "Web Design", value: 35 },
            { service: "SEO", value: 25 },
            { service: "Social Media", value: 20 },
            { service: "Content", value: 12 },
            { service: "Other", value: 8 }
          ]
        };
      }
    }
  });

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return <div>Loading sales data...</div>;
  }

  // Use real clients if available
  const topClients = salesData?.top_clients?.map(client => {
    const realClient = clients?.find(c => c.client_id === client.client_id);
    return {
      ...client,
      client_name: realClient?.client_name || client.client_name
    };
  }) || [];

  // Calculate annual progress percentage
  const annualProgress = salesData ? 
    Math.round((salesData.monthly_revenue * 12) / salesData.annual_target * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesData?.monthly_revenue || 0)}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                vs. {formatCurrency((salesData?.monthly_revenue || 0) * 0.9)} last month
              </p>
              <div className="flex items-center text-green-500 text-xs">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Target</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesData?.annual_target || 0)}</div>
            <div className="flex items-center space-x-2">
              <Progress value={annualProgress} className="h-1.5" />
              <span className="text-xs text-muted-foreground">{annualProgress}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData?.growth_rate || 0}%</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                YoY growth
              </p>
              <div className="flex items-center text-green-500 text-xs">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+2.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Acquisition</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData?.client_acquisition || 0}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                New clients this month
              </p>
              <div className="flex items-center text-green-500 text-xs">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Monthly Revenue Trend"
          icon={<BarChart3 className="h-5 w-5" />}
          badgeText="2023"
          badgeVariant="outline"
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={salesData?.monthly_trend || []} 
            height={300}
            defaultType="bar"
          />
        </DashboardCard>

        <DashboardCard
          title="Sales by Service"
          icon={<CreditCard className="h-5 w-5" />}
          badgeText="YTD"
          badgeVariant="outline"
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={salesData?.sales_by_service || []} 
            height={300}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Top Clients by Revenue"
        icon={<Users className="h-5 w-5" />}
        badgeText="Monthly"
        badgeVariant="outline"
      >
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">Client</th>
                <th className="py-3 px-4 text-right font-medium">Revenue</th>
                <th className="py-3 px-4 text-right font-medium">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((client, index) => (
                <tr key={client.client_id} className={index !== topClients.length - 1 ? "border-b" : ""}>
                  <td className="py-3 px-4 font-medium">{client.client_name}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(client.revenue)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end">
                      {client.growth > 0 ? (
                        <div className="flex items-center text-green-500">
                          <ChevronUp className="h-4 w-4 mr-1" />
                          <span>{client.growth}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-500">
                          <ChevronDown className="h-4 w-4 mr-1" />
                          <span>{Math.abs(client.growth)}%</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default SalesDashboard;
