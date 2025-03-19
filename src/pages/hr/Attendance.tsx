
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Filter, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const weeklyAttendanceData = [
  { name: "Mon", present: 48, late: 3, absent: 1 },
  { name: "Tue", present: 50, late: 1, absent: 1 },
  { name: "Wed", present: 49, late: 2, absent: 1 },
  { name: "Thu", present: 47, late: 3, absent: 2 },
  { name: "Fri", present: 45, late: 2, absent: 5 },
];

const HrAttendance = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Attendance</h1>
          <p className="text-muted-foreground">
            Monitor daily attendance and track employee work hours
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47/52</div>
            <div className="mt-1">
              <Progress value={90} className="h-1.5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">90% attendance rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">5.8% of workforce</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">3.8% of workforce</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">9.6% of workforce</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCard
        title="Weekly Attendance Overview"
        icon={<Calendar className="h-5 w-5" />}
      >
        <AnalyticsChart 
          data={weeklyAttendanceData} 
          height={300}
          defaultType="bar"
        />
      </DashboardCard>

      <DashboardCard
        title="Today's Attendance Log"
        icon={<Clock className="h-5 w-5" />}
      >
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Check In</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Check Out</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Work Hours</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { 
                  name: "Alex Johnson", 
                  image: null, 
                  status: "present", 
                  checkIn: "08:58 AM", 
                  checkOut: "05:45 PM", 
                  hours: "8h 47m", 
                  department: "Engineering" 
                },
                { 
                  name: "Sarah Brown", 
                  image: null, 
                  status: "present", 
                  checkIn: "09:05 AM", 
                  checkOut: "06:02 PM", 
                  hours: "8h 57m", 
                  department: "Design" 
                },
                { 
                  name: "Michael Wilson", 
                  image: null, 
                  status: "late", 
                  checkIn: "10:22 AM", 
                  checkOut: "06:15 PM", 
                  hours: "7h 53m", 
                  department: "Marketing" 
                },
                { 
                  name: "Emily Davis", 
                  image: null, 
                  status: "present", 
                  checkIn: "08:45 AM", 
                  checkOut: "05:30 PM", 
                  hours: "8h 45m", 
                  department: "Product" 
                },
                { 
                  name: "Robert Lee", 
                  image: null, 
                  status: "absent", 
                  checkIn: "-", 
                  checkOut: "-", 
                  hours: "-", 
                  department: "Sales" 
                },
                { 
                  name: "Jennifer Martinez", 
                  image: null, 
                  status: "leave", 
                  checkIn: "-", 
                  checkOut: "-", 
                  hours: "-", 
                  department: "HR" 
                }
              ].map((employee, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.status === 'present' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      employee.status === 'late' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      employee.status === 'absent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {employee.checkIn}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {employee.checkOut}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {employee.hours}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {employee.department}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default HrAttendance;
