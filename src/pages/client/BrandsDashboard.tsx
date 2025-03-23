
import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brand } from "@/services/api/clientService";
import { BarChart, PieChart, Clock, Users, CheckCircle, FileText, Plus, Briefcase, MessageSquare } from "lucide-react";
import ClientBrandsList from "@/components/client/ClientBrandsList";
import ClientPlatformMessages from "@/components/client/ClientPlatformMessages";
import ClientAIInsights from "@/components/client/ClientAIInsights";
import ClientTimeReporting from "@/components/client/ClientTimeReporting";
import clientService from "@/services/api/clientService";
import platformService from "@/utils/platformIntegrations";
import { toast } from "sonner";

// Sample client data - in a real app, this would come from API
const clientId = 1; // This would normally come from route params or context
const clientName = "Social Land";

const BrandsDashboard = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);
  
  // Fetch client details
  const { data: client } = useQuery({
    queryKey: ['clientDetails', clientId],
    queryFn: () => clientService.getClientById(clientId),
    onError: (error) => {
      console.error('Error fetching client details:', error);
      toast.error('Failed to load client details');
    }
  });
  
  // Fetch client platforms
  const { data: platforms = [] } = useQuery({
    queryKey: ['clientPlatforms'],
    queryFn: () => platformService.getPlatforms(),
  });
  
  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
  };
  
  const handleGenerateTasks = (tasks: any[]) => {
    setGeneratedTasks(tasks);
    toast.success(`Generated ${tasks.length} task suggestions`);
  };
  
  const handleTaskCreated = () => {
    toast.success('Task created successfully');
    // In a real app, you would refetch tasks here
  };
  
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Management</h1>
          <p className="text-muted-foreground">
            Manage brands and tasks for {clientName}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Connect Platform
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Managing 14 active projects</p>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Designers, developers, and managers</p>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-muted-foreground">92% completion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <ClientBrandsList 
            clientId={clientId} 
            clientName={clientName}
            onSelectBrand={handleSelectBrand} 
          />
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="insights">
            <TabsList className="mb-4">
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="messages">Platform Messages</TabsTrigger>
              <TabsTrigger value="timeReporting">Time Reporting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights">
              <ClientAIInsights 
                clientId={clientId}
                clientName={clientName}
                clientDescription={client?.description}
                onTaskCreated={handleTaskCreated}
              />
              
              {generatedTasks.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Generated Task Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedTasks.map((task, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-sm">
                              Est: {task.estimated_time} hrs • Priority: {task.priority}
                            </div>
                            <Button size="sm">Create Task</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="messages">
              <ClientPlatformMessages 
                clientId={clientId}
                clientName={clientName}
                onGenerateTasks={handleGenerateTasks}
              />
            </TabsContent>
            
            <TabsContent value="timeReporting">
              <ClientTimeReporting 
                clientId={clientId}
                clientName={clientName}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BrandsDashboard;
