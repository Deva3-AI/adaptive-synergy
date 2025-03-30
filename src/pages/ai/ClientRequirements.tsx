
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Brain, BrainCircuit, Briefcase, ChevronLeft, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clientService } from '@/services/api';
import ClientRequirementsAnalyzer from '@/components/ai/ClientRequirementsAnalyzer';
import TaskRecommendations from '@/components/ai/TaskRecommendations';
import VirtualManagerInsights from '@/components/employee/VirtualManagerInsights';
import ClientRequirementsPanel from '@/components/employee/ClientRequirementsPanel';
import useUser from '@/hooks/useUser';

const ClientRequirementsPage = () => {
  const { user } = useUser();
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  // Fetch clients list
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  });
  
  const handleClientChange = (value: string) => {
    setSelectedClientId(Number(value));
    setAnalysisResults(null);
  };
  
  const handleInsightsGenerated = (insights: any) => {
    setAnalysisResults(insights);
  };
  
  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/dashboard">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">AI Client Requirements</h1>
          <p className="text-muted-foreground">
            Analyze client requirements and generate actionable insights
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span>Select Client:</span>
        </div>
        <Select 
          value={selectedClientId?.toString() || ""} 
          onValueChange={handleClientChange}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client: any) => (
              <SelectItem key={client.client_id} value={client.client_id.toString()}>
                {client.client_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedClientId ? (
            <ClientRequirementsAnalyzer 
              clientId={selectedClientId} 
              onInsightsGenerated={handleInsightsGenerated} 
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select a Client</CardTitle>
                <CardDescription>
                  Choose a client to analyze their requirements and generate insights
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Select a client from the dropdown above to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          {selectedClientId && (
            <Tabs defaultValue="manager">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="manager">Virtual Manager</TabsTrigger>
                <TabsTrigger value="requirements">Client Requirements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manager">
                <VirtualManagerInsights 
                  clientId={selectedClientId} 
                  employeeName={user?.name} 
                />
              </TabsContent>
              
              <TabsContent value="requirements">
                <ClientRequirementsPanel clientId={selectedClientId} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      
      {selectedClientId && user && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Task Recommendations
          </h2>
          <TaskRecommendations userId={user.id} clientId={selectedClientId} />
        </div>
      )}
    </div>
  );
};

export default ClientRequirementsPage;
