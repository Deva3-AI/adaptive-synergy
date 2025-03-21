
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Clock, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { analyzeEmployeePerformance } from '@/utils/aiUtils';
import { toast } from 'sonner';
import AIInsightCard from './AIInsightCard';

interface EmployeePerformanceInsightsProps {
  employeeId: number;
  employeeName: string;
  attendanceData: any[];
  taskData: any[];
}

const EmployeePerformanceInsights = ({
  employeeId,
  employeeName,
  attendanceData,
  taskData
}: EmployeePerformanceInsightsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);

  const generatePerformanceInsights = async () => {
    if (!employeeId || attendanceData.length === 0) {
      toast.error('Not enough data to generate performance insights');
      return;
    }

    setIsLoading(true);
    try {
      const filtered = {
        attendanceData: attendanceData.filter(a => a.user_id === employeeId),
        taskData: taskData.filter(t => t.assigned_to === employeeId)
      };

      // If not enough data, show an error
      if (filtered.attendanceData.length === 0 && filtered.taskData.length === 0) {
        toast.error('Not enough historical data to generate insights');
        setIsLoading(false);
        return;
      }

      const results = await analyzeEmployeePerformance(
        filtered.attendanceData,
        filtered.taskData
      );
      
      setPerformanceData(results);
    } catch (error) {
      console.error('Error generating performance insights:', error);
      toast.error('Failed to generate performance insights');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate initial insights on component mount
  useEffect(() => {
    if (employeeId && (attendanceData.length > 0 || taskData.length > 0)) {
      generatePerformanceInsights();
    }
  }, [employeeId, attendanceData.length, taskData.length]);

  if (!performanceData && !isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium flex items-center">
            <Brain className="mr-2 h-5 w-5 text-accent" />
            Performance Insights
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={generatePerformanceInsights}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Generate Insights
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No performance data available. Click "Generate Insights" to analyze this employee's performance.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          <Brain className="mr-2 h-5 w-5 text-accent" />
          AI Performance Analysis for {employeeName}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={generatePerformanceInsights}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/4 h-24 bg-muted rounded"></div>
              <div className="w-1/4 h-24 bg-muted rounded"></div>
              <div className="w-1/4 h-24 bg-muted rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Average Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className="text-3xl font-bold">
                    {performanceData.metrics.avg_hours_worked.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">hrs/day</p>
                </CardContent>
              </Card>
              
              <Card className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Task Completion
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className="text-3xl font-bold">
                    {performanceData.metrics.task_completion_rate.toFixed(0)}%
                  </div>
                  <Progress 
                    value={performanceData.metrics.task_completion_rate} 
                    className="h-1.5 mt-2" 
                  />
                </CardContent>
              </Card>
              
              <Card className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Efficiency Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className="text-3xl font-bold">
                    {performanceData.metrics.efficiency_rate.toFixed(0)}%
                  </div>
                  <p className="text-xs text-muted-foreground">estimated vs actual time</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <AIInsightCard
                title="Performance Assessment"
                insights={[performanceData.performance_assessment.explanation]}
                type={
                  performanceData.performance_assessment.rating === 'excellent' || 
                  performanceData.performance_assessment.rating === 'good' ? 'success' :
                  performanceData.performance_assessment.rating === 'poor' ? 'danger' :
                  'warning'
                }
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AIInsightCard
                  title="Strengths"
                  insights={performanceData.strengths}
                  type="success"
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />
                
                <AIInsightCard
                  title="Areas for Improvement"
                  insights={performanceData.improvement_areas}
                  type="warning"
                  icon={<AlertTriangle className="h-4 w-4" />}
                />
              </div>
              
              <AIInsightCard
                title="Recommendations"
                insights={performanceData.recommendations}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeePerformanceInsights;
