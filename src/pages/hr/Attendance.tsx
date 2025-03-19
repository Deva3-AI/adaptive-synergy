
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Download, Filter, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for employees
const employees = [
  {
    id: 1,
    name: "John Smith",
    position: "Senior Developer",
    department: "Engineering",
    status: "present",
    checkin: "09:02 AM",
    checkout: "05:45 PM",
    hours: 8.72,
    breaks: 1,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Senior Designer",
    department: "Design",
    status: "present",
    checkin: "08:55 AM",
    checkout: "05:30 PM",
    hours: 8.58,
    breaks: 0.75,
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "Project Manager",
    department: "Engineering",
    status: "present",
    checkin: "09:15 AM",
    checkout: "06:00 PM",
    hours: 8.75,
    breaks: 1,
  },
  {
    id: 4,
    name: "Emily Davis",
    position: "Marketing Specialist",
    department: "Marketing",
    status: "late",
    checkin: "10:22 AM",
    checkout: "06:15 PM",
    hours: 7.88,
    breaks: 0.5,
  },
  {
    id: 5,
    name: "David Wilson",
    position: "UI/UX Designer",
    department: "Design",
    status: "absent",
    checkin: "",
    checkout: "",
    hours: 0,
    breaks: 0,
    reason: "Sick Leave",
  },
  {
    id: 6,
    name: "Jennifer Lee",
    position: "Content Writer",
    department: "Marketing",
    status: "present",
    checkin: "09:05 AM",
    checkout: "05:40 PM",
    hours: 8.58,
    breaks: 1,
  },
  {
    id: 7,
    name: "Robert Taylor",
    position: "Backend Developer",
    department: "Engineering",
    status: "present",
    checkin: "08:50 AM",
    checkout: "05:50 PM",
    hours: 9,
    breaks: 1,
  },
  {
    id: 8,
    name: "Lisa Martinez",
    position: "HR Specialist",
    department: "HR",
    status: "present",
    checkin: "09:00 AM",
    checkout: "05:30 PM",
    hours: 8.5,
    breaks: 1,
  },
];

// Sample data for weekly overview chart
const weeklyOverviewData = [
  { name: "Mon", present: 48, late: 3, absent: 1 },
  { name: "Tue", present: 50, late: 1, absent: 1 },
  { name: "Wed", present: 49, late: 2, absent: 1 },
  { name: "Thu", present: 47, late: 3, absent: 2 },
  { name: "Fri", present: 45, late: 2, absent: 5 },
];

// Status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "present":
      return "success";
    case "late":
      return "warning";
    case "absent":
      return "destructive";
    default:
      return "outline";
  }
};

const HrAttendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">
            Track employee attendance, hours, and punctuality
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">90.4% of workforce</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <div className="h-4 w-4 rounded-full bg-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">5.8% of workforce</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">3.8% of workforce</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.6</div>
            <p className="text-xs text-muted-foreground">hrs per employee</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Attendance trends for the current week</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsChart 
            data={weeklyOverviewData} 
            height={250}
            defaultType="bar"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Daily Attendance</CardTitle>
              <CardDescription>
                {date ? format(date, "EEEE, MMMM do, yyyy") : "Today"}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search employees..."
                  className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Filter by dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="present">Present</TabsTrigger>
              <TabsTrigger value="late">Late</TabsTrigger>
              <TabsTrigger value="absent">Absent</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Breaks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {employee.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-muted-foreground">{employee.position}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(employee.status)}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.checkin || "-"}</TableCell>
                      <TableCell>{employee.checkout || "-"}</TableCell>
                      <TableCell>{employee.hours ? `${employee.hours.toFixed(2)} hrs` : "-"}</TableCell>
                      <TableCell>{employee.breaks ? `${employee.breaks.toFixed(2)} hrs` : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="present">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Present Employees</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter showing only present employees would appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="late">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Late Employees</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter showing only late employees would appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="absent">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Absent Employees</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter showing only absent employees would appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HrAttendance;
