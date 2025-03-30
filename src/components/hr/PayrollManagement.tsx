
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { PieChart } from "@/components/ui/charts/PieChart";
import { 
  FileSpreadsheet, 
  Download, 
  Send, 
  DollarSign, 
  Filter, 
  CalendarDays, 
  CheckCircle, 
  AlertCircle, 
  Users
} from "lucide-react";
import { transformSupabaseData } from '@/utils/supabaseUtils';
import { PaySlip } from '@/interfaces/hr';

const PayrollManagement = () => {
  const [selectedMonth, setSelectedMonth] = useState('current');
  
  // Generate mock payroll data
  const { data: payslips, isLoading } = useQuery({
    queryKey: ['payroll-data', selectedMonth],
    queryFn: () => {
      // This would normally call an API
      return new Promise<PaySlip[]>((resolve) => {
        setTimeout(() => {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          
          // Select month based on filter
          let month = months[currentMonth];
          let year = currentYear;
          
          if (selectedMonth === 'previous') {
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            month = months[prevMonth];
            year = prevMonth === 11 ? currentYear - 1 : currentYear;
          } else if (selectedMonth === 'next') {
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            month = months[nextMonth];
            year = nextMonth === 0 ? currentYear + 1 : currentYear;
          }
          
          const mockPayslips: PaySlip[] = [
            {
              id: 1,
              employeeId: 1,
              employeeName: "John Smith",
              month,
              year,
              basicSalary: 5000,
              allowances: 500,
              deductions: 1000,
              netSalary: 4500,
              paidDate: selectedMonth === 'previous' ? new Date(year, currentMonth - 1, 28).toISOString() : undefined,
              status: selectedMonth === 'previous' ? 'paid' : 'draft'
            },
            {
              id: 2,
              employeeId: 2,
              employeeName: "Jane Doe",
              month,
              year,
              basicSalary: 6000,
              allowances: 600,
              deductions: 1200,
              netSalary: 5400,
              paidDate: selectedMonth === 'previous' ? new Date(year, currentMonth - 1, 28).toISOString() : undefined,
              status: selectedMonth === 'previous' ? 'paid' : 'draft'
            },
            {
              id: 3,
              employeeId: 3,
              employeeName: "Michael Brown",
              month,
              year,
              basicSalary: 5500,
              allowances: 550,
              deductions: 1100,
              netSalary: 4950,
              paidDate: selectedMonth === 'previous' ? new Date(year, currentMonth - 1, 28).toISOString() : undefined,
              status: selectedMonth === 'previous' ? 'paid' : 'draft'
            },
            {
              id: 4,
              employeeId: 4,
              employeeName: "Emily Johnson",
              month,
              year,
              basicSalary: 4800,
              allowances: 480,
              deductions: 960,
              netSalary: 4320,
              paidDate: selectedMonth === 'previous' ? new Date(year, currentMonth - 1, 28).toISOString() : undefined,
              status: selectedMonth === 'previous' ? 'paid' : 'final'
            },
            {
              id: 5,
              employeeId: 5,
              employeeName: "Robert Wilson",
              month,
              year,
              basicSalary: 5200,
              allowances: 520,
              deductions: 1040,
              netSalary: 4680,
              paidDate: selectedMonth === 'previous' ? new Date(year, currentMonth - 1, 28).toISOString() : undefined,
              status: selectedMonth === 'previous' ? 'paid' : 'draft'
            }
          ];
          
          resolve(mockPayslips);
        }, 500);
      });
    }
  });
  
  // Calculate payroll statistics
  const payrollStats = React.useMemo(() => {
    if (!payslips) return {
      totalEmployees: 0,
      totalBasicSalary: 0,
      totalAllowances: 0,
      totalDeductions: 0,
      totalNetSalary: 0,
      draft: 0,
      final: 0,
      paid: 0
    };
    
    return {
      totalEmployees: payslips.length,
      totalBasicSalary: payslips.reduce((sum, p) => sum + p.basicSalary, 0),
      totalAllowances: payslips.reduce((sum, p) => sum + p.allowances, 0),
      totalDeductions: payslips.reduce((sum, p) => sum + p.deductions, 0),
      totalNetSalary: payslips.reduce((sum, p) => sum + p.netSalary, 0),
      draft: payslips.filter(p => p.status === 'draft').length,
      final: payslips.filter(p => p.status === 'final').length,
      paid: payslips.filter(p => p.status === 'paid').length
    };
  }, [payslips]);
  
  // Prepare chart data
  const salaryDistributionData = React.useMemo(() => {
    if (!payslips) return [];
    
    return [
      { name: 'Basic Salary', value: payrollStats.totalBasicSalary },
      { name: 'Allowances', value: payrollStats.totalAllowances },
      { name: 'Deductions', value: -payrollStats.totalDeductions }
    ];
  }, [payslips, payrollStats]);
  
  const payslipStatusData = React.useMemo(() => {
    if (!payslips) return [];
    
    return [
      { name: 'Draft', value: payrollStats.draft },
      { name: 'Final', value: payrollStats.final },
      { name: 'Paid', value: payrollStats.paid }
    ];
  }, [payslips, payrollStats]);
  
  // Get badge color for payslip status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'final':
        return 'warning';
      case 'draft':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Payroll Management</h2>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Generate Payslips
          </Button>
        </div>
      </div>
      
      {/* Payroll Period Selector */}
      <div className="flex gap-3">
        <Button 
          variant={selectedMonth === 'previous' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedMonth('previous')}
        >
          Previous Month
        </Button>
        <Button 
          variant={selectedMonth === 'current' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedMonth('current')}
        >
          Current Month
        </Button>
        <Button 
          variant={selectedMonth === 'next' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedMonth('next')}
        >
          Next Month
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payrollStats.totalNetSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payslips?.[0]?.month} {payslips?.[0]?.year}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollStats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Active payroll recipients
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${payrollStats.totalEmployees ? Math.round(payrollStats.totalNetSalary / payrollStats.totalEmployees).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per employee
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payslip Status</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {payrollStats.paid}/{payrollStats.totalEmployees}
              {payrollStats.paid === payrollStats.totalEmployees ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Payslips processed
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Tables */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Payroll Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="employee">By Employee</TabsTrigger>
                <TabsTrigger value="department">By Department</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslips?.map(payslip => (
                      <TableRow key={payslip.id}>
                        <TableCell className="font-medium">{payslip.employeeName}</TableCell>
                        <TableCell>${payslip.basicSalary.toLocaleString()}</TableCell>
                        <TableCell>${payslip.allowances.toLocaleString()}</TableCell>
                        <TableCell>-${payslip.deductions.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">${payslip.netSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(payslip.status)}>
                            {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            
                            {payslip.status === 'draft' && (
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            )}
                            
                            {payslip.status === 'final' && (
                              <Button variant="default" size="sm">
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
              </TabsContent>
              
              <TabsContent value="employee">
                <div className="space-y-4">
                  {payslips?.map(payslip => (
                    <Card key={payslip.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{payslip.employeeName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Employee ID: {payslip.employeeId}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(payslip.status)}>
                            {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Basic Salary</p>
                            <p className="font-medium">${payslip.basicSalary.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Allowances</p>
                            <p className="font-medium">${payslip.allowances.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Deductions</p>
                            <p className="font-medium">-${payslip.deductions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Net Salary</p>
                            <p className="font-medium">${payslip.netSalary.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">Payment Status</p>
                          <div className="mt-1">
                            <Progress 
                              value={
                                payslip.status === 'paid' ? 100 : 
                                payslip.status === 'final' ? 66 : 
                                33
                              } 
                              className="h-2" 
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Draft</span>
                            <span>Final</span>
                            <span>Paid</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Download
                          </Button>
                          
                          {payslip.status === 'draft' && (
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          )}
                          
                          {payslip.status === 'final' && (
                            <Button variant="default" size="sm">
                              <Send className="h-3.5 w-3.5 mr-1" />
                              Send
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="department">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Engineering Department</h3>
                    <Card>
                      <CardContent className="pt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Employee</TableHead>
                              <TableHead>Net Salary</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>John Smith</TableCell>
                              <TableCell>${payslips?.[0]?.netSalary.toLocaleString() || '0'}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(payslips?.[0]?.status || 'draft')}>
                                  {payslips?.[0]?.status.charAt(0).toUpperCase() + payslips?.[0]?.status.slice(1) || 'Draft'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Michael Brown</TableCell>
                              <TableCell>${payslips?.[2]?.netSalary.toLocaleString() || '0'}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(payslips?.[2]?.status || 'draft')}>
                                  {payslips?.[2]?.status.charAt(0).toUpperCase() + payslips?.[2]?.status.slice(1) || 'Draft'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <div className="flex justify-between items-center mt-4 px-4">
                          <div>
                            <p className="text-sm font-medium">Department Total</p>
                            <p className="text-xl font-semibold">${(payslips?.[0]?.netSalary || 0) + (payslips?.[2]?.netSalary || 0)}</p>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Export Department
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Design Department</h3>
                    <Card>
                      <CardContent className="pt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Employee</TableHead>
                              <TableHead>Net Salary</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Jane Doe</TableCell>
                              <TableCell>${payslips?.[1]?.netSalary.toLocaleString() || '0'}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(payslips?.[1]?.status || 'draft')}>
                                  {payslips?.[1]?.status.charAt(0).toUpperCase() + payslips?.[1]?.status.slice(1) || 'Draft'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <div className="flex justify-between items-center mt-4 px-4">
                          <div>
                            <p className="text-sm font-medium">Department Total</p>
                            <p className="text-xl font-semibold">${payslips?.[1]?.netSalary || 0}</p>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Export Department
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">HR & Admin Department</h3>
                    <Card>
                      <CardContent className="pt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Employee</TableHead>
                              <TableHead>Net Salary</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Emily Johnson</TableCell>
                              <TableCell>${payslips?.[3]?.netSalary.toLocaleString() || '0'}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(payslips?.[3]?.status || 'draft')}>
                                  {payslips?.[3]?.status.charAt(0).toUpperCase() + payslips?.[3]?.status.slice(1) || 'Draft'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Robert Wilson</TableCell>
                              <TableCell>${payslips?.[4]?.netSalary.toLocaleString() || '0'}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(payslips?.[4]?.status || 'draft')}>
                                  {payslips?.[4]?.status.charAt(0).toUpperCase() + payslips?.[4]?.status.slice(1) || 'Draft'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <div className="flex justify-between items-center mt-4 px-4">
                          <div>
                            <p className="text-sm font-medium">Department Total</p>
                            <p className="text-xl font-semibold">${(payslips?.[3]?.netSalary || 0) + (payslips?.[4]?.netSalary || 0)}</p>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Export Department
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="space-y-4 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Salary Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart 
                data={salaryDistributionData}
                nameKey="name"
                dataKey="value"
                innerRadius={30}
                outerRadius={80}
                height={200}
                valueFormatter={(value) => `$${Math.abs(value).toLocaleString()}`}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payslip Status</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart 
                data={payslipStatusData}
                nameKey="name"
                dataKey="value"
                innerRadius={30}
                outerRadius={80}
                height={200}
                colors={['#94a3b8', '#f59e0b', '#22c55e']}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payroll Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm">Data Collection</p>
                    <p className="text-sm font-medium">{selectedMonth === 'previous' ? '100%' : '100%'}</p>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm">Payslip Generation</p>
                    <p className="text-sm font-medium">{selectedMonth === 'previous' ? '100%' : '100%'}</p>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm">Payslip Review</p>
                    <p className="text-sm font-medium">
                      {selectedMonth === 'previous' ? '100%' : `${Math.round((payrollStats.final + payrollStats.paid) / payrollStats.totalEmployees * 100)}%`}
                    </p>
                  </div>
                  <Progress 
                    value={selectedMonth === 'previous' ? 100 : Math.round((payrollStats.final + payrollStats.paid) / payrollStats.totalEmployees * 100)} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm">Payment Processing</p>
                    <p className="text-sm font-medium">
                      {selectedMonth === 'previous' ? '100%' : `${Math.round(payrollStats.paid / payrollStats.totalEmployees * 100)}%`}
                    </p>
                  </div>
                  <Progress 
                    value={selectedMonth === 'previous' ? 100 : Math.round(payrollStats.paid / payrollStats.totalEmployees * 100)} 
                    className="h-2" 
                  />
                </div>
                
                {selectedMonth !== 'previous' && (
                  <Button className="w-full">Generate All Payslips</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* AI-Generated Insights */}
      <Card className="border-blue-200 bg-blue-50/40 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Payroll Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1.5">
                <AlertCircle className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Overtime Analysis:</span> Engineering department overtime is 20% higher than other departments. Consider workload redistribution.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1.5">
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Payroll Efficiency:</span> Current payroll processing time is 3 days, down from 5 days last quarter due to automation improvements.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1.5">
                <CalendarDays className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Tax Optimization:</span> Analysis shows potential for $3,200 in annual tax savings by restructuring allowances. Recommendation: Schedule consultant review.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollManagement;
