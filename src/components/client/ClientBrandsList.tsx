
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brand } from '@/services/api/clientService';
import { Plus, FileText, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import clientService from '@/services/api/clientService';
import { toast } from 'sonner';

interface ClientBrandsListProps {
  clientId: number;
  clientName: string;
  onSelectBrand?: (brand: Brand) => void;
}

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

const ClientBrandsList: React.FC<ClientBrandsListProps> = ({ 
  clientId, 
  clientName,
  onSelectBrand 
}) => {
  const [isAddBrandDialogOpen, setIsAddBrandDialogOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  // Fetch client brands
  const { data: brands = [], isLoading: isBrandsLoading, refetch: refetchBrands } = useQuery({
    queryKey: ['clientBrands', clientId],
    queryFn: () => clientService.getClientBrands(clientId),
  });

  // Fetch brand tasks if a brand is selected
  const { data: brandTasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ['brandTasks', selectedBrandId],
    queryFn: () => selectedBrandId ? clientService.getBrandTasks(selectedBrandId) : Promise.resolve([]),
    enabled: !!selectedBrandId,
  });

  const handleBrandSelect = (brandId: number) => {
    setSelectedBrandId(brandId);
    const selectedBrand = brands.find(brand => brand.id === brandId);
    if (selectedBrand && onSelectBrand) {
      onSelectBrand(selectedBrand);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      toast.error('Brand name is required');
      return;
    }

    try {
      await clientService.createBrand(clientId, {
        name: newBrandName,
        description: newBrandDescription,
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

  if (isBrandsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Brands...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-md"></div>
            <div className="h-12 bg-muted rounded-md"></div>
            <div className="h-12 bg-muted rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">
          {clientName}'s Brands
        </CardTitle>
        <Button 
          size="sm"
          onClick={() => setIsAddBrandDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {brands.length === 0 ? (
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
          <Tabs defaultValue="list" className="p-4">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="tasks">Brand Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <div className="space-y-3">
                {brands.map((brand) => (
                  <div 
                    key={brand.id}
                    className={`p-3 rounded-md border hover:bg-muted/50 transition-colors cursor-pointer ${selectedBrandId === brand.id ? 'bg-muted border-primary' : ''}`}
                    onClick={() => handleBrandSelect(brand.id)}
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
            </TabsContent>
            
            <TabsContent value="tasks">
              {!selectedBrandId ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Select a brand to view its tasks</p>
                </div>
              ) : isTasksLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-muted rounded-md"></div>
                  <div className="h-16 bg-muted rounded-md"></div>
                </div>
              ) : brandTasks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No tasks found for this brand.</p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {brandTasks.map((task: any) => (
                      <div 
                        key={task.task_id}
                        className="p-3 rounded-md border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                          </div>
                          <div>
                            {getStatusBadge(task.status)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Est: {task.estimated_time || 'N/A'} hrs</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Add Brand Dialog */}
        <Dialog open={isAddBrandDialogOpen} onOpenChange={setIsAddBrandDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>
                Add a new brand for {clientName}. You can organize tasks and projects under each brand.
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
      </CardContent>
    </Card>
  );
};

export default ClientBrandsList;
