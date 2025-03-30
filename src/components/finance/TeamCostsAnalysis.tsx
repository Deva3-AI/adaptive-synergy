
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { financeService } from '@/services/api';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BarChart from '@/components/ui/charts/BarChart';
import PieChart from '@/components/ui/charts/PieChart';
import { formatCurrency } from '@/lib/utils';

const TeamCostsAnalysis = () => {
  const [period, setPeriod] = useState<string>("month");
  const [view, setView] = useState<string>("department");
  
  const { data: teamCosts, isLoading } = useQuery({
    queryKey: ['team-costs', period],
    queryFn: async () => {
      return financeService.analyzeTeamCosts(undefined, period);
    }
  });
  
  // Custom formatter for currency values
  const currencyFormatter = (value: number) => formatCurrency(value);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }
  
  if (!teamCosts) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No team cost data available.</p>
      </div>
    );
  }
  
  // Create data for charts based on selected view
  const getPieChartData = () => {
    if (view === "department") {
      return teamCosts.by_department.map((item: any) => ({
        name: item.department,
        value: item.cost
      }));
    } else if (view === "employee_type") {
      return teamCosts.by_employee_type.map((item: any) => ({
        name: item.type,
        value: item.cost
      }));
    }
    return [];
  };
  
  const getBarChartData = () => {
    return teamCosts.by_month.map((item: any) => ({
      name: item.month,
      Cost: item.cost
    }));
  };

  // Prepare data for department breakdown chart
  const departmentChartData = teamCosts.by_department.map((item: any) => ({
    name: item.department,
    cost: item.cost
  }));
  
  // Prepare data for employee type breakdown chart
  const employeeTypeChartData = teamCosts.by_employee_type.map((item: any) => ({
    name: item.type,
    cost: item.cost
  }));
  
  // Prepare data for monthly trend chart
  const monthlyTrendData = teamCosts.by_month.map((item: any) => ({
    name: item.month,
    Cost: item.cost
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle>Team Costs Analysis</CardTitle>
        
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={monthlyTrendData} 
              xAxisKey="name"
              series={[{ name: 'Cost', color: '#2563eb' }]}
              valueFormatter={currencyFormatter}
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={view} onValueChange={setView}>
              <TabsList className="mb-4">
                <TabsTrigger value="department">By Department</TabsTrigger>
                <TabsTrigger value="employee_type">By Type</TabsTrigger>
              </TabsList>
              
              <TabsContent value="department">
                <div className="text-center text-3xl font-bold mb-6">
                  {formatCurrency(teamCosts.total_cost)}
                </div>
                
                <div>
                  {teamCosts.by_department.map((dept: any, index: number) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{dept.department}</span>
                        <span className="font-medium">{formatCurrency(dept.cost)}</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ 
                            width: `${(dept.cost / teamCosts.total_cost) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="employee_type">
                <div className="text-center text-3xl font-bold mb-6">
                  {formatCurrency(teamCosts.total_cost)}
                </div>
                
                <div>
                  {teamCosts.by_employee_type.map((type: any, index: number) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{type.type}</span>
                        <span className="font-medium">{formatCurrency(type.cost)}</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ 
                            width: `${(type.cost / teamCosts.total_cost) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Department Cost Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={departmentChartData}
              xAxisKey="name"
              series={[{ name: 'cost', color: '#8b5cf6' }]}
              height={300}
              valueFormatter={currencyFormatter}
              yAxisWidth={80}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employee Type Cost Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={employeeTypeChartData}
              xAxisKey="name"
              series={[{ name: 'cost', color: '#a855f7' }]}
              height={300}
              valueFormatter={currencyFormatter}
              yAxisWidth={80}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Cost Trends</h3>
              <p className="text-muted-foreground">Team costs have increased by 7% compared to last {period}. This is primarily driven by the Engineering department which saw new hires.</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-2">Optimization Opportunities</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Consider moving 3 contractor positions to full-time to save approximately $15,000 per quarter</li>
                <li>Review Marketing department resource allocation - current cost per output is 15% above benchmark</li>
                <li>Implement cross-training program to reduce dependency on specialized contractors</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-2">Benchmark Comparison</h3>
              <p className="text-muted-foreground">Your total cost per employee is 5% below industry average while maintaining competitive compensation.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamCostsAnalysis;
