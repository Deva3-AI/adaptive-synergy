
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, BrainCircuit, CheckCircle, Clock, FileText, MessageSquare, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { aiService, clientService } from '@/services/api';
import type { ClientPreferences } from '@/interfaces/client';

interface ClientRequirementsAnalyzerProps {
  clientId: number;
  onInsightsGenerated?: (insights: any) => void;
}

const ClientRequirementsAnalyzer: React.FC<ClientRequirementsAnalyzerProps> = ({ 
  clientId,
  onInsightsGenerated 
}) => {
  const [clientInput, setClientInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any>(null);
  
  // Fetch client preferences
  const { data: preferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['client-preferences', clientId],
    queryFn: () => clientService.getClientPreferences(clientId),
    enabled: !!clientId
  });
  
  // Fetch client communication history
  const { data: communicationHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['client-communication', clientId],
    queryFn: async () => {
      try {
        // In a real implementation, this would fetch all communication history
        // For demo purposes, we'll return mock data
        return [
          {
            id: 1,
            date: new Date().toISOString(),
            channel: 'Email',
            content: 'We want a vibrant website with bold fonts and a modern layout.'
          },
          {
            id: 2,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            channel: 'Meeting',
            content: 'Client emphasized the importance of mobile responsiveness and quick loading times.'
          },
          {
            id: 3,
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            channel: 'Slack',
            content: 'Please keep our logo sleek and minimal across all materials.'
          }
        ];
      } catch (error) {
        console.error('Error fetching communication history:', error);
        return [];
      }
    },
    enabled: !!clientId
  });
  
  const analyzeRequirements = async () => {
    if (!clientInput.trim() && (!communicationHistory || communicationHistory.length === 0)) {
      toast.error('Please enter client requirements or ensure communication history exists');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Combine current input with historical communication
      const combinedInput = [
        clientInput,
        ...(communicationHistory?.map(c => c.content) || [])
      ].filter(Boolean).join('\n\n');
      
      // Call AI service to analyze the requirements
      const result = await aiService.analyzeClientCommunication(clientId);
      
      // Process results
      setAnalysis(result);
      
      if (onInsightsGenerated) {
        onInsightsGenerated(result);
      }
      
      toast.success('Client requirements analyzed successfully');
    } catch (error) {
      console.error('Error analyzing client requirements:', error);
      toast.error('Failed to analyze client requirements');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Generate mock task suggestions based on client requirements
  const generateTaskSuggestions = () => {
    if (!analysis) return [];
    
    return [
      {
        title: 'Create responsive design mockups',
        description: `Design mockups that incorporate ${analysis.key_priorities?.join(', ') || 'client requirements'}.`,
        estimated_time: 4,
        priority: 'high'
      },
      {
        title: 'Develop brand style guide',
        description: `Develop a comprehensive style guide with ${analysis.communication_style} tone and approved color schemes.`,
        estimated_time: 3,
        priority: 'medium'
      },
      {
        title: 'Create content outline',
        description: 'Prepare content structure based on client feedback and requirements.',
        estimated_time: 2,
        priority: 'medium'
      }
    ];
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Client Requirements Analyzer</CardTitle>
        <CardDescription>
          Analyze client requirements and communication to generate insights and task suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="input">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="input">Client Input</TabsTrigger>
            <TabsTrigger value="history">Communication History</TabsTrigger>
            <TabsTrigger value="preferences">Client Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            <Textarea
              placeholder="Enter client requirements or feedback here..."
              value={clientInput}
              onChange={(e) => setClientInput(e.target.value)}
              className="min-h-[120px]"
            />
            <Button 
              onClick={analyzeRequirements} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Analyze Requirements
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="history">
            {isLoadingHistory ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-md p-3 bg-muted/40">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            ) : communicationHistory && communicationHistory.length > 0 ? (
              <div className="space-y-3">
                {communicationHistory.map((item, index) => (
                  <div key={index} className="rounded-md p-3 bg-muted/40">
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="font-medium flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {item.channel}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{item.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No communication history available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preferences">
            {isLoadingPreferences ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-1/3 mb-2 mt-4" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/4" />
              </div>
            ) : preferences ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Communication Preferences</h3>
                  <p className="text-sm flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                    {preferences.preferred_contact_method || preferences.communication_channel || 'Email'} 
                    <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-muted">
                      {preferences.communication_frequency || preferences.feedback_frequency || 'Weekly'}
                    </span>
                  </p>
                </div>
                
                {preferences.design_preferences && (
                  <div>
                    <h3 className="font-medium mb-1">Design Preferences</h3>
                    <div className="text-sm">
                      {typeof preferences.design_preferences === 'string' ? (
                        <p>{preferences.design_preferences}</p>
                      ) : (
                        <div className="space-y-1">
                          {preferences.design_preferences.colors && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {Array.isArray(preferences.design_preferences.colors) && 
                               preferences.design_preferences.colors.map((color, idx) => (
                                <div 
                                  key={idx} 
                                  className="w-6 h-6 rounded-full border"
                                  style={{backgroundColor: color}}
                                  title={color}
                                />
                              ))}
                            </div>
                          )}
                          
                          {preferences.design_preferences.style && (
                            <p>Style: <span className="font-medium">{preferences.design_preferences.style}</span></p>
                          )}
                          
                          {preferences.design_preferences.fonts && (
                            <p>Fonts: <span className="font-medium">
                              {Array.isArray(preferences.design_preferences.fonts) 
                                ? preferences.design_preferences.fonts.join(', ') 
                                : preferences.design_preferences.fonts}
                            </span></p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Do's
                    </h3>
                    <ul className="space-y-1 text-sm">
                      {preferences.dos && preferences.dos.length > 0 ? (
                        preferences.dos.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">No specific guidelines</li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                      Don'ts
                    </h3>
                    <ul className="space-y-1 text-sm">
                      {preferences.donts && preferences.donts.length > 0 ? (
                        preferences.donts.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">No specific restrictions</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>No client preferences found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {analysis && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Analysis Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-muted/30 p-3 rounded-md">
                <h4 className="font-medium text-sm mb-2">Communication Style</h4>
                <p className="text-sm">{analysis.communication_style || 'Formal'}</p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md">
                <h4 className="font-medium text-sm mb-2">Response Time Expectation</h4>
                <p className="text-sm">{analysis.response_time_expectation || 'Within 24 hours'}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Key Priorities</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.key_priorities?.map((priority: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {priority}
                  </Badge>
                )) || (
                  <p className="text-sm text-muted-foreground">No clear priorities detected</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Common Revision Requests</h4>
              <ul className="space-y-1 text-sm">
                {analysis.common_revisions?.map((revision: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{revision}</span>
                  </li>
                )) || (
                  <li className="text-muted-foreground">No common revisions detected</li>
                )}
              </ul>
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Task Suggestions</h3>
            <div className="space-y-3">
              {generateTaskSuggestions().map((task, idx) => (
                <div key={idx} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant={
                      task.priority === 'high' ? 'destructive' : 
                      task.priority === 'medium' ? 'default' : 
                      'secondary'
                    } className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Estimated: {task.estimated_time} hours</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientRequirementsAnalyzer;
