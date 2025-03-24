import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, DownloadIcon, FileText, Users, Clock, DollarSign, BarChart2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subMonths } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TeamCostsAnalysis = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [currentView, setCurrentView] = useState('overview');
  
  // Calculate default date range
  const endDate = new Date();
  const startDate = subMonths(endDate, 1); // Default to last month
  
  const { data: teamCosts, isLoading } = useQuery({
    queryKey: ['team-costs', timeRange],
    queryFn: () => financeService.analyzeTeamCosts(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    ),
  });
  
  // Prepare chart data for role distribution
  const roleChartData = teamCosts?.role_distribution?.map(role => ({
    name: role.role,
    value: role.cost,
    hours: role.hours,
    headcount: role.count,
  }));
  
  // Prepare chart data for employee costs
  const employeeChartData = teamCosts?.employee_data?.map(emp => ({
    name: emp.name,
    cost: emp.cost,
    hours: emp.hours_worked,
    productivity: emp.productivity_ratio * 100,
  }));
  
  // Prepare chart data for client costs
  const clientChartData = teamCosts?.client_costs?.map(client => ({
    name: client.client_name,
    cost: client.cost,
    hours: client.hours,
    tasks: client.task_count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
        </div>
        
        <Button>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Team Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {teamCosts?.summary?.total_hours.toLocaleString()} hrs
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  This period
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Team Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  ${teamCosts?.summary?.total_cost.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  This period
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {teamCosts?.summary?.total_employees}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  Active employees
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Productivity Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {(teamCosts?.summary?.productivity_ratio * 100).toFixed(1)}%
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <BarChart2 className="h-3.5 w-3.5 mr-1" />
                  Task hours / worked hours
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Tab Navigation */}
      <Tabs defaultValue="overview" onValueChange={setCurrentView}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="byRole">By Role</TabsTrigger>
          <TabsTrigger value="byEmployee">By Employee</TabsTrigger>
          <TabsTrigger value="byClient">By Client</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="h-[350px] flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roleChartData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="byRole" className="pt-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="h-[350px] flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Cost by Department/Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={roleChartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip formatter={(value, name) => {
                        if (name === 'cost') return [`$${value.toLocaleString()}`, 'Cost'];
                        if (name === 'hours') return [`${value.toLocaleString()} hrs`, 'Hours'];
                        return [value, name];
                      }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="cost" name="Cost" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="hours" name="Hours" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="byEmployee" className="pt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="h-[350px] flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={employeeChartData}
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
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'cost') return [`$${value.toLocaleString()}`, 'Cost'];
                            if (name === 'hours') return [`${value.toLocaleString()} hrs`, 'Hours'];
                            if (name === 'productivity') return [`${value.toFixed(1)}%`, 'Productivity'];
                            return [value, name];
                          }}
                        />
                        <Legend />
                        <Bar dataKey="cost" name="Cost" fill="#8884d8" />
                        <Bar dataKey="hours" name="Hours" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamCosts?.employee_data?.map((emp) => (
                  <Card key={emp.user_id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-base">{emp.name}</h3>
                        <span className="text-sm font-medium">${emp.cost.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Hours:</span> {emp.hours_worked.toLocaleString()}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Task Hours:</span> {emp.task_hours.toLocaleString()}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Productivity:</span> 
                          <div className="text-xs font-medium">
                            {typeof value === 'number' ? `${value.toFixed(1)}%` : value}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cost Rate:</span> ${(emp.cost / emp.hours_worked).toFixed(2)}/hr
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="byClient" className="pt-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="h-[350px] flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Client Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={clientChartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'cost') return [`$${value.toLocaleString()}`, 'Cost'];
                          if (name === 'hours') return [`${value.toLocaleString()} hrs`, 'Hours'];
                          if (name === 'tasks') return [`${value} tasks`, 'Task Count'];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="cost" name="Cost" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="hours" name="Hours" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Client Cost Breakdown</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Client</th>
                        <th className="text-right py-2">Hours</th>
                        <th className="text-right py-2">Cost</th>
                        <th className="text-right py-2">Tasks</th>
                        <th className="text-right py-2">Cost/Task</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamCosts?.client_costs?.map((client) => (
                        <tr key={client.client_id} className="border-b">
                          <td className="py-2">{client.client_name}</td>
                          <td className="text-right py-2">{client.hours}</td>
                          <td className="text-right py-2">${client.cost.toLocaleString()}</td>
                          <td className="text-right py-2">{client.task_count}</td>
                          <td className="text-right py-2">
                            ${(client.cost / client.task_count).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamCostsAnalysis;
