
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, AlertCircle, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskProgressAnalysisProps {
  analysis: {
    analysis: string;
    suggestions: string[];
    completion_percentage?: number;
    efficiency_score?: number;
    quality_assessment?: string;
  };
  isLoading?: boolean;
}

const TaskProgressAnalysis = ({ analysis, isLoading = false }: TaskProgressAnalysisProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Progress Analysis</CardTitle>
          <Sparkles className="h-5 w-5 text-purple-500" />
        </div>
        <CardDescription>Automated analysis of your task progress</CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>No analysis available yet</p>
            <p className="text-xs mt-1">Upload work progress or screenshots for AI analysis</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">{analysis.analysis}</p>
            
            {analysis.completion_percentage !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completion Estimate:</span>
                <Badge variant="outline" className="bg-blue-50">
                  {analysis.completion_percentage}%
                </Badge>
              </div>
            )}
            
            {analysis.efficiency_score !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Efficiency Score:</span>
                <Badge variant="outline" className="bg-green-50">
                  {analysis.efficiency_score}/10
                </Badge>
              </div>
            )}
            
            {analysis.quality_assessment && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Quality Assessment:</span>
                <Badge variant="outline" className="bg-purple-50">
                  {analysis.quality_assessment}
                </Badge>
              </div>
            )}
            
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Suggestions:</h4>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskProgressAnalysis;
