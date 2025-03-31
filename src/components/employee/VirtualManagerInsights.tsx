
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle, CalendarDays, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import aiService from '@/services/api/aiService';
import { cn } from '@/lib/utils';

interface VirtualManagerInsightsProps {
  taskId: number;
  className?: string;
}

const VirtualManagerInsights: React.FC<VirtualManagerInsightsProps> = ({ taskId, className }) => {
  // Fetch insights for a specific task
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['manager-insights', taskId],
    queryFn: () => aiService.generateManagerInsights(taskId),
    enabled: !!taskId,
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'quality':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'planning':
        return <CalendarDays className="h-4 w-4 text-blue-500" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">Virtual Manager Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full mb-3" />
            <Skeleton className="h-16 w-full mb-3" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : error ? (
          <div className="text-center p-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load insights</p>
            <Button variant="outline" size="sm" className="mt-2">Retry</Button>
          </div>
        ) : !insights || insights.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">No insights available for this task</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight: any, i: number) => (
              <div key={i} className="p-3 bg-muted rounded-lg flex items-start">
                <div className="flex-shrink-0 p-1">
                  {getIconForType(insight.type)}
                </div>
                <div className="ml-2 flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <Badge variant={getBadgeVariant(insight.priority)} className="text-[10px]">
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
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
