
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BrainCircuit, CheckCircle2, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import useTasks from "@/hooks/useTasks";
import aiService from "@/services/api/aiService";
import clientService from "@/services/api/clientService";
import { ClientRequirementsPanel } from "@/components/ai/ClientRequirementsPanel";

const ClientRequirements = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [requirement, setRequirement] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createTask } = useTasks();

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await clientService.getClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to load clients');
      }
    };
    
    fetchClients();
  }, []);

  const handleAnalyzeRequirements = async () => {
    if (!requirement.trim()) {
      toast.error('Please enter client requirements');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await aiService.analyzeRequirements(requirement);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      toast.error('Failed to analyze requirements');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateTasks = async () => {
    if (!analysisResult || !selectedClient) return;
    
    try {
      // Create tasks based on analysis
      for (const task of analysisResult.suggestedTasks) {
        await createTask({
          title: task.title,
          description: task.description,
          client_id: selectedClient,
          assigned_to: user?.id,
          status: 'pending',
          estimated_time: task.estimatedTime
        });
      }
      
      toast.success('Tasks created successfully');
      navigate('/employee/tasks');
    } catch (error) {
      console.error('Error creating tasks:', error);
      toast.error('Failed to create tasks');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Requirements Analysis</CardTitle>
            <CardDescription>
              Enter client requirements and our AI will analyze them to help you create appropriate tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Client</label>
              <Select onValueChange={(value) => setSelectedClient(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.client_id} value={client.client_id.toString()}>
                      {client.client_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Requirements</label>
              <Textarea
                placeholder="Enter client requirements here (e.g., project details, timelines, specific needs)"
                rows={8}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleAnalyzeRequirements} 
              disabled={!selectedClient || !requirement.trim() || isAnalyzing}
              className="w-full"
            >
              <BrainCircuit className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Requirements'}
            </Button>
          </CardContent>
        </Card>
        
        {analysisResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis Results</CardTitle>
                <CardDescription>
                  Here's what our AI discovered from your client requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Points Identified</h3>
                  <ul className="space-y-2">
                    {analysisResult.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Suggested Timeline</h3>
                  <p>{analysisResult.timeline}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Client Requirements Context</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <Building2 className="h-5 w-5 mr-2" />
                      <span className="font-medium">{clients.find(c => c.client_id === selectedClient)?.client_name}</span>
                    </div>
                    <p className="text-sm">{analysisResult.context}</p>
                  </div>
                </div>
                
                <ClientRequirementsPanel analysisResult={analysisResult} />
                
                <Button 
                  onClick={handleCreateTasks} 
                  className="w-full"
                >
                  Create Tasks from Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRequirements;
