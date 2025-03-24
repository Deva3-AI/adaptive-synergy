
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, PieChart, TrendingUp, Users, Briefcase, Calendar, 
  ArrowUpRight, ArrowDownRight, DollarSign, Clock, AlertCircle
} from "lucide-react";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Skeleton } from "@/components/ui/skeleton";

const TeamCostsAnalysis = () => {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month");
  
  // Fetch team costs analysis data
  const { data: teamCosts, isLoading } = useQuery({
    queryKey: ["team-costs", dateRange],
    queryFn: () => financeService.analyzeTeamCosts(dateRange),
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Custom tooltip formatter to handle the display of currency
  const currencyTooltipFormatter = (value: any) => {
    if (typeof value === 'number') {
      return [formatCurrency(value), ''];
    }
    return [value, ''];
  };

  // Render a loading skeleton when data is loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] rounded-lg" />
          <Skeleton className="h-[300px] rounded-lg" />
          <Skeleton className="h-[300px] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Team Costs Analysis</h2>
        <Select
          value={dateRange}
          onValueChange={(value) => setDateRange(value as "week" | "month" | "quarter" | "year")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DashboardCard
            title="Total Team Costs"
            icon={<DollarSign className="h-5 w-5" />}
            badgeText={`This ${dateRange}`}
            badgeVariant="outline"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(teamCosts?.total_cost || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    For {dateRange === 'week' ? 'this week' : dateRange === 'month' ? 'this month' : dateRange === 'quarter' ? 'this quarter' : 'this year'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Cost per Employee</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(teamCosts?.average_cost_per_employee || 0)}
                  </div>
                  <div className="mt-2 flex items-center text-xs">
                    {teamCosts?.cost_trend > 0 ? (
                      <div className="text-red-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>{teamCosts?.cost_trend}% vs previous {dateRange}</span>
                      </div>
                    ) : (
                      <div className="text-green-500 flex items-center">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        <span>{Math.abs(teamCosts?.cost_trend || 0)}% vs previous {dateRange}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {teamCosts?.cost_efficiency || 0}%
                  </div>
                  <div className="mt-1">
                    <Progress value={teamCosts?.cost_efficiency || 0} className="h-2" />
                  </div>
                  <div className="mt-2">
                    <Badge className={teamCosts?.cost_efficiency > 75 ? "bg-green-500" : teamCosts?.cost_efficiency > 50 ? "bg-amber-500" : "bg-red-500"}>
                      {teamCosts?.cost_efficiency > 75 ? "Excellent" : teamCosts?.cost_efficiency > 50 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Department Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={teamCosts?.departments || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={currencyTooltipFormatter} />
                  <Legend />
                  <Bar dataKey="cost" fill="#8884d8" name="Cost" />
                  <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Department Cost Distribution"
              icon={<PieChart className="h-5 w-5" />}
              badgeText={`This ${dateRange}`}
              badgeVariant="outline"
            >
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={teamCosts?.departments || []}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => {
                      if (typeof percent === 'number') {
                        return `${name}: ${(percent * 100).toFixed(0)}%`;
                      }
                      return `${name}: ${percent}%`;
                    }}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="cost"
                    nameKey="name"
                  >
                    {(teamCosts?.departments || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'][index % 6]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={currencyTooltipFormatter} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </DashboardCard>
            
            <DashboardCard
              title="Budget vs. Actual Cost"
              icon={<BarChart className="h-5 w-5" />}
              badgeText={`This ${dateRange}`}
              badgeVariant="outline"
            >
              <div className="space-y-4">
                {(teamCosts?.departments || []).map((dept: any) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{dept.name}</div>
                      <div className="text-sm">
                        {formatCurrency(dept.cost)} / {formatCurrency(dept.budget)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(dept.cost / dept.budget) * 100} 
                        className={`h-2 ${dept.cost > dept.budget ? "bg-red-200" : "bg-slate-200"}`}
                      />
                      <span className={`text-xs ${dept.cost > dept.budget ? "text-red-500" : "text-green-500"}`}>
                        {((dept.cost / dept.budget) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
          
          <DashboardCard
            title="Department Details"
            icon={<Briefcase className="h-5 w-5" />}
            badgeText={`This ${dateRange}`}
            badgeVariant="outline"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Department</th>
                    <th className="text-left py-3 px-4">Headcount</th>
                    <th className="text-left py-3 px-4">Avg. Cost/Employee</th>
                    <th className="text-left py-3 px-4">Total Cost</th>
                    <th className="text-left py-3 px-4">Budget</th>
                    <th className="text-left py-3 px-4">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {(teamCosts?.departments || []).map((dept: any) => {
                    const variance = dept.budget - dept.cost;
                    const variancePercent = (variance / dept.budget) * 100;
                    
                    return (
                      <tr key={dept.name} className="border-b">
                        <td className="py-3 px-4 font-medium">{dept.name}</td>
                        <td className="py-3 px-4">{dept.headcount}</td>
                        <td className="py-3 px-4">{formatCurrency(dept.cost / dept.headcount)}</td>
                        <td className="py-3 px-4">{formatCurrency(dept.cost)}</td>
                        <td className="py-3 px-4">{formatCurrency(dept.budget)}</td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center ${variance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {variance >= 0 ? 
                              <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                            }
                            <span>{formatCurrency(Math.abs(variance))}</span>
                            <span className="ml-1">({Math.abs(variancePercent).toFixed(1)}%)</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <DashboardCard
            title="Cost Trends Over Time"
            icon={<TrendingUp className="h-5 w-5" />}
            badgeText={`This ${dateRange}`}
            badgeVariant="outline"
          >
            <AnalyticsChart
              data={teamCosts?.trend || []}
              height={300}
              defaultType="line"
            />
          </DashboardCard>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Efficiency Analysis"
              icon={<Clock className="h-5 w-5" />}
              badgeText={`This ${dateRange}`}
              badgeVariant="outline"
            >
              <div className="space-y-4">
                {(teamCosts?.efficiency || []).map((item: any) => (
                  <div key={item.metric} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{item.metric}</div>
                      <div className="text-sm">
                        {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={item.percentage} className="h-2" />
                      <span className="text-xs">{item.percentage}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Cost Optimization Recommendations"
              icon={<AlertCircle className="h-5 w-5" />}
              badgeText="AI Generated"
              badgeVariant="outline"
            >
              <div className="space-y-4">
                {(teamCosts?.recommendations || []).map((rec: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start gap-2">
                      <div className={`p-1 rounded-full mt-0.5 ${rec.priority === 'high' ? 'bg-red-100' : rec.priority === 'medium' ? 'bg-amber-100' : 'bg-green-100'}`}>
                        <AlertCircle className={`h-4 w-4 ${rec.priority === 'high' ? 'text-red-500' : rec.priority === 'medium' ? 'text-amber-500' : 'text-green-500'}`} />
                      </div>
                      <div>
                        <div className="font-medium">{rec.title}</div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'warning' : 'success'} className="mr-2">
                            {rec.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Potential Savings: {formatCurrency(rec.potential_savings)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamCostsAnalysis;
