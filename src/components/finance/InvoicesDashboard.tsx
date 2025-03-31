
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Send, Check, AlertTriangle, MoreHorizontal, Plus, Filter, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { financeService } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const InvoicesDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch invoices
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', statusFilter !== 'all' ? statusFilter : null],
    queryFn: () => financeService.getInvoices(statusFilter !== 'all' ? statusFilter : undefined)
  });
  
  // Update invoice status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ invoiceId, status }: { invoiceId: number, status: string }) => {
      return financeService.updateInvoice(invoiceId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  });
  
  // Send invoice reminder mutation
  const sendReminderMutation = useMutation({
    mutationFn: (invoiceId: number) => {
      // This is a mock function, in reality you would call an API endpoint
      return Promise.resolve({ success: true, message: 'Reminder sent' });
    },
    onSuccess: () => {
      toast.success('Reminder sent successfully');
    },
    onError: (error) => {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    }
  });
  
  // Filter invoices based on search term
  const filteredInvoices = invoices && Array.isArray(invoices) ? invoices.filter(invoice => 
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.client_name && invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];
  
  // Get counts for status badges
  const getStatusCounts = () => {
    if (!invoices || !Array.isArray(invoices)) return { all: 0, pending: 0, paid: 0, overdue: 0 };
    
    return {
      all: invoices.length,
      pending: invoices.filter(inv => inv.status === 'pending').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length
    };
  };
  
  const statusCounts = getStatusCounts();
  
  // Handle status update
  const handleStatusUpdate = (invoiceId: number, newStatus: string) => {
    updateStatusMutation.mutate({ invoiceId, status: newStatus });
  };
  
  // Handle send reminder
  const handleSendReminder = (invoiceId: number) => {
    sendReminderMutation.mutate(invoiceId);
  };
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" className="gap-1"><Check className="h-3 w-3" /> Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Overdue</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Create Invoice</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            Manage and track all invoices in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  All
                  <Badge variant="secondary">{statusCounts.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2">
                  Pending
                  <Badge variant="secondary">{statusCounts.pending}</Badge>
                </TabsTrigger>
                <TabsTrigger value="paid" className="gap-2">
                  Paid
                  <Badge variant="secondary">{statusCounts.paid}</Badge>
                </TabsTrigger>
                <TabsTrigger value="overdue" className="gap-2">
                  Overdue
                  <Badge variant="secondary">{statusCounts.overdue}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              {renderInvoicesTable(filteredInvoices, isLoading, handleStatusUpdate, handleSendReminder)}
            </TabsContent>
            <TabsContent value="pending" className="space-y-4">
              {renderInvoicesTable(filteredInvoices, isLoading, handleStatusUpdate, handleSendReminder)}
            </TabsContent>
            <TabsContent value="paid" className="space-y-4">
              {renderInvoicesTable(filteredInvoices, isLoading, handleStatusUpdate, handleSendReminder)}
            </TabsContent>
            <TabsContent value="overdue" className="space-y-4">
              {renderInvoicesTable(filteredInvoices, isLoading, handleStatusUpdate, handleSendReminder)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to render invoices table
const renderInvoicesTable = (
  invoices: any[] | undefined,
  isLoading: boolean,
  onStatusUpdate: (invoiceId: number, status: string) => void,
  onSendReminder: (invoiceId: number) => void
) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No invoices found matching your criteria.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice_id}>
            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
            <TableCell>{invoice.client_name}</TableCell>
            <TableCell>{formatDate(invoice.created_at)}</TableCell>
            <TableCell>{formatDate(invoice.due_date)}</TableCell>
            <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
            <TableCell>
              {invoice.status === 'paid' ? (
                <Badge variant="success" className="gap-1"><Check className="h-3 w-3" /> Paid</Badge>
              ) : invoice.status === 'overdue' ? (
                <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Overdue</Badge>
              ) : (
                <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.open(`/finance/invoices/${invoice.invoice_id}`, '_blank')}>
                    View details
                  </DropdownMenuItem>
                  {invoice.status === 'pending' && (
                    <DropdownMenuItem onClick={() => onStatusUpdate(invoice.invoice_id, 'paid')}>
                      Mark as paid
                    </DropdownMenuItem>
                  )}
                  {invoice.status === 'overdue' && (
                    <DropdownMenuItem onClick={() => onSendReminder(invoice.invoice_id)}>
                      Send reminder
                    </DropdownMenuItem>
                  )}
                  {invoice.status === 'overdue' && (
                    <DropdownMenuItem onClick={() => onStatusUpdate(invoice.invoice_id, 'paid')}>
                      Mark as paid
                    </DropdownMenuItem>
                  )}
                  {invoice.status === 'paid' && (
                    <DropdownMenuItem onClick={() => onStatusUpdate(invoice.invoice_id, 'pending')}>
                      Mark as pending
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoicesDashboard;
