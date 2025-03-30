
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  BrainCircuit,
  Building2, 
  FileText, 
  ListChecks, 
  ArrowLeft, 
  CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';
import { clientService, taskService } from '@/services/api';
import ClientRequirementsAnalyzer from '@/components/ai/ClientRequirementsAnalyzer';
import VirtualManagerInsights from '@/components/employee/VirtualManagerInsights';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const ClientRequirements = () => {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [creatingTasks, setCreatingTasks] = useState(false);
  const [createdTasks, setCreatedTasks] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      return await clientService.getClients();
    },
  });

  // Handle client selection
  const handleClientChange = (value: string) => {
    setSelectedClientId(parseInt(value));
    setAnalysisResults(null);
    setCreatedTasks([]);
  };

  // Handle analysis results
  const handleAnalysisResults = (results: any) => {
    setAnalysisResults(results);
    setCreatedTasks([]);
  };

  // Create tasks from analysis
  const handleCreateTasks = async () => {
    if (!analysisResults || !selectedClientId || !user) {
      toast.error('No analysis results or client selected');
      return;
    }

    setCreatingTasks(true);

    try {
      const createdTaskIds = [];

      for (const taskSuggestion of analysisResults.suggested_tasks) {
        const taskData = {
          title: taskSuggestion.title,
          description: taskSuggestion.description,
          client_id: selectedClientId,
          assigned_to: user.id,
          status: 'pending',
          estimated_time: taskSuggestion.estimated_time
        };

        const task = await taskService.createTask(taskData);
        createdTaskIds.push(task);
      }

      setCreatedTasks(createdTaskIds);
      toast.success(`${createdTaskIds.length} tasks created successfully`);
    } catch (error) {
      console.error('Error creating tasks:', error);
      toast.error('Failed to create tasks');
    } finally {
      setCreatingTasks(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Client Requirements Analyzer</h1>
          <p className="text-muted-foreground">
            Process client messages and generate actionable insights and tasks
          </p>
        </div>
        
        <div className="w-full md:w-64">
          <Select
            value={selectedClientId?.toString()}
            onValueChange={handleClientChange}
            disabled={clientsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.client_id} value={client.client_id.toString()}>
                  {client.client_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedClientId ? (
            <ClientRequirementsAnalyzer 
              clientId={selectedClientId} 
              onInsightsGenerated={handleAnalysisResults}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <BrainCircuit className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Client</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a client from the dropdown above to analyze their requirements
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Task Creation Section */}
          {analysisResults && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-primary" />
                  Task Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create tasks based on the AI-analyzed client requirements. These tasks will be automatically assigned to you.
                </p>
                
                {createdTasks.length > 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium text-green-800">Tasks Created Successfully</h4>
                        <p className="text-sm text-green-600 mt-1 mb-3">
                          {createdTasks.length} tasks have been created and assigned to you.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/employee/tasks')}
                        >
                          View Tasks
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleCreateTasks}
                    disabled={creatingTasks || !analysisResults.suggested_tasks.length}
                  >
                    {creatingTasks ? 'Creating Tasks...' : 'Create Tasks From Analysis'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          {selectedClientId && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-primary" />
                    Client Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <VirtualManagerInsights clientId={selectedClientId} />
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    How To Use This Tool
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <p>Paste client requirements, emails, or messages into the analyzer.</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <p>Review the AI analysis including key requirements and sentiment.</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <p>Generate tasks with accurate time estimates based on client requirements.</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        4
                      </div>
                      <p>Review client preferences and history to understand patterns and expectations.</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-md mt-4">
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Brain className="h-3 w-3 mr-1" />
                      Powered by AI based on historical client data and interactions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientRequirements;
