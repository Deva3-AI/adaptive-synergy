
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Edit, PlusCircle } from "lucide-react";
import { Link } from 'react-router-dom';

interface Client {
  client_id: number;
  client_name: string;
  description?: string;
  contact_info?: string;
  created_at: string;
}

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch clients directly from Supabase
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('client_name');

        if (error) throw error;
        
        console.log('Fetched clients from Supabase in ClientsList:', data);
        setClients(data || []);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  const filteredClients = clients?.filter((client) => 
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_info?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract communication channels from description
  const extractChannels = (description: string): string[] => {
    if (!description) return [];
    
    const channels = ['Discord', 'Slack', 'Email', 'Whatsapp', 'Trello', 'Asana', 'Google doc', 'Base Camp'];
    return channels.filter(channel => description.includes(channel));
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>Something went wrong loading clients data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
            Error loading clients: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Clients</CardTitle>
            <CardDescription>View and manage your clients and their communication channels</CardDescription>
          </div>
          <Button className="gap-1">
            <PlusCircle className="h-4 w-4" />
            New Client
          </Button>
        </div>
        <div className="mt-2">
          <Input 
            placeholder="Search clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Communication Channels</TableHead>
                  <TableHead>Task Assignment</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients?.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.client_id}>
                      <TableCell className="font-medium">{client.client_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {extractChannels(client.description || '').map((channel, idx) => (
                            <Badge key={idx} variant="outline">{channel}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {client.description?.includes('Google doc') && <Badge variant="secondary">Google Docs</Badge>}
                          {client.description?.includes('Asana') && <Badge variant="secondary">Asana</Badge>}
                          {client.description?.includes('Trello') && <Badge variant="secondary">Trello</Badge>}
                          {client.description?.includes('Whatsapp') && client.description?.includes('tasks') && <Badge variant="secondary">WhatsApp</Badge>}
                          {client.description?.includes('Base Camp') && <Badge variant="secondary">Base Camp</Badge>}
                          {client.description?.includes('Email') && client.description?.includes('tasks') && <Badge variant="secondary">Email</Badge>}
                          {client.description?.includes('Slack') && client.description?.includes('tasks') && <Badge variant="secondary">Slack</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{client.contact_info}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      {clients.length === 0 ? 'No clients found. Add your first client to get started.' : 'No clients match your search. Try a different term.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientsList;
