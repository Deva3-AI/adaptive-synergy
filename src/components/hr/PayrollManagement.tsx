
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Download, Send, DollarSign, Calendar, Filter } from "lucide-react";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

const PayrollManagement = () => {
  const [month, setMonth] = useState(format(new Date(), 'MMMM'));
  const [year, setYear] = useState(format(new Date(), 'yyyy'));
  
  // Get all employees with their roles
  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees-payroll'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          user_id,
          name,
          email,
          roles(role_name)
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
  
  // Get payslips for the selected month and year
  const { data: payslips, isLoading: payslipsLoading } = useQuery({
    queryKey: ['payslips', month, year],
    queryFn: async () => {
      // Mocked data as we haven't created payslips table yet
      return Array.from({ length: 10 }).map((_, index) => ({
        id: index + 1,
        employee_id: employees?.[index % employees.length]?.user_id || 0,
        employee_name: employees?.[index % employees.length]?.name || 'Employee',
        role: employees?.[index % employees.length]?.roles?.role_name || 'Employee',
        basic_salary: Math.floor(Math.random() * 3000) + 2000,
        allowances: Math.floor(Math.random() * 500) + 100,
        deductions: Math.floor(Math.random() * 300) + 50,
        net_salary: 0,
        month,
        year,
        status: Math.random() > 0.3 ? 'paid' : 'pending'
      })).map(p => ({
        ...p,
        net_salary: p.basic_salary + p.allowances - p.deductions
      }));
    },
    enabled: !!employees
  });
  
  const handleGeneratePayslip = (employeeId: number) => {
    toast.success(`Payslip generated for ${employees?.find(e => e.user_id === employeeId)?.name || 'employee'}`);
  };
  
  const handleSendPayslip = (employeeId: number) => {
    toast.success(`Payslip sent to ${employees?.find(e => e.user_id === employeeId)?.name || 'employee'}`);
  };
  
  const handleDownloadAll = () => {
    toast.success(`All payslips downloaded for ${month} ${year}`);
  };
  
  const handleSendAll = () => {
    toast.success(`All payslips sent for ${month} ${year}`);
  };
  
  if (employeesLoading || payslipsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payroll Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-end">
            <div className="grid w-full md:w-auto gap-1.5">
              <Label htmlFor="month">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full md:w-auto gap-1.5">
              <Label htmlFor="year">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-full md:w-[120px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025].map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full gap-1.5 md:w-auto md:flex-1">
              <Label htmlFor="search">Search Employee</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Search by name or ID..."
                  className="pl-8"
                />
              </div>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="flex justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {payslips?.length || 0} employees
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadAll}>
                <Download className="h-4 w-4" />
                Download All
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleSendAll}>
                <Send className="h-4 w-4" />
                Send All
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips?.map((payslip) => (
                <TableRow key={payslip.id}>
                  <TableCell className="font-medium">{payslip.employee_name}</TableCell>
                  <TableCell>{payslip.role}</TableCell>
                  <TableCell className="text-right">${payslip.basic_salary.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${payslip.allowances.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${payslip.deductions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${payslip.net_salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={payslip.status === 'paid' ? 'success' : 'outline'}>
                      {payslip.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {payslip.status === 'pending' ? (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleGeneratePayslip(payslip.employee_id)}
                        >
                          <DollarSign className="h-3.5 w-3.5 mr-1" />
                          Pay
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendPayslip(payslip.employee_id)}
                        >
                          <Send className="h-3.5 w-3.5 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollManagement;
