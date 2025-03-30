
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { clientService } from '@/services/api';
import { Brand } from '@/services/api/clientService';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';

const BrandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  logo: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  industry: z.string().optional()
});

type BrandFormValues = z.infer<typeof BrandSchema>;

const BrandsDashboard = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const clientId = user?.id;

  const { data: brands, isLoading } = useQuery({
    queryKey: ['clientBrands', clientId],
    queryFn: () => clientId ? clientService.getClientBrands(clientId) : Promise.resolve([]),
    enabled: !!clientId,
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['brandTasks'],
    queryFn: () => Promise.resolve([]), // We'll load tasks when a brand is selected
    enabled: false,
  });

  const createBrandMutation = useMutation({
    mutationFn: (newBrand: Omit<Brand, 'id' | 'created_at'>) => {
      return clientService.createBrand(newBrand);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientBrands'] });
      setOpen(false);
      toast.success('Brand created successfully');
    },
    onError: (error) => {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand');
    }
  });

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: "",
      logo: "",
      description: "",
      website: "",
      industry: ""
    }
  });

  const onSubmit = (values: BrandFormValues) => {
    if (!clientId) {
      toast.error('Client ID is required');
      return;
    }

    createBrandMutation.mutate({
      ...values,
      client_id: clientId,
      name: values.name
    });
  };

  const handleBrandClick = (brandId: number) => {
    navigate(`/client/brands/${brandId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">Manage your brand portfolio and brand-specific tasks</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Brand</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>
                Create a new brand to organize your tasks and projects.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter brand description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter brand website" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={createBrandMutation.isPending}>
                    Save Brand
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-[200px] rounded-lg" />
            <Skeleton className="h-[200px] rounded-lg" />
            <Skeleton className="h-[200px] rounded-lg" />
          </>
        ) : brands && brands.length > 0 ? (
          brands.map((brand) => (
            <Card key={brand.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleBrandClick(brand.id)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="h-8 w-8 rounded" />
                    ) : (
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                        {brand.name.charAt(0)}
                      </div>
                    )}
                    <CardTitle className="text-xl">{brand.name}</CardTitle>
                  </div>
                </div>
                <CardDescription>{brand.industry}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {brand.description || "No description provided"}
                </p>
                {brand.website && (
                  <p className="text-xs text-muted-foreground truncate">
                    {brand.website}
                  </p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Tasks: </span>
                    <span className="font-medium">3 active</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/client/brands/${brand.id}/tasks/new`);
                  }}>
                    New Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1">No brands found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You haven't added any brands yet. Create a brand to organize your tasks.
                </p>
                <Button onClick={() => setOpen(true)}>Add Brand</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsDashboard;
