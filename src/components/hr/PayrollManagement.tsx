
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PieChart from "@/components/ui/charts/PieChart";
import { toast } from "sonner";
import { DollarSign, Calendar, FileCheck, FileText, Download, Send, Users, Plus, User } from "lucide-react";
import { PaySlip } from '@/interfaces/hr';
import hrServiceSupabase from '@/services/api/hrServiceSupabase';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = MONTHS[new Date().getMonth()];

const PayrollManagement = () => {
  const [activeTab, setActiveTab] = useState("payslips");
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [year, setYear] = useState(CURRENT_YEAR.toString());
  const [selectedPayslip, setSelectedPayslip] = useState<PaySlip | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [isGeneratePayslipsOpen, setIsGeneratePayslipsOpen] = useState(false);
  
  // Fetch payslips
  const { data: payslips, isLoading: isLoadingPayslips, refetch: refetchPayslips } = useQuery({
    queryKey: ['payslips', month, year],
    queryFn: () => hrServiceSupabase.getPayslips(month, parseInt(year)),
  });
  
  // Fetch employees
  const { data: employees } = useQuery({
    queryKey: ['employees-for-payroll'],
    queryFn: () => hrServiceSupabase.getEmployees(),
  });
  
  // Handle payslip generation
  const handleGeneratePayslips = async () => {
    try {
      await hrServiceSupabase.generatePayslips(month, parseInt(year));
      toast.success(`Payslips generated for ${month} ${year}`);
      setIsGeneratePayslipsOpen(false);
      refetchPayslips();
    } catch (error) {
      console.error('Error generating payslips:', error);
      toast.error('Failed to generate payslips');
    }
  };
  
  // Calculate payroll stats
  const payrollStats = React.useMemo(() => {
    if (!payslips) return {
      total: 0,
      paid: 0,
      pending: 0,
      totalAmount: 0,
      paidAmount: 0
    };
    
    return {
      total: payslips.length,
      paid: payslips.filter(p => p.status === 'paid').length,
      pending: payslips.filter(p => p.status !== 'paid').length,
      totalAmount: payslips.reduce((sum, p) => sum + p.net_salary, 0),
      paidAmount: payslips.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.net_salary, 0)
    };
  }, [payslips]);
  
  // Prepare chart data
  const statusChartData = [
    { name: 'Paid', value: payrollStats.paid, color: "#22c55e" },
    { name: 'Pending', value: payrollStats.pending, color: "#f59e0b" }
  ];
  
  // Handle payslip download
  const handleDownloadPayslip = (payslip: PaySlip) => {
    toast.success(`Downloading payslip for ${payslip.employee_name}`);
    
    // In a real implementation, this would make an API call to download the payslip PDF
    setTimeout(() => {
      toast('Payslip downloaded successfully');
    }, 1500);
  };
  
  // Handle send payslip email
  const handleSendPayslip = (payslip: PaySlip) => {
    toast.success(`Sending payslip to ${payslip.employee_name}`);
    
    // In a real implementation, this would make an API call to send the payslip via email
    setTimeout(() => {
      toast('Payslip sent successfully');
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payroll Management</h2>
          <p className="text-muted-foreground">Generate and manage employee payslips</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isGeneratePayslipsOpen} onOpenChange={setIsGeneratePayslipsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Payslips
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Generate Payslips</DialogTitle>
                <DialogDescription>
                  Generate payslips for all employees based on attendance and salary data.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Select defaultValue={month} onValueChange={setMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select defaultValue={year} onValueChange={setYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={(CURRENT_YEAR - 1).toString()}>{CURRENT_YEAR - 1}</SelectItem>
                        <SelectItem value={CURRENT_YEAR.toString()}>{CURRENT_YEAR}</SelectItem>
                        <SelectItem value={(CURRENT_YEAR + 1).toString()}>{CURRENT_YEAR + 1}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium text-sm mb-2">This will:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Pull attendance data for {month} {year}</li>
                    <li>• Calculate salary based on employee contracts and attendance</li>
                    <li>• Generate digital payslips for all employees</li>
                    <li>• Mark payslips as pending until approved</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGeneratePayslipsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGeneratePayslips}>
                  Generate Payslips
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${payrollStats.totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For {month} {year}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${payrollStats.paidAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {payrollStats.paid} payslips paid
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              ${(payrollStats.totalAmount - payrollStats.paidAmount).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {payrollStats.pending} payslips pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pt-2">
            <PieChart 
              data={statusChartData}
              height={120}
              width={120}
              valueFormatter={(value) => `${value} payslips`}
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        defaultValue="payslips" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="payslips" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Payslips
            </TabsTrigger>
            <TabsTrigger value="salary-review" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Salary Review
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Payment Transactions
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select defaultValue={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select defaultValue={year} onValueChange={setYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={(CURRENT_YEAR - 1).toString()}>{CURRENT_YEAR - 1}</SelectItem>
                <SelectItem value={CURRENT_YEAR.toString()}>{CURRENT_YEAR}</SelectItem>
                <SelectItem value={(CURRENT_YEAR + 1).toString()}>{CURRENT_YEAR + 1}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="payslips" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {isLoadingPayslips ? (
                <div className="text-center py-8">Loading payslips...</div>
              ) : !payslips || payslips.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No payslips found for {month} {year}</p>
                  <Button onClick={() => setIsGeneratePayslipsOpen(true)}>
                    Generate Payslips
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslips.map((payslip) => (
                      <TableRow key={payslip.id}>
                        <TableCell className="font-medium">{payslip.employee_name}</TableCell>
                        <TableCell>${payslip.basic_salary.toLocaleString()}</TableCell>
                        <TableCell>${payslip.allowances.toLocaleString()}</TableCell>
                        <TableCell>${payslip.deductions.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">${payslip.net_salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            payslip.status === 'paid' ? 'success' : 
                            payslip.status === 'draft' ? 'outline' : 
                            'warning'
                          }>
                            {payslip.status === 'paid' && payslip.paidDate 
                              ? `Paid on ${new Date(payslip.paidDate).toLocaleDateString()}` 
                              : payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => {
                                setSelectedPayslip(payslip);
                                setIsPayslipModalOpen(true);
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDownloadPayslip(payslip)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleSendPayslip(payslip)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="salary-review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Review</CardTitle>
              <CardDescription>
                Review and adjust employee salaries based on performance and market rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Salary review functionality coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>
                Track and manage all payroll transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Payment transaction history coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Payslip Detail Modal */}
      <Dialog open={isPayslipModalOpen} onOpenChange={setIsPayslipModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payslip Details</DialogTitle>
            <DialogDescription>
              Employee payslip for {month} {year}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayslip && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{selectedPayslip.employee_name}</h3>
                  <div className="text-sm text-muted-foreground">Employee ID: EMP-{selectedPayslip.employee_id}</div>
                </div>
                <Badge variant={
                  selectedPayslip.status === 'paid' ? 'success' : 
                  selectedPayslip.status === 'draft' ? 'outline' : 
                  'warning'
                }>
                  {selectedPayslip.status.charAt(0).toUpperCase() + selectedPayslip.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 p-4 border rounded-md">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Pay Period</h4>
                  <div className="font-medium">{selectedPayslip.month} {selectedPayslip.year}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Date</h4>
                  <div className="font-medium">
                    {selectedPayslip.paidDate ? new Date(selectedPayslip.paidDate).toLocaleDateString() : 'Pending'}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Basic Salary</h4>
                  <div className="font-medium">${selectedPayslip.basic_salary.toLocaleString()}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Position</h4>
                  <div className="font-medium">Senior Developer</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Earnings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b">
                    <span>Basic Salary</span>
                    <span className="font-medium">${selectedPayslip.basic_salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Performance Bonus</span>
                    <span className="font-medium">${(selectedPayslip.allowances * 0.6).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Transport Allowance</span>
                    <span className="font-medium">${(selectedPayslip.allowances * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Other Allowances</span>
                    <span className="font-medium">${(selectedPayslip.allowances * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-medium">
                    <span>Total Earnings</span>
                    <span>${(selectedPayslip.basic_salary + selectedPayslip.allowances).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b">
                    <span>Tax</span>
                    <span className="font-medium">${(selectedPayslip.deductions * 0.7).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Health Insurance</span>
                    <span className="font-medium">${(selectedPayslip.deductions * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Other Deductions</span>
                    <span className="font-medium">${(selectedPayslip.deductions * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-medium">
                    <span>Total Deductions</span>
                    <span>${selectedPayslip.deductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between py-2 font-bold text-lg border-t border-b">
                <span>Net Pay</span>
                <span>${selectedPayslip.net_salary.toLocaleString()}</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsPayslipModalOpen(false)}>
                Close
              </Button>
              {selectedPayslip && (
                <>
                  <Button variant="outline" onClick={() => handleDownloadPayslip(selectedPayslip)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={() => handleSendPayslip(selectedPayslip)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send to Employee
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollManagement;
