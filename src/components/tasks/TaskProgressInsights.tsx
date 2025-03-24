
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Brain, RotateCw, Plus, BarChart, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import aiUtils from '@/utils/aiUtils';

interface TaskProgressInsightsProps {
  taskId?: number;
  taskTitle?: string;
  taskDescription?: string;
}

const TaskProgressInsights = ({ taskId, taskTitle, taskDescription }: TaskProgressInsightsProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [implementedSuggestions, setImplementedSuggestions] = useState<string[]>([]);

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['task-progress-analysis', taskId, refreshKey],
    queryFn: async () => {
      if (!taskId) return null;
      
      // Mock progress data - in a real app, this would come from task tracking
      const progressData = {
        completed_subtasks: 3,
        total_subtasks: 7,
        time_spent: 4.5,
        estimated_time: 12,
        current_blockers: [],
        recent_updates: "Completed initial design and started frontend implementation."
      };
      
      return aiUtils.analyzeTaskProgress(taskId, progressData);
    },
    enabled: !!taskId,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.info("Refreshing progress analysis...");
  };

  const handleImplementSuggestion = (suggestion: string) => {
    setImplementedSuggestions(prev => [...prev, suggestion]);
    toast.success("Marked as implemented");
  };

  const isSuggestionImplemented = (suggestion: string) => 
    implementedSuggestions.includes(suggestion);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" /> 
            AI Task Progress Analysis
          </CardTitle>
          <CardDescription>
            Get AI-powered insights on your task progress
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6 text-muted-foreground">
          <p>No analysis available for this task yet.</p>
          <p className="text-xs mt-1">
            Analysis will be available once you start working on the task.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-500" /> 
              AI Task Progress Analysis
            </CardTitle>
            <CardDescription>
              Smart insights to help you complete this task efficiently
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="h-8"
          >
            <RotateCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-md">
            <p className="text-sm">{analysis.analysis}</p>
          </div>
          
          {/* Progress metrics */}
          <div className="grid grid-cols-3 gap-4 pb-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Completion</span>
                <span>{analysis.completion_percentage}%</span>
              </div>
              <Progress value={analysis.completion_percentage} className="h-2" />
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Efficiency Score</span>
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">{analysis.efficiency_score}/10</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Quality Assessment</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {analysis.quality_assessment}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* AI Suggestions */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 mr-1.5 text-yellow-500" />
              Suggestions to Improve
            </h4>
            
            <div className="space-y-2">
              {analysis.suggestions.map((suggestion: string, index: number) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-2 p-3 rounded-md border ${
                    isSuggestionImplemented(suggestion) 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-muted/20'
                  }`}
                >
                  <div className="mt-0.5">
                    {isSuggestionImplemented(suggestion) ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Plus className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 flex justify-between items-start">
                    <p className="text-sm">
                      {suggestion}
                    </p>
                    {!isSuggestionImplemented(suggestion) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleImplementSuggestion(suggestion)}
                        className="h-7 text-xs ml-2"
                      >
                        Implement
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskProgressInsights;
