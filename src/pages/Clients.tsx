
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ClientsList from '@/components/client/ClientsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Building2, ArrowUpDown } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

const Clients = () => {
  // Fetch clients directly from Supabase
  const { data: clients, isLoading, error, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('client_name', { ascending: true });
        
        if (error) throw error;
        console.log('Fetched clients from Supabase:', data);
        return data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
    }
  });

  useEffect(() => {
    // Force refetch on mount to ensure latest data
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and projects</p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>
      
      {/* Client Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : (clients?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Active business relationships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : "12"}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Client Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : "28"}
            </div>
            <p className="text-xs text-muted-foreground">
              Key stakeholders
            </p>
          </CardContent>
        </Card>
      </div>
      
      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Clients</CardTitle>
            <CardDescription>
              There was a problem fetching client data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
              {(error as Error).message || "Unknown error occurred"}
            </div>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ClientsList />
      )}
    </div>
  );
};

export default Clients;
