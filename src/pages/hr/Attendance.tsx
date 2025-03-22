
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Download, 
  FileText, 
  Filter, 
  PlusCircle, 
  RefreshCcw, 
  Users 
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import LeaveRequestForm from '@/components/hr/LeaveRequestForm';
import LeaveRequestsList from '@/components/hr/LeaveRequestsList';
import EmployeePayslip from '@/components/hr/EmployeePayslip';

// Mock data
const MOCK_EMPLOYEES = [
  { id: 1, name: 'John Doe', department: 'Engineering', position: 'Senior Developer' },
  { id: 2, name: 'Jane Smith', department: 'Design', position: 'UI/UX Designer' },
  { id: 3, name: 'Mike Johnson', department: 'Marketing', position: 'Marketing Specialist' },
  { id: 4, name: 'Sarah Williams', department: 'HR', position: 'HR Manager' },
  { id: 5, name: 'David Brown', department: 'Finance', position: 'Financial Analyst' },
];

const MOCK_ATTENDANCE_RECORDS = [
  { id: 1, employeeId: 1, employeeName: 'John Doe', date: '2023-09-01', loginTime: '09:02:34', logoutTime: '17:05:21', status: 'present', workHours: 8.05 },
  { id: 2, employeeId: 1, employeeName: 'John Doe', date: '2023-09-02', loginTime: '08:55:12', logoutTime: '17:15:43', status: 'present', workHours: 8.34 },
  { id: 3, employeeId: 2, employeeName: 'Jane Smith', date: '2023-09-01', loginTime: '09:10:05', logoutTime: '17:03:11', status: 'present', workHours: 7.88 },
  { id: 4, employeeId: 2, employeeName: 'Jane Smith', date: '2023-09-02', loginTime: null, logoutTime: null, status: 'absent', workHours: 0 },
  { id: 5, employeeId: 3, employeeName: 'Mike Johnson', date: '2023-09-01', loginTime: '08:45:22', logoutTime: '16:50:19', status: 'present', workHours: 8.08 },
  { id: 6, employeeId: 4, employeeName: 'Sarah Williams', date: '2023-09-01', loginTime: '09:12:45', logoutTime: '17:20:33', status: 'present', workHours: 8.13 },
  { id: 7, employeeId: 5, employeeName: 'David Brown', date: '2023-09-01', loginTime: '09:05:11', logoutTime: '17:10:05', status: 'present', workHours: 8.08 },
  { id: 8, employeeId: 3, employeeName: 'Mike Johnson', date: '2023-09-02', loginTime: '09:30:00', logoutTime: '17:00:00', status: 'late', workHours: 7.5 },
];

const MOCK_LEAVE_REQUESTS = [
  { 
    id: 1, 
    employeeId: 1, 
    employeeName: 'John Doe', 
    leaveType: 'annual', 
    startDate: '2023-09-15', 
    endDate: '2023-09-20', 
    reason: 'Family vacation', 
    status: 'approved',
    createdAt: '2023-09-01T10:23:45Z',
    updatedAt: '2023-09-02T14:12:30Z'
  },
  { 
    id: 2, 
    employeeId: 2, 
    employeeName: 'Jane Smith', 
    leaveType: 'sick', 
    startDate: '2023-09-05', 
    endDate: '2023-09-06', 
    reason: 'Feeling unwell, doctor recommended rest', 
    status: 'approved',
    documentUrl: '/documents/medical-note.pdf',
    createdAt: '2023-09-04T09:15:22Z',
    updatedAt: '2023-09-04T11:45:10Z'
  },
  { 
    id: 3, 
    employeeId: 3, 
    employeeName: 'Mike Johnson', 
    leaveType: 'wfh', 
    startDate: '2023-09-10', 
    reason: 'Internet installation at home', 
    status: 'pending',
    createdAt: '2023-09-08T16:30:00Z',
    updatedAt: '2023-09-08T16:30:00Z'
  },
  { 
    id: 4, 
    employeeId: 4, 
    employeeName: 'Sarah Williams', 
    leaveType: 'halfDay', 
    startDate: '2023-09-12', 
    reason: 'Doctor appointment in the afternoon', 
    status: 'pending',
    createdAt: '2023-09-09T14:20:15Z',
    updatedAt: '2023-09-09T14:20:15Z'
  },
  { 
    id: 5, 
    employeeId: 5, 
    employeeName: 'David Brown', 
    leaveType: 'annual', 
    startDate: '2023-10-01', 
    endDate: '2023-10-05', 
    reason: 'Personal leave for family event', 
    status: 'rejected',
    createdAt: '2023-09-05T11:10:45Z',
    updatedAt: '2023-09-06T09:30:20Z'
  },
];

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
  {
    id: 3,
    employeeId: 2,
    employeeName: 'Jane Smith',
    month: 'August',
    year: 2023,
    basicSalary: 4500,
    allowances: 600,
    deductions: 1100,
    netSalary: 4000,
    paidDate: '2023-08-31',
    status: 'paid'
  },
  {
    id: 4,
    employeeId: 3,
    employeeName: 'Mike Johnson',
    month: 'August',
    year: 2023,
    basicSalary: 4200,
    allowances: 550,
    deductions: 900,
    netSalary: 3850,
    paidDate: '2023-08-31',
    status: 'paid'
  },
  {
    id: 5,
    employeeId: 4,
    employeeName: 'Sarah Williams',
    month: 'August',
    year: 2023,
    basicSalary: 5500,
    allowances: 900,
    deductions: 1300,
    netSalary: 5100,
    paidDate: '2023-08-31',
    status: 'paid'
  },
  {
    id: 6,
    employeeId: 5,
    employeeName: 'David Brown',
    month: 'August',
    year: 2023,
    basicSalary: 4800,
    allowances: 700,
    deductions: 1150,
    netSalary: 4350,
    status: 'pending'
  },
];

const HrAttendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [leaveRequestDialog, setLeaveRequestDialog] = useState(false);
  
  // Fetch attendance data
  const { data: attendanceData, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['attendance', dateRange, selectedEmployee],
    queryFn: async () => {
      try {
        // In a real implementation, this would call the backend API
        // const response = await axios.get('/api/hr/attendance', {
        //   params: {
        //     startDate: format(dateRange.from, 'yyyy-MM-dd'),
        //     endDate: format(dateRange.to, 'yyyy-MM-dd'),
        //     employeeId: selectedEmployee !== 'all' ? selectedEmployee : undefined,
        //   }
        // });
        // return response.data;
        
        // For mock purposes, return filtered data
        const filteredData = MOCK_ATTENDANCE_RECORDS.filter(record => {
          const recordDate = new Date(record.date);
          const isInRange = recordDate >= dateRange.from && recordDate <= dateRange.to;
          const isMatchingEmployee = selectedEmployee === 'all' || 
            record.employeeId === parseInt(selectedEmployee);
          return isInRange && isMatchingEmployee;
        });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return filteredData;
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        return [];
      }
    },
  });
  
  // Fetch leave requests
  const { data: leaveRequests, isLoading: isLoadingLeaveRequests } = useQuery({
    queryKey: ['leaveRequests'],
    queryFn: async () => {
      try {
        // In a real implementation, this would call the backend API
        // const response = await axios.get('/api/hr/leave-requests');
        // return response.data;
        
        // For mock purposes, return data
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_LEAVE_REQUESTS;
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        return [];
      }
    },
  });
  
  // Function to update leave request status
  const updateLeaveRequestStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      // In a real implementation, this would call the backend API
      // await axios.patch(`/api/hr/leave-requests/${id}`, { status });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return true;
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }
  };
  
  const handleGenerateReport = () => {
    toast.success('Attendance report is being generated. It will be available for download shortly.');
  };
  
  const handleRefresh = () => {
    // Trigger refetch of data
    toast.success('Data refreshed successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Attendance & Leave Management</h1>
        <p className="text-muted-foreground">
          Track employee attendance, manage leave requests, and handle payroll.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {MOCK_EMPLOYEES.map(emp => (
                <SelectItem key={emp.id} value={emp.id.toString()}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={leaveRequestDialog} onOpenChange={setLeaveRequestDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                New Leave Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Leave Request</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for an employee.
                </DialogDescription>
              </DialogHeader>
              <LeaveRequestForm />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="gap-2" onClick={handleGenerateReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="attendance">
        <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="mt-4 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24/26</div>
                <p className="text-xs text-muted-foreground mt-1">92% attendance rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground mt-1">8% absence rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Work Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.9h</div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Employee attendance data for {format(dateRange.from, 'PPP')} to {format(dateRange.to, 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAttendance ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">Loading attendance data...</p>
                </div>
              ) : attendanceData && attendanceData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Login Time</TableHead>
                      <TableHead>Logout Time</TableHead>
                      <TableHead>Work Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                        <TableCell>{format(new Date(record.date), 'PP')}</TableCell>
                        <TableCell>{record.loginTime || 'N/A'}</TableCell>
                        <TableCell>{record.logoutTime || 'N/A'}</TableCell>
                        <TableCell>{record.workHours.toFixed(2)} hrs</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              record.status === 'present' 
                                ? 'success' 
                                : record.status === 'late' 
                                  ? 'warning' 
                                  : 'destructive'
                            }
                            className="capitalize"
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">No attendance records found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leave" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Leave Requests</CardTitle>
                  <CardDescription>
                    Manage employee leave requests and approvals
                  </CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLeaveRequests ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">Loading leave requests...</p>
                </div>
              ) : (
                <LeaveRequestsList 
                  requests={leaveRequests || []} 
                  onUpdateStatus={updateLeaveRequestStatus}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payroll" className="mt-4 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Employee Payslips</CardTitle>
                <CardDescription>
                  Manage payroll and download employee payslips
                </CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate New Payslips
              </Button>
            </CardHeader>
            <CardContent>
              <EmployeePayslip payslips={MOCK_PAYSLIPS} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>
                Generate and download attendance and leave reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Attendance Summary</CardTitle>
                    <CardDescription>
                      Complete attendance statistics for the selected month
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Includes daily attendance breakdown, late arrivals, and absences
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Leave Balance Report</CardTitle>
                    <CardDescription>
                      Overview of leave balances for all employees
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Shows remaining annual, sick, and other leave types for each employee
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Payroll Summary</CardTitle>
                    <CardDescription>
                      Complete payroll information for accounting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Comprehensive breakdown of salaries, allowances, and deductions
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HrAttendance;
