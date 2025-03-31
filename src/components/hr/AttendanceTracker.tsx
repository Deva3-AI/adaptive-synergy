import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Edit, Trash2, Filter, ChevronDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { hrService } from '@/services/api/hrService';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the Attendance type that was previously imported
interface Attendance {
  id: number;
  employee_id: number;
  employee_name: string;
  login_time: string;
  logout_time: string | null;
  work_date: string;
  hours_worked: number | null;
}

const AttendanceTracker = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<any>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(null);

  // Fetch attendance data
  const { data: attendanceData, isLoading, isError, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      // Fix: Remove the date parameter - use default date range
      return await hrService.getAttendanceRecords();
    }
  });

  // Fetch employees for filtering
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => hrService.getEmployees()
  });

  // Handle refreshing the data
  const handleRefresh = () => {
    // Fix: Use refetchAttendance instead of fetchAttendance
    refetchAttendance();
    toast.success('Attendance data refreshed');
  };

  // Filter attendance records based on selected criteria
  const filteredAttendance = React.useMemo(() => {
    if (!attendanceData) return [];

    return (attendanceData as Attendance[]).filter(record => {
      // Filter by date range
      const recordDate = new Date(record.work_date);
      const isInDateRange = (!selectedDateRange.from || recordDate >= selectedDateRange.from) &&
                           (!selectedDateRange.to || recordDate <= selectedDateRange.to);
      
      // Filter by employee
      const isEmployeeMatch = filterEmployee === 'all' || record.employee_id.toString() === filterEmployee;
      
      // Filter by search query
      const matchesSearch = !searchQuery || 
                           record.employee_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return isInDateRange && isEmployeeMatch && matchesSearch;
    });
  }, [attendanceData, selectedDateRange, filterEmployee, searchQuery]);

  // Handle editing an attendance record
  const handleEdit = (attendance: Attendance) => {
    setCurrentAttendance(attendance);
    setIsEditDialogOpen(true);
  };

  // Handle saving edited attendance
  const handleSaveEdit = async () => {
    if (!currentAttendance) return;
    
    try {
      await hrService.updateAttendanceRecord(currentAttendance.id, {
        login_time: currentAttendance.login_time,
        logout_time: currentAttendance.logout_time,
        work_date: currentAttendance.work_date
      });
      
      toast.success('Attendance record updated successfully');
      setIsEditDialogOpen(false);
      refetchAttendance();
    } catch (error) {
      console.error('Error updating attendance record:', error);
      toast.error('Failed to update attendance record');
    }
  };

  // Handle deleting an attendance record
  const handleDelete = async (attendanceId: number) => {
    try {
      await hrService.deleteAttendanceRecord(attendanceId);
      toast.success('Attendance record deleted successfully');
      refetchAttendance();
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      toast.error('Failed to delete attendance record');
    }
  };

  // Fix: Update the button click handler to use an inline function
  const renderDeleteButton = (record: Attendance) => (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-destructive hover:bg-destructive/10"
      onClick={() => handleDelete(record.id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  return (
    <Card className="space-y-4">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Attendance Tracker</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <Clock className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 items-center">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={
                  "w-[200px] justify-start text-left font-normal"
                }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>
                  {selectedDateRange?.from ? (
                    selectedDateRange.to ? (
                      <>
                        {format(selectedDateRange.from, "MMM dd, yyyy")} -{" "}
                        {format(selectedDateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(selectedDateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DateRangePicker
                value={selectedDateRange}
                onChange={setSelectedDateRange}
              />
            </PopoverContent>
          </Popover>

          {/* Employee Filter */}
          <Select onValueChange={setFilterEmployee}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees &&
                employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Search Input */}
          <Input
            type="search"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Attendance Table */}
        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Login Time</TableHead>
                <TableHead>Logout Time</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading attendance data...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Error loading attendance data.
                  </TableCell>
                </TableRow>
              )}
              {filteredAttendance.length === 0 && !isLoading && !isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.work_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{record.employee_name}</TableCell>
                    <TableCell>{format(new Date(record.login_time), 'h:mm a')}</TableCell>
                    <TableCell>
                      {record.logout_time ? format(new Date(record.logout_time), 'h:mm a') : 'N/A'}
                    </TableCell>
                    <TableCell>{record.hours_worked ? record.hours_worked.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell className="text-right font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(record)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(record.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      {/* Edit Attendance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              Make changes to the attendance record for {currentAttendance?.employee_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                type="date"
                id="date"
                defaultValue={currentAttendance?.work_date}
                className="col-span-3"
                onChange={(e) => setCurrentAttendance({ ...currentAttendance, work_date: e.target.value } as Attendance)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loginTime" className="text-right">
                Login Time
              </Label>
              <Input
                type="time"
                id="loginTime"
                defaultValue={currentAttendance?.login_time}
                className="col-span-3"
                onChange={(e) => setCurrentAttendance({ ...currentAttendance, login_time: e.target.value } as Attendance)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logoutTime" className="text-right">
                Logout Time
              </Label>
              <Input
                type="time"
                id="logoutTime"
                defaultValue={currentAttendance?.logout_time}
                className="col-span-3"
                onChange={(e) => setCurrentAttendance({ ...currentAttendance, logout_time: e.target.value } as Attendance)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSaveEdit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AttendanceTracker;
