
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Link2, Briefcase, Image as ImageIcon } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';

interface Brand {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  client_id: number;
  created_at?: string;
}

interface BrandFormData {
  name: string;
  logo: string;
  description: string;
  website: string;
  industry: string;
}

const BrandsDashboard = () => {
  const { user } = useAuth();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    logo: '',
    description: '',
    website: '',
    industry: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API to create the brand
      console.log('Creating brand with data:', formData);
      
      // Simulate API call success
      setTimeout(() => {
        // Add the new brand to the list
        const newBrand = {
          id: Date.now(), // Use timestamp as temporary ID
          ...formData,
          client_id: user?.client_id || 0
        };
        
        setBrands(prev => [...prev, newBrand]);
        setOpenModal(false);
        toast.success('Brand created successfully!');
        
        // Reset form
        setFormData({
          name: '',
          logo: '',
          description: '',
          website: '',
          industry: ''
        });
        
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Check if user has client_id property
        if (!user.client_id) {
          console.error('User does not have a client_id');
          return;
        }
        
        // Make API call to fetch brands
        // In a real app this would be an API call instead of mockData
        // const response = await clientService.getBrandsByClientId(user.client_id);
        // setBrands(response.data);
        
        // Simulate API call with mock data
        setTimeout(() => {
          setBrands([
            {
              id: 1,
              name: 'Acme Corp',
              logo: '/logos/acme.png',
              description: 'Leading provider of innovative solutions',
              industry: 'Technology',
              website: 'https://acme.example.com'
            },
            // ... more brands
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setLoading(false);
      }
    };

    fetchBrands();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Brand Management</h2>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Brand</DialogTitle>
                <DialogDescription>
                  Add a new brand to manage its assets and tasks.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logo" className="text-right">
                    Logo URL
                  </Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="website" className="text-right">
                    Website
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="industry" className="text-right">
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Brand'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-6 bg-muted rounded-md w-1/2"></div>
                <div className="h-4 bg-muted rounded-md w-3/4"></div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 bg-muted rounded-md w-full"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
                <div className="h-4 bg-muted rounded-md w-4/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : brands.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent className="pt-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Brands Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first brand to manage its assets and tasks.
            </p>
            <Button onClick={() => setOpenModal(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Card key={brand.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{brand.name}</CardTitle>
                    <CardDescription>{brand.industry}</CardDescription>
                  </div>
                  {brand.logo && (
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img 
                        src={brand.logo} 
                        alt={`${brand.name} logo`} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Logo';
                        }} 
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {brand.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {brand.description}
                  </p>
                )}
                {brand.website && (
                  <div className="flex items-center text-sm">
                    <Link2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <a 
                      href={brand.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {brand.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">View Tasks</Button>
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Assets
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandsDashboard;
