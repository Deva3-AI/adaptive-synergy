import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { financeService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CheckSquare, Calendar, TrendingUp, Activity, Users, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

interface TeamCostsAnalysisProps {
  startDate?: string;
  endDate?: string;
}

const TeamCostsAnalysis = ({ startDate, endDate }: TeamCostsAnalysisProps) => {
  // Update to use getTeamCosts instead of analyzeTeamCosts
  const { data: costAnalysis, isLoading } = useQuery({
    queryKey: ['team-costs', startDate, endDate],
    queryFn: () => financeService.getTeamCosts(startDate, endDate),
  });

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Team Costs Breakdown"
          icon={<Users className="h-5 w-5" />}
          badgeText="Current Period"
          badgeVariant="outline"
        >
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <AnalyticsChart 
              data={costAnalysis?.costsBreakdown || []} 
              height={300}
              defaultType="pie"
            />
          )}
        </DashboardCard>

        <DashboardCard
          title="Cost Trends Over Time"
          icon={<BarChart className="h-5 w-5" />}
          badgeText="Last 6 Months"
          badgeVariant="outline"
        >
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <AnalyticsChart 
              data={costAnalysis?.costTrends || []} 
              height={300}
              defaultType="line"
            />
          )}
        </DashboardCard>
      </div>

      <DashboardCard
        title="Detailed Cost Analysis"
        icon={<FileText className="h-5 w-5" />}
        badgeText="By Employee"
        badgeVariant="outline"
      >
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Benefits</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(costAnalysis?.employeeCosts || []).map((employee: any) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{formatCurrency(employee.salary)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.benefits)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.totalCost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DashboardCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Cost Saving Opportunities"
          icon={<CheckSquare className="h-5 w-5" />}
          badgeText="AI Generated"
          badgeVariant="outline"
        >
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Based on your team costs, here are potential saving opportunities:</p>
              <ul className="space-y-2">
                {(costAnalysis?.savingOpportunities || []).map((opportunity: string, index: number) => (
                  <li key={index} className="text-sm flex items-start">
                    <CheckSquare className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          title="Upcoming Budget Reviews"
          icon={<Calendar className="h-5 w-5" />}
          badgeText="Next 3 Months"
          badgeVariant="outline"
        >
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {(costAnalysis?.budgetReviews || []).map((review: any) => (
                <div key={review.id} className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{review.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{review.date} · {review.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default TeamCostsAnalysis;
