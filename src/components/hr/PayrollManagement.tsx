
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FileText, Download, Plus } from "lucide-react";
import { format } from 'date-fns';

// Mock data for payslips
const MOCK_PAYSLIPS = [
  {
    id: 1,
    employee_id: 1,
    employee_name: 'John Doe',
    month: 'June',
    year: '2023',
    gross_salary: 6000,
    deductions: 800,
    net_salary: 5200,
    generated_date: '2023-06-30'
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: 'Jane Smith',
    month: 'June',
    year: '2023',
    gross_salary: 5300,
    deductions: 700,
    net_salary: 4600,
    generated_date: '2023-06-30'
  },
  {
    id: 3,
    employee_id: 3,
    employee_name: 'Mike Johnson',
    month: 'June',
    year: '2023',
    gross_salary: 5800,
    deductions: 750,
    net_salary: 5050,
    generated_date: '2023-06-30'
  }
];

const PayrollManagement = () => {
  const [payslips, setPayslips] = useState(MOCK_PAYSLIPS);
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedYear, setSelectedYear] = useState('2023');

  const generateNewPayslips = () => {
    // In a real implementation, this would call an API
    alert(`Generating payslips for ${selectedMonth} ${selectedYear}`);
  };

  const downloadPayslip = (id: number) => {
    // In a real implementation, this would download a file
    alert(`Downloading payslip ID: ${id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Payslips</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {['2023', '2024', '2025'].map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateNewPayslips}>
              <Plus className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Month/Year</TableHead>
                <TableHead className="text-right">Gross Salary</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead className="text-right">Generated Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map(payslip => (
                <TableRow key={payslip.id}>
                  <TableCell className="font-medium">{payslip.employee_name}</TableCell>
                  <TableCell>{payslip.month} {payslip.year}</TableCell>
                  <TableCell className="text-right">${payslip.gross_salary.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${payslip.deductions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${payslip.net_salary.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{format(new Date(payslip.generated_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadPayslip(payslip.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {payslips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No payslips found for the selected period.
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

export default PayrollManagement;
