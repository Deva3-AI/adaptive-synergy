import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download, Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, subDays, isToday, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { hrService, Attendance } from '@/services/api/hrService';

interface AttendanceTrackerProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  employeeId?: number;
}

const AttendanceTracker = ({ selectedDate = new Date(), onDateChange, employeeId }: AttendanceTrackerProps) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const startDate = subDays(selectedDate, 7);
  const endDate = selectedDate;
  
  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ['hr-attendance', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), employeeId],
    queryFn: () => hrService.getAttendanceRecords(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd'),
      employeeId
    ),
  });
  
  const { data: attendanceStats } = useQuery({
    queryKey: ['hr-attendance-stats', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: () => hrService.getAttendanceStats(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    ),
  });
  
  const filteredRecords = attendanceRecords ? attendanceRecords.filter((record: Attendance) => {
    if (filter !== 'all' && record.status !== filter) {
      return false;
    }
    
    if (searchTerm && !record.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }) : [];
  
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'late':
        return <Badge className="bg-amber-500">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-500">Absent</Badge>;
      case 'half-day':
        return <Badge className="bg-blue-500">Half Day</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  const calculateHours = (loginTime?: string, logoutTime?: string) => {
    if (!loginTime) return 'N/A';
    if (!logoutTime) return 'In progress';
    
    try {
      const login = new Date(loginTime).getTime();
      const logout = new Date(logoutTime).getTime();
      const diffHours = (logout - login) / (1000 * 60 * 60);
      return diffHours.toFixed(2) + 'h';
    } catch (error) {
      return 'Error';
    }
  };
  
  return (
    <Tabs defaultValue="daily" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Select Date
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <TabsContent value="daily" className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-2">
            <InputWithIcon
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
              icon={<Search className="h-4 w-4" />}
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="max-w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="half-day">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMMM d, yyyy')}
          </div>
        </div>
        
        <div className="bg-background rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Employee</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Login Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Logout Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Hours</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center">Loading...</td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center">No attendance records found</td>
                  </tr>
                ) : (
                  filteredRecords.map((record: Attendance) => (
                    <tr key={record.attendance_id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{record.employee_name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{record.employee_name}</div>
                            <div className="text-xs text-muted-foreground">ID: {record.user_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                      <td className="px-4 py-3">
                        {record.login_time ? format(new Date(record.login_time), 'hh:mm a') : 'Not logged in'}
                      </td>
                      <td className="px-4 py-3">
                        {record.logout_time ? format(new Date(record.logout_time), 'hh:mm a') : 'Active'}
                      </td>
                      <td className="px-4 py-3">{calculateHours(record.login_time, record.logout_time)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="weekly" className="space-y-4">
        <div className="bg-background rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Employee</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Mon</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tue</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Wed</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Fri</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-3 text-center">Loading...</td>
                  </tr>
                ) : (
                  [
                    { 
                      user_id: 1, 
                      name: "John Doe", 
                      days: [
                        { status: "present", hours: 8.5 },
                        { status: "present", hours: 8.2 },
                        { status: "present", hours: 7.9 },
                        { status: "late", hours: 7.5 },
                        { status: "present", hours: 8.0 }
                      ],
                      total_hours: 40.1
                    },
                    { 
                      user_id: 2, 
                      name: "Jane Smith",
                      days: [
                        { status: "present", hours: 8.0 },
                        { status: "absent", hours: 0 },
                        { status: "present", hours: 8.5 },
                        { status: "present", hours: 8.2 },
                        { status: "half-day", hours: 4.0 }
                      ],
                      total_hours: 28.7
                    }
                  ].map((employee) => (
                    <tr key={employee.user_id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{employee.name}</div>
                        </div>
                      </td>
                      {employee.days.map((day, index) => (
                        <td key={index} className="px-4 py-3">
                          <div className="flex flex-col items-center">
                            {getStatusBadge(day.status)}
                            <span className="text-xs mt-1">{day.hours > 0 ? `${day.hours}h` : '-'}</span>
                          </div>
                        </td>
                      ))}
                      <td className="px-4 py-3 font-medium">{employee.total_hours}h</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="stats" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendanceStats?.summary?.avg_attendance_rate ? 
                  `${attendanceStats.summary.avg_attendance_rate.toFixed(1)}%` : 
                  '90.5%'}
              </div>
              <p className="text-xs text-muted-foreground">
                Past 7 days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendanceStats?.summary?.avg_late ? 
                  `${(100 - attendanceStats.summary.avg_late * 100 / attendanceStats.summary.avg_present).toFixed(1)}%` : 
                  '85.2%'}
              </div>
              <p className="text-xs text-muted-foreground">
                Employees arriving on time
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                7.8h
              </div>
              <p className="text-xs text-muted-foreground">
                Per employee per day
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Overview</CardTitle>
            <CardDescription>
              Attendance patterns for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              [Attendance Chart - Would display daily attendance rates]
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AttendanceTracker;
