
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsList from "@/components/client/ClientsList";
import EmployeesList from "@/components/employee/EmployeesList";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/apiUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface FinancialMetrics {
  income: number;
  expenses: number;
  profit_margin: number;
  outstanding_invoices: number;
  total_clients: number;
  monthly_revenue: {
    month: string;
    revenue: number;
    expenses: number;
  }[];
  revenue_by_client: {
    client_name: string;
    revenue: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff6b81', '#c95151'];

const mockFinancialData: FinancialMetrics = {
  income: 75000,
  expenses: 45000,
  profit_margin: 40,
  outstanding_invoices: 15000,
  total_clients: 10,
  monthly_revenue: [
    { month: "Jan", revenue: 12000, expenses: 8000 },
    { month: "Feb", revenue: 14000, expenses: 8500 },
    { month: "Mar", revenue: 15000, expenses: 9000 },
    { month: "Apr", revenue: 16000, expenses: 9500 },
    { month: "May", revenue: 18000, expenses: 10000 },
  ],
  revenue_by_client: [
    { client_name: "Social Land", revenue: 15000 },
    { client_name: "Koala Digital", revenue: 12000 },
    { client_name: "AC Digital", revenue: 10000 },
    { client_name: "Muse Digital", revenue: 8000 },
    { client_name: "Internet People", revenue: 7000 },
    { client_name: "Philip", revenue: 6000 },
    { client_name: "Website Architect", revenue: 5000 },
    { client_name: "Justin", revenue: 4000 },
    { client_name: "Mark Intrinsic", revenue: 3000 },
    { client_name: "Mario", revenue: 5000 },
  ]
};

const FinancePerformance = () => {
  const [timeRange, setTimeRange] = useState("monthly");

  // In a real application, this would fetch from your API
  const { data: financialMetrics, isLoading } = useQuery({
    queryKey: ['financial-metrics', timeRange],
    queryFn: async () => {
      try {
        if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
          return mockFinancialData;
        }
        
        // If backend is available
        return await fetchData<FinancialMetrics>(`/finance/metrics?timeRange=${timeRange}`);
      } catch (error) {
        console.error("Error fetching financial metrics:", error);
        // Fallback to mock data in case of error
        return mockFinancialData;
      }
    }
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Financial Performance</h1>
        <div className="flex space-x-2">
          <select 
            className="border rounded px-3 py-1"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="monthly">Last 5 Months</option>
            <option value="quarterly">Last 4 Quarters</option>
            <option value="yearly">Last 3 Years</option>
          </select>
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${financialMetrics?.income.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${financialMetrics?.expenses.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{financialMetrics?.profit_margin}%</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${financialMetrics?.outstanding_invoices.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly breakdown of revenue against expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={financialMetrics?.monthly_revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Client</CardTitle>
            <CardDescription>Distribution of revenue across clients</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={financialMetrics?.revenue_by_client}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="client_name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {financialMetrics?.revenue_by_client.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Clients and Employees Tabs */}
      <Tabs defaultValue="clients">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
          <ClientsList />
        </TabsContent>
        <TabsContent value="employees">
          <EmployeesList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancePerformance;
