import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Download, Filter, Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { hrService } from '@/services/api';
import { format, parseISO, isToday, startOfMonth, endOfMonth, addDays, subDays } from 'date-fns';

interface AttendanceRecord {
  id: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late';
}

const AttendanceTracker = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Mock attendance data for demonstration
    const mockData: AttendanceRecord[] = [
      {
        id: 1,
        employeeName: "John Doe",
        date: format(new Date(), 'yyyy-MM-dd'),
        checkIn: "08:00",
        checkOut: "17:00",
        status: "present",
      },
      {
        id: 2,
        employeeName: "Jane Smith",
        date: format(new Date(), 'yyyy-MM-dd'),
        checkIn: "08:30",
        checkOut: "17:30",
        status: "present",
      },
      {
        id: 3,
        employeeName: "Alice Johnson",
        date: format(new Date(), 'yyyy-MM-dd'),
        checkIn: "09:15",
        checkOut: "18:00",
        status: "late",
      },
      {
        id: 4,
        employeeName: "Bob Williams",
        date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        checkIn: "07:45",
        checkOut: "16:45",
        status: "present",
      },
      {
        id: 5,
        employeeName: "Charlie Brown",
        date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        checkIn: null,
        checkOut: null,
        status: "absent",
      },
    ];

    setAttendanceData(mockData);
  }, []);

  const filteredAttendance = attendanceData.filter((record) => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const employeeNameMatches = searchRegex.test(record.employeeName);
    const statusMatches = statusFilter === 'all' || record.status === statusFilter;

    return employeeNameMatches && statusMatches && format(new Date(record.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  });

  const handleDateChange = (offset: number) => {
    setSelectedDate(addDays(selectedDate, offset));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'absent':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700">Absent</Badge>;
      case 'late':
        return <Badge className="bg-amber-500">Late</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="attendance">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-r-none"
                onClick={() => handleDateChange(-1)}
              >
                &lt;
              </Button>
              <div className="px-3 py-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {format(selectedDate, 'MMM d, yyyy')}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-l-none"
                onClick={() => handleDateChange(1)}
              >
                &gt;
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-2">
              <InputWithIcon
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
                icon={<Search className="h-4 w-4" />}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="max-w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Check In</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Check Out</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{record.employeeName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{record.employeeName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{format(new Date(record.date), 'MMM d, yyyy')}</td>
                        <td className="px-4 py-3">{record.checkIn || '-'}</td>
                        <td className="px-4 py-3">{record.checkOut || '-'}</td>
                        <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Generate attendance reports and analytics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceTracker;
