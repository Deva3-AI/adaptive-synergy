
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/api';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, ExternalLink, Briefcase, Box, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

const BrandsDashboard = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [newBrand, setNewBrand] = useState({
    name: '',
    industry: '',
    website: '',
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  // Fetch brands for the client
  const { data: brands, isLoading: brandsLoading, refetch: refetchBrands } = useQuery({
    queryKey: ['brands', clientId],
    queryFn: () => clientService.getClientBrands(Number(clientId)),
  });

  // Fetch tasks for the selected brand
  const { data: brandTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['brand-tasks', selectedBrandId],
    queryFn: () => clientService.getBrandTasks(selectedBrandId!),
    enabled: !!selectedBrandId,
  });

  const handleCreateBrand = async () => {
    try {
      await clientService.createBrand({
        ...newBrand,
        client_id: Number(clientId)
      });
      
      toast.success('Brand created successfully');
      setNewBrand({ name: '', industry: '', website: '', description: '' });
      setIsDialogOpen(false);
      refetchBrands();
    } catch (error) {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand');
    }
  };

  if (brandsLoading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Brand Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Brand Management</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
              <DialogDescription>
                Add a new brand for this client
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input 
                  id="name" 
                  value={newBrand.name} 
                  onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry" 
                  value={newBrand.industry} 
                  onChange={(e) => setNewBrand({...newBrand, industry: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={newBrand.website} 
                  onChange={(e) => setNewBrand({...newBrand, website: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newBrand.description} 
                  onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleCreateBrand}>Create Brand</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {brands && brands.length > 0 ? (
          brands.map((brand) => (
            <Card key={brand.id} className="overflow-hidden">
              <CardHeader className="bg-secondary/20">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{brand.name}</CardTitle>
                    {brand.industry && (
                      <CardDescription>
                        <Badge variant="outline" className="mt-1">
                          {brand.industry}
                        </Badge>
                      </CardDescription>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedBrandId(brand.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {brand.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {brand.description}
                  </p>
                )}
                
                <div className="flex flex-col gap-2">
                  {brand.website && (
                    <div className="flex items-center text-sm">
                      <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline text-primary"
                      >
                        {brand.website}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedBrandId(brand.id)}
                    >
                      <Briefcase className="h-4 w-4 mr-1" />
                      View Tasks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="md:col-span-3 text-center py-8">
            <h3 className="text-lg font-medium">No brands found</h3>
            <p className="text-muted-foreground">Create a new brand to get started</p>
          </div>
        )}
      </div>
      
      {selectedBrandId && (
        <Dialog open={!!selectedBrandId} onOpenChange={() => setSelectedBrandId(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {brands?.find(b => b.id === selectedBrandId)?.name}
              </DialogTitle>
              <DialogDescription>
                {brands?.find(b => b.id === selectedBrandId)?.industry}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="tasks">
              <TabsList>
                <TabsTrigger value="tasks">Tasks & Projects</TabsTrigger>
                <TabsTrigger value="assets">Brand Assets</TabsTrigger>
                <TabsTrigger value="settings">Brand Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="space-y-4">
                <h3 className="text-lg font-semibold">Tasks for this Brand</h3>
                
                {tasksLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : brandTasks && brandTasks.length > 0 ? (
                  <div className="space-y-2">
                    {brandTasks.map((task) => (
                      <Card key={task.task_id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              
                              <div className="flex gap-4 mt-2">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {task.due_date}
                                </div>
                                <div className="flex items-center text-xs">
                                  <Badge variant={
                                    task.status === 'completed' ? 'success' : 
                                    task.status === 'in_progress' ? 'default' : 
                                    'secondary'
                                  }>
                                    {task.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {task.priority} priority
                                </div>
                              </div>
                            </div>
                            
                            <Button variant="outline" size="sm">
                              View Task
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No tasks found</h3>
                    <p className="text-muted-foreground">Create a new task for this brand</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="assets">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">No brand assets found</h3>
                  <p className="text-muted-foreground">Upload brand assets such as logos, brand guidelines, etc.</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Assets
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Brand Name</Label>
                    <Input 
                      id="edit-name" 
                      value={brands?.find(b => b.id === selectedBrandId)?.name || ''}
                      disabled
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-industry">Industry</Label>
                    <Input 
                      id="edit-industry" 
                      value={brands?.find(b => b.id === selectedBrandId)?.industry || ''}
                      disabled
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-website">Website</Label>
                    <Input 
                      id="edit-website" 
                      value={brands?.find(b => b.id === selectedBrandId)?.website || ''}
                      disabled
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea 
                      id="edit-description" 
                      value={brands?.find(b => b.id === selectedBrandId)?.description || ''}
                      disabled
                    />
                  </div>
                  
                  <Button variant="secondary" disabled>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Brand
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BrandsDashboard;
