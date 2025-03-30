
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart, FileText, LineChart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BrandsDashboard = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    client_id: parseInt(clientId || '0')
  });
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  
  // Fetch client details
  const { data: clientDetails } = useQuery({
    queryKey: ['client-details', clientId],
    queryFn: () => clientService.getClientDetails(parseInt(clientId || '0')),
    enabled: !!clientId
  });
  
  // Fetch brands for this client
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['client-brands', clientId],
    queryFn: () => clientService.getClientBrands(parseInt(clientId || '0')),
    enabled: !!clientId
  });
  
  // Fetch tasks for selected brand
  const { data: brandTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['brand-tasks', selectedBrandId],
    queryFn: () => clientService.getBrandTasks(selectedBrandId || 0),
    enabled: !!selectedBrandId
  });
  
  // Mutation for creating a new brand
  const createBrandMutation = useMutation({
    mutationFn: (brandData: any) => clientService.createBrand(brandData),
    onSuccess: () => {
      toast.success('Brand created successfully');
      queryClient.invalidateQueries({ queryKey: ['client-brands'] });
      setNewBrand({
        name: '',
        description: '',
        website: '',
        industry: '',
        client_id: parseInt(clientId || '0')
      });
    },
    onError: (error) => {
      toast.error('Failed to create brand');
      console.error('Error creating brand:', error);
    }
  });
  
  const handleCreateBrand = () => {
    createBrandMutation.mutate(newBrand);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Client Brands</h1>
          <p className="text-muted-foreground">
            Manage brands for {clientDetails?.client_name || 'this client'}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
              <DialogDescription>
                Add a new brand for this client to manage related tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input 
                  id="name" 
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                  placeholder="Enter brand name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry" 
                  value={newBrand.industry}
                  onChange={(e) => setNewBrand({...newBrand, industry: e.target.value})}
                  placeholder="E.g. Technology, Healthcare, Retail"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={newBrand.website}
                  onChange={(e) => setNewBrand({...newBrand, website: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newBrand.description}
                  onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                  placeholder="Brief description of the brand"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewBrand({...newBrand, name: '', description: '', website: '', industry: ''})}>Cancel</Button>
              <Button onClick={handleCreateBrand} disabled={!newBrand.name}>Create Brand</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {brandsLoading ? (
        <div className="text-center py-12">Loading brands...</div>
      ) : brands && brands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Brands</CardTitle>
                <CardDescription>
                  Select a brand to view details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  {brands?.map((brand) => (
                    <Button 
                      key={brand.id} 
                      variant={selectedBrandId === brand.id ? "default" : "outline"} 
                      className="justify-start"
                      onClick={() => setSelectedBrandId(brand.id)}
                    >
                      {brand.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            {selectedBrandId ? (
              <Tabs defaultValue="tasks">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>
                          {brands?.find(b => b.id === selectedBrandId)?.name} Tasks
                        </CardTitle>
                        <Button size="sm">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          New Task
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {tasksLoading ? (
                        <div className="text-center py-6">Loading tasks...</div>
                      ) : brandTasks && brandTasks.length > 0 ? (
                        <div className="space-y-4">
                          {brandTasks.map((task) => (
                            <Card key={task.task_id}>
                              <CardHeader className="py-3">
                                <CardTitle className="text-base">{task.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="py-2">
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs">{task.due_date}</span>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {task.status.replace('_', ' ')}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No tasks found for this brand
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="assets">
                  <Card>
                    <CardHeader>
                      <CardTitle>Brand Assets</CardTitle>
                      <CardDescription>
                        Logos, style guides, and other brand assets
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        No assets uploaded yet
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Upload Asset
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Brand Analytics</CardTitle>
                      <CardDescription>
                        Performance metrics and analytics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        Analytics data coming soon
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-full border rounded-lg p-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Select a Brand</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a brand from the list to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border rounded-lg p-12">
          <h3 className="text-lg font-medium mb-2">No Brands Found</h3>
          <p className="text-muted-foreground mb-4">
            This client doesn't have any brands yet. Create one to get started.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Brand</DialogTitle>
                <DialogDescription>
                  Add a new brand for this client to manage related tasks.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Brand Name</Label>
                  <Input 
                    id="name" 
                    value={newBrand.name}
                    onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                    placeholder="Enter brand name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    value={newBrand.industry}
                    onChange={(e) => setNewBrand({...newBrand, industry: e.target.value})}
                    placeholder="E.g. Technology, Healthcare, Retail"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={newBrand.website}
                    onChange={(e) => setNewBrand({...newBrand, website: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newBrand.description}
                    onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                    placeholder="Brief description of the brand"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleCreateBrand} disabled={!newBrand.name}>Create Brand</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default BrandsDashboard;
