
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, CheckCircle2, Clock, FileText, Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { clientService } from '@/services/api';
import aiUtils from '@/utils/aiUtils';

interface ClientRequirementsAnalyzerProps {
  clientId: number;
  onInsightsGenerated?: (insights: any) => void;
}

const ClientRequirementsAnalyzer: React.FC<ClientRequirementsAnalyzerProps> = ({ 
  clientId,
  onInsightsGenerated
}) => {
  const [clientInput, setClientInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  
  React.useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const clientData = await clientService.getClientDetails(clientId);
        setClient(clientData);
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };
    
    if (clientId) {
      fetchClientDetails();
    }
  }, [clientId]);
  
  const handleAnalyze = async () => {
    if (!clientInput.trim()) {
      toast.error('Please enter client requirements to analyze');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // First analyze the sentiment and overall requirements
      const initialAnalysis = await aiUtils.analyzeClientInput(clientInput);
      
      // Then generate suggested tasks based on the requirements
      const tasksAnalysis = await aiUtils.generateSuggestedTasks(clientInput, clientId);
      
      // Combine the results
      const results = {
        sentiment: initialAnalysis.sentiment,
        priority_level: initialAnalysis.priority_level,
        key_requirements: initialAnalysis.key_requirements,
        suggested_tasks: tasksAnalysis.suggested_tasks,
        client_id: clientId,
      };
      
      setAnalysisResults(results);
      
      // Send the results back to the parent component if callback exists
      if (onInsightsGenerated) {
        onInsightsGenerated(results);
      }
      
      toast.success('Analysis complete');
    } catch (error) {
      console.error('Error analyzing client requirements:', error);
      toast.error('Failed to analyze client requirements');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleClear = () => {
    setClientInput('');
    setAnalysisResults(null);
    
    // Clear parent component's state if callback exists
    if (onInsightsGenerated) {
      onInsightsGenerated(null);
    }
  };
  
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-600">Positive</Badge>;
      case 'negative':
        return <Badge variant="destructive">Negative</Badge>;
      default:
        return <Badge variant="outline">Neutral</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default">Medium Priority</Badge>;
      default:
        return <Badge variant="secondary">Low Priority</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Client Requirements Analyzer</CardTitle>
          <CardDescription>
            {client ? (
              `Analyze requirements for ${client.client_name}`
            ) : (
              'Paste client requirements to extract key insights'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste client requirements or message here... (e.g., 'We need a website with bright colors, bold fonts, and our logo prominently displayed on every page')"
            value={clientInput}
            onChange={(e) => setClientInput(e.target.value)}
            className="min-h-[150px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear} disabled={isAnalyzing}>
            Clear
          </Button>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !clientInput.trim()}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze Requirements
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {analysisResults && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Analysis Results</CardTitle>
              <div className="flex space-x-2">
                {getSentimentBadge(analysisResults.sentiment)}
                {getPriorityBadge(analysisResults.priority_level)}
              </div>
            </div>
            <CardDescription>
              AI-powered analysis of client requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <FileText className="mr-2 h-4 w-4" />
                Key Requirements Identified
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResults.key_requirements.map((req: string, index: number) => (
                  <Badge key={index} variant="outline" className="flex items-center">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Lightbulb className="mr-2 h-4 w-4" />
                Suggested Tasks
              </h3>
              
              <div className="space-y-3">
                {analysisResults.suggested_tasks.map((task: any, index: number) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge variant={
                        task.priority_level === 'high' ? 'destructive' : 
                        task.priority_level === 'medium' ? 'default' : 
                        'secondary'
                      }>
                        {task.priority_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">{task.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3.5 w-3.5" />
                      <span>Estimated: {task.estimated_time} hours</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <AlertTriangle className="mr-2 h-4 w-4" />
                AI Recommendations
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on the client's tone and requirements, maintain a {analysisResults.sentiment} approach in your communications.
                {analysisResults.priority_level === 'high' && " This client's request appears urgent and should be prioritized."}
                {analysisResults.sentiment === 'negative' && " Take extra care to address any concerns they may have expressed."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientRequirementsAnalyzer;
