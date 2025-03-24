import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart, LineChart, TrendingUp, FileText, Download, Filter, Calendar, ChevronDown, Plus, ArrowRight, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addMonths, format, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import FinancialMetricsCard from "@/components/finance/FinancialMetricsCard";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const DateRangePicker = ({ 
  date, 
  setDate 
}: { 
  date: DateRange | undefined; 
  setDate: (date: DateRange | undefined) => void 
}) => {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className="w-[300px] justify-start text-left font-normal"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const FinanceReports = () => {
  const [reportType, setReportType] = useState("financial");
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  
  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['financial-metrics', timeframe],
    queryFn: () => financeService.getFinancialMetrics(timeframe)
  });

  const { data: financialPlans, isLoading: isPlansLoading } = useQuery({
    queryKey: ['financial-plans'],
    queryFn: financeService.getFinancialPlans
  });

  const chartData = metrics?.monthly_breakdown?.map((item) => ({
    name: format(new Date(item.month), 'MMM yyyy'),
    revenue: item.income,
    expenses: item.expense,
    profit: item.profit,
  }));

  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">
            Generate and download detailed financial reports
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as 'month' | 'quarter' | 'year')}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker date={date} setDate={setDate} />
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="plans">Financial Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance</CardTitle>
                  <CardDescription>Revenue, expenses, and profit trends</CardDescription>
                </CardHeader>
                <CardContent>
                  {isMetricsLoading ? (
                    <div className="h-80 flex items-center justify-center">
                      <Skeleton className="h-64 w-full" />
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={chartData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                          <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                          <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                          <Line type="monotone" dataKey="profit" stroke="#ff7300" name="Profit" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <FinancialMetricsCard metrics={metrics} isLoading={isMetricsLoading} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isMetricsLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${metrics?.summary?.total_revenue.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isMetricsLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${metrics?.summary?.total_expenses.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isMetricsLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${metrics?.summary?.net_profit.toLocaleString()}
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
                  <div className="text-2xl font-bold">
                    {metrics?.summary?.profit_margin.toFixed(1)}%
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Revenue breakdown by client and service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                <p className="text-muted-foreground">Detailed revenue analysis charts will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
              <CardDescription>Expense breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                <p className="text-muted-foreground">Detailed expense analysis charts will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profitability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profitability Analysis</CardTitle>
              <CardDescription>Profit margins and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                <p className="text-muted-foreground">Detailed profitability analysis will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Financial Improvement Plans</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Plan
            </Button>
          </div>
          
          {isPlansLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-60" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(financialPlans && Array.isArray(financialPlans) ? 
                financialPlans : 
                []).map((plan: any) => (
                <Card key={plan.plan_id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.title}</CardTitle>
                        <CardDescription>{plan.timeline}</CardDescription>
                      </div>
                      <Badge 
                        className={
                          plan.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : plan.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }
                      >
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{plan.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Goals</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="border rounded p-2">
                            <div className="text-muted-foreground">Revenue</div>
                            <div className="font-medium">+{plan.goals.revenue_increase}%</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="text-muted-foreground">Cost</div>
                            <div className="font-medium">-{plan.goals.cost_reduction}%</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="text-muted-foreground">Profit Margin</div>
                            <div className="font-medium">{plan.goals.profit_margin_target}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Key Strategies</h4>
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            View All <ChevronDown className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {plan.strategies.slice(0, 2).map((strategy: any, index: number) => (
                            <div key={index} className="border rounded p-3">
                              <div className="flex justify-between items-start mb-1">
                                <div className="font-medium text-sm">{strategy.title}</div>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    strategy.priority === 'high' 
                                      ? 'bg-red-50 text-red-700 border-red-200' 
                                      : strategy.priority === 'medium'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                  }
                                >
                                  {strategy.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {strategy.description}
                              </p>
                              <div className="text-xs">
                                Impact: <span className="font-medium">${strategy.estimated_impact.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Download detailed financial reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                title: "Income Statement", 
                description: "Comprehensive profit and loss report for the current period",
                update: "Updated monthly",
                icon: <BarChart className="h-10 w-10 text-primary/20" />
              },
              { 
                title: "Balance Sheet", 
                description: "Statement of financial position showing assets, liabilities, and equity",
                update: "Updated monthly",
                icon: <PieChart className="h-10 w-10 text-primary/20" />
              },
              { 
                title: "Cash Flow Statement", 
                description: "Analysis of all cash inflows and outflows during the period",
                update: "Updated monthly",
                icon: <LineChart className="h-10 w-10 text-primary/20" />
              },
              { 
                title: "Revenue by Client", 
                description: "Breakdown of revenue streams by client",
                update: "Updated weekly",
                icon: <BarChart className="h-10 w-10 text-primary/20" />
              },
              { 
                title: "Expense Report", 
                description: "Detailed analysis of all company expenses by category",
                update: "Updated weekly",
                icon: <PieChart className="h-10 w-10 text-primary/20" />
              },
              { 
                title: "Budget vs. Actual", 
                description: "Comparison of budgeted figures against actual financial performance",
                update: "Updated monthly",
                icon: <BarChart className="h-10 w-10 text-primary/20" />
              },
            ].map((report, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute right-2 top-2 opacity-10">
                  {report.icon}
                </div>
                <CardHeader>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-muted-foreground">{report.update}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      View
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceReports;
