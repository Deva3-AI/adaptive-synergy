
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { financeService, type Invoice } from '@/services/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { DollarSign, FileText, Mail, Check, Clock, AlertTriangle, Search, Filter, Download } from "lucide-react";
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";

const InvoicesDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch invoices based on active tab
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', activeTab],
    queryFn: () => financeService.getInvoices(activeTab === 'all' ? undefined : activeTab),
  });

  // Mutation for updating invoice status
  const updateStatusMutation = useMutation({
    mutationFn: ({ invoiceId, status }: { invoiceId: number; status: "pending" | "paid" | "overdue" }) => 
      financeService.updateInvoiceStatus(invoiceId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update invoice status');
    },
  });

  // Mutation for sending invoice reminder
  const sendReminderMutation = useMutation({
    mutationFn: (invoiceId: number) => financeService.sendInvoiceReminder(invoiceId),
    onSuccess: () => {
      toast.success('Reminder sent successfully');
    },
    onError: () => {
      toast.error('Failed to send reminder');
    },
  });

  // Handle status update
  const handleStatusUpdate = (invoiceId: number, status: "pending" | "paid" | "overdue") => {
    updateStatusMutation.mutate({ invoiceId, status });
  };

  // Handle sending reminder
  const handleSendReminder = (invoiceId: number) => {
    sendReminderMutation.mutate(invoiceId);
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices?.filter((invoice: Invoice) => 
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading invoices...</p>
            </div>
          ) : filteredInvoices && filteredInvoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice: Invoice) => (
                  <TableRow key={invoice.invoice_id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.client_name}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{format(new Date(invoice.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        {invoice.status === 'pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSendReminder(invoice.invoice_id)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusUpdate(invoice.invoice_id, 'paid')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <FileText className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                filteredInvoices
                  ?.filter((invoice: Invoice) => invoice.status !== 'paid')
                  .reduce((sum: number, invoice: Invoice) => sum + invoice.amount, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              From {filteredInvoices?.filter((invoice: Invoice) => invoice.status !== 'paid').length || 0} unpaid invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                filteredInvoices
                  ?.filter((invoice: Invoice) => invoice.status === 'overdue')
                  .reduce((sum: number, invoice: Invoice) => sum + invoice.amount, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              From {filteredInvoices?.filter((invoice: Invoice) => invoice.status === 'overdue').length || 0} overdue invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                filteredInvoices
                  ?.filter((invoice: Invoice) => invoice.status === 'paid')
                  .reduce((sum: number, invoice: Invoice) => sum + invoice.amount, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              From {filteredInvoices?.filter((invoice: Invoice) => invoice.status === 'paid').length || 0} paid invoices
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoicesDashboard;
