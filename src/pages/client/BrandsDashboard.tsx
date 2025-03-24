import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clientService, { Brand } from '@/services/api/clientService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, FileText, CheckCircle, Clock, AlertCircle, XCircle, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from 'react-router-dom';

const BrandsDashboard = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isAddBrandDialogOpen, setIsAddBrandDialogOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const { toast } = useToast();

  // Fetch client details
  const { data: client } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientService.getClientDetails(Number(clientId)),
    meta: {
      onError: (error: any) => {
        toast({
          title: "Error",
          description: "Failed to load client details",
          variant: "destructive"
        });
      }
    }
  });

  // Fetch client brands
  const { data: brands, isLoading } = useQuery({
    queryKey: ['brands', clientId],
    queryFn: () => clientService.getClientBrands(Number(clientId)),
  });

  // Fetch brand tasks if a brand is selected
  const { data: brandTasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ['brandTasks', selectedBrand?.id],
    queryFn: () => selectedBrand ? clientService.getBrandTasks(selectedBrand.id) : Promise.resolve([]),
    enabled: !!selectedBrand,
  });

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      toast({
        title: "Validation Error",
        description: "Brand name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await clientService.createBrand(Number(clientId), {
        name: newBrandName,
        description: newBrandDescription,
      });
      
      toast({
        title: "Success",
        description: "Brand added successfully",
      });
      setIsAddBrandDialogOpen(false);
      setNewBrandName('');
      setNewBrandDescription('');
    } catch (error) {
      console.error('Error adding brand:', error);
      toast({
        title: "Error",
        description: "Failed to add brand",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case "in_progress":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> In Progress</Badge>;
      case "pending":
        return <Badge variant="outline" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {client?.client_name || 'Client'}'s Brands
        </h1>
        <Button onClick={() => setIsAddBrandDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Brands</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-muted rounded-md"></div>
                  <div className="h-12 bg-muted rounded-md"></div>
                  <div className="h-12 bg-muted rounded-md"></div>
                </div>
              ) : brands.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No brands found for this client.</p>
                  <Button 
                    onClick={() => setIsAddBrandDialogOpen(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Brand
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {brands.map((brand: Brand) => (
                    <div 
                      key={brand.id}
                      className={`p-3 rounded-md border hover:bg-muted/50 transition-colors cursor-pointer ${selectedBrand?.id === brand.id ? 'bg-muted border-primary' : ''}`}
                      onClick={() => setSelectedBrand(brand)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={brand.logo} alt={brand.name} />
                          <AvatarFallback>{brand.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{brand.name}</h3>
                          {brand.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{brand.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {!selectedBrand ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Select a Brand</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a brand from the list to view its details and tasks
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddBrandDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Brand
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedBrand.logo} alt={selectedBrand.name} />
                      <AvatarFallback>{selectedBrand.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedBrand.name}</CardTitle>
                      {selectedBrand.description && (
                        <p className="text-sm text-muted-foreground mt-1">{selectedBrand.description}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit Brand
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tasks">
                  <TabsList className="mb-4">
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="assets">Assets</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tasks">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Brand Tasks</h3>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                      </Button>
                    </div>
                    
                    {isTasksLoading ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-16 bg-muted rounded-md"></div>
                        <div className="h-16 bg-muted rounded-md"></div>
                        <div className="h-16 bg-muted rounded-md"></div>
                      </div>
                    ) : brandTasks.length === 0 ? (
                      <div className="text-center py-12 border rounded-md">
                        <p className="text-muted-foreground mb-4">No tasks found for this brand</p>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create First Task
                        </Button>
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                          {brandTasks.map((task: any) => (
                            <div 
                              key={task.task_id}
                              className="p-4 rounded-md border hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{task.title}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
                                </div>
                                <div>
                                  {getStatusBadge(task.status)}
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>Est: {task.estimated_time || 'N/A'} hrs</span>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="assets">
                    <div className="text-center py-12 border rounded-md">
                      <p className="text-muted-foreground mb-4">No brand assets uploaded yet</p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Brand Assets
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics">
                    <div className="text-center py-12 border rounded-md">
                      <p className="text-muted-foreground mb-4">Brand analytics will appear here</p>
                      <Button variant="outline">
                        <Search className="mr-2 h-4 w-4" />
                        Generate Analytics
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Brand Dialog */}
      <Dialog open={isAddBrandDialogOpen} onOpenChange={setIsAddBrandDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Add a new brand for {client?.client_name || 'this client'}. You can organize tasks and projects under each brand.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                placeholder="e.g. Brand X"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-description">Description (Optional)</Label>
              <Textarea
                id="brand-description"
                placeholder="Brief description of the brand"
                value={newBrandDescription}
                onChange={(e) => setNewBrandDescription(e.target.value)}
                rows={3}
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
