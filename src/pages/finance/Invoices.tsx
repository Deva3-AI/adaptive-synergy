
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Download, Eye, Filter, Plus, Search, FilePlus, Send, MoreHorizontal, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for invoices
const invoices = [
  {
    id: "INV-2023-001",
    client: "ABC Corporation",
    amount: 7500,
    issueDate: "2023-09-05",
    dueDate: "2023-10-05",
    status: "paid",
    paymentDate: "2023-09-25",
  },
  {
    id: "INV-2023-002",
    client: "XYZ Limited",
    amount: 5200,
    issueDate: "2023-09-10",
    dueDate: "2023-10-10",
    status: "pending",
  },
  {
    id: "INV-2023-003",
    client: "123 Industries",
    amount: 3800,
    issueDate: "2023-09-12",
    dueDate: "2023-10-12",
    status: "pending",
  },
  {
    id: "INV-2023-004",
    client: "Tech Solutions Inc",
    amount: 12000,
    issueDate: "2023-09-15",
    dueDate: "2023-10-15",
    status: "pending",
  },
  {
    id: "INV-2023-005",
    client: "Creative Agency Co",
    amount: 4500,
    issueDate: "2023-09-18",
    dueDate: "2023-10-18",
    status: "pending",
  },
  {
    id: "INV-2023-006",
    client: "Global Ventures",
    amount: 8000,
    issueDate: "2023-08-25",
    dueDate: "2023-09-25",
    status: "overdue",
  },
  {
    id: "INV-2023-007",
    client: "Startup Innovators",
    amount: 6500,
    issueDate: "2023-08-30",
    dueDate: "2023-09-30",
    status: "overdue",
  },
  {
    id: "INV-2023-008",
    client: "Enterprise Solutions",
    amount: 9200,
    issueDate: "2023-08-20",
    dueDate: "2023-09-20",
    status: "paid",
    paymentDate: "2023-09-15",
  },
];

// Sample data for payment status chart
const paymentStatusData = [
  { name: "Paid", value: 24000 },
  { name: "Pending", value: 25500 },
  { name: "Overdue", value: 14500 },
];

// Sample data for monthly invoice amounts
const monthlyInvoiceData = [
  { name: "Jan", amount: 42000 },
  { name: "Feb", amount: 48000 },
  { name: "Mar", amount: 52000 },
  { name: "Apr", amount: 58000 },
  { name: "May", amount: 56000 },
  { name: "Jun", amount: 62000 },
  { name: "Jul", amount: 68000 },
  { name: "Aug", amount: 72000 },
  { name: "Sep", amount: 56700 },
];

// Status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "overdue":
      return "destructive";
    case "draft":
      return "secondary";
    default:
      return "outline";
  }
};

const FinanceInvoices = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
          <p className="text-muted-foreground">
            Create, track, and manage client invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <FilePlus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$40,000</div>
            <p className="text-xs text-muted-foreground">Across 6 invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <FileText className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$14,500</div>
            <p className="text-xs text-muted-foreground">Across 2 invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$16,700</div>
            <p className="text-xs text-muted-foreground">Across 2 invoices</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Overview of current invoice status</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              data={paymentStatusData} 
              height={200}
              defaultType="pie"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Invoices</CardTitle>
            <CardDescription>Total invoice amounts by month</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              data={monthlyInvoiceData} 
              height={200}
              defaultType="bar"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Manage Invoices</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {date ? format(date, "MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status === "pending" && (
                            <Button variant="ghost" size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="pending">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Pending Invoices</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter showing only pending invoices would appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="overdue">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Overdue Invoices</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter showing only overdue invoices would appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="paid">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Paid Invoices</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter showing only paid invoices would appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceInvoices;
