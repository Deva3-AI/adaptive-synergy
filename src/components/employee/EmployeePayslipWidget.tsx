
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import EmployeePayslip from '@/components/hr/EmployeePayslip';

// Mock data - in a real app, this would come from your API
const MOCK_PAYSLIPS = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'John Doe',
    month: 'August',
    year: 2023,
    basicSalary: 5000,
    allowances: 800,
    deductions: 1200,
    netSalary: 4600,
    paidDate: '2023-08-31',
    status: 'paid'
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: 'John Doe',
    month: 'July',
    year: 2023,
    basicSalary: 5000,
    allowances: 750,
    deductions: 1200,
    netSalary: 4550,
    paidDate: '2023-07-31',
    status: 'paid'
  },
];

const EmployeePayslipWidget: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch payslips for the current employee
  const { data: payslips, isLoading } = useQuery({
    queryKey: ['employeePayslips', user?.id],
    queryFn: async () => {
      try {
        // In a real implementation, this would call the backend API
        // const response = await fetch(`/api/employee/payslips?employeeId=${user?.id}`);
        // return await response.json();
        
        // For mock purposes, filter the data for the current employee
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use user.id from auth context if available, otherwise default to 1 for demo
        const employeeId = user?.id || 1;
        return MOCK_PAYSLIPS.filter(p => p.employeeId === employeeId);
      } catch (error) {
        console.error('Error fetching payslips:', error);
        return [];
      }
    },
  });
  
  const latestPayslip = payslips && payslips.length > 0 ? payslips[0] : null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Your Payslips</CardTitle>
        <CardDescription>
          View and download your monthly salary statements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">Loading your payslips...</p>
          </div>
        ) : latestPayslip ? (
          <div className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    {latestPayslip.month} {latestPayslip.year}
                  </CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    latestPayslip.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {latestPayslip.status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <CardDescription>
                  {latestPayslip.status === 'paid' && latestPayslip.paidDate
                    ? `Paid on ${format(new Date(latestPayslip.paidDate), 'PP')}`
                    : 'Payment pending'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gross Salary:</span>
                    <span className="font-medium">${(latestPayslip.basicSalary + latestPayslip.allowances).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Deductions:</span>
                    <span className="font-medium">-${latestPayslip.deductions.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium">Net Salary:</span>
                    <span className="font-bold">${latestPayslip.netSalary.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download Payslip
                </Button>
              </CardFooter>
            </Card>
            
            {payslips && payslips.length > 1 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Previous Payslips</h3>
                {payslips.slice(1).map((payslip) => (
                  <div key={payslip.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{payslip.month} {payslip.year}</p>
                      <p className="text-xs text-muted-foreground">
                        Net: ${payslip.netSalary.toFixed(2)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No payslips available.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/employee/payslips')}
        >
          View All Payslips
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmployeePayslipWidget;
