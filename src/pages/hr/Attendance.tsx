
import React, { useState } from 'react';
import { format, parseISO, startOfWeek, endOfWeek, differenceInDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Calendar as CalendarIcon, Edit, Info, Search, Filter, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { hrService } from '@/services/api';
import { AttendanceLeaveRequest, PaySlip } from '@/types';
import LeaveRequestsList from '@/components/hr/LeaveRequestsList';

interface AttendanceRecord {
  id: number;
  user_id: number;
  employee_name: string;
  date: string;
  login_time: string;
  logout_time: string | null;
  total_hours: number;
  status: string;
}

const Attendance = () => {
  // State for record filtering and modals
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date())
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [formData, setFormData] = useState({
    login_time: '',
    logout_time: '',
    status: ''
  });

  // Leave requests data
  const pendingLeaveRequests: AttendanceLeaveRequest[] = [
    {
      id: 1,
      employee_id: 101,
      employee_name: 'Alex Johnson',
      start_date: '2023-06-15',
      end_date: '2023-06-20',
      reason: 'Vacation',
      status: 'pending',
      leaveType: 'annual'
    },
    {
      id: 2,
      employee_id: 102,
      employee_name: 'Sarah Williams',
      start_date: '2023-06-18',
      end_date: '2023-06-19',
      reason: 'Doctor appointment',
      status: 'pending',
      leaveType: 'sick'
    },
    {
      id: 3,
      employee_id: 103,
      employee_name: 'Michael Brown',
      start_date: '2023-06-25',
      end_date: '2023-06-30',
      reason: 'Family event',
      status: 'pending',
      leaveType: 'personal'
    },
    {
      id: 4,
      employee_id: 104,
      employee_name: 'Emily Davis',
      start_date: '2023-06-22',
      end_date: '2023-06-22',
      reason: 'Working from home',
      status: 'pending',
      leaveType: 'wfh'
    },
    {
      id: 5,
      employee_id: 105,
      employee_name: 'David Wilson',
      start_date: '2023-06-28',
      end_date: '2023-06-28',
      reason: 'Half day leave for personal work',
      status: 'pending',
      leaveType: 'halfDay'
    }
  ];

  // Mock payslips data
  const payslips: PaySlip[] = [
    {
      id: 1,
      employeeId: 101,
      employeeName: 'Alex Johnson',
      month: 'June',
      year: 2023,
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netSalary: 5500,
      paidDate: '2023-06-28',
      status: 'paid'
    },
    {
      id: 2,
      employeeId: 102,
      employeeName: 'Sarah Williams',
      month: 'June',
      year: 2023,
      basicSalary: 4500,
      allowances: 800,
      deductions: 450,
      netSalary: 4850,
      paidDate: '2023-06-28',
      status: 'paid'
    },
    {
      id: 3,
      employeeId: 103,
      employeeName: 'Michael Brown',
      month: 'June',
      year: 2023,
      basicSalary: 5200,
      allowances: 1200,
      deductions: 600,
      netSalary: 5800,
      status: 'pending'
    },
    {
      id: 4,
      employeeId: 104,
      employeeName: 'Emily Davis',
      month: 'June',
      year: 2023,
      basicSalary: 4800,
      allowances: 900,
      deductions: 480,
      netSalary: 5220,
      status: 'pending'
    },
    {
      id: 5,
      employeeId: 105,
      employeeName: 'David Wilson',
      month: 'June',
      year: 2023,
      basicSalary: 4600,
      allowances: 850,
      deductions: 460,
      netSalary: 4990,
      paidDate: '2023-06-28',
      status: 'paid'
    }
  ];

  // Handler for opening edit modal
  const handleEditRecord = (record: AttendanceRecord) => {
    setCurrentRecord(record);
    setFormData({
      login_time: record.login_time,
      logout_time: record.logout_time || '',
      status: record.status
    });
    setIsEditModalOpen(true);
  };

  // Handler for submitting attendance record update
  const handleUpdateRecord = async () => {
    if (!currentRecord) return;
    
    try {
      await hrService.updateAttendanceRecord(currentRecord.id, {
        ...formData,
        user_id: currentRecord.user_id
      });
      
      setIsEditModalOpen(false);
      toast.success('Attendance record updated successfully');
      // In a real app, you'd refetch the data here
    } catch (error) {
      console.error('Error updating attendance record:', error);
      toast.error('Failed to update attendance record');
    }
  };

  // Handler for deleting attendance record
  const handleDeleteRecord = async (id: number) => {
    try {
      await hrService.deleteAttendanceRecord(id);
      toast.success('Attendance record deleted successfully');
      // In a real app, you'd refetch the data here
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      toast.error('Failed to delete attendance record');
    }
  };

  // Format time for display
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return format(parseISO(timeString), 'hh:mm a');
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case 'leave':
        return <Badge className="bg-blue-100 text-blue-800">Leave</Badge>;
      case 'wfh':
        return <Badge className="bg-purple-100 text-purple-800">WFH</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle approve/reject leave requests
  const handleUpdateLeaveStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      // In a real app, you'd make an API call here
      console.log(`Updating leave request ${id} to ${status}`);
      toast.success(`Leave request ${status} successfully`);
      // Mock update for demo purposes
      //setPendingLeaveRequests(pendingLeaveRequests.map(req => 
      //  req.id === id ? { ...req, status } : req
      //));
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error('Failed to update leave status');
    }
  };

  // Fetch attendance records
  const { data: attendanceRecords, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['attendance-records', dateRange],
    queryFn: () => hrService.getAttendanceRecords(dateRange.from.toISOString(), dateRange.to?.toISOString()),
  });

  // Fetch attendance summary
  const { data: attendanceSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['attendance-summary'],
    queryFn: () => hrService.getAttendanceSummary(),
  });

  // Filter records based on search query and status
  const filteredRecords = attendanceRecords?.filter(record => {
    const matchesSearch = record.employee_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
        <p className="text-muted-foreground">
          Monitor employee attendance, manage leave requests, and generate reports
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceSummary?.presentToday || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {attendanceSummary?.presentPercentage || 0}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceSummary?.lateToday || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {attendanceSummary?.latePercentage || 0}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceSummary?.absentToday || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {attendanceSummary?.absentPercentage || 0}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceSummary?.onLeaveToday || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {attendanceSummary?.onLeavePercentage || 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
          <TabsTrigger value="leave-requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DateRangePicker
                    date={dateRange}
                    setDate={setDateRange}
                  />
                </PopoverContent>
              </Popover>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                  <SelectItem value="wfh">WFH</SelectItem>
                </SelectContent>
              </Select>
              
              <Input 
                type="date" 
                className="w-full md:w-auto"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setDateRange({ from: date, to: date });
                }}
              />
            </div>
            
            <Button>
              Download Report
            </Button>
          </div>
          
          <ScrollArea className="h-[450px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Logout Time</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingAttendance ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading attendance records...
                    </TableCell>
                  </TableRow>
                ) : filteredRecords && filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employee_name}</TableCell>
                      <TableCell>{format(parseISO(record.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{formatTime(record.login_time)}</TableCell>
                      <TableCell>{formatTime(record.logout_time)}</TableCell>
                      <TableCell>{record.total_hours.toFixed(2)} hrs</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Attendance Record</DialogTitle>
                <DialogDescription>
                  Update the attendance record for {currentRecord?.employee_name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="login-time" className="text-right">
                    Login Time
                  </Label>
                  <Input
                    id="login-time"
                    value={formData.login_time}
                    onChange={(e) => setFormData({
                      ...formData,
                      login_time: e.target.value
                    })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logout-time" className="text-right">
                    Logout Time
                  </Label>
                  <Input
                    id="logout-time"
                    value={formData.logout_time}
                    onChange={(e) => setFormData({
                      ...formData,
                      logout_time: e.target.value
                    })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Input
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({
                      ...formData,
                      status: e.target.value
                    })}
                    className="col-span-3"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateRecord}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="leave-requests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pending Leave Requests</h3>
            <Button variant="outline">View All Requests</Button>
          </div>
          
          <LeaveRequestsList
            requests={pendingLeaveRequests}
            onUpdateStatus={handleUpdateLeaveStatus}
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Leave Balance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Annual Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">15</div>
                    <Badge className="bg-blue-100 text-blue-800">5 Used</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    10 days remaining
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">10</div>
                    <Badge className="bg-blue-100 text-blue-800">2 Used</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    8 days remaining
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Personal Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">5</div>
                    <Badge className="bg-blue-100 text-blue-800">1 Used</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    4 days remaining
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Work From Home</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">8</div>
                    <Badge className="bg-blue-100 text-blue-800">3 Used</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    5 days remaining
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payslips" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Payslips</h3>
            <Button>Generate Payslips</Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((payslip) => (
                <TableRow key={payslip.id}>
                  <TableCell className="font-medium">{payslip.employeeName}</TableCell>
                  <TableCell>{payslip.month} {payslip.year}</TableCell>
                  <TableCell>${payslip.basicSalary.toLocaleString()}</TableCell>
                  <TableCell>${payslip.allowances.toLocaleString()}</TableCell>
                  <TableCell>${payslip.deductions.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">${payslip.netSalary.toLocaleString()}</TableCell>
                  <TableCell>
                    {payslip.status === 'paid' ? (
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
