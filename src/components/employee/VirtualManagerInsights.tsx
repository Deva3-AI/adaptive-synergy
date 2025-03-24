
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, AlertCircle, Clock, ThumbsUp, Sparkles, RotateCw, CheckCircle, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import aiUtils from '@/utils/aiUtils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VirtualManagerInsightsProps {
  clientId?: number;
  taskId?: number;
  employeeName?: string;
}

interface Insight {
  id: string;
  type: 'tip' | 'warning' | 'deadline' | 'preference';
  content: string;
  priority: 'low' | 'medium' | 'high';
  acknowledgable?: boolean;
}

const VirtualManagerInsights = ({ clientId, taskId, employeeName }: VirtualManagerInsightsProps) => {
  const [acknowledgedInsights, setAcknowledgedInsights] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const { data: insights = [], isLoading, refetch } = useQuery({
    queryKey: ['virtualManagerInsights', clientId, taskId, refreshKey],
    queryFn: async () => {
      if (!clientId && !taskId) return [];
      
      // Get insights based on client history and task details
      return aiUtils.getManagerInsights({ clientId, taskId });
    },
    enabled: !!(clientId || taskId),
  });

  const handleRefreshInsights = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
    toast.info("Refreshing AI insights...");
  };

  const acknowledgeInsight = (insightId: string) => {
    setAcknowledgedInsights(prev => [...prev, insightId]);
    toast.success("Insight acknowledged");
  };

  const dismissInsight = (insightId: string) => {
    setAcknowledgedInsights(prev => [...prev, insightId]);
    toast.info("Insight dismissed");
  };

  const isAcknowledged = (insightId: string) => acknowledgedInsights.includes(insightId);

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

  // Filter out acknowledged insights for the main display
  const activeInsights = insights.filter((insight: Insight) => 
    !isAcknowledged(insight.id) || !insight.acknowledgable
  );

  // Count by type
  const insightCounts = insights.reduce((acc: Record<string, number>, insight: Insight) => {
    acc[insight.type] = (acc[insight.type] || 0) + 1;
    return acc;
  }, {});

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
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/ai-assistant.png" alt="AI Assistant" />
              <AvatarFallback>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Virtual Manager</CardTitle>
              <CardDescription>AI-powered insights for optimal performance</CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefreshInsights} 
            className="h-8 px-2"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {insights.length > 0 && (
        <div className="px-6 py-2 border-t border-b bg-muted/30">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex space-x-2">
              {Object.entries(insightCounts).map(([type, count]) => (
                <Badge key={type} variant="outline" className="bg-background">
                  {getInsightIcon(type)} <span className="ml-1">{count} {type}</span>
                </Badge>
              ))}
            </div>
            <span>
              {acknowledgedInsights.length} of {insights.length} acknowledged
            </span>
          </div>
          <Progress 
            value={(acknowledgedInsights.length / insights.length) * 100} 
            className="h-1 mt-2" 
          />
        </div>
      )}
      
      <CardContent className="pt-4">
        {activeInsights.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No specific insights available.</p>
            <p className="text-xs mt-1">Insights will appear as you work on more tasks for this client.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeInsights.map((insight: Insight) => (
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
                  
                  {insight.acknowledgable && !isAcknowledged(insight.id) && (
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => dismissInsight(insight.id)}
                      >
                        <X className="h-3 w-3 mr-1" /> Dismiss
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => acknowledgeInsight(insight.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" /> Acknowledge
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {employeeName && (
        <CardFooter className="px-6 py-3 border-t bg-muted/10 flex justify-between">
          <span className="text-xs text-muted-foreground">
            Personalized for: {employeeName}
          </span>
          <span className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </CardFooter>
      )}
    </Card>
  );
};

export default VirtualManagerInsights;
