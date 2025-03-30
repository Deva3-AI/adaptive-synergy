
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { DonutChart } from '@/components/ui/charts';
import { BarChart } from '@/components/ui/charts';

const TeamCostsAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Mock teamCosts query while we implement the actual service
  const { data: teamCosts, isLoading, error } = useQuery({
    queryKey: ['team-costs', selectedPeriod],
    queryFn: () => {
      // Temporary mock function until financeService.analyzeTeamCosts is implemented
      const mockData = {
        totalCost: 125000,
        departmentBreakdown: [
          { name: 'Design', value: 45000 },
          { name: 'Development', value: 35000 },
          { name: 'Marketing', value: 25000 },
          { name: 'Management', value: 20000 }
        ],
        roleBreakdown: [
          { name: 'Junior', value: 30000 },
          { name: 'Mid-level', value: 45000 },
          { name: 'Senior', value: 35000 },
          { name: 'Lead', value: 15000 }
        ],
        monthlyTrend: [
          { name: 'Jan', cost: 110000 },
          { name: 'Feb', cost: 115000 },
          { name: 'Mar', cost: 120000 },
          { name: 'Apr', cost: 125000 },
          { name: 'May', cost: 122000 },
          { name: 'Jun', cost: 126000 }
        ],
        efficiencyMetrics: {
          costPerTask: 450,
          costPerTaskByDepartment: [
            { name: 'Design', value: 500 },
            { name: 'Development', value: 600 },
            { name: 'Marketing', value: 350 },
            { name: 'Management', value: 250 }
          ]
        }
      };
      
      return Promise.resolve(mockData);
    }
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Cost Analysis</CardTitle>
          <CardDescription>Cost breakdown by department and role</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading team cost data.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Cost Analysis</CardTitle>
        <CardDescription>Cost breakdown by department and role</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="department" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="department">By Department</TabsTrigger>
            <TabsTrigger value="role">By Role</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="efficiency">Cost Efficiency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="department" className="space-y-4">
            <div className="flex items-center justify-center">
              <DonutChart 
                data={teamCosts?.departmentBreakdown || []} 
                nameKey="name" 
                dataKey="value" 
                innerRadius={60} 
                outerRadius={80} 
              />
            </div>
            <div className="mt-4 grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-sm font-medium">Total Department Costs</div>
                  <div className="text-2xl font-bold">${teamCosts?.totalCost.toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-sm font-medium">Highest Department</div>
                  <div className="text-2xl font-bold">
                    {teamCosts?.departmentBreakdown.sort((a, b) => b.value - a.value)[0]?.name}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="role" className="space-y-4">
            <div className="flex items-center justify-center">
              <DonutChart 
                data={teamCosts?.roleBreakdown || []} 
                nameKey="name" 
                dataKey="value" 
                innerRadius={60} 
                outerRadius={80} 
              />
            </div>
            <div className="mt-4 grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-sm font-medium">Total Role Costs</div>
                  <div className="text-2xl font-bold">${teamCosts?.totalCost.toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-sm font-medium">Highest Cost Role</div>
                  <div className="text-2xl font-bold">
                    {teamCosts?.roleBreakdown.sort((a, b) => b.value - a.value)[0]?.name}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="h-[300px]">
              <BarChart 
                data={teamCosts?.monthlyTrend || []}
                index="name"
                categories={["cost"]} 
                yAxisWidth={60}
                colors={["hsl(var(--primary))"]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="efficiency">
            <div className="space-y-6">
              <div className="rounded-lg bg-muted p-4">
                <div className="text-sm font-medium">Average Cost per Task</div>
                <div className="text-3xl font-bold mt-1">
                  ${teamCosts?.efficiencyMetrics.costPerTask.toLocaleString()}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Cost per Task by Department</h4>
                <BarChart 
                  data={teamCosts?.efficiencyMetrics.costPerTaskByDepartment || []}
                  index="name"
                  categories={["value"]}
                  colors={["hsl(var(--primary))"]}
                  yAxisWidth={60}
                  height={200}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamCostsAnalysis;
