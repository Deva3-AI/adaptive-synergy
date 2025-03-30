
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { PlusCircle, Building, Briefcase } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService, Brand } from '@/services/api';
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';

const BrandsDashboard = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Get the client ID (for demo purposes)
  // In a real app, this would come from user context/auth
  const clientId = user?.clientId || 1;
  
  // Form for brand creation
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      website: '',
      industry: '',
      logo: ''
    }
  });
  
  // Fetch client's brands
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['clientBrands', clientId],
    queryFn: () => clientService.getClientBrands(clientId)
  });
  
  // Fetch tasks for each brand
  const { data: brandTasks = {} } = useQuery({
    queryKey: ['brandTasks', clientId],
    queryFn: async () => {
      // This would fetch tasks for each brand in a real app
      return {};
    }
  });
  
  // Mutation for creating a new brand
  const createBrandMutation = useMutation({
    mutationFn: (brandData: Omit<Brand, 'id' | 'created_at'>) => {
      return clientService.createBrand(brandData);
    },
    onSuccess: () => {
      setDialogOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['clientBrands', clientId] });
      toast.success('Brand created successfully');
    },
    onError: (error) => {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand. Please try again.');
    }
  });
  
  const onSubmit = (data: any) => {
    const brandData = {
      ...data,
      client_id: clientId
    };
    createBrandMutation.mutate(brandData);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Management</h1>
          <p className="text-muted-foreground">
            Manage all your brands and view brand-specific content.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
              <DialogDescription>
                Add a new brand to your client portfolio. Fill out the details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: "Brand name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  {...register('website')}
                  placeholder="https://"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  {...register('industry')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  {...register('logo')}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createBrandMutation.isPending}>
                  {createBrandMutation.isPending ? "Creating..." : "Create Brand"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="opacity-70 animate-pulse">
              <CardHeader>
                <CardTitle className="bg-muted h-6 w-3/4 rounded"></CardTitle>
                <CardDescription className="bg-muted h-4 w-1/2 rounded"></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted h-20 w-full rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : brands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <Card key={brand.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{brand.name}</CardTitle>
                    <CardDescription>{brand.industry || 'No industry specified'}</CardDescription>
                  </div>
                  {brand.logo && (
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                      <img 
                        src={brand.logo} 
                        alt={`${brand.name} logo`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {brand.description || 'No description provided.'}
                </p>
                {brand.website && (
                  <a 
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                )}
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  {brandTasks[brand.id] ? `${brandTasks[brand.id].length} tasks` : 'No tasks'}
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Brands Yet</CardTitle>
            <CardDescription>
              You haven't created any brands for this client yet. Use the "Add Brand" button to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Building className="h-16 w-16 text-muted-foreground/30" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Brand
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BrandsDashboard;
