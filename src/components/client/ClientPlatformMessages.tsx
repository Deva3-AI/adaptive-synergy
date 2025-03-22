
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SlackIcon, MessageSquare, Trello, FileSpreadsheet, Mail } from "lucide-react";
import { 
  platformService, 
  PlatformMessage, 
  PlatformType 
} from '@/utils/platformIntegrations';
import platformAnalysisService from '@/services/api/platformAnalysisService';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import AIInsightCard from '@/components/ai/AIInsightCard';

interface ClientPlatformMessagesProps {
  clientId: number;
  clientName: string;
  onGenerateTasks?: (tasks: any[]) => void;
}

const getPlatformIcon = (platform: PlatformType) => {
  switch (platform) {
    case 'slack':
      return <SlackIcon className="h-4 w-4 text-[#4A154B]" />;
    case 'discord':
      return <MessageSquare className="h-4 w-4 text-[#7289DA]" />;
    case 'trello':
      return <Trello className="h-4 w-4 text-[#0079BF]" />;
    case 'asana':
      return <FileSpreadsheet className="h-4 w-4 text-[#FC636B]" />;
    case 'gmail':
    case 'zoho':
      return <Mail className="h-4 w-4 text-[#D14836]" />;
    case 'whatsapp':
      return <MessageSquare className="h-4 w-4 text-[#25D366]" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ClientPlatformMessages: React.FC<ClientPlatformMessagesProps> = ({
  clientId,
  clientName,
  onGenerateTasks
}) => {
  const [messages, setMessages] = useState<PlatformMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const clientMessages = await platformService.fetchAllClientMessages(clientId);
      setMessages(clientMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch client messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMessages();
  }, [clientId]);
  
  const analyzeMessages = async () => {
    if (messages.length === 0) {
      toast.error('No messages to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const analysis = await platformAnalysisService.analyzeMessages(messages);
      setInsights(analysis);
    } catch (error) {
      console.error('Error analyzing messages:', error);
      toast.error('Failed to analyze messages');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const generateTasks = async () => {
    if (messages.length === 0) {
      toast.error('No messages to analyze for task generation');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const suggestions = await platformAnalysisService.generateTaskSuggestions(messages, clientId);
      
      if (onGenerateTasks && suggestions && suggestions.suggested_tasks) {
        onGenerateTasks(suggestions.suggested_tasks);
        toast.success('Tasks generated from platform messages');
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast.error('Failed to generate tasks from messages');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getMessageDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">
          Communication Channels
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchMessages}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={analyzeMessages}
            disabled={isAnalyzing || messages.length === 0}
          >
            Analyze
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="messages">
          <TabsList className="mb-4">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages">
            <ScrollArea className="h-[400px] pr-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <MessageSquare className="mx-auto h-10 w-10 opacity-20 mb-2" />
                  <p>No messages found for this client.</p>
                  <p className="text-sm mt-1">Connect platforms to view communication history.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className="flex gap-3 py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.sender}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>{getPlatformIcon(message.platform)}</span>
                            <span>via {message.platform}</span>
                          </div>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {getMessageDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            {messages.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateTasks}
                  disabled={isAnalyzing}
                >
                  Generate Tasks
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="insights">
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !insights ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No insights yet.</p>
                <p className="text-sm mt-1">Analyze messages to generate insights.</p>
                <Button 
                  className="mt-4" 
                  size="sm"
                  onClick={analyzeMessages}
                  disabled={messages.length === 0}
                >
                  Analyze Messages
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <AIInsightCard
                  title="Client Sentiment & Priority"
                  insights={[
                    `Client sentiment: ${insights.sentiment?.charAt(0).toUpperCase() + insights.sentiment?.slice(1) || 'Neutral'}`,
                    `Priority level: ${insights.priority_level?.charAt(0).toUpperCase() + insights.priority_level?.slice(1) || 'Medium'}`
                  ]}
                  type={insights.sentiment === 'positive' ? 'success' : insights.sentiment === 'negative' ? 'danger' : 'info'}
                />
                
                <AIInsightCard
                  title="Key Requirements"
                  insights={insights.key_requirements || ["No specific requirements detected"]}
                />
                
                <div className="mt-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={analyzeMessages}
                  >
                    Re-analyze
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={generateTasks}
                  >
                    Generate Tasks
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientPlatformMessages;
