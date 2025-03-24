import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input, InputWithIcon, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Filter, FileText, Mail, Clock, DollarSign, ArrowUpRight, Check, AlertCircle, Search } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { hrService, Payslip } from '@/services/api/hrService';
import { format, parseISO, isAfter, isBefore, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const PayrollManagement = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()));
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const periodStart = format(selectedMonth, 'yyyy-MM-dd');
  const periodEnd = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');
  
  const { data: payslips, isLoading } = useQuery({
    queryKey: ['hr-payslips', periodStart, periodEnd],
    queryFn: () => hrService.getPayslips(periodStart, periodEnd),
  });
  
  const filteredPayslips = payslips ? payslips.filter((payslip: Payslip) => {
    if (statusFilter !== 'all' && payslip.status !== statusFilter) {
      return false;
    }
    
    if (searchTerm && !payslip.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }) : [];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700">Draft</Badge>;
      case 'generated':
        return <Badge className="bg-blue-500">Generated</Badge>;
      case 'sent':
        return <Badge className="bg-purple-500">Sent</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const getTotalPayrollAmount = () => {
    if (!payslips) return 0;
    return payslips.reduce((total, payslip) => total + payslip.net_salary, 0);
  };
  
  const handleMonthChange = (offset: number) => {
    setSelectedMonth(startOfMonth(subMonths(selectedMonth, -offset)));
  };
  
  const handleGeneratePayslip = async (employeeId: number, month: string) => {
    try {
      await hrService.generatePayslip(employeeId, month);
      refetch();
      toast.success("Payslip generated successfully");
    } catch (error) {
      console.error("Failed to generate payslip:", error);
      toast.error("Failed to generate payslip");
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="payslips">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="payslips">Payslips</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 rounded-r-none"
                onClick={() => handleMonthChange(-1)}
              >
                &lt;
              </Button>
              <div className="px-3 py-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {format(selectedMonth, 'MMMM yyyy')}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 rounded-l-none"
                onClick={() => handleMonthChange(1)}
                disabled={isAfter(selectedMonth, startOfMonth(new Date()))}
              >
                &gt;
              </Button>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Payslips
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Payslips</DialogTitle>
                  <DialogDescription>
                    Generate payslips for the selected period
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Period</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Input 
                        type="date" 
                        value={format(selectedMonth, 'yyyy-MM-dd')} 
                        disabled 
                        className="bg-background" 
                      />
                      <span>to</span>
                      <Input 
                        type="date" 
                        value={format(endOfMonth(selectedMonth), 'yyyy-MM-dd')} 
                        disabled 
                        className="bg-background" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Payment Date</Label>
                    <Input type="date" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Additional Notes</Label>
                    <Input placeholder="Optional notes" className="mt-1.5" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    This will generate payslips for all employees for the selected period.
                  </p>
                  <Button>Generate Now</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <TabsContent value="payslips" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-2">
              <InputWithIcon
                placeholder="Search payslips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
                icon={<Search className="h-4 w-4" />}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="max-w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Period</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Basic Salary</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Allowances</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Deductions</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Net Salary</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-3 text-center">Loading...</td>
                      </tr>
                    ) : filteredPayslips && filteredPayslips.length > 0 ? (
                      filteredPayslips.map((payslip: Payslip) => (
                        <tr key={payslip.payslip_id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{payslip.employee_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{payslip.employee_name}</div>
                                <div className="text-xs text-muted-foreground">ID: {payslip.user_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              {format(new Date(payslip.period_start), 'MMM d')} - {format(new Date(payslip.period_end), 'MMM d, yyyy')}
                            </div>
                          </td>
                          <td className="px-4 py-3">${payslip.basic_salary.toFixed(2)}</td>
                          <td className="px-4 py-3 text-green-600">+${payslip.allowances.toFixed(2)}</td>
                          <td className="px-4 py-3 text-red-600">-${payslip.deductions.toFixed(2)}</td>
                          <td className="px-4 py-3 font-medium">${payslip.net_salary.toFixed(2)}</td>
                          <td className="px-4 py-3">{getStatusBadge(payslip.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {payslip.status === "generated" || payslip.status === "draft" && (
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4 mr-1" />
                                  Send
                                </Button>
                              )}
                              {payslip.document_url && (
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  PDF
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-3 text-center">
                          No payslips found for this period. {isBefore(selectedMonth, new Date()) ? "Click 'Generate Payslips' to create them." : ""}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${getTotalPayrollAmount().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  For {format(selectedMonth, 'MMMM yyyy')}
                </p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  4.5% from last month
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${filteredPayslips && filteredPayslips.length > 0 
                    ? (getTotalPayrollAmount() / filteredPayslips.length).toFixed(2) 
                    : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per employee
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {payslips ? payslips.filter(p => p.status === 'paid' || p.status === 'sent').length : 0}/
                  {payslips ? payslips.length : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Payslips processed
                </p>
                {payslips && payslips.some(p => p.status === 'draft') && (
                  <div className="mt-2 flex items-center text-xs text-amber-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {payslips.filter(p => p.status === 'draft').length} drafts pending
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Department Breakdown</CardTitle>
              <CardDescription>
                Payroll distribution by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                [Department Bar Chart - Would display payroll by department]
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Salary Distribution</CardTitle>
                <CardDescription>
                  Employee count by salary range
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Histogram Chart - Would display salary distribution]
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payroll Components</CardTitle>
                <CardDescription>
                  Breakdown of salary components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Pie Chart - Would display salary components]
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>
                Monthly payroll trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                [Line Chart - Would display payroll over time]
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-background rounded-md border overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Recent Payroll Processing</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium">Pay Period</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Employees</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Total Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Generated On</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: 1,
                      period: 'August 2023',
                      startDate: '2023-08-01',
                      endDate: '2023-08-31',
                      employees: 45,
                      amount: 187500,
                      generatedOn: '2023-08-28T10:00:00',
                      status: 'paid'
                    },
                    {
                      id: 2,
                      period: 'July 2023',
                      startDate: '2023-07-01',
                      endDate: '2023-07-31',
                      employees: 43,
                      amount: 179500,
                      generatedOn: '2023-07-29T11:30:00',
                      status: 'paid'
                    },
                    {
                      id: 3,
                      period: 'June 2023',
                      startDate: '2023-06-01',
                      endDate: '2023-06-30',
                      employees: 43,
                      amount: 177800,
                      generatedOn: '2023-06-28T09:15:00',
                      status: 'paid'
                    }
                  ].map((record) => (
                    <tr key={record.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{record.period}</td>
                      <td className="px-4 py-3">{record.employees}</td>
                      <td className="px-4 py-3">${record.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">{format(new Date(record.generatedOn), 'MMM d, yyyy')}</td>
                      <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollManagement;
