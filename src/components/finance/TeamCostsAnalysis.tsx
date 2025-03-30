
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, DonutChart } from "@/components/ui/charts";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { financeService } from '@/services/api';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

export const TeamCostsAnalysis = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [department, setDepartment] = useState('all');
  
  // Query team costs analysis data
  const { data: teamCostsData, isLoading } = useQuery({
    queryKey: ['team-costs', timeRange, year, department],
    queryFn: () => {
      // In a real app, these parameters would be passed to the API
      return financeService.analyzeTeamCosts();
    }
  });
  
  // Placeholder for the department selection options
  const departments = ['all', 'Design', 'Development', 'Marketing'];
  
  // Placeholder for year selection options
  const years = [
    (new Date().getFullYear() - 1).toString(),
    new Date().getFullYear().toString(),
    (new Date().getFullYear() + 1).toString()
  ];
  
  // Prepare data for charts
  const departmentCostData = teamCostsData?.cost_per_department.map(dept => ({
    name: dept.department,
    value: dept.cost
  })) || [];
  
  const projectCostData = teamCostsData?.cost_per_project.map(project => ({
    name: project.project,
    value: project.cost
  })) || [];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle className="text-xl">Team Costs Analysis</CardTitle>
            <CardDescription>Detailed breakdown of team-related expenses</CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <div className="flex items-center">
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : teamCostsData ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Total Team Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(teamCostsData.total_team_cost)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{timeRange === 'monthly' ? 'This month' : timeRange === 'quarterly' ? 'This quarter' : 'This year'}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average hourly rate:</span>
                    <span className="font-medium">{formatCurrency(teamCostsData.efficiency_metrics.average_hourly_rate)}/hour</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Billable hours:</span>
                    <span className="font-medium">{formatPercentage(teamCostsData.efficiency_metrics.billable_hours_percentage)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cost per billable hour:</span>
                    <span className="font-medium">{formatCurrency(teamCostsData.efficiency_metrics.cost_per_billable_hour)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="department" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="department">By Department</TabsTrigger>
                <TabsTrigger value="project">By Project</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="department" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-80">
                    <DonutChart data={departmentCostData} />
                  </div>
                  
                  <div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Department</TableHead>
                          <TableHead>Employees</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamCostsData.cost_per_department.map((dept, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{dept.department}</TableCell>
                            <TableCell>{dept.employee_count}</TableCell>
                            <TableCell className="text-right">{formatCurrency(dept.cost)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="font-bold">
                            {teamCostsData.cost_per_department.reduce((acc, dept) => acc + dept.employee_count, 0)}
                          </TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(teamCostsData.total_team_cost)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="project" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-80">
                    <BarChart data={projectCostData} />
                  </div>
                  
                  <div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamCostsData.cost_per_project.map((project, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{project.project}</TableCell>
                            <TableCell>{project.hours}</TableCell>
                            <TableCell className="text-right">{formatCurrency(project.cost)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="font-bold">
                            {teamCostsData.cost_per_project.reduce((acc, project) => acc + project.hours, 0)}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(teamCostsData.cost_per_project.reduce((acc, project) => acc + project.cost, 0))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="summary" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Team Cost Efficiency Summary</CardTitle>
                    <CardDescription>
                      Overall analysis and recommendations for team cost optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Current Efficiency</h3>
                        <p className="text-sm text-muted-foreground">
                          Your team's billable percentage is {formatPercentage(teamCostsData.efficiency_metrics.billable_hours_percentage)}, 
                          which is {teamCostsData.efficiency_metrics.billable_hours_percentage >= 70 ? 'good' : 'below target'}. 
                          The industry average is around 70-75%.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Cost Distribution</h3>
                        <p className="text-sm text-muted-foreground">
                          The {teamCostsData.cost_per_department[0].department} department represents the highest portion 
                          of your team costs ({formatPercentage(teamCostsData.cost_per_department[0].cost / teamCostsData.total_team_cost)}), 
                          followed by {teamCostsData.cost_per_department[1].department} ({formatPercentage(teamCostsData.cost_per_department[1].cost / teamCostsData.total_team_cost)}).
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Optimization Opportunities</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary shrink-0 mt-0.5">1</div>
                            <span>Increase billable hours percentage to 80% or higher</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary shrink-0 mt-0.5">2</div>
                            <span>Optimize resource allocation on smaller projects</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary shrink-0 mt-0.5">3</div>
                            <span>Consider cross-training team members for better utilization</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No team cost data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamCostsAnalysis;
