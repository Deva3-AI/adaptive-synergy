
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Plus, Trash2, Filter, Search, Calendar, ArrowUpDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { financeService } from '@/services/api';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ExpenseFormData {
  amount: number;
  description: string;
  record_date: string;
  category: string;
  record_type: 'expense';
}

export const ExpensesDashboard = () => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    description: '',
    record_date: format(new Date(), 'yyyy-MM-dd'),
    category: 'Operations',
    record_type: 'expense'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<{ from: Date; to: Date }>(
    { from: new Date(new Date().setMonth(new Date().getMonth() - 1)), to: new Date() }
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  const queryClient = useQueryClient();

  // Fetch financial records (expenses only)
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['financial-records', 'expense', dateFilter],
    queryFn: async () => {
      return await financeService.getFinancialRecords('expense');
    }
  });

  // Mutation for creating a new expense
  const createExpenseMutation = useMutation({
    mutationFn: (data: ExpenseFormData) => {
      return financeService.createFinancialRecord(data);
    },
    onSuccess: () => {
      // Close modal and reset form
      setIsAddExpenseOpen(false);
      setFormData({
        amount: 0,
        description: '',
        record_date: format(new Date(), 'yyyy-MM-dd'),
        category: 'Operations',
        record_type: 'expense'
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['financial-records'] });
      toast.success('Expense added successfully');
    },
    onError: (error) => {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExpenseMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleDateSelect = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      record_date: format(date, 'yyyy-MM-dd')
    }));
  };

  // Filter expenses based on search term and category
  const filteredExpenses = expenses && Array.isArray(expenses) ? expenses.filter(expense => {
    const matchesSearch = searchTerm === '' || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || 
      (expense.category && expense.category === categoryFilter);
    
    return matchesSearch && matchesCategory;
  }) : [];

  // Extract unique categories for the filter dropdown
  const categories = expenses && Array.isArray(expenses) ? expenses.reduce((acc: string[], expense) => {
    if (expense.category && !acc.includes(expense.category)) {
      acc.push(expense.category);
    }
    return acc;
  }, []) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense Management</h1>
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Add Expense</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of the new expense.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Salaries">Salaries</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="record_date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.record_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.record_date ? format(new Date(formData.record_date), 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={new Date(formData.record_date)}
                          onSelect={(date) => date && handleDateSelect(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createExpenseMutation.isPending}>
                  {createExpenseMutation.isPending ? 'Saving...' : 'Save Expense'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
          <CardDescription>
            Manage and track all company expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex-1 min-w-[150px]">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {dateFilter.from ? (
                        dateFilter.to ? (
                          <>
                            {format(dateFilter.from, "LLL dd, y")} - {format(dateFilter.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateFilter.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: dateFilter.from,
                      to: dateFilter.to,
                    }}
                    onSelect={(range) => {
                      if (range && range.from && range.to) {
                        setDateFilter({ from: range.from, to: range.to });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              ))}
            </div>
          ) : filteredExpenses && filteredExpenses.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.record_id}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>
                        {expense.category ? (
                          <Badge variant="outline">{expense.category}</Badge>
                        ) : (
                          <Badge variant="outline">Uncategorized</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(expense.record_date)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              {expenses && Array.isArray(expenses) && expenses.length > 0
                ? "No expenses match your search criteria."
                : "No expenses found. Add your first expense using the button above."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesDashboard;
