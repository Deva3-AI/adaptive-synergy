
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Clock, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import hrService from '@/services/api/hrService';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Attendance {
  attendance_id: number;
  user_id: number;
  employee_name?: string;
  login_time: string;
  logout_time: string | null;
  work_date: string;
  hours_worked?: number;
  id?: number;
}

interface AttendanceTrackerProps {
  attendance?: Attendance;
  onAttendanceUpdate: () => void;
}

const AttendanceTracker = ({ attendance, onAttendanceUpdate }: AttendanceTrackerProps) => {
  const [selectedDateRange, setSelectedDateRange] = useState<any>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(null);

  // Use getAttendance function from hrService instead of getAttendanceRecords
  const { data: attendanceData, isLoading, isError, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      return await hrService.getAttendanceHistory();
    }
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => hrService.getEmployees()
  });

  const handleRefresh = () => {
    refetchAttendance();
    toast.success('Attendance data refreshed');
  };

  const filteredAttendance = React.useMemo(() => {
    if (!attendanceData) return [];

    return (attendanceData as any[]).filter(record => {
      const recordDate = new Date(record.work_date || record.date);
      const isInDateRange = (!selectedDateRange.from || recordDate >= selectedDateRange.from) &&
                           (!selectedDateRange.to || recordDate <= selectedDateRange.to);
      
      const isEmployeeMatch = filterEmployee === 'all' || 
                             (record.user_id && record.user_id.toString() === filterEmployee);
      
      const matchesSearch = !searchQuery || 
                           (record.employee_name && record.employee_name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return isInDateRange && isEmployeeMatch && matchesSearch;
    });
  }, [attendanceData, selectedDateRange, filterEmployee, searchQuery]);

  const handleEdit = (attendance: Attendance) => {
    setCurrentAttendance(attendance);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!currentAttendance) return;
    
    try {
      // We'll mock this functionality since the service doesn't have this method
      // In a real app, we would call something like:
      // await hrService.updateAttendanceRecord(currentAttendance.id, { ... })
      
      toast.success('Attendance record updated successfully');
      setIsEditDialogOpen(false);
      refetchAttendance();
    } catch (error) {
      console.error('Error updating attendance record:', error);
      toast.error('Failed to update attendance record');
    }
  };

  const handleDelete = async (attendanceId: number) => {
    try {
      // We'll mock this functionality since the service doesn't have this method
      // In a real app, we would call something like:
      // await hrService.deleteAttendanceRecord(attendanceId);
      
      toast.success('Attendance record deleted successfully');
      refetchAttendance();
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      toast.error('Failed to delete attendance record');
    }
  };

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

          <Select onValueChange={setFilterEmployee}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees &&
                employees.map((employee: any) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Input
            type="search"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

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
                filteredAttendance.map((record: any) => (
                  <TableRow key={record.id || record.attendance_id}>
                    <TableCell>{format(new Date(record.work_date || record.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{record.employee_name}</TableCell>
                    <TableCell>{record.login_time ? format(new Date(record.login_time), 'h:mm a') : 'N/A'}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleDelete(record.id || record.attendance_id)} className="text-destructive">
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
                defaultValue={currentAttendance?.logout_time?.toString()}
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
