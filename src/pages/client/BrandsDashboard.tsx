import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
// Update the import to get Brand from clientService instead
import { Brand } from '@/services/api/clientService';
import { User } from '@/hooks/useUser';
import clientService from '@/services/api/clientService';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  logo: z.string().url({
    message: "Please enter a valid URL for the logo.",
  }).optional(),
  description: z.string().optional(),
  website: z.string().url({
    message: "Please enter a valid URL for the website.",
  }).optional(),
  industry: z.string().optional(),
})

// Update the relevant part to handle clientId properly
const BrandsDashboard = () => {
  const { user } = useUser();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState<Omit<Brand, 'id' | 'created_at'>>({
    name: '',
    client_id: user?.role === 'client' ? (user.id || 0) : 0,
    logo: '',
    description: '',
    website: '',
    industry: ''
  });

  // Fix the query to use clientService.getClientBrands
  const { data: brands = [], isLoading, refetch } = useQuery({
    queryKey: ['client-brands', user?.id],
    queryFn: () => {
      if (user?.role === 'client' && user.id) {
        return clientService.getClientBrands(user.id);
      }
      return [];
    },
    enabled: !!user && user.role === 'client' && !!user.id
  });

  // Fix the createBrand mutation
  const createBrandMutation = useMutation({
    mutationFn: (brandData: Omit<Brand, 'id' | 'created_at'>) => {
      return clientService.createBrand(brandData);
    },
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
      setNewBrand({
        name: '',
        client_id: user?.role === 'client' ? (user.id || 0) : 0,
        logo: '',
        description: '',
        website: '',
        industry: ''
      });
      toast.success('Brand created successfully');
    },
    onError: (error) => {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand');
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logo: "",
      description: "",
      website: "",
      industry: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createBrandMutation.mutate({
      ...values,
      client_id: user?.id || 0,
    });
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your brands.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">
                    <img src={brand.logo} alt={brand.name} className="h-8 w-8 rounded-full" />
                  </TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{brand.website}</TableCell>
                  <TableCell>{brand.industry}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Brand</DialogTitle>
                <DialogDescription>
                  Create a new brand for your company.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Brand Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Logo URL" {...field} />
                        </FormControl>
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
                          <Input placeholder="Description" {...field} />
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
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Website URL" {...field} />
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
                        <FormControl>
                          <Input placeholder="Industry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Add Brand</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandsDashboard;
