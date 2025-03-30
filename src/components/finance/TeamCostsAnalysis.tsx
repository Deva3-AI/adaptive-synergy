
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DonutChart, BarChart } from "@/components/ui/charts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { financeService } from "@/services/api";
import { cn } from "@/lib/utils";

interface TeamCostsAnalysisProps {
  period: 'month' | 'quarter' | 'year';
}

const TeamCostsAnalysis = ({ period }: TeamCostsAnalysisProps) => {
  // Fetch team costs analysis data
  const { data: teamCosts, isLoading } = useQuery({
    queryKey: ['team-costs', period],
    queryFn: () => financeService.analyzeTeamCosts(period),
  });

  // Format data for charts
  const formatDataForDonutChart = (data: any) => {
    if (!data || !data.breakdown) return [];
    
    return data.breakdown.map((item: any) => ({
      name: item.department,
      value: item.cost,
    }));
  };
  
  const formatDataForBarChart = (data: any) => {
    if (!data || !data.trends) return [];
    
    return data.trends.map((item: any) => ({
      name: item.month,
      cost: item.cost,
    }));
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Team Costs Analysis</CardTitle>
          <CardDescription>Breakdown of team-related expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Costs Analysis</CardTitle>
        <CardDescription>
          Breakdown of team-related expenses - {period === 'month' ? 'Monthly' : period === 'quarter' ? 'Quarterly' : 'Yearly'} View
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Department Breakdown</TabsTrigger>
            <TabsTrigger value="trends">Cost Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-[250px] flex items-center justify-center">
                  <DonutChart 
                    data={formatDataForDonutChart(teamCosts)} 
                    nameKey="name"
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={100}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid place-items-center h-16 bg-muted rounded-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ${teamCosts?.totalCost?.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Costs
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {teamCosts?.breakdown?.map((dept: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className={cn(
                            "w-3 h-3 rounded-full mr-2",
                            index === 0 ? "bg-blue-500" :
                            index === 1 ? "bg-green-500" :
                            index === 2 ? "bg-yellow-500" :
                            index === 3 ? "bg-purple-500" :
                            "bg-gray-500"
                          )}
                        />
                        <span>{dept.department}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">${dept.cost.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">({dept.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="h-[300px]">
              <BarChart 
                data={formatDataForBarChart(teamCosts)}
                xAxisKey="name"
              />
            </div>
            
            <div className="mt-4">
              <BarChart 
                data={formatDataForBarChart(teamCosts)} 
                xAxisKey="name"
                height={250}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamCostsAnalysis;
