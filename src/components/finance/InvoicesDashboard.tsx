
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeService, type Invoice } from '@/services/api/financeService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Download, FileClock, Clock, ArrowUpDown, Filter, 
  Search, Check, FileText, Mail, ExternalLink, MoreHorizontal, AlertTriangle, CheckCircle
} from 'lucide-react';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isAfter, parseISO, subDays } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const InvoicesDashboard = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  
  const queryClient = useQueryClient();
  
  // Fetch invoices
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices', statusFilter],
    queryFn: () => statusFilter === 'all' ? financeService.getInvoices() : financeService.getInvoices(statusFilter),
  });
  
  // Update invoice status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ invoiceId, status }: { invoiceId: number, status: string }) => 
      financeService.updateInvoiceStatus(invoiceId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success("Invoice status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update invoice status");
    }
  });
  
  // Send reminder mutation
  const sendReminderMutation = useMutation({
    mutationFn: (invoiceId: number) => 
      financeService.sendInvoiceReminder(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success("Payment reminder sent successfully");
      setReminderDialogOpen(false);
      setReminderMessage('');
    },
    onError: () => {
      toast.error("Failed to send payment reminder");
    }
  });
  
  const handleReminderSend = () => {
    if (selectedInvoice) {
      sendReminderMutation.mutate(selectedInvoice.id);
    }
  };
  
  const handleMarkAsPaid = (invoiceId: number) => {
    updateStatusMutation.mutate({ invoiceId, status: 'paid' });
  };
  
  const filteredInvoices = invoices.filter((invoice: Invoice) => {
    // If there's a search term, check against invoice number and client name
    if (searchTerm && 
        !invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const getPendingTotal = () => {
    return filteredInvoices
      .filter((invoice: Invoice) => invoice.status === 'pending' || invoice.status === 'overdue')
      .reduce((sum: number, invoice: Invoice) => sum + invoice.amount, 0);
  };
  
  const getOverdueCount = () => {
    return filteredInvoices.filter((invoice: Invoice) => invoice.status === 'overdue').length;
  };
  
  const getPaidTotal = () => {
    return filteredInvoices
      .filter((invoice: Invoice) => invoice.status === 'paid')
      .reduce((sum: number, invoice: Invoice) => sum + invoice.amount, 0);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const isOverdue = (dueDate: string) => {
    return isAfter(new Date(), parseISO(dueDate));
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getPendingTotal())}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter((invoice: Invoice) => invoice.status === 'pending' || invoice.status === 'overdue').length} invoices pending
            </p>
            <div className="mt-2 flex items-center text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {getOverdueCount()} overdue
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getPaidTotal())}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter((invoice: Invoice) => invoice.status === 'paid').length} invoices paid
            </p>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              On track for this month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Payment Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 days</div>
            <p className="text-xs text-muted-foreground">
              From invoice to payment
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 sm:max-w-md">
          <InputWithIcon
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Invoices</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <span>Amount</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <span>Date</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No invoices found for the selected criteria</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice: Invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            {invoice.invoice_number}
                          </div>
                        </TableCell>
                        <TableCell>{invoice.client_name}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>{formatDate(invoice.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className={isOverdue(invoice.due_date) && invoice.status !== 'paid' ? 'text-red-500' : ''}>
                              {formatDate(invoice.due_date)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {invoice.status === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pending
                            </Badge>
                          )}
                          {invoice.status === 'overdue' && (
                            <Badge variant="destructive">
                              Overdue
                            </Badge>
                          )}
                          {invoice.status === 'paid' && (
                            <Badge variant="success">
                              Paid
                            </Badge>
                          )}
                          {invoice.status === 'sent' && (
                            <Badge variant="secondary">
                              Sent
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setReminderDialogOpen(true);
                                }}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsPaid(invoice.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
            <DialogDescription>
              Send a reminder to the client to pay invoice {selectedInvoice?.invoice_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="invoice-details">Invoice Details</Label>
              <div id="invoice-details" className="text-sm">
                <div><strong>Client:</strong> {selectedInvoice?.client_name}</div>
                <div><strong>Amount:</strong> {selectedInvoice && formatCurrency(selectedInvoice.amount)}</div>
                <div><strong>Due Date:</strong> {selectedInvoice && formatDate(selectedInvoice.due_date)}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-message">Message (Optional)</Label>
              <Textarea
                id="reminder-message"
                placeholder="Enter an optional message to include in the reminder..."
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReminderSend}>
              <Mail className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicesDashboard;
