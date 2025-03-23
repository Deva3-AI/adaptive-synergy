
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, RefreshCw, Sparkles } from "lucide-react";
import AIInsightCard from '@/components/ai/AIInsightCard';
import TaskSuggestionCard from '@/components/ai/TaskSuggestionCard';
import { analyzeClientInput, generateSuggestedTasks } from '@/utils/aiUtils';
import { platformService, PlatformMessage as PlatformIntegrationMessage } from '@/utils/platformIntegrations';
import platformAnalysisService, { PlatformMessage as AnalysisPlatformMessage } from '@/services/api/platformAnalysisService';
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

// Helper function to convert between message types
const convertToAnalysisMessages = (messages: PlatformIntegrationMessage[]): AnalysisPlatformMessage[] => {
  return messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: msg.sender,
    timestamp: msg.timestamp,
    platform: msg.platform as any, // Type assertion to handle platform type conversion
    metadata: { clientId: msg.client_id }
  }));
};

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
  const [usePlatformData, setUsePlatformData] = useState(true);

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
    if (usePlatformData) {
      await generateInsightsFromPlatforms();
    } else {
      await generateInsightsFromText();
    }
  };

  // Generate insights from integrated platforms
  const generateInsightsFromPlatforms = async () => {
    setIsLoadingInsights(true);
    try {
      const messages = await platformService.fetchAllClientMessages(clientId);
      
      if (messages.length === 0) {
        toast.warning('No platform messages found. Using direct client data.');
        await generateInsightsFromText();
        return;
      }
      
      // Convert messages to the format expected by platformAnalysisService
      const analysisMessages = convertToAnalysisMessages(messages);
      const insights = await platformAnalysisService.analyzeMessages(analysisMessages);
      setClientInsights(insights);
    } catch (error) {
      console.error('Error generating insights from platforms:', error);
      toast.error('Failed to generate insights from platforms');
      
      // Fallback to direct text analysis
      await generateInsightsFromText();
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Generate insights from direct text
  const generateInsightsFromText = async () => {
    if (!combinedClientText.trim()) {
      toast.error('Not enough client data to generate insights');
      setIsLoadingInsights(false);
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
    if (usePlatformData) {
      await generateTasksFromPlatforms();
    } else {
      await generateTasksFromText();
    }
  };

  // Generate tasks from integrated platforms
  const generateTasksFromPlatforms = async () => {
    setIsLoadingTasks(true);
    try {
      const messages = await platformService.fetchAllClientMessages(clientId);
      
      if (messages.length === 0) {
        toast.warning('No platform messages found. Using direct client data.');
        await generateTasksFromText();
        return;
      }
      
      // Convert messages to the format expected by platformAnalysisService
      const analysisMessages = convertToAnalysisMessages(messages);
      const suggestions = await platformAnalysisService.generateTaskSuggestions(analysisMessages, clientId);
      setTaskSuggestions(suggestions?.suggested_tasks || []);
    } catch (error) {
      console.error('Error generating tasks from platforms:', error);
      toast.error('Failed to generate tasks from platforms');
      
      // Fallback to direct text analysis
      await generateTasksFromText();
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Generate tasks from direct text
  const generateTasksFromText = async () => {
    if (!combinedClientText.trim()) {
      toast.error('Not enough client data to generate task suggestions');
      setIsLoadingTasks(false);
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

  const toggleDataSource = () => {
    setUsePlatformData(!usePlatformData);
    toast.info(`Using ${!usePlatformData ? 'platform' : 'direct'} data for analysis`);
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
            variant="ghost" 
            size="sm"
            onClick={toggleDataSource}
            className="text-xs"
          >
            {usePlatformData ? "Using Platform Data" : "Using Direct Data"}
          </Button>
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
                    `Client sentiment: ${clientInsights.sentiment?.charAt(0).toUpperCase() + clientInsights.sentiment?.slice(1) || 'Neutral'}`,
                    `Priority level: ${clientInsights.priority_level?.charAt(0).toUpperCase() + clientInsights.priority_level?.slice(1) || 'Medium'}`
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
