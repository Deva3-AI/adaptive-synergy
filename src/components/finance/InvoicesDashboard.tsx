import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, CalendarIcon, Clock, Download, Filter, Mail, Plus, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Invoice } from '@/services/api/financeService';
import { toast } from 'sonner';

const InvoiceStatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    sent: 'bg-blue-100 text-blue-800 border-blue-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusType = status as keyof typeof statusStyles;
  
  return (
    <Badge variant="outline" className={statusStyles[statusType] || ''}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const InvoicesDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { data: invoices, isLoading, refetch } = useQuery({
    queryKey: ['invoices', statusFilter],
    queryFn: () => {
      return statusFilter === 'all' 
        ? financeService.getInvoices() 
        : financeService.getInvoices(statusFilter);
    },
  });

  const handleSendReminder = async (invoice: Invoice) => {
    if (invoice.status !== 'pending' && invoice.status !== 'overdue') {
      toast({
        title: "Cannot send reminder",
        description: "Reminders can only be sent for pending or overdue invoices.",
        variant: "destructive"
      });
      return;
    }

    try {
      await financeService.sendInvoiceReminder(invoice.invoice_id);
      toast({
        title: "Reminder Sent",
        description: `Reminder sent successfully for invoice #${invoice.invoice_number}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (invoiceId: number, newStatus: string) => {
    try {
      await financeService.updateInvoiceStatus(invoiceId, newStatus);
      refetch();
      toast.success(`Invoice status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const filteredInvoices = invoices?.filter((invoice: Invoice) => {
    const matchesSearch = invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate ? 
      new Date(invoice.due_date).toDateString() === selectedDate.toDateString() : 
      true;
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 max-w-md relative">
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-8"
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {selectedDate ? format(selectedDate, 'PP') : 'Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No invoices found matching your criteria
            </div>
          ) : (
            filteredInvoices?.map((invoice: Invoice) => (
              <Card key={invoice.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-medium">
                        {invoice.client_name || `Client #${invoice.client_id}`}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        Invoice #{invoice.invoice_number}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-lg font-medium">
                        ${invoice.amount.toLocaleString()}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </div>
                      
                      <InvoiceStatusBadge status={invoice.status} />
                      
                      <div className="flex gap-2">
                        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendReminder(invoice);
                            }}
                            disabled={invoice.status === 'paid'}
                          >
                            <MailIcon className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline">
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          PDF
                        </Button>
                        
                        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendReminder(invoice);
                            }}
                            disabled={invoice.status === 'paid'}
                          >
                            <MailIcon className="h-4 w-4 mr-1" /> Send Reminder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default InvoicesDashboard;
