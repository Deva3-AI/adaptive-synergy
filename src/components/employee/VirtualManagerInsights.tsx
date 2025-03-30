
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, AlertTriangle, Brain, CheckCircle, Clock, Info, Lightbulb, RotateCw, ThumbsDown, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { aiService } from '@/services/api';

interface VirtualManagerInsightsProps {
  clientId: number;
  employeeName?: string;
  taskId?: number;
}

interface Insight {
  id: string;
  type: 'tip' | 'warning' | 'deadline' | 'preference';
  content: string;
  priority: 'low' | 'medium' | 'high';
  acknowledgable: boolean;
  acknowledged?: boolean;
}

const VirtualManagerInsights: React.FC<VirtualManagerInsightsProps> = ({ 
  clientId, 
  employeeName,
  taskId 
}) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskHistory, setTaskHistory] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const fetchedInsights = await aiService.getManagerInsights({ clientId, taskId });
        setInsights(fetchedInsights);
        
        // Also fetch task history for this client if available
        if (clientId) {
          // This would be a call to get historical tasks for time estimation insights
          // For now we'll use mock data
          setTaskHistory([
            { 
              title: 'Website Banner Design', 
              completed_time: 3.2, 
              estimated_time: 4, 
              date: '2023-08-15'
            },
            { 
              title: 'Logo Revision', 
              completed_time: 1.5, 
              estimated_time: 2, 
              date: '2023-09-02'
            },
            { 
              title: 'Social Media Post Design', 
              completed_time: 2.1, 
              estimated_time: 1.5, 
              date: '2023-09-10'
            }
          ]);
        }
        
      } catch (error) {
        console.error('Error fetching manager insights:', error);
        toast.error('Failed to load manager insights');
      } finally {
        setLoading(false);
      }
    };
    
    if (clientId) {
      fetchInsights();
    }
  }, [clientId, taskId]);
  
  const acknowledgeInsight = (insightId: string) => {
    setInsights(prev => 
      prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, acknowledged: true } 
          : insight
      )
    );
    toast.success('Insight acknowledged');
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-primary" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'deadline':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'preference':
        return <ThumbsUp className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const refreshInsights = async () => {
    try {
      setLoading(true);
      toast.info('Refreshing insights...');
      const fetchedInsights = await aiService.getManagerInsights({ clientId, taskId });
      setInsights(fetchedInsights);
      toast.success('Insights refreshed');
    } catch (error) {
      console.error('Error refreshing insights:', error);
      toast.error('Failed to refresh insights');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Virtual Manager</CardTitle>
          <CardDescription>Loading insights...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse space-y-4 w-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted rounded-md w-full"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              Virtual Manager
            </CardTitle>
            <CardDescription>
              Personalized insights for working with this client
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refreshInsights}
            title="Refresh insights"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[380px]">
          <div className="p-4 space-y-4">
            {insights.length > 0 ? (
              insights.map(insight => (
                <div 
                  key={insight.id}
                  className={`p-3 rounded-md border ${
                    insight.acknowledged ? 'bg-muted/50 opacity-70' : ''
                  } ${
                    insight.priority === 'high' ? 'border-red-200 bg-red-50' : 
                    insight.priority === 'medium' ? 'border-amber-200 bg-amber-50' : 
                    'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2 mb-1">
                      {getIconForType(insight.type)}
                      <span className="font-medium text-sm">
                        {insight.type === 'tip' ? 'Suggestion' : 
                         insight.type === 'warning' ? 'Important Warning' : 
                         insight.type === 'deadline' ? 'Time Insight' : 
                         'Client Preference'}
                      </span>
                      {insight.priority === 'high' && (
                        <Badge variant="destructive">High Priority</Badge>
                      )}
                    </div>
                    {insight.acknowledgable && !insight.acknowledged && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => acknowledgeInsight(insight.id)}
                        className="h-6 text-xs"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                  <p className="text-sm mt-1">{insight.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="mx-auto h-8 w-8 opacity-20 mb-2" />
                <p>No specific insights available for this client yet.</p>
                <p className="text-xs mt-1">Insights will appear as you work with this client.</p>
              </div>
            )}
            
            {taskHistory.length > 0 && (
              <>
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Historical Time Analysis
                  </h3>
                  
                  <div className="space-y-3">
                    {taskHistory.map((task, index) => (
                      <div key={index} className="border rounded-md p-2">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium">{task.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {task.date}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <span>Estimated: {task.estimated_time}h</span>
                            <Separator orientation="vertical" className="mx-2 h-3" />
                            <span>Actual: {task.completed_time}h</span>
                            <Separator orientation="vertical" className="mx-2 h-3" />
                            <Badge variant={task.completed_time <= task.estimated_time ? "success" : "destructive"} className="text-xs">
                              {task.completed_time <= task.estimated_time 
                                ? `${Math.round((1 - task.completed_time/task.estimated_time) * 100)}% faster` 
                                : `${Math.round((task.completed_time/task.estimated_time - 1) * 100)}% slower`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default VirtualManagerInsights;
