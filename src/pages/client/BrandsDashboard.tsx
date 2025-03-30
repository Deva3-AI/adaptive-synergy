
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Building2, Clock, FileCheck2, Users, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/api';
import { toast } from "sonner";

const BrandsDashboard = () => {
  const [selectedClient, setSelectedClient] = useState<number>(0);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [isAddBrandDialogOpen, setIsAddBrandDialogOpen] = useState(false);
  const [newBrandData, setNewBrandData] = useState({
    name: '',
    client_id: 0,
    logo: '',
    description: '',
    website: '',
    industry: ''
  });
  
  const queryClient = useQueryClient();
  
  // Get list of clients
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientService.getClients
  });
  
  // Get brands for selected client
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['client-brands', selectedClient],
    queryFn: () => clientService.getClientBrands(selectedClient),
    enabled: !!selectedClient
  });
  
  // Get tasks for selected brand
  const { data: brandTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['brand-tasks', selectedBrandId],
    queryFn: () => clientService.getBrandTasks(selectedBrandId!),
    enabled: !!selectedBrandId
  });
  
  // Create brand mutation
  const createBrandMutation = useMutation({
    mutationFn: clientService.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-brands'] });
      setIsAddBrandDialogOpen(false);
      toast.success("Brand created successfully!");
      
      // Reset form
      setNewBrandData({
        name: '',
        client_id: 0,
        logo: '',
        description: '',
        website: '',
        industry: ''
      });
    },
    onError: (error) => {
      console.error("Error creating brand:", error);
      toast.error("Failed to create brand. Please try again.");
    }
  });
  
  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    createBrandMutation.mutate(newBrandData);
  };
  
  // When a client is selected, clear the selected brand
  const handleClientChange = (clientId: number) => {
    setSelectedClient(clientId);
    setSelectedBrandId(null);
  };
  
  // Set up the brand form when dialog opens
  const handleAddBrandClick = () => {
    setNewBrandData({
      ...newBrandData,
      client_id: selectedClient
    });
    setIsAddBrandDialogOpen(true);
  };
  
  // If no clients are loaded yet, show skeleton UI
  if (clientsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Brand Management</h1>
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
            <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Brand Management</h1>
        {selectedClient > 0 && (
          <Button onClick={handleAddBrandClick} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Brand</span>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Select a client to manage their brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients && clients.length > 0 ? (
                clients.map((client) => (
                  <div 
                    key={client.client_id} 
                    className={`p-4 flex items-center border rounded-lg cursor-pointer ${
                      selectedClient === client.client_id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                    }`}
                    onClick={() => handleClientChange(client.client_id)}
                  >
                    <div className="mr-3">
                      <Avatar>
                        <AvatarFallback>{client.client_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="font-medium">{client.client_name}</div>
                      <div className="text-sm text-muted-foreground">{client.contact_info}</div>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No clients found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedClient ? (
                clients?.find(c => c.client_id === selectedClient)?.client_name + "'s Brands"
              ) : (
                "Brands"
              )}
            </CardTitle>
            <CardDescription>
              {selectedClient ? (
                "Manage all brands for this client"
              ) : (
                "Select a client to view and manage their brands"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedClient ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>Select a client from the list to manage their brands</p>
              </div>
            ) : brandsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : brands && brands.length > 0 ? (
              <div className="space-y-4">
                {brands.map((brand) => (
                  <div 
                    key={brand.id} 
                    className={`p-4 border rounded-lg hover:bg-accent cursor-pointer ${
                      selectedBrandId === brand.id ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedBrandId(brand.id)}
                  >
                    <div className="flex gap-4">
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="h-16 w-16 object-contain rounded" />
                      ) : (
                        <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{brand.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{brand.description}</p>
                          </div>
                          <Badge variant="outline">{brand.industry}</Badge>
                        </div>
                        
                        {brand.website && (
                          <a 
                            href={brand.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center mt-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {brand.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {selectedBrandId === brand.id && (
                      <div className="mt-4 pt-4 border-t">
                        <Tabs defaultValue="tasks">
                          <TabsList className="mb-4">
                            <TabsTrigger value="tasks" className="flex items-center gap-2">
                              <FileCheck2 className="h-4 w-4" />
                              Tasks
                            </TabsTrigger>
                            <TabsTrigger value="team" className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Team
                            </TabsTrigger>
                            <TabsTrigger value="history" className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              History
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="tasks">
                            {tasksLoading ? (
                              <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                  <Skeleton key={i} className="h-8 w-full" />
                                ))}
                              </div>
                            ) : brandTasks && brandTasks.length > 0 ? (
                              <div className="space-y-2">
                                {brandTasks.slice(0, 5).map((task) => (
                                  <div key={task.task_id} className="p-2 border rounded flex justify-between items-center">
                                    <span className="font-medium">{task.title}</span>
                                    <Badge variant={
                                      task.status === 'completed' ? 'success' : 
                                      task.status === 'in_progress' ? 'warning' : 
                                      'secondary'
                                    }>
                                      {task.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                No tasks found for this brand.
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="team">
                            <div className="text-center py-4 text-muted-foreground">
                              Team management feature coming soon.
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="history">
                            <div className="text-center py-4 text-muted-foreground">
                              Brand history feature coming soon.
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>No brands found for this client</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddBrandClick}
                >
                  Add First Brand
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Brand Dialog */}
      <Dialog open={isAddBrandDialogOpen} onOpenChange={setIsAddBrandDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCreateBrand}>
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>
                Create a new brand for{' '}
                {clients?.find(c => c.client_id === selectedClient)?.client_name || 'this client'}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Brand Name
                </Label>
                <Input
                  id="name"
                  value={newBrandData.name}
                  onChange={(e) => setNewBrandData({...newBrandData, name: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">
                  Industry
                </Label>
                <Select
                  value={newBrandData.industry}
                  onValueChange={(value) => setNewBrandData({...newBrandData, industry: value})}
                >
                  <SelectTrigger id="industry" className="col-span-3">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Website
                </Label>
                <Input
                  id="website"
                  value={newBrandData.website}
                  onChange={(e) => setNewBrandData({...newBrandData, website: e.target.value})}
                  className="col-span-3"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logo" className="text-right">
                  Logo URL
                </Label>
                <Input
                  id="logo"
                  value={newBrandData.logo}
                  onChange={(e) => setNewBrandData({...newBrandData, logo: e.target.value})}
                  className="col-span-3"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right align-top pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newBrandData.description}
                  onChange={(e) => setNewBrandData({...newBrandData, description: e.target.value})}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddBrandDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createBrandMutation.isPending}>
                {createBrandMutation.isPending ? 'Creating...' : 'Create Brand'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandsDashboard;
