
import React, { useState } from 'react';
import { Download, FileText, Printer, Share2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface PaySlip {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paidDate?: string;
  status: 'pending' | 'paid';
}

interface EmployeePayslipProps {
  payslips: PaySlip[];
  employeeId?: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const EmployeePayslip: React.FC<EmployeePayslipProps> = ({ payslips, employeeId }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [printingId, setPrintingId] = useState<number | null>(null);
  
  // Filter payslips by employee if employeeId is provided
  const filteredPayslips = employeeId 
    ? payslips.filter(p => p.employeeId === employeeId) 
    : payslips;
    
  // Filter by selected month if applicable
  const displayedPayslips = selectedMonth 
    ? filteredPayslips.filter(p => `${p.month}-${p.year}` === selectedMonth)
    : filteredPayslips;
  
  // Get unique month-year combinations for the dropdown
  const monthOptions = [...new Set(filteredPayslips.map(p => `${p.month}-${p.year}`))];
  
  const downloadPayslip = async (payslipId: number) => {
    setDownloadingId(payslipId);
    try {
      // Try to download from the real API
      const response = await axios.get(`${API_URL}/hr/payslips/${payslipId}/download`, {
        responseType: 'blob'
      });
      
      // Create a download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip-${payslipId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Payslip downloaded successfully');
    } catch (error) {
      console.error('Error downloading payslip:', error);
      toast.error('Failed to download payslip. Please try again later.');
    } finally {
      setDownloadingId(null);
    }
  };
  
  const printPayslip = async (payslipId: number) => {
    setPrintingId(payslipId);
    try {
      // In a real application, this would prepare content for printing
      // For this demo, we'll simulate a print operation
      setTimeout(() => {
        window.print();
        toast.success('Payslip sent to printer');
      }, 1000);
    } catch (error) {
      console.error('Error printing payslip:', error);
      toast.error('Failed to print payslip');
    } finally {
      setPrintingId(null);
    }
  };

  const sharePayslip = async (payslipId: number) => {
    try {
      // This would ideally use the Web Share API if available,
      // or provide email sharing options
      if (navigator.share) {
        await navigator.share({
          title: 'My Payslip',
          text: 'Here is my payslip',
          url: window.location.href,
        });
        toast.success('Payslip shared successfully');
      } else {
        // Fallback to copy link
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing payslip:', error);
      toast.error('Failed to share payslip');
    }
  };

  if (filteredPayslips.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">No payslips found.</p>;
  }
  
  return (
    <div className="space-y-4">
      {monthOptions.length > 0 && (
        <div className="flex justify-end mb-4">
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All months</SelectItem>
              {monthOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {`${option.split('-')[0]} ${option.split('-')[1]}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedPayslips.map((payslip) => (
          <Card key={payslip.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>
                {payslip.month} {payslip.year}
              </CardTitle>
              <CardDescription>
                {employeeId ? null : `${payslip.employeeName} • `}
                {payslip.status === 'paid' 
                  ? `Paid on ${payslip.paidDate ? format(new Date(payslip.paidDate), 'PP') : 'N/A'}`
                  : 'Pending payment'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Basic Salary:</span>
                  <span className="font-medium">${payslip.basicSalary.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Allowances:</span>
                  <span className="font-medium">+${payslip.allowances.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Deductions:</span>
                  <span className="font-medium">-${payslip.deductions.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium">Net Salary:</span>
                  <span className="font-bold">${payslip.netSalary.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mr-2">
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Payslip Details</DialogTitle>
                    <DialogDescription>
                      {payslip.month} {payslip.year} payslip for {payslip.employeeName}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="border rounded-lg p-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">Hive AI Solutions</h2>
                        <p className="text-muted-foreground">Payslip for {payslip.month} {payslip.year}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <h3 className="font-medium">Employee Information</h3>
                          <div className="text-sm space-y-1 mt-2">
                            <p><span className="text-muted-foreground">Name:</span> {payslip.employeeName}</p>
                            <p><span className="text-muted-foreground">Employee ID:</span> {payslip.employeeId}</p>
                            <p><span className="text-muted-foreground">Department:</span> Engineering</p>
                            <p><span className="text-muted-foreground">Position:</span> Software Developer</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium">Payment Information</h3>
                          <div className="text-sm space-y-1 mt-2">
                            <p><span className="text-muted-foreground">Payment Date:</span> {payslip.paidDate ? format(new Date(payslip.paidDate), 'PPP') : 'Pending'}</p>
                            <p><span className="text-muted-foreground">Payment Method:</span> Direct Deposit</p>
                            <p><span className="text-muted-foreground">Payment Period:</span> {payslip.month} {payslip.year}</p>
                            <p><span className="text-muted-foreground">Payment Status:</span> {payslip.status === 'paid' ? 'Paid' : 'Pending'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-b py-4 my-4">
                        <h3 className="font-medium mb-2">Earnings</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Basic Salary:</span>
                              <span>${payslip.basicSalary.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Performance Bonus:</span>
                              <span>${(payslip.allowances * 0.4).toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Transportation Allowance:</span>
                              <span>${(payslip.allowances * 0.3).toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Other Allowances:</span>
                              <span>${(payslip.allowances * 0.3).toFixed(2)}</span>
                            </p>
                          </div>
                          <div>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Total Allowances:</span>
                              <span>${payslip.allowances.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Gross Earnings:</span>
                              <span>${(payslip.basicSalary + payslip.allowances).toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-b py-4 mb-4">
                        <h3 className="font-medium mb-2">Deductions</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Income Tax:</span>
                              <span>${(payslip.deductions * 0.6).toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Pension Contribution:</span>
                              <span>${(payslip.deductions * 0.3).toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Other Deductions:</span>
                              <span>${(payslip.deductions * 0.1).toFixed(2)}</span>
                            </p>
                          </div>
                          <div>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Total Deductions:</span>
                              <span>${payslip.deductions.toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 flex justify-between items-center font-bold">
                        <span>Net Pay:</span>
                        <span className="text-xl">${payslip.netSalary.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => printPayslip(payslip.id)}
                      disabled={printingId === payslip.id}
                    >
                      {printingId === payslip.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Printing...
                        </>
                      ) : (
                        <>
                          <Printer className="h-4 w-4" />
                          Print
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => sharePayslip(payslip.id)}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button 
                      className="gap-2"
                      onClick={() => downloadPayslip(payslip.id)}
                      disabled={downloadingId === payslip.id}
                    >
                      {downloadingId === payslip.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button
                onClick={() => downloadPayslip(payslip.id)}
                disabled={downloadingId === payslip.id}
                className="flex-1"
              >
                {downloadingId === payslip.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeePayslip;
