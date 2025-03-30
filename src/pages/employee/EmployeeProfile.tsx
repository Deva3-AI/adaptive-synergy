
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, LineChart } from "@/components/ui/charts";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Edit, Mail, Phone, Calendar, MapPin, Briefcase, FileText, Clock } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  
  // Fetch employee details
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ['employee-profile', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      try {
        const parsedEmployeeId = parseInt(employeeId || '0', 10);
        
        const { data, error } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            created_at,
            roles (
              role_name
            ),
            employee_details (
              joining_date,
              employee_id,
              date_of_birth,
              phone,
              address,
              emergency_contact
            )
          `)
          .eq('user_id', parsedEmployeeId)
          .single();
        
        if (error) throw error;
        
        return {
          ...data,
          role_name: data.roles?.role_name || 'Unknown Role',
          joining_date: data.employee_details?.joining_date,
          employee_id: data.employee_details?.employee_id,
          date_of_birth: data.employee_details?.date_of_birth,
          phone: data.employee_details?.phone || 'Not provided',
          address: data.employee_details?.address || 'Not provided',
          emergency_contact: data.employee_details?.emergency_contact || 'Not provided'
        };
      } catch (error) {
        console.error('Error fetching employee details:', error);
        throw error;
      }
    }
  });
  
  // Fetch employee attendance
  const { data: attendanceData, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['employee-attendance', employeeId, dateRange],
    enabled: !!employeeId,
    queryFn: async () => {
      try {
        const parsedEmployeeId = parseInt(employeeId || '0', 10);
        
        const fromDate = format(dateRange.from, 'yyyy-MM-dd');
        const toDate = format(dateRange.to, 'yyyy-MM-dd');
        
        const { data, error } = await supabase
          .from('employee_attendance')
          .select('*')
          .eq('user_id', parsedEmployeeId)
          .gte('work_date', fromDate)
          .lte('work_date', toDate)
          .order('work_date', { ascending: false });
        
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error('Error fetching employee attendance:', error);
        return [];
      }
    }
  });
  
  // Calculate work hours from attendance data
  const calculateWorkHours = (login: string | null, logout: string | null): number => {
    if (!login || !logout) return 0;
    
    const loginTime = new Date(login).getTime();
    const logoutTime = new Date(logout).getTime();
    
    return (logoutTime - loginTime) / (1000 * 60 * 60);
  };
  
  // Calculate attendance metrics
  const attendanceMetrics = React.useMemo(() => {
    if (!attendanceData) return { present: 0, absent: 0, late: 0, avgHours: 0 };
    
    let presentDays = 0;
    let totalHours = 0;
    let daysWithHours = 0;
    
    attendanceData.forEach(record => {
      if (record.login_time) {
        presentDays++;
        
        if (record.login_time && record.logout_time) {
          const hours = calculateWorkHours(record.login_time, record.logout_time);
          totalHours += hours;
          daysWithHours++;
        }
      }
    });
    
    const avgHours = daysWithHours > 0 ? totalHours / daysWithHours : 0;
    
    // Total days in range
    const totalDays = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      present: presentDays,
      absent: totalDays - presentDays,
      late: 0, // We don't have late data yet
      avgHours
    };
  }, [attendanceData, dateRange]);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[125px]" />
          ))}
        </div>
        <Skeleton className="h-[600px]" />
      </div>
    );
  }
  
  if (error || !employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Could not load employee profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              There was an error loading the employee profile. Please try again later or contact support.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.history.back()} variant="outline">Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {employee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{employee.name}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Badge variant="outline">{employee.role_name}</Badge>
              <span>•</span>
              <span>ID: {employee.employee_id || 'N/A'}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" className="gap-2 w-full md:w-auto">
          <Edit className="h-4 w-4" /> Edit Profile
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceMetrics.present}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In selected date range
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceMetrics.absent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In selected date range
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Work Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceMetrics.avgHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per day in selected range
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceMetrics.late}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Late clock-ins this month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="profile">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
              <CardDescription>
                Personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div>{employee.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Employee ID</div>
                  <div>{employee.employee_id || 'Not assigned'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {employee.date_of_birth 
                        ? format(new Date(employee.date_of_birth), 'PPP') 
                        : 'Not provided'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Join Date</div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {employee.joining_date 
                        ? format(new Date(employee.joining_date), 'PPP') 
                        : 'Not provided'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 col-span-1 md:col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.address}</span>
                  </div>
                </div>
                <div className="space-y-1 col-span-1 md:col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Emergency Contact</div>
                  <div>{employee.emergency_contact}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Department & Role</CardTitle>
              <CardDescription>
                Information about employee's position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Department</div>
                  <div>
                    <Badge variant="outline">{employee.role_name.split('.')[0] || 'General'}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Role</div>
                  <div>
                    <Badge>{employee.role_name}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Reports To</div>
                  <div>CEO</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>
                Daily attendance records for selected date range
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAttendance ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : attendanceData && attendanceData.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Login Time</TableHead>
                        <TableHead>Logout Time</TableHead>
                        <TableHead>Work Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.map((record) => (
                        <TableRow key={record.attendance_id}>
                          <TableCell>
                            {format(new Date(record.work_date), 'EEE, MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            {record.login_time 
                              ? format(new Date(record.login_time), 'h:mm a')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {record.logout_time 
                              ? format(new Date(record.logout_time), 'h:mm a')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {record.login_time && record.logout_time 
                              ? calculateWorkHours(record.login_time, record.logout_time).toFixed(2) + 'h'
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {!record.login_time 
                              ? <Badge variant="destructive">Absent</Badge>
                              : !record.logout_time
                                ? <Badge variant="warning">Incomplete</Badge>
                                : <Badge variant="success">Present</Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No attendance records found for the selected date range.
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Work Hours</CardTitle>
                <CardDescription>
                  Hours worked per day in selected range
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={attendanceData?.map(record => ({
                    name: format(new Date(record.work_date), 'MMM d'),
                    value: record.login_time && record.logout_time 
                      ? calculateWorkHours(record.login_time, record.logout_time)
                      : 0
                  })) || []}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance</CardTitle>
                <CardDescription>
                  Present vs. absent days by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={[
                    { name: 'Jan', present: 20, absent: 3 },
                    { name: 'Feb', present: 18, absent: 2 },
                    { name: 'Mar', present: 22, absent: 1 },
                    { name: 'Apr', present: 19, absent: 4 },
                    { name: 'May', present: 23, absent: 0 },
                    { name: 'Jun', present: attendanceMetrics.present, absent: attendanceMetrics.absent }
                  ]}
                  xAxisKey="name"
                  yAxisKey={["present", "absent"]}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Task completion rates and productivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <LineChart 
                    data={[
                      { month: 'Jan', productivity: 75 },
                      { month: 'Feb', productivity: 82 },
                      { month: 'Mar', productivity: 78 },
                      { month: 'Apr', productivity: 85 },
                      { month: 'May', productivity: 90 },
                      { month: 'Jun', productivity: 87 }
                    ]}
                    xAxisKey="month"
                    yAxisKey="productivity"
                    height={300}
                  />
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Productivity Score (%)
                  </p>
                </div>
                
                <div>
                  <LineChart 
                    data={[
                      { month: 'Jan', onTime: 10, late: 2 },
                      { month: 'Feb', onTime: 12, late: 1 },
                      { month: 'Mar', onTime: 8, late: 0 },
                      { month: 'Apr', onTime: 14, late: 3 },
                      { month: 'May', onTime: 15, late: 1 },
                      { month: 'Jun', onTime: 11, late: 2 }
                    ]}
                    xAxisKey="month"
                    yAxisKey={["onTime", "late"]}
                    height={300}
                  />
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Task Completion (On Time vs. Late)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance Review</CardTitle>
              <CardDescription>
                Latest performance evaluation results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Quality of Work</div>
                    <div className="text-sm font-medium">4.5/5</div>
                  </div>
                  <div className="bg-secondary rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Communication</div>
                    <div className="text-sm font-medium">4.0/5</div>
                  </div>
                  <div className="bg-secondary rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Technical Skills</div>
                    <div className="text-sm font-medium">4.8/5</div>
                  </div>
                  <div className="bg-secondary rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Teamwork</div>
                    <div className="text-sm font-medium">4.2/5</div>
                  </div>
                  <div className="bg-secondary rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Reliability</div>
                    <div className="text-sm font-medium">4.7/5</div>
                  </div>
                  <div className="bg-secondary rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Manager's Comment</h4>
                  <p className="text-muted-foreground">
                    {employee.name} has shown excellent progress over the past quarter. 
                    Technical skills are outstanding, and communication has improved significantly. 
                    Continue focusing on cross-team collaboration and knowledge sharing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Documents</CardTitle>
              <CardDescription>
                Important documents and files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div>
                      <div className="font-medium">Employment Contract</div>
                      <div className="text-xs text-muted-foreground">PDF • 2.4 MB • Uploaded 24 Jun 2023</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-green-500" />
                    <div>
                      <div className="font-medium">Employee Handbook</div>
                      <div className="text-xs text-muted-foreground">PDF • 3.8 MB • Uploaded 12 Jan 2023</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-purple-500" />
                    <div>
                      <div className="font-medium">ID Proof</div>
                      <div className="text-xs text-muted-foreground">JPG • 1.2 MB • Uploaded 24 Jun 2023</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-orange-500" />
                    <div>
                      <div className="font-medium">Qualification Certificate</div>
                      <div className="text-xs text-muted-foreground">PDF • 1.8 MB • Uploaded 24 Jun 2023</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Upload New Document</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
