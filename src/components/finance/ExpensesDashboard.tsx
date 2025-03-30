
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, PlusCircle, Filter, FilePdf, Search, ArrowUpDown, CreditCard, MoreHorizontal, DownloadCloud, Send, Trash2, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { financeService } from '@/services/api';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";

interface ExpenseFormData {
  amount: number;
  description: string;
  record_date: string;
  record_type: 'expense' | 'income';
}

const ExpensesDashboard = () => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    description: '',
    record_date: format(new Date(), 'yyyy-MM-dd'),
    record_type: 'expense'
  });
  const [dateFilter, setDateFilter] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Fetch financial records
  const { data: records, isLoading, refetch } = useQuery({
    queryKey: ['financial-records', typeFilter, dateFilter],
    queryFn: async () => {
      const recordType = typeFilter !== 'all' ? typeFilter : undefined;
      const startDate = dateFilter[0] ? format(dateFilter[0], 'yyyy-MM-dd') : undefined;
      const endDate = dateFilter[1] ? format(dateFilter[1], 'yyyy-MM-dd') : undefined;
      
      return financeService.getFinancialRecords(recordType, startDate, endDate);
    }
  });

  const handleCreateRecord = async () => {
    try {
      // Create a new financial record
      await financeService.createFinancialRecord(formData);
      
      // Close the dialog and reset form
      setIsDialogOpen(false);
      setFormData({
        amount: 0,
        description: '',
        record_date: format(new Date(), 'yyyy-MM-dd'),
        record_type: 'expense'
      });
      
      // Refetch records and show success message
      refetch();
      toast.success(`${formData.record_type === 'expense' ? 'Expense' : 'Income'} recorded successfully`);
    } catch (error) {
      console.error('Error creating financial record:', error);
      toast.error('Failed to record financial transaction');
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData({
        ...formData,
        record_date: format(date, 'yyyy-MM-dd')
      });
    }
  };

  // Calculate totals
  const expenseTotal = records?.filter(r => r.record_type === 'expense').reduce((sum, record) => sum + record.amount, 0) || 0;
  const incomeTotal = records?.filter(r => r.record_type === 'income').reduce((sum, record) => sum + record.amount, 0) || 0;
  const balance = incomeTotal - expenseTotal;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Financial Expenses & Income</h1>
          <p className="text-muted-foreground">
            Manage and track all financial transactions
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FilePdf className="h-4 w-4" />
            Export
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Record Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Financial Transaction</DialogTitle>
                <DialogDescription>
                  Add a new expense or income transaction to your financial records.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <RadioGroup
                  value={formData.record_type}
                  onValueChange={(value) => setFormData({...formData, record_type: value as 'expense' | 'income'})}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label htmlFor="expense">Expense</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="income" />
                    <Label htmlFor="income">Income</Label>
                  </div>
                </RadioGroup>
                
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateRecord}>
                  {formData.record_type === 'expense' ? 'Record Expense' : 'Record Income'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              {formatCurrency(expenseTotal)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {records?.filter(r => r.record_type === 'expense').length || 0} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {formatCurrency(incomeTotal)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {records?.filter(r => r.record_type === 'income').length || 0} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {records?.length || 0} total transactions
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                />
              </div>
              
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as 'all' | 'expense' | 'income')}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    {dateFilter[0] && dateFilter[1]
                      ? `${format(dateFilter[0], 'PP')} - ${format(dateFilter[1], 'PP')}`
                      : "Date Range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateFilter[0],
                      to: dateFilter[1]
                    }}
                    onSelect={(range) => setDateFilter([range?.from, range?.to])}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Loading records...</TableCell>
                </TableRow>
              ) : records && records.length > 0 ? (
                records.map((record) => (
                  <TableRow key={record.record_id || record.id}>
                    <TableCell className="font-medium">
                      {formatDate(record.record_date || record.date)}
                    </TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>
                      <Badge variant={record.record_type === 'expense' ? 'destructive' : 'success'}>
                        {record.record_type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right ${record.record_type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {formatCurrency(record.amount)}
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
                            <Send className="mr-2 h-4 w-4" />
                            <span>Share</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <CreditCard className="h-8 w-8 mb-2" />
                      <h3 className="text-lg font-medium">No transactions found</h3>
                      <p className="text-sm">Record your first transaction to get started</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Record Transaction
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesDashboard;
