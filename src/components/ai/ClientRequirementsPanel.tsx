
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Calendar, AlertTriangle } from "lucide-react";

interface SuggestedTask {
  title: string;
  description: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
}

interface ClientRequirementsPanelProps {
  analysisResult: {
    suggestedTasks: SuggestedTask[];
    risks: string[];
    recommendations: string[];
  };
}

export const ClientRequirementsPanel: React.FC<ClientRequirementsPanelProps> = ({ 
  analysisResult 
}) => {
  // Helper function to get badge color based on priority
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Suggested Tasks</h3>
        <div className="space-y-4">
          {analysisResult.suggestedTasks.map((task, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="bg-muted px-4 py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span className="font-medium">{task.title}</span>
                </div>
                <Badge variant={getPriorityColor(task.priority) as any}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Estimated time: {task.estimatedTime} hour{task.estimatedTime !== 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {analysisResult.risks && analysisResult.risks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Potential Risks</h3>
          <ul className="space-y-2">
            {analysisResult.risks.map((risk, index) => (
              <li key={index} className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                <span className="text-sm">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Recommendations</h3>
          <ul className="space-y-2">
            {analysisResult.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <Calendar className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
