
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, RefreshCw, Sparkles } from "lucide-react";
import AIInsightCard from '@/components/ai/AIInsightCard';
import TaskSuggestionCard from '@/components/ai/TaskSuggestionCard';
import { analyzeClientInput, generateSuggestedTasks } from '@/utils/aiUtils';
import { toast } from 'sonner';

interface ClientAIInsightsProps {
  clientId: number;
  clientName: string;
  clientDescription?: string;
  communicationLogs?: Array<{
    message: string;
    created_at: string;
    channel: string;
  }>;
  onTaskCreated?: () => void;
}

const ClientAIInsights = ({
  clientId,
  clientName,
  clientDescription,
  communicationLogs = [],
  onTaskCreated
}: ClientAIInsightsProps) => {
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [clientInsights, setClientInsights] = useState<any>(null);
  const [taskSuggestions, setTaskSuggestions] = useState<any[]>([]);

  // Get recent communications for analysis
  const recentCommunications = communicationLogs
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .map(log => log.message)
    .join('\n\n');

  const combinedClientText = `
    Client Name: ${clientName}
    ${clientDescription ? `Description: ${clientDescription}` : ''}
    ${recentCommunications ? `Recent Communications:\n${recentCommunications}` : ''}
  `;

  // Generate client insights
  const generateClientInsights = async () => {
    if (!combinedClientText.trim()) {
      toast.error('Not enough client data to generate insights');
      return;
    }

    setIsLoadingInsights(true);
    try {
      const results = await analyzeClientInput(combinedClientText);
      setClientInsights(results);
    } catch (error) {
      console.error('Error generating client insights:', error);
      toast.error('Failed to generate client insights');
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Generate task suggestions
  const generateTaskSuggestions = async () => {
    if (!combinedClientText.trim()) {
      toast.error('Not enough client data to generate task suggestions');
      return;
    }

    setIsLoadingTasks(true);
    try {
      const results = await generateSuggestedTasks(combinedClientText, clientId);
      setTaskSuggestions(results?.suggested_tasks || []);
    } catch (error) {
      console.error('Error generating task suggestions:', error);
      toast.error('Failed to generate task suggestions');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Generate initial insights on component mount
  useEffect(() => {
    if (combinedClientText.trim()) {
      generateClientInsights();
      generateTaskSuggestions();
    }
  }, [clientId]);

  // Add animation to the insights card
  const getAnimationDelay = (index: number) => {
    return { animationDelay: `${(index + 1) * 150}ms` };
  };

  return (
    <Card className="overflow-hidden shadow-lg border-accent/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-accent/5">
        <CardTitle className="text-lg font-medium flex items-center">
          <Brain className="mr-2 h-5 w-5 text-accent" />
          AI Insights & Suggestions
        </CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              generateClientInsights();
              generateTaskSuggestions();
            }}
            disabled={isLoadingInsights || isLoadingTasks}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${(isLoadingInsights || isLoadingTasks) ? 'animate-spin' : ''}`} />
            Refresh Insights
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="insights">
          <TabsList className="mb-4">
            <TabsTrigger value="insights">Client Insights</TabsTrigger>
            <TabsTrigger value="tasks">Task Suggestions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="mt-0 space-y-4 animate-fade-in">
            {clientInsights ? (
              <div className="space-y-4">
                <AIInsightCard
                  title="Client Sentiment & Priority"
                  insights={[
                    `Client sentiment: ${clientInsights.sentiment.charAt(0).toUpperCase() + clientInsights.sentiment.slice(1)}`,
                    `Priority level: ${clientInsights.priority_level.charAt(0).toUpperCase() + clientInsights.priority_level.slice(1)}`
                  ]}
                  type={clientInsights.sentiment === 'positive' ? 'success' : clientInsights.sentiment === 'negative' ? 'danger' : 'info'}
                  isLoading={isLoadingInsights}
                  animation="pulse"
                />
                
                <AIInsightCard
                  title="Key Client Requirements"
                  insights={clientInsights.key_requirements || ["No specific requirements detected"]}
                  isLoading={isLoadingInsights}
                  icon={<Sparkles className="h-4 w-4" />}
                  animation="pulse"
                />
              </div>
            ) : (
              <AIInsightCard
                title="Client Insights"
                insights={["Analyzing client data to generate insights..."]}
                isLoading={isLoadingInsights}
                animation="pulse"
              />
            )}
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0 animate-fade-in" style={getAnimationDelay(1)}>
            <TaskSuggestionCard
              clientId={clientId}
              clientName={clientName}
              suggestions={taskSuggestions}
              onTaskCreated={onTaskCreated}
              isLoading={isLoadingTasks}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientAIInsights;
