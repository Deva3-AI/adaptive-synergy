
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clientService from '@/services/api/clientService';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

interface ClientBrandsListProps {
  clientId: number;
}

const ClientBrandsList: React.FC<ClientBrandsListProps> = ({ clientId }) => {
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    logo_url: '/placeholder.svg'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  
  // Get client brands
  const { data: brands = [], isLoading: isLoadingBrands } = useQuery({
    queryKey: ['client-brands', clientId],
    queryFn: () => clientService.getClientBrands(clientId),
    enabled: Boolean(clientId)
  });
  
  // Get brand tasks
  const { data: brandTasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['brand-tasks', selectedBrandId],
    queryFn: () => clientService.getBrandTasks(selectedBrandId || 0),
    enabled: Boolean(selectedBrandId)
  });
  
  // Create brand mutation
  const createBrandMutation = useMutation({
    mutationFn: (brandData: any) => {
      return clientService.createBrand({
        ...brandData,
        client_id: clientId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-brands', clientId] });
      setIsDialogOpen(false);
      setNewBrand({
        name: '',
        description: '',
        logo_url: '/placeholder.svg'
      });
      toast.success('Brand created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create brand');
      console.error('Error creating brand:', error);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBrandMutation.mutate(newBrand);
  };
  
  const handleBrandSelect = (brandId: number) => {
    setSelectedBrandId(brandId);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Brands</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>
                Create a new brand for this client. This will allow you to organize tasks by brand.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input 
                    id="brand-name" 
                    placeholder="Enter brand name" 
                    value={newBrand.name}
                    onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand-description">Description</Label>
                  <Textarea 
                    id="brand-description" 
                    placeholder="Enter brand description"
                    value={newBrand.description}
                    onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createBrandMutation.isPending}>
                  {createBrandMutation.isPending ? 'Creating...' : 'Create Brand'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoadingBrands ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-md">
            <p className="text-muted-foreground mb-2">No brands found for this client</p>
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Brand
            </Button>
          </div>
        ) : (
          <Tabs defaultValue={brands[0]?.id?.toString()} onValueChange={(value) => handleBrandSelect(parseInt(value))}>
            <TabsList className="grid grid-cols-2 mb-4">
              {brands.map((brand: any) => (
                <TabsTrigger key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {brands.map((brand: any) => (
              <TabsContent key={brand.id} value={brand.id.toString()} className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={brand.logo_url || '/placeholder.svg'} 
                      alt={brand.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{brand.name}</h3>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {brand.description || 'No description provided'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created on {new Date(brand.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Brand Tasks</h4>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                  
                  {isLoadingTasks ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : brandTasks.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-md">
                      <p className="text-muted-foreground">No tasks found for this brand</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {brandTasks.map((task: any) => (
                        <div key={task.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">{task.description?.substring(0, 50)}{task.description?.length > 50 ? '...' : ''}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              task.status === 'completed' ? 'success' :
                              task.status === 'in_progress' ? 'default' :
                              'secondary'
                            }>
                              {task.status}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientBrandsList;
