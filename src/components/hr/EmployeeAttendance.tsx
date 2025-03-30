
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInHours, differenceInMinutes, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import {
  Search,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  UserMinus,
  Download,
  Filter,
  Plus,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getInitials } from '@/lib/utils';

interface AttendanceProps {
  attendanceData?: any;
  isLoading?: boolean;
  refetch?: () => void;
}

const EmployeeAttendance = ({ attendanceData, isLoading, refetch }: AttendanceProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Filter attendance records
  const filteredRecords = React.useMemo(() => {
    if (!attendanceData?.records) return [];
    
    return attendanceData.records.filter((record: any) => {
      // Filter by search query
      const matchesSearch = searchQuery === '' ||
        record.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.department?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by date
      const matchesDate = filterDate
        ? new Date(record.work_date).toDateString() === filterDate.toDateString()
        : true;
      
      return matchesSearch && matchesDate;
    });
  }, [attendanceData, searchQuery, filterDate]);
  
  // Calculate work hours
  const calculateWorkHours = (login: string | null, logout: string | null) => {
    if (!login || !logout) return '-';
    
    try {
      const loginTime = parseISO(login);
      const logoutTime = parseISO(logout);
      
      const hours = differenceInHours(logoutTime, loginTime);
      const minutes = differenceInMinutes(logoutTime, loginTime) % 60;
      
      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error('Error calculating work hours:', error);
      return '-';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto flex items-center gap-2"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {filterDate ? format(filterDate, 'PPP') : 'Select date'}
                </Button>
                
                {showCalendar && (
                  <div className="absolute z-10 mt-2 bg-background border rounded-md shadow-md p-2">
                    <Calendar
                      mode="single"
                      selected={filterDate}
                      onSelect={(date) => {
                        setFilterDate(date);
                        setShowCalendar(false);
                      }}
                      initialFocus
                    />
                    <div className="flex justify-between mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setFilterDate(new Date());
                        }}
                      >
                        Today
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setFilterDate(undefined);
                          setShowCalendar(false);
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Button onClick={() => refetch?.()}>
              Refresh Data
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Present Today</p>
                        <h3 className="text-2xl font-semibold">{attendanceData?.today_present || 0}</h3>
                      </div>
                      <UserCheck className="h-8 w-8 text-green-500 opacity-80" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {attendanceData?.total_employees ? 
                        `${Math.round((attendanceData.today_present / attendanceData.total_employees) * 100)}% of staff` : 
                        '0% of staff'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Absent Today</p>
                        <h3 className="text-2xl font-semibold">{attendanceData?.today_absent || 0}</h3>
                      </div>
                      <UserMinus className="h-8 w-8 text-red-500 opacity-80" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {attendanceData?.total_employees ? 
                        `${Math.round((attendanceData.today_absent / attendanceData.total_employees) * 100)}% of staff` : 
                        '0% of staff'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">On Leave</p>
                        <h3 className="text-2xl font-semibold">{attendanceData?.today_on_leave || 0}</h3>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500 opacity-80" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Approved absences
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Hours</p>
                        <h3 className="text-2xl font-semibold">{attendanceData?.average_hours || 0}</h3>
                      </div>
                      <Clock className="h-8 w-8 text-indigo-500 opacity-80" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per employee this month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No attendance records found for the selected criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record: any) => (
                      <TableRow key={record.attendance_id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(record.employee_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium leading-none">{record.employee_name}</p>
                              <p className="text-sm text-muted-foreground">{record.department}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(record.work_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          {record.login_time ? (
                            format(new Date(record.login_time), 'hh:mm a')
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Not logged in
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.logout_time ? (
                            format(new Date(record.logout_time), 'hh:mm a')
                          ) : (
                            record.login_time ? (
                              <Badge variant="outline" className="text-green-600">
                                Currently working
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                N/A
                              </Badge>
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          {record.login_time ? (
                            record.logout_time ? (
                              calculateWorkHours(record.login_time, record.logout_time)
                            ) : (
                              <Badge variant="outline" className="text-green-600">
                                In progress
                              </Badge>
                            )
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {record.login_time ? (
                            <Badge variant="success" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Present
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Absent
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendance;
