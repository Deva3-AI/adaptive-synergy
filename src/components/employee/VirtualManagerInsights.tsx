
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import aiService from '@/services/api/aiService';
import { VirtualManagerInsightsProps } from '@/types';

const VirtualManagerInsights: React.FC<VirtualManagerInsightsProps> = ({ userId, clientId }) => {
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['manager-insights', userId, clientId],
    queryFn: () => aiService.generateManagerInsights(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <CardHeader className="bg-muted/40 pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
            Virtual Manager Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-muted rounded w-4/5 mb-4"></div>
          <div className="h-6 bg-muted rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !insights) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/40 pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
            Virtual Manager Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Failed to load manager insights
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/40 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
          Virtual Manager Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Client Tendencies Section */}
          <div>
            <h3 className="font-medium text-md mb-2 flex items-center">
              <Badge variant="outline" className="mr-2">Client</Badge>
              Client Tendencies
            </h3>
            <ul className="space-y-2">
              {insights.clientTendencies.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Performance Insights Section */}
          <div>
            <h3 className="font-medium text-md mb-2 flex items-center">
              <Badge variant="outline" className="mr-2">Performance</Badge>
              Your Performance Insights
            </h3>
            <ul className="space-y-2">
              {insights.performanceInsights.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations Section */}
          <div>
            <h3 className="font-medium text-md mb-2 flex items-center">
              <Badge variant="outline" className="mr-2">Action</Badge>
              Recommended Actions
            </h3>
            <ul className="space-y-2">
              {insights.recommendedActions.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualManagerInsights;
