
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
  Mail,
  Check,
  Clock,
  X,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { marketingService } from '@/services/api';
import { EmailOutreach } from '@/interfaces/marketing';

const MarketingEmailOutreach = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: emails, isLoading, error } = useQuery({
    queryKey: ['marketing', 'email-outreach'],
    queryFn: () => marketingService.getEmailOutreach(),
  });
  
  const filteredEmails = emails ? emails.filter((email: EmailOutreach) => 
    email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    email.recipientCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'sent':
        return <Badge variant="outline"><Mail className="h-3 w-3 mr-1" /> Sent</Badge>;
      case 'opened':
        return <Badge variant="outline" className="bg-blue-50"><Check className="h-3 w-3 mr-1 text-blue-500" /> Opened</Badge>;
      case 'replied':
        return <Badge variant="outline" className="bg-green-50"><Check className="h-3 w-3 mr-1 text-green-500" /> Replied</Badge>;
      case 'bounced':
        return <Badge variant="outline" className="bg-red-50"><X className="h-3 w-3 mr-1 text-red-500" /> Bounced</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search emails..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Email
        </Button>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Follow-up</TableHead>
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
                <TableCell colSpan={8} className="text-center text-red-500">Error loading emails</TableCell>
              </TableRow>
            ) : filteredEmails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No emails found</TableCell>
              </TableRow>
            ) : (
              filteredEmails.map((email: EmailOutreach) => (
                <TableRow key={email.id}>
                  <TableCell>{getStatusBadge(email.status)}</TableCell>
                  <TableCell>{email.recipient}</TableCell>
                  <TableCell>{email.recipientCompany || '-'}</TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>{format(new Date(email.sentAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {email.source.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {email.followUpScheduled ? (
                      <Badge variant="outline" className="bg-purple-50">
                        <Calendar className="h-3 w-3 mr-1 text-purple-500" /> Scheduled
                      </Badge>
                    ) : (
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Calendar className="h-3 w-3 mr-1" /> Schedule
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-7">
                      View
                    </Button>
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

export default MarketingEmailOutreach;
