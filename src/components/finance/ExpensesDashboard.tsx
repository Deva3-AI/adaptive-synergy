
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { FinancialRecord } from '@/services/api/financeService';
import { Calendar, Plus, Search, FileText, TrendingDown, TrendingUp } from 'lucide-react';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ExpenseChart = ({ data }: { data: any[] }) => {
  const categories = data.reduce((acc: Record<string, number>, record) => {
    const category = record.description.split(':')[0] || 'Other';
    acc[category] = (acc[category] || 0) + record.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ExpensesTrendChart = ({ data }: { data: any[] }) => {
  // Group expenses by month
  const expensesByMonth: Record<string, number> = {};
  data.forEach(record => {
    const date = new Date(record.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    expensesByMonth[monthYear] = (expensesByMonth[monthYear] || 0) + record.amount;
  });

  const chartData = Object.entries(expensesByMonth)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ExpensesDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');

  const { data: financialRecords, isLoading } = useQuery({
    queryKey: ['financial-records', 'expense'],
    queryFn: () => financeService.getFinancialRecords('expense'),
  });

  const filteredRecords = financialRecords?.filter(
    (record: FinancialRecord) =>
      record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total expenses
  const totalExpenses = financialRecords?.reduce(
    (sum, record: FinancialRecord) => sum + record.amount,
    0
  ) || 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 max-w-md relative">
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-8"
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex gap-2">
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                  This period
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Largest Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">Software</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  35% of total
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-green-600">-3.2%</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                  vs last month
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="trend">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="pt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No expenses found matching your criteria
                </div>
              ) : (
                filteredRecords?.map((record: FinancialRecord) => (
                  <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{record.description}</h3>
                          <div className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-medium">
                            ${record.amount.toLocaleString()}
                          </div>
                          
                          <Button size="sm" variant="outline">
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="category" className="pt-4">
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <ExpenseChart data={financialRecords || []} />
          )}
        </TabsContent>

        <TabsContent value="trend" className="pt-4">
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <ExpensesTrendChart data={financialRecords || []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpensesDashboard;
