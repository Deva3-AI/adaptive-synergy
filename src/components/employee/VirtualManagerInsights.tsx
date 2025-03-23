
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Clock, ThumbsUp, AlertCircle, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import aiUtils from '@/utils/aiUtils';
import { Badge } from "@/components/ui/badge";

interface VirtualManagerInsightsProps {
  clientId?: number;
  taskId?: number;
}

interface Insight {
  id: string;
  type: 'tip' | 'warning' | 'deadline' | 'preference';
  content: string;
  priority: 'low' | 'medium' | 'high';
}

const VirtualManagerInsights = ({ clientId, taskId }: VirtualManagerInsightsProps) => {
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['virtualManagerInsights', clientId, taskId],
    queryFn: async () => {
      if (!clientId && !taskId) return [];
      
      // Get insights based on client history and task details
      return aiUtils.getManagerInsights({ clientId, taskId });
    },
    enabled: !!(clientId || taskId),
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'deadline':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'preference':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-purple-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-amber-600 bg-amber-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Virtual Manager</CardTitle>
          <Sparkles className="h-5 w-5 text-purple-500" />
        </div>
        <CardDescription>Insights and recommendations for this task</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {insights.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No specific insights available.</p>
            <p className="text-xs mt-1">Insights will appear as you work on more tasks for this client.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map(insight => (
              <div key={insight.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium capitalize">{insight.type}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-1.5 py-0 h-5 ${getPriorityColor(insight.priority)}`}
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualManagerInsights;
