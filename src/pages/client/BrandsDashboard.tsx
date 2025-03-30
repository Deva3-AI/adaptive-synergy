
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Globe, Plus, ExternalLink, Share2, Briefcase, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BrandsDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [newBrand, setNewBrand] = useState({
    name: '',
    client_id: 0,
    description: '',
    website: '',
    industry: ''
  });
  
  const queryClient = useQueryClient();
  
  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients()
  });
  
  // Fetch brands based on selected client
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['client-brands', selectedClientId],
    queryFn: () => clientService.getClientBrands(selectedClientId || undefined),
    enabled: true
  });
  
  // Fetch brand tasks when a brand is selected
  const { data: brandTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['brand-tasks', selectedBrandId],
    queryFn: () => clientService.getBrandTasks(selectedBrandId as number),
    enabled: !!selectedBrandId
  });
  
  // Create brand mutation
  const createBrandMutation = useMutation({
    mutationFn: (data: typeof newBrand) => clientService.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-brands'] });
      setOpenDialog(false);
      setNewBrand({
        name: '',
        client_id: 0,
        description: '',
        website: '',
        industry: ''
      });
      toast.success('Brand created successfully!');
    },
    onError: () => {
      toast.error('Failed to create brand.');
    }
  });
  
  const handleCreateBrand = () => {
    if (!newBrand.name || !newBrand.client_id) {
      toast.error('Brand name and client are required.');
      return;
    }
    
    createBrandMutation.mutate(newBrand);
  };
  
  // Select a client and set as active
  const handleSelectClient = (clientId: number) => {
    setSelectedClientId(clientId);
    setSelectedBrandId(null);
  };
  
  // Select a brand and load its tasks
  const handleSelectBrand = (brandId: number) => {
    setSelectedBrandId(brandId);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brand Management</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
              <DialogDescription>
                Add a new brand to your client portfolio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <select 
                  id="client"
                  className="w-full p-2 border rounded-md"
                  value={newBrand.client_id}
                  onChange={(e) => setNewBrand({...newBrand, client_id: Number(e.target.value)})}
                >
                  <option value={0}>Select a client</option>
                  {clients?.map((client: any) => (
                    <option key={client.client_id} value={client.client_id}>
                      {client.client_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input 
                  id="name"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                  placeholder="Brand name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry"
                  value={newBrand.industry}
                  onChange={(e) => setNewBrand({...newBrand, industry: e.target.value})}
                  placeholder="e.g. Technology, Healthcare"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website"
                  value={newBrand.website}
                  onChange={(e) => setNewBrand({...newBrand, website: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={newBrand.description}
                  onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                  placeholder="Brief description of the brand"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateBrand}>Create Brand</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
              <CardDescription>Select a client to view brands</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${!selectedClientId ? 'bg-accent' : ''}`}
                  onClick={() => setSelectedClientId(null)}
                >
                  All Clients
                </Button>
                {clients?.map((client: any) => (
                  <Button 
                    key={client.client_id}
                    variant="ghost" 
                    className={`w-full justify-start ${selectedClientId === client.client_id ? 'bg-accent' : ''}`}
                    onClick={() => handleSelectClient(client.client_id)}
                  >
                    {client.client_name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Brands</CardTitle>
              <CardDescription>
                {selectedClientId 
                  ? `Brands for ${clients?.find((c: any) => c.client_id === selectedClientId)?.client_name}` 
                  : 'All brands'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {brandsLoading ? (
                <div>Loading brands...</div>
              ) : brands?.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No brands found</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedClientId 
                      ? 'This client doesn\'t have any brands yet. Add one to get started.'
                      : 'No brands found. Select a client or add a brand.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brands?.map((brand: any) => (
                    <Card 
                      key={brand.id} 
                      className={`cursor-pointer hover:border-primary transition-all ${selectedBrandId === brand.id ? 'border-primary' : ''}`}
                      onClick={() => handleSelectBrand(brand.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex justify-between items-center">
                          <span>{brand.name}</span>
                          {brand.logo && <img src={brand.logo} alt={brand.name} className="h-6" />}
                        </CardTitle>
                        <CardDescription>
                          {brand.industry || 'No industry specified'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 text-sm">
                        {brand.description ? (
                          <p className="line-clamp-2">{brand.description}</p>
                        ) : (
                          <p className="text-muted-foreground italic">No description available</p>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
                        <div>
                          Created: {new Date(brand.created_at).toLocaleDateString()}
                        </div>
                        {brand.website && (
                          <a 
                            href={brand.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-xs hover:text-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedBrandId && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  Brand Tasks & Activities
                </CardTitle>
                <CardDescription>
                  {brands?.find((b: any) => b.id === selectedBrandId)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tasks">
                  <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="assets">Brand Assets</TabsTrigger>
                    <TabsTrigger value="guidelines">Brand Guidelines</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tasks" className="pt-4">
                    {tasksLoading ? (
                      <div>Loading tasks...</div>
                    ) : brandTasks?.length === 0 ? (
                      <div className="text-center py-8">
                        <Briefcase className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <p>No tasks found for this brand</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {brandTasks?.map((task: any) => (
                          <div key={task.task_id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{task.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {task.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <div>Due: {new Date(task.due_date).toLocaleDateString()}</div>
                              <div className={`${
                                task.priority === 'high' ? 'text-red-500' : 
                                task.priority === 'medium' ? 'text-amber-500' : 'text-green-500'
                              }`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="assets" className="pt-4">
                    <div className="text-center py-8">
                      <Share2 className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <p>No brand assets available yet</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="guidelines" className="pt-4">
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <p>No brand guidelines available yet</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandsDashboard;
