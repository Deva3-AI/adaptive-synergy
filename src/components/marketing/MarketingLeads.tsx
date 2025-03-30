
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
  Building,
  Mail,
  Phone,
  Calendar,
  Tag,
  BarChart
} from 'lucide-react';
import { marketingService } from '@/services/api';

interface Lead {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  assigned_to: number;
  assigned_to_name: string;
  created_at: string;
  last_contact: string;
  notes: string;
  score: number;
  tags: string[];
}

const MarketingLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['marketing', 'leads'],
    queryFn: () => marketingService.getLeads(),
  });
  
  const filteredLeads = leads ? leads.filter((lead: Lead) => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50"><User className="h-3 w-3 mr-1 text-blue-500" /> New</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-green-50">Qualified</Badge>;
      case 'nurturing':
        return <Badge variant="outline" className="bg-purple-50">Nurturing</Badge>;
      case 'disqualified':
        return <Badge variant="outline" className="bg-red-50">Disqualified</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getLeadScore = (score: number) => {
    let color = 'bg-gray-100 text-gray-500';
    
    if (score >= 80) {
      color = 'bg-green-100 text-green-700';
    } else if (score >= 60) {
      color = 'bg-amber-100 text-amber-700';
    } else if (score >= 40) {
      color = 'bg-orange-100 text-orange-700';
    } else {
      color = 'bg-red-100 text-red-700';
    }
    
    return (
      <div className={`text-xs rounded-full px-2 py-0.5 ${color} font-medium inline-block`}>
        {score}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Tag className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden md:table-cell">Source</TableHead>
              <TableHead className="hidden lg:table-cell">Last Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Score</TableHead>
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
              filteredLeads.map((lead: Lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.position}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      {lead.company}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs">
                        <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                        <a href={`mailto:${lead.email}`} className="hover:underline">
                          {lead.email}
                        </a>
                      </div>
                      <div className="flex items-center text-xs">
                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                        <a href={`tel:${lead.phone}`} className="hover:underline">
                          {lead.phone}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="capitalize">
                      {lead.source.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                      {new Date(lead.last_contact).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(lead.status)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {getLeadScore(lead.score)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <BarChart className="h-4 w-4" />
                        <span className="sr-only">Analyze</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Contact</span>
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
