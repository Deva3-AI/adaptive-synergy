
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, Briefcase, Award, Edit, History, ClipboardList } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  
  // Fetch employee details from Supabase
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ['employee', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      try {
        // Get employee from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            roles (role_name),
            employee_details (joining_date, employee_id, date_of_birth)
          `)
          .eq('user_id', employeeId)
          .single();
        
        if (userError) throw userError;
        
        if (!userData) {
          throw new Error('Employee not found');
        }
        
        return {
          id: userData.user_id,
          name: userData.name,
          email: userData.email,
          role: userData.roles?.role_name || 'Unassigned',
          department: userData.roles?.role_name || 'Unassigned',
          joinDate: userData.employee_details?.joining_date 
            ? format(new Date(userData.employee_details.joining_date), 'MMMM d, yyyy')
            : 'Not specified',
          employeeId: userData.employee_details?.employee_id || 'Not assigned',
          dateOfBirth: userData.employee_details?.date_of_birth || null,
          phone: '+1 (555) 123-4567', // Mock data - would need to be added to schema
          location: 'San Francisco, CA', // Mock data - would need to be added to schema
          imageUrl: "",
          bio: "Experienced professional with expertise in their field. Has worked on multiple high-profile projects and brings a user-centered approach to all their work."
        };
      } catch (error) {
        console.error('Error fetching employee details:', error);
        throw error;
      }
    }
  });

  // Fetch employee's tasks
  const { data: tasks } = useQuery({
    queryKey: ['employee-tasks', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            task_id,
            title,
            status,
            clients (client_name)
          `)
          .eq('assigned_to', employeeId)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        return data.map(task => ({
          id: task.task_id,
          title: task.title,
          status: task.status,
          client: task.clients?.client_name || 'Unknown Client'
        }));
      } catch (error) {
        console.error('Error fetching employee tasks:', error);
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-7 w-40 mb-2" />
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="w-full space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-3">
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          Error loading employee profile. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold tracking-tight">Employee Profile</h1>
        <Button variant="outline" className="gap-1">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={employee.imageUrl} alt={employee.name} />
                <AvatarFallback className="text-xl">{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{employee.name}</h2>
              <Badge className="mt-1 mb-2">{employee.role}</Badge>
              <p className="text-sm text-muted-foreground mb-4">{employee.bio}</p>
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{employee.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined {employee.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Department: {employee.department}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">UI Design</Badge>
                    <Badge variant="secondary">UX Research</Badge>
                    <Badge variant="secondary">Wireframing</Badge>
                    <Badge variant="secondary">Prototyping</Badge>
                    <Badge variant="secondary">Figma</Badge>
                    <Badge variant="secondary">Adobe XD</Badge>
                    <Badge variant="secondary">Sketch</Badge>
                    <Badge variant="secondary">User Testing</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Current Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tasks && tasks.length > 0 ? (
                    <div className="space-y-4">
                      {tasks.map(task => (
                        <div key={task.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">Client: {task.client}</p>
                            </div>
                            <Badge>{task.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No current projects assigned</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Task History</CardTitle>
                </CardHeader>
                <CardContent>
                  {tasks && tasks.length > 0 ? (
                    <div className="space-y-4">
                      {tasks.map(task => (
                        <div key={task.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">Client: {task.client}</p>
                            </div>
                            <Badge>{task.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="mt-2 text-muted-foreground">No task history available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">Performance data will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">Attendance history and work hours will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
