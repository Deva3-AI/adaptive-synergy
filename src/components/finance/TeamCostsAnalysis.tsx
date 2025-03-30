
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import { BarChart } from "@/components/ui/charts";
import DonutChart from "@/components/ui/charts/DonutChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Users, Building, Briefcase } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface TeamCostsAnalysisProps {
  period: "month" | "quarter" | "year";
}

const TeamCostsAnalysis: React.FC<TeamCostsAnalysisProps> = ({ period }) => {
  const { data: teamCosts, isLoading } = useQuery({
    queryKey: ['team-costs', period],
    queryFn: () => financeService.analyzeTeamCosts(period),
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
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Team Costs Analysis</h2>
      <Tabs defaultValue="department">
        <TabsList>
          <TabsTrigger value="department">By Department</TabsTrigger>
          <TabsTrigger value="project-type">By Project Type</TabsTrigger>
          <TabsTrigger value="client">By Client</TabsTrigger>
        </TabsList>
        
        <TabsContent value="department" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Department Cost Distribution
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <DonutChart 
                  data={teamCosts?.by_department || []} 
                  innerRadius={60}
                  outerRadius={90}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {formatCurrency(teamCosts?.total_cost || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total cost for the {period}
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(teamCosts?.by_department || []).map((dept: any) => (
                        <TableRow key={dept.name}>
                          <TableCell>{dept.name}</TableCell>
                          <TableCell className="text-right">{formatCurrency(dept.value)}</TableCell>
                          <TableCell className="text-right">
                            {Math.round((dept.value / teamCosts?.total_cost) * 100)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="project-type" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Project Type Cost Distribution
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <DonutChart 
                  data={teamCosts?.by_project_type || []} 
                  innerRadius={60}
                  outerRadius={90}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Cost by Project Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(teamCosts?.by_project_type || []).map((type: any) => (
                      <TableRow key={type.name}>
                        <TableCell>{type.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(type.value)}</TableCell>
                        <TableCell className="text-right">
                          {Math.round((type.value / teamCosts?.total_cost) * 100)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Project Cost Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <BarChart 
                data={teamCosts?.by_project_type || []} 
                xAxisKey="name"
                yAxisKey="value"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="client" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Cost & Revenue by Client
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(teamCosts?.cost_per_client || []).map((client: any) => (
                    <TableRow key={client.client}>
                      <TableCell>{client.client}</TableCell>
                      <TableCell className="text-right">{formatCurrency(client.cost)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(client.revenue)}</TableCell>
                      <TableCell className="text-right">
                        <span className={client.profit >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(client.profit)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={client.profit >= 0 ? "text-green-600" : "text-red-600"}>
                          {Math.round((client.profit / client.revenue) * 100)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamCostsAnalysis;
