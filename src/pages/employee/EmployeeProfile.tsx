
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Mail, Phone, MapPin, Calendar, Clock, FileText, 
  Briefcase, GraduationCap, Award, Heart, Activity,
  BarChart, LineChart as LineChartIcon, PieChart as PieChartIcon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart, 
  LineChart, 
  PieChart 
} from '@/components/ui/charts';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DateRange {
  from: Date;
  to: Date;
}

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  
  // Fetch employee details
  const { data: employee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['employee', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      try {
        const { data: employeeData, error: employeeError } = await supabase
          .from('users')
          .select(`
            *,
            roles(role_name)
          `)
          .eq('user_id', Number(employeeId))
          .single();
        
        if (employeeError) throw employeeError;
        
        return employeeData;
      } catch (error) {
        console.error('Error fetching employee:', error);
        throw error;
      }
    }
  });
  
  // Fetch employee details
  const { data: employeeDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['employee-details', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('employee_details')
          .select('*')
          .eq('user_id', Number(employeeId))
          .single();
        
        if (error) throw error;
        
        return {
          user_id: data.user_id,
          joining_date: data.joining_date,
          employee_id: data.employee_id,
          date_of_birth: data.date_of_birth,
          // Default values for fields that might not exist yet
          phone: "Not provided",
          address: "Not provided",
          emergency_contact: "Not provided"
        };
      } catch (error) {
        console.error('Error fetching employee details:', error);
        return {
          user_id: Number(employeeId),
          joining_date: "Not provided",
          employee_id: "Not provided",
          date_of_birth: "Not provided",
          phone: "Not provided",
          address: "Not provided",
          emergency_contact: "Not provided"
        };
      }
    }
  });
  
  // Fetch employee attendance
  const { data: attendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['employee-attendance', employeeId, dateRange],
    enabled: !!employeeId,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('employee_attendance')
          .select('*')
          .eq('user_id', Number(employeeId))
          .gte('work_date', dateRange.from.toISOString().split('T')[0])
          .lte('work_date', dateRange.to.toISOString().split('T')[0])
          .order('work_date', { ascending: false });
        
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error('Error fetching attendance:', error);
        return [];
      }
    }
  });
  
  // Fetch employee tasks
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['employee-tasks', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            clients(client_name)
          `)
          .eq('assigned_to', Number(employeeId))
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    }
  });
  
  if (isLoadingEmployee || isLoadingDetails) {
    return (
      <div className="container mx-auto py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="container mx-auto py-8">
        <div className="w-full max-w-6xl mx-auto bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          Employee not found
        </div>
      </div>
    );
  }
  
  // Task statistics
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const pendingTasks = tasks?.filter(task => task.status === 'pending').length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress').length || 0;
  
  // Attendance statistics
  const totalDays = attendance?.length || 0;
  const totalHours = attendance?.reduce((total, day) => {
    if (day.login_time && day.logout_time) {
      const login = new Date(day.login_time);
      const logout = new Date(day.logout_time);
      const hours = (logout.getTime() - login.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }
    return total;
  }, 0) || 0;
  
  const averageHours = totalDays > 0 ? totalHours / totalDays : 0;
  
  // Mock data for charts
  const taskDistributionData = [
    { name: 'Completed', value: completedTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'Pending', value: pendingTasks }
  ];
  
  const productivityData = [
    { name: 'Mon', hours: 7.5 },
    { name: 'Tue', hours: 8.2 },
    { name: 'Wed', hours: 6.8 },
    { name: 'Thu', hours: 7.9 },
    { name: 'Fri', hours: 7.2 }
  ];
  
  const taskCompletionData = [
    { name: 'Week 1', tasks: 8 },
    { name: 'Week 2', tasks: 12 },
    { name: 'Week 3', tasks: 7 },
    { name: 'Week 4', tasks: 10 }
  ];
  
  return (
    <div className="container mx-auto py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Employee Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <Avatar className="h-24 w-24 border-2 border-primary mb-4 md:mb-0 md:mr-6">
                <AvatarFallback className="text-2xl">{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{employee.name}</h1>
                <p className="text-muted-foreground">{employee.roles?.role_name || 'Employee'}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Joined: {employeeDetails?.joining_date || 'Not available'}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>ID: {employeeDetails?.employee_id || 'Not assigned'}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button>Send Message</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Employee Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-32">Full Name</span>
                      <span>{employee.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-32">Email</span>
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-32">Job Title</span>
                      <span>{employee.roles?.role_name || 'Employee'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-32">Date of Birth</span>
                      <span>{employeeDetails?.date_of_birth || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-32">Phone</span>
                      <span>{employeeDetails?.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span className="text-sm text-muted-foreground w-32">Address</span>
                      <span>{employeeDetails?.address}</span>
                    </div>
                    <div className="flex items-start">
                      <Heart className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span className="text-sm text-muted-foreground w-32">Emergency Contact</span>
                      <span>{employeeDetails?.emergency_contact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Task Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Task Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-700">{completedTasks}</p>
                      <p className="text-xs text-blue-600">Completed</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-yellow-700">{inProgressTasks}</p>
                      <p className="text-xs text-yellow-600">In Progress</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-700">{pendingTasks}</p>
                      <p className="text-xs text-purple-600">Pending</p>
                    </div>
                  </div>
                  
                  <div className="h-48">
                    <PieChart 
                      data={taskDistributionData}
                      nameKey="name"
                      dataKey="value"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Attendance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-700">{totalDays}</p>
                      <p className="text-xs text-green-600">Days Present</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-700">{averageHours.toFixed(1)}</p>
                      <p className="text-xs text-blue-600">Avg Hours/Day</p>
                    </div>
                  </div>
                  
                  <div className="h-48">
                    <BarChart 
                      data={productivityData}
                      xAxisKey="name"
                      series={[
                        { key: 'hours', label: 'Hours', color: '#2563eb' }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks && tasks.length > 0 ? (
                    tasks.slice(0, 5).map((task) => (
                      <div key={task.task_id} className="flex items-start pb-4 border-b">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                          task.status === 'completed' ? 'bg-green-100 text-green-700' :
                          task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Client: {task.clients?.client_name || 'N/A'} • 
                            Status: <span className="capitalize">{task.status.replace('_', ' ')}</span>
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(task.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-4">Task Distribution</h3>
                    <div className="h-64">
                      <PieChart 
                        data={taskDistributionData}
                        nameKey="name"
                        dataKey="value"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-4">Task Completion</h3>
                    <div className="h-64">
                      <BarChart 
                        data={taskCompletionData}
                        xAxisKey="name"
                        series={[
                          { key: 'tasks', label: 'Tasks', color: '#8b5cf6' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">Assigned Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <div className="text-center py-4">Loading tasks...</div>
                ) : tasks && tasks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Estimated Time</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.task_id}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>{task.clients?.client_name || 'N/A'}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              task.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell>
                            {task.end_time ? new Date(task.end_time).toLocaleDateString() : 'Not set'}
                          </TableCell>
                          <TableCell>{task.estimated_time || 0} hours</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No tasks assigned
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <CardTitle className="text-lg">Attendance Records</CardTitle>
                <DateRangePicker date={dateRange} setDate={setDateRange} />
              </CardHeader>
              <CardContent>
                {isLoadingAttendance ? (
                  <div className="text-center py-4">Loading attendance records...</div>
                ) : attendance && attendance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Clock In</TableHead>
                        <TableHead>Clock Out</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.map((record) => {
                        const loginTime = record.login_time ? new Date(record.login_time) : null;
                        const logoutTime = record.logout_time ? new Date(record.logout_time) : null;
                        const duration = loginTime && logoutTime 
                          ? ((logoutTime.getTime() - loginTime.getTime()) / (1000 * 60 * 60)).toFixed(2)
                          : '-';
                        
                        return (
                          <TableRow key={record.attendance_id}>
                            <TableCell>{new Date(record.work_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {loginTime ? loginTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                            </TableCell>
                            <TableCell>
                              {logoutTime ? logoutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                            </TableCell>
                            <TableCell>{duration} hours</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                loginTime && logoutTime ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {loginTime && logoutTime ? 'Complete' : 'Incomplete'}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No attendance records found for the selected date range
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-700">{totalDays}</p>
                    <p className="text-sm text-green-600">Days Present</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700">{totalHours.toFixed(1)}</p>
                    <p className="text-sm text-blue-600">Total Hours</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-700">{averageHours.toFixed(1)}</p>
                    <p className="text-sm text-purple-600">Avg Hours/Day</p>
                  </div>
                </div>
                
                <div className="h-64">
                  <BarChart 
                    data={productivityData}
                    xAxisKey="name"
                    series={[
                      { key: 'hours', label: 'Hours', color: '#2563eb' }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Task Completion</CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Activity className="h-4 w-4 mr-1" />
                    Last 30 days
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-green-700">{completedTasks}</p>
                        <p className="text-sm text-green-600">Completed</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-700">
                          {completedTasks + pendingTasks + inProgressTasks > 0 
                            ? Math.round((completedTasks / (completedTasks + pendingTasks + inProgressTasks)) * 100) 
                            : 0}%
                        </p>
                        <p className="text-sm text-blue-600">Completion Rate</p>
                      </div>
                    </div>
                    
                    <div className="h-48">
                      <LineChart 
                        data={taskCompletionData.map(item => ({
                          name: item.name,
                          Completed: item.tasks
                        }))}
                        xAxisKey="name"
                        series={[
                          { key: 'Completed', color: '#10b981' }
                        ]}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Productivity</CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Activity className="h-4 w-4 mr-1" />
                    Last 30 days
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-purple-700">{totalHours.toFixed(1)}</p>
                        <p className="text-sm text-purple-600">Hours Worked</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-700">{averageHours.toFixed(1)}</p>
                        <p className="text-sm text-yellow-600">Avg Hours/Day</p>
                      </div>
                    </div>
                    
                    <div className="h-48">
                      <BarChart 
                        data={productivityData}
                        xAxisKey="name"
                        series={[
                          { key: 'hours', label: 'Hours', color: '#8b5cf6' }
                        ]}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills & Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-4">Skills</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>React Development</span>
                        <span className="text-sm">Expert</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span>UI/UX Design</span>
                        <span className="text-sm">Advanced</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span>Project Management</span>
                        <span className="text-sm">Intermediate</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-4">Certifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded mr-3">
                          <Award className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <h4 className="font-medium">React Developer Certification</h4>
                          <p className="text-sm text-muted-foreground">Issued Jun 2022 • No Expiration</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded mr-3">
                          <GraduationCap className="h-5 w-5 text-purple-700" />
                        </div>
                        <div>
                          <h4 className="font-medium">UI/UX Design Fundamentals</h4>
                          <p className="text-sm text-muted-foreground">Issued Mar 2021 • No Expiration</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeProfile;
