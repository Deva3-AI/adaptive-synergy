
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Mail, Phone, MapPin, BookUser, Clock, Calendar, ArrowUpRight, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, BarChart, PieChart } from "@/components/ui/charts";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, subDays } from 'date-fns';

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  // Fetch employee details
  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee-profile', employeeId],
    queryFn: async () => {
      try {
        // Fetch user details
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            role_id,
            roles(role_name),
            created_at
          `)
          .eq('user_id', employeeId)
          .single();

        if (userError) throw userError;

        // Fetch employee details
        const { data: employeeData, error: employeeError } = await supabase
          .from('employee_details')
          .select(`
            joining_date,
            employee_id,
            date_of_birth
          `)
          .eq('user_id', employeeId)
          .single();

        // Continue even if employee details have an error, as they might not exist yet
        
        // Fetch employee attendance data
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('employee_attendance')
          .select('*')
          .eq('user_id', employeeId)
          .order('work_date', { ascending: false })
          .limit(10);
        
        if (attendanceError) throw attendanceError;
        
        return {
          ...userData,
          role_name: userData.roles?.role_name || 'Employee',
          joining_date: employeeData?.joining_date || null,
          employee_id: employeeData?.employee_id || null,
          date_of_birth: employeeData?.date_of_birth || null,
          // These fields may not exist yet in the database, so we'll mock them
          phone: '+1 (555) 123-4567',
          address: '123 Main St, Anytown, CA 12345',
          emergency_contact: 'Jane Doe (+1 555-987-6543)',
          attendance: attendanceData || []
        };
      } catch (error) {
        console.error('Error fetching employee profile:', error);
        throw error;
      }
    }
  });

  // Mock performance data
  const performanceData = {
    overview: {
      tasks_completed: 45,
      tasks_in_progress: 3,
      on_time_completion: 92,
      average_rating: 4.8
    },
    tasks_by_client: [
      { name: 'Social Land', value: 12 },
      { name: 'Koala Digital', value: 10 },
      { name: 'AC Digital', value: 8 },
      { name: 'Muse Digital', value: 5 }
    ],
    time_tracking: [
      { name: 'Mon', value: 7.5 },
      { name: 'Tue', value: 8.2 },
      { name: 'Wed', value: 7.8 },
      { name: 'Thu', value: 8.5 },
      { name: 'Fri', value: 6.5 },
      { name: 'Sat', value: 0 },
      { name: 'Sun', value: 0 }
    ],
    recent_tasks: [
      {
        id: 1,
        title: 'Website Redesign',
        client: 'Social Land',
        due_date: '2023-09-15',
        status: 'in_progress',
        priority: 'High'
      },
      {
        id: 2,
        title: 'Social Media Campaign',
        client: 'Koala Digital',
        due_date: '2023-09-20',
        status: 'pending',
        priority: 'Medium'
      },
      {
        id: 3,
        title: 'Logo Design',
        client: 'AC Digital',
        due_date: '2023-09-10',
        status: 'completed',
        priority: 'High'
      }
    ],
    skills: [
      { name: 'UI Design', level: 90 },
      { name: 'Frontend Dev', level: 85 },
      { name: 'UX Research', level: 75 },
      { name: 'Backend Dev', level: 60 },
      { name: 'Project Management', level: 80 }
    ]
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <p>Loading employee profile...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <p className="text-red-500">Employee not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24 border-2 border-primary/10">
            <AvatarImage src="/placeholder.svg" alt={employee.name} />
            <AvatarFallback className="text-2xl">{employee.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <Badge variant="outline">{employee.role_name}</Badge>
              {employee.employee_id && (
                <Badge variant="secondary">ID: {employee.employee_id}</Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {employee.joining_date ? (
                `Joined on ${format(new Date(employee.joining_date), 'PPP')}`
              ) : 'New Employee'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{employee.address}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookUser className="h-4 w-4 text-muted-foreground" />
                <span>Emergency Contact: {employee.emergency_contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {employee.date_of_birth ? (
                    `Date of Birth: ${format(new Date(employee.date_of_birth), 'PPP')}`
                  ) : 'Date of Birth: Not available'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button>Edit Profile</Button>
          <Button variant="outline">Message</Button>
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="skills">Skills & Training</TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <DateRangePicker 
              range={dateRange}
              onChange={setDateRange}
            />
          </div>
          
          <TabsContent value="overview" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceData.overview.tasks_completed}</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceData.overview.tasks_in_progress}</div>
                  <p className="text-xs text-muted-foreground">Active tasks</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceData.overview.on_time_completion}%</div>
                  <Progress value={performanceData.overview.on_time_completion} className="h-1 mt-1" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceData.overview.average_rating}/5</div>
                  <div className="flex items-center mt-1">
                    {"★".repeat(Math.floor(performanceData.overview.average_rating))}
                    {"☆".repeat(5 - Math.floor(performanceData.overview.average_rating))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks by Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <PieChart 
                      data={performanceData.tasks_by_client}
                      nameKey="name"
                      dataKey="value"
                      height={250}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <BarChart 
                      data={performanceData.time_tracking}
                      xAxisKey="name"
                      yAxisKey="value"
                      height={250}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performanceData.recent_tasks.map(task => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>{task.client}</TableCell>
                          <TableCell>{task.due_date}</TableCell>
                          <TableCell>
                            <Badge variant={
                              task.status === 'completed' ? 'success' :
                              task.status === 'in_progress' ? 'default' :
                              'secondary'
                            }>
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              task.priority === 'High' ? 'destructive' :
                              task.priority === 'Medium' ? 'default' :
                              'secondary'
                            }>
                              {task.priority}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  Recent attendance records for {employee.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Clock In</TableHead>
                        <TableHead>Clock Out</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee.attendance && employee.attendance.length > 0 ? (
                        employee.attendance.map((record: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              {format(new Date(record.work_date), 'PPP')}
                            </TableCell>
                            <TableCell>
                              {record.login_time
                                ? format(new Date(record.login_time), 'p')
                                : 'Not logged in'}
                            </TableCell>
                            <TableCell>
                              {record.logout_time
                                ? format(new Date(record.logout_time), 'p')
                                : record.login_time
                                  ? 'Still working'
                                  : 'Not logged in'}
                            </TableCell>
                            <TableCell>
                              {record.login_time && record.logout_time
                                ? ((new Date(record.logout_time).getTime() - new Date(record.login_time).getTime()) / (1000 * 60 * 60)).toFixed(2) + 'h'
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {!record.login_time ? (
                                <Badge variant="destructive">Absent</Badge>
                              ) : !record.logout_time ? (
                                <Badge variant="outline">In Progress</Badge>
                              ) : (
                                <Badge variant="success">Complete</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Tracking work performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Task Completion</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completed on time</span>
                        <span className="font-medium">{performanceData.overview.on_time_completion}%</span>
                      </div>
                      <Progress value={performanceData.overview.on_time_completion} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Quality rating</span>
                        <span className="font-medium">{performanceData.overview.average_rating}/5</span>
                      </div>
                      <Progress value={performanceData.overview.average_rating * 20} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Client satisfaction</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <Progress value={95} />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-sm mb-4">Performance Trend</h3>
                    <LineChart 
                      data={[
                        { month: "Jan", performance: 85 },
                        { month: "Feb", performance: 82 },
                        { month: "Mar", performance: 88 },
                        { month: "Apr", performance: 90 },
                        { month: "May", performance: 92 },
                        { month: "Jun", performance: 95 }
                      ]}
                      xAxisKey="month"
                      yAxisKey="performance"
                      height={200}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Client Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Social Land</p>
                        <p className="text-sm text-muted-foreground">Website Redesign Project</p>
                      </div>
                      <div className="text-amber-500">★★★★★</div>
                    </div>
                    <p className="text-sm">
                      "{employee.name} consistently delivered high-quality work and was very responsive to feedback. The redesign exceeded our expectations."
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">August 15, 2023</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Koala Digital</p>
                        <p className="text-sm text-muted-foreground">Social Media Campaign</p>
                      </div>
                      <div className="text-amber-500">★★★★☆</div>
                    </div>
                    <p className="text-sm">
                      "Great work on our campaign. The content was creative and well-executed. Would have appreciated more regular updates."
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">July 28, 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData.skills.map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill.name}</span>
                          <span className="font-medium">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Training & Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <h3 className="font-medium">UX Design Certification</h3>
                        <Badge>Completed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Google UX Design Professional Certificate</p>
                      <p className="text-xs text-muted-foreground mt-2">Completed: March 15, 2023</p>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <h3 className="font-medium">React Advanced Concepts</h3>
                        <Badge variant="outline">In Progress</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Frontend Masters</p>
                      <p className="text-xs text-muted-foreground mt-2">Started: July 10, 2023</p>
                      <div className="mt-2">
                        <Progress value={65} />
                        <p className="text-xs text-right mt-1">65% complete</p>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Project Management</h3>
                        <Badge>Completed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Internal training</p>
                      <p className="text-xs text-muted-foreground mt-2">Completed: January 20, 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommended Training</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium">Advanced UI Animation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Learn advanced animation techniques for web interfaces
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline">15 hours</Badge>
                      <Button size="sm">
                        Enroll
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium">Client Communication Masterclass</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Effective strategies for client communication and management
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline">8 hours</Badge>
                      <Button size="sm">
                        Enroll
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium">TypeScript for React Developers</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Master TypeScript in React applications
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline">12 hours</Badge>
                      <Button size="sm">
                        Enroll
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium">Advanced Project Management</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Advanced techniques for managing complex projects
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline">20 hours</Badge>
                      <Button size="sm">
                        Enroll
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
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
