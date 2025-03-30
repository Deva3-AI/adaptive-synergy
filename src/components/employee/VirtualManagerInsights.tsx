
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { aiService } from '@/services/api';
import { toast } from 'sonner';

interface VirtualManagerInsightsProps {
  clientId: number;
  taskId?: number;
  className?: string;
}

const VirtualManagerInsights: React.FC<VirtualManagerInsightsProps> = ({ 
  clientId, 
  taskId,
  className 
}) => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const { 
    data: insights, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['managerInsights', clientId, taskId, refreshKey],
    queryFn: async () => {
      // Get client preferences and insights from AI service
      return await aiService.getAIManagerInsights({ clientId, taskId });
    },
    enabled: !!clientId,
  });

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
    toast.info('Refreshing client insights...');
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Virtual Manager Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Virtual Manager Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            <p>Error loading insights. Please try again.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Virtual Manager Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No insights available for this client.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          Virtual Manager Insights
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key insights */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Client Insights</h3>
          <ul className="space-y-2">
            {insights.insights.map((insight: string, i: number) => (
              <li key={i} className="text-sm flex items-start">
                <span className="mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Warnings */}
        {insights.warnings.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center text-amber-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Important Warnings
            </h3>
            <ul className="space-y-2">
              {insights.warnings.map((warning: string, i: number) => (
                <li key={i} className="text-sm bg-amber-50 text-amber-700 px-3 py-2 rounded-md">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Suggestions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Suggestions
          </h3>
          <ul className="space-y-2">
            {insights.suggestions.map((suggestion: string, i: number) => (
              <li key={i} className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-md">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2">
          <Badge variant="outline" className="flex items-center justify-center w-full">
            <Brain className="h-3 w-3 mr-1" />
            <span className="text-xs">Powered by AI based on client history and preferences</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualManagerInsights;
