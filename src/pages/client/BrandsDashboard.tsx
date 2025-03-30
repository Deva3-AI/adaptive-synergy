
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Image, ArrowLeft, Clock, Filter, MoreHorizontal, ArrowRight } from "lucide-react";

// Import Brand type from clientService
interface Brand {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  client_id: number;
}

const BrandsDashboard = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const [isAddBrandDialogOpen, setIsAddBrandDialogOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  // Fetch client details
  const { data: client, isLoading: isClientLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientService.getClientDetails(Number(clientId)),
    enabled: !!clientId,
  });

  // Fetch client brands
  const { data: brands = [], isLoading: isBrandsLoading, refetch: refetchBrands } = useQuery({
    queryKey: ['clientBrands', clientId],
    queryFn: () => clientService.getClientBrands(Number(clientId)),
    enabled: !!clientId,
  });

  // Fetch brand tasks if a brand is selected
  const { data: brandTasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ['brandTasks', selectedBrandId],
    queryFn: () => selectedBrandId ? clientService.getBrandTasks(selectedBrandId) : Promise.resolve([]),
    enabled: !!selectedBrandId,
  });

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      toast.error('Brand name is required');
      return;
    }

    try {
      await clientService.createBrand({
        name: newBrandName,
        description: newBrandDescription,
        client_id: Number(clientId)
      });
      
      toast.success('Brand added successfully');
      setIsAddBrandDialogOpen(false);
      setNewBrandName('');
      setNewBrandDescription('');
      refetchBrands();
    } catch (error) {
      console.error('Error adding brand:', error);
      toast.error('Failed to add brand');
    }
  };

  const handleBrandSelect = (brandId: number) => {
    setSelectedBrandId(brandId);
  };

  if (isClientLoading || isBrandsLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{client?.client_name}'s Brands</h1>
          </div>
          <p className="text-muted-foreground">Manage brands and their related tasks</p>
        </div>
        
        <Button onClick={() => setIsAddBrandDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Brand
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3">
                <Image className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No brands found</h3>
              <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                This client doesn't have any brands yet. Create a new brand to get started.
              </p>
              <Button 
                onClick={() => setIsAddBrandDialogOpen(true)}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </CardContent>
          </Card>
        ) : (
          brands.map((brand: Brand) => (
            <Card 
              key={brand.id} 
              className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${selectedBrandId === brand.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleBrandSelect(brand.id)}
            >
              <div className="h-28 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="max-h-20 max-w-[80%]" />
                ) : (
                  <div className="font-bold text-2xl text-primary/60">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{brand.name}</CardTitle>
                {brand.description && (
                  <CardDescription>{brand.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{brandTasks?.length || 0} tasks</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {selectedBrandId && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Brand Tasks
            </h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          {isTasksLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : brandTasks.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No tasks found for this brand</p>
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {brandTasks.map((task: any) => (
                <Card key={task.id} className="overflow-hidden hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {task.status}
                        </span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Add Brand Dialog */}
      <Dialog open={isAddBrandDialogOpen} onOpenChange={setIsAddBrandDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Create a new brand for {client?.client_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                placeholder="Enter brand name"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-description">Description (Optional)</Label>
              <Textarea
                id="brand-description"
                placeholder="Enter brand description"
                value={newBrandDescription}
                onChange={(e) => setNewBrandDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBrandDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBrand}>
              Add Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandsDashboard;
