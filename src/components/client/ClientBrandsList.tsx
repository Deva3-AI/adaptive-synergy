
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
import { clientService } from '@/services/api';
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
      await clientService.createBrand({
        name: newBrandName,
        description: newBrandDescription,
        client_id: clientId
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
              className="mt-2"
            >
              Add First Brand
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="list">
            <TabsList className="w-full">
              <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
              <TabsTrigger value="grid" className="flex-1">Grid View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="p-4">
              <div className="space-y-3">
                {brands.map((brand) => (
                  <div 
                    key={brand.id}
                    className={`p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors ${selectedBrandId === brand.id ? 'bg-accent text-accent-foreground' : ''}`}
                    onClick={() => handleBrandSelect(brand.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={brand.logo} alt={brand.name} />
                          <AvatarFallback>{brand.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{brand.name}</h3>
                          {brand.description && (
                            <p className="text-sm text-muted-foreground">{brand.description}</p>
                          )}
                        </div>
                      </div>
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="grid" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <Card 
                    key={brand.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${selectedBrandId === brand.id ? 'border-primary' : ''}`}
                    onClick={() => handleBrandSelect(brand.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={brand.logo} alt={brand.name} />
                          <AvatarFallback className="text-lg">{brand.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{brand.name}</h3>
                          {brand.description && (
                            <p className="text-sm text-muted-foreground">{brand.description}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      {/* Brand tasks section */}
      {selectedBrandId && (
        <div className="mt-4 p-4 border-t">
          <h3 className="font-medium mb-3">Brand Tasks</h3>
          {isTasksLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-8 bg-muted rounded-md"></div>
              <div className="h-8 bg-muted rounded-md"></div>
            </div>
          ) : brandTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No tasks found for this brand</p>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {brandTasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm">{task.assigned_to}</span>
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}

      {/* Add Brand Dialog */}
      <Dialog open={isAddBrandDialogOpen} onOpenChange={setIsAddBrandDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Create a new brand for {clientName}
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
    </Card>
  );
};

export default ClientBrandsList;
