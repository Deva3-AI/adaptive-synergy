
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Timer, ThumbsUp, Coffee, Users, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { aiService } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

interface VirtualManagerInsightsProps {
  taskId: number | null;
}

const VirtualManagerInsights: React.FC<VirtualManagerInsightsProps> = ({ taskId }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [timelineRisk, setTimelineRisk] = useState<string>('low');
  const [timelineSuggestions, setTimelineSuggestions] = useState<string[]>([]);
  const [qualityInsights, setQualityInsights] = useState<string[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['manager-insights', taskId],
    queryFn: () => aiService.generateManagerInsights(taskId),
    enabled: !!taskId,
  });

  useEffect(() => {
    if (data) {
      setTips(data.tips || []);
      setTimelineRisk(data.timeline_risk || 'low');
      setTimelineSuggestions(data.timeline_suggestions || []);
      setQualityInsights(data.quality_insights || []);
      setResources(data.resources || []);
    }
  }, [data]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          Virtual Manager Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-red-500">Error loading insights.</div>
        ) : (
          <div className="space-y-4">
            {tips.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center">
                  <Coffee className="mr-1 h-4 w-4 text-gray-400" />
                  Quick Tips
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-700">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <Timer className="mr-1 h-4 w-4 text-gray-400" />
                Timeline Risk
                <Badge
                  variant={timelineRisk === 'high' ? 'destructive' : timelineRisk === 'medium' ? 'warning' : 'success'}
                  className="ml-2"
                >
                  {timelineRisk}
                </Badge>
              </h4>
              {timelineSuggestions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {timelineSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No timeline suggestions available.</p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <ThumbsUp className="mr-1 h-4 w-4 text-gray-400" />
                Quality Insights
              </h4>
              {qualityInsights.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {qualityInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-700">{insight}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No quality insights available.</p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <Users className="mr-1 h-4 w-4 text-gray-400" />
                Resources
              </h4>
              {resources.length > 0 ? (
                <ul className="space-y-2">
                  {resources.map((resource, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                        {resource.title}
                      </a>
                      <Button variant="link" size="sm">
                        View
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No resources available.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualManagerInsights;
