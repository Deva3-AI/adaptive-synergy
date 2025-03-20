
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useClients } from "@/utils/apiUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface Client {
  client_id: number;
  client_name: string;
  description: string;
  contact_info: string;
  created_at?: string;
}

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: clients, isLoading, error } = useClients();

  // Filter clients based on search term
  const filteredClients = clients?.filter((client: Client) => 
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
            Error loading clients. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Clients</CardTitle>
        <CardDescription>View and manage your clients and their communication channels</CardDescription>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients?.length > 0 ? (
                  filteredClients.map((client: Client) => (
                    <TableRow key={client.client_id}>
                      <TableCell className="font-medium">{client.client_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {extractChannels(client.description).map((channel, idx) => (
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No clients found. Try a different search term.
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
