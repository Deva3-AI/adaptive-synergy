
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  BarChart4, 
  Filter,
  ArrowUpDown,
  Star,
  Mail,
  Phone,
  Calendar,
  Check,
  X,
  MoreHorizontal,
} from 'lucide-react';
import { format } from 'date-fns';
import { marketingService } from '@/services/api';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Fetch leads data
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['marketing-leads'],
    queryFn: () => marketingService.getLeads(),
  });
  
  // Apply filters (search and status)
  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === null || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge variant="outline">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Qualified</Badge>;
      case 'proposal':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Proposal</Badge>;
      case 'negotiation':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Negotiation</Badge>;
      case 'won':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Won</Badge>;
      case 'lost':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Lost</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Rating component
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Leads</h1>
          <p className="text-muted-foreground">
            Manage and track potential clients and opportunities
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
          <Button variant="outline">
            <BarChart4 className="mr-2 h-4 w-4" />
            Report
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((lead: any) => lead.status === 'qualified' || lead.status === 'proposal' || lead.status === 'negotiation').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +5 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.length 
                ? Math.round((leads.filter((lead: any) => lead.status === 'won').length / leads.length) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-2">
        <div className="relative w-full md:w-1/3">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                Status
                {statusFilter && (
                  <Badge variant="secondary" className="ml-2">
                    {statusFilter}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('new')}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('contacted')}>
                Contacted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('qualified')}>
                Qualified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('proposal')}>
                Proposal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('negotiation')}>
                Negotiation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('won')}>
                Won
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('lost')}>
                Lost
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div className="flex items-center space-x-1">
                    <span>Lead Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-red-500">
                    Error loading leads
                  </TableCell>
                </TableRow>
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead: any) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell><RatingStars rating={lead.rating} /></TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-xs">
                          <Mail className="h-3 w-3 mr-1" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-xs">
                          <Phone className="h-3 w-3 mr-1" />
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(lead.lastContact), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Meeting
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Check className="mr-2 h-4 w-4" />
                            Mark as Won
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <X className="mr-2 h-4 w-4" />
                            Mark as Lost
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;
