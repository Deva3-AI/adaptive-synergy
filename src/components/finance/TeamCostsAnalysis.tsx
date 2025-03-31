
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart } from '@/components/ui/charts';
import { Users, TrendingUp, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import financeService from '@/services/api/financeService';

interface TeamCostsAnalysisProps {
  period: 'month' | 'quarter' | 'year';
}

const TeamCostsAnalysis: React.FC<TeamCostsAnalysisProps> = ({ period }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['team-costs', period],
    queryFn: () => financeService.analyzeTeamCosts(),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Team Costs Analysis
          </CardTitle>
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
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Team Costs Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">
            Error loading team costs data
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Team Costs Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Total Cost</span>
            <span className="text-2xl font-bold">{formatCurrency(data?.total_cost || 0)}</span>
            <span className="text-xs text-muted-foreground">{period}</span>
          </div>
          
          <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Average per Employee</span>
            <span className="text-2xl font-bold">{formatCurrency(data?.cost_per_employee || 0)}</span>
            <span className="text-xs text-muted-foreground">{period}</span>
          </div>
          
          <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Cost to Revenue</span>
            <span className="text-2xl font-bold">{data?.efficiency_metrics?.cost_to_revenue_ratio ? 
              (data.efficiency_metrics.cost_to_revenue_ratio * 100).toFixed(1) + '%' : '0%'}</span>
            <span className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Healthy ratio
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Costs by Department</h3>
            <BarChart 
              data={data?.by_department.map(dept => ({
                department: dept.department,
                cost: dept.cost
              })) || []}
              xAxisKey="department"
              height={260}
              series={[
                { name: 'cost', color: '#4f46e5' }
              ]}
              valueFormatter={(value) => formatCurrency(value)}
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Headcount Distribution</h3>
            <PieChart 
              data={data?.by_department.map(dept => ({
                name: dept.department,
                value: dept.headcount,
                color: getRandomColor(dept.department)
              })) || []}
              height={260}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Cost Trend</h3>
          <BarChart 
            data={data?.cost_trends || []}
            xAxisKey="month"
            height={200}
            series={[
              { name: 'cost', color: '#4f46e5' }
            ]}
            valueFormatter={(value) => formatCurrency(value)}
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col">
            <div className="text-sm text-muted-foreground">Revenue per Employee</div>
            <div className="text-xl font-semibold">{formatCurrency(data?.efficiency_metrics?.revenue_per_employee || 0)}</div>
            <div className="text-xs text-muted-foreground">{period}</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col">
            <div className="text-sm text-muted-foreground">Profit per Employee</div>
            <div className="text-xl font-semibold">{formatCurrency(data?.efficiency_metrics?.profit_per_employee || 0)}</div>
            <div className="text-xs text-muted-foreground">{period}</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col">
            <div className="text-sm text-muted-foreground">Cost to Revenue</div>
            <div className="text-xl font-semibold">
              {data?.efficiency_metrics?.cost_to_revenue_ratio 
                ? (data.efficiency_metrics.cost_to_revenue_ratio * 100).toFixed(1) + '%' 
                : '0%'}
            </div>
            <div className="text-xs text-muted-foreground">{period}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to generate consistent colors based on department name
function getRandomColor(name: string) {
  const colors = [
    '#4f46e5', // Indigo
    '#0ea5e9', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
  ];
  
  // Use string hash to pick a consistent color
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export default TeamCostsAnalysis;
