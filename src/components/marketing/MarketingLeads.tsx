
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { marketingService } from '@/services/api';
import { LeadProfile } from '@/interfaces/marketing';

const MarketingLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['marketing', 'leads'],
    queryFn: () => marketingService.getLeads(),
  });
  
  const filteredLeads = leads ? leads.filter((lead: LeadProfile) => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge className="bg-blue-50 text-blue-600">New</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-50 text-yellow-600">Contacted</Badge>;
      case 'meeting_scheduled':
        return <Badge className="bg-purple-50 text-purple-600">Meeting Scheduled</Badge>;
      case 'meeting_completed':
        return <Badge className="bg-indigo-50 text-indigo-600">Meeting Completed</Badge>;
      case 'proposal_sent':
        return <Badge className="bg-orange-50 text-orange-600">Proposal Sent</Badge>;
      case 'converted':
        return <Badge className="bg-green-50 text-green-600">Converted</Badge>;
      case 'lost':
        return <Badge className="bg-gray-50 text-gray-600">Lost</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getScoreIndicator = (score: number) => {
    if (score >= 80) return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
    if (score >= 60) return <Star className="h-4 w-4 text-yellow-500" />;
    if (score >= 40) return <Star className="h-4 w-4 text-gray-400" />;
    return <Star className="h-4 w-4 text-gray-300" />;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500">Error loading leads</TableCell>
              </TableRow>
            ) : filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No leads found</TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead: LeadProfile) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.position}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell className="flex items-center">
                    {getScoreIndicator(lead.score || 0)}
                    <span className="ml-1">{lead.score}</span>
                  </TableCell>
                  <TableCell>
                    {lead.lastContactedAt 
                      ? format(new Date(lead.lastContactedAt), 'MMM dd, yyyy')
                      : 'Not contacted yet'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mail className="h-4 w-4" />
                      </Button>
                      {lead.phone && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MarketingLeads;
