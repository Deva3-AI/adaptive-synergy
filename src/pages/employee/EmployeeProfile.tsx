import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Award, 
  FileText, 
  Briefcase,
  GraduationCap,
  Heart,
  Star
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const EmployeeProfile = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>({});
  const [employeeDetails, setEmployeeDetails] = useState<any>({});
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [date, setDate] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const data = await supabase
          .from('employee_details')
          .select('*')
          .eq('user_id', Number(userId))
          .single();
        
        if (data.data) {
          setEmployeeDetails({
            joining_date: data.data.joining_date || '',
            employee_id: data.data.employee_id || '',
            date_of_birth: data.data.date_of_birth || '',
            phone: data.data.phone || '',
            address: data.data.address || '',
            emergency_contact: data.data.emergency_contact || ''
          });
        } else {
          console.error('Error fetching employee details:', data.error);
        }
      } catch (error) {
        console.error('Error in fetchEmployeeDetails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [userId]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('employee_attendance')
          .select('*')
          .eq('user_id', Number(userId))
          .order('work_date', { ascending: false })
          .limit(90);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setAttendanceRecords(data);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, [userId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', Number(userId))
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfileData(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const getSkillsString = () => {
    if (Array.isArray(profileData.skills)) {
      return profileData.skills.join(', ');
    }
    return profileData.skills || '';
  };

  const getInterestsString = () => {
    if (Array.isArray(profileData.interests)) {
      return profileData.interests.join(', ');
    }
    return profileData.interests || '';
  };

  const calculateAttendanceRate = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) return 0;
    
    const presentDays = attendanceRecords.filter(record => record.status === 'present').length;
    return (presentDays / attendanceRecords.length) * 100;
  };

  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-500">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500">Late</Badge>;
      case 'leave':
        return <Badge className="bg-blue-500">Leave</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
            <AvatarFallback>{profileData.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profileData.full_name}</h1>
            <p className="text-muted-foreground">{profileData.job_title}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            View Documents
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-none md:flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-24">Employee ID</span>
                  <span>{employeeDetails.employee_id}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-24">Email</span>
                  <span>{profileData.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-24">Phone</span>
                  <span>{employeeDetails.phone}</span>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <span className="text-sm text-muted-foreground w-24">Address</span>
                  <span>{employeeDetails.address}</span>
                </div>
                
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-24">Birth Date</span>
                  <span>{employeeDetails.date_of_birth ? format(new Date(employeeDetails.date_of_birth), 'PPP') : 'Not set'}</span>
                </div>
                
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-24">Joined</span>
                  <span>{employeeDetails.joining_date ? format(new Date(employeeDetails.joining_date), 'PPP') : 'Not set'}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Professional Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Department</h3>
                  <Badge variant="outline" className="text-sm">{profileData.department}</Badge>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills</h3>
                  <p>{getSkillsString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Education</h3>
                  <div className="flex items-start">
                    <GraduationCap className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{profileData.education?.degree}</p>
                      <p className="text-sm text-muted-foreground">{profileData.education?.institution}, {profileData.education?.year}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.certifications?.map((cert: string, index: number) => (
                      <Badge key={index} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Interests</h3>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{getInterestsString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.current_projects?.map((project: any, index: number) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.role}</p>
                        </div>
                        <Badge>{project.status}</Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.recent_activity?.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 border-b pb-4 last:border-0 last:pb-0">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {activity.type === 'task' && <FileText className="h-4 w-4 text-primary" />}
                        {activity.type === 'achievement' && <Award className="h-4 w-4 text-primary" />}
                        {activity.type === 'time' && <Clock className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Attendance Rate</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Overall</span>
                    <span className="text-sm font-medium">{calculateAttendanceRate().toFixed(1)}%</span>
                  </div>
                  <Progress value={calculateAttendanceRate()} className="h-2" />
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Date Range</h3>
                  <DateRangePicker 
                    range={{ from: date.from, to: date.to }}
                    onChange={setDate}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No attendance records found</TableCell>
                      </TableRow>
                    ) : (
                      attendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{format(new Date(record.work_date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                          <TableCell>{record.check_in ? format(new Date(record.check_in), 'hh:mm a') : '-'}</TableCell>
                          <TableCell>{record.check_out ? format(new Date(record.check_out), 'hh:mm a') : '-'}</TableCell>
                          <TableCell>{record.hours_worked || '-'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Task Completion Rate</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Last 30 days</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Quality Score</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Last 30 days</span>
                    <span className="text-sm font-medium">4.8/5</span>
                  </div>
                  <div className="flex">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Productivity</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Last 30 days</span>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Project X Review</h3>
                        <p className="text-sm text-muted-foreground">From: Jane Smith (Project Manager)</p>
                      </div>
                      <div className="flex">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <p className="mt-2 text-sm">Excellent work on the project. Delivered ahead of schedule with outstanding quality.</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Quarterly Review</h3>
                        <p className="text-sm text-muted-foreground">From: John Doe (Department Head)</p>
                      </div>
                      <div className="flex">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                    </div>
                    <p className="mt-2 text-sm">Consistently meets deadlines and produces high-quality work. Could improve on communication with team members.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Goals & Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Complete Advanced Certification</h3>
                      <p className="text-sm text-muted-foreground">Due: December 31, 2023</p>
                    </div>
                    <Badge>In Progress</Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Improve Client Satisfaction Score</h3>
                      <p className="text-sm text-muted-foreground">Due: Ongoing</p>
                    </div>
                    <Badge>On Track</Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current: 4.7/5</span>
                      <span>Target: 4.8/5</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Mentor Junior Team Members</h3>
                      <p className="text-sm text-muted-foreground">Due: Ongoing</p>
                    </div>
                    <Badge className="bg-green-500">Exceeding</Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Target: 2 mentees</span>
                      <span>Current: 3 mentees</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Documents</CardTitle>
              <CardDescription>View and manage employee-related documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Employment Contract</h3>
                      <p className="text-sm text-muted-foreground">Uploaded on {format(new Date('2023-01-15'), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                
                <div className="border rounded-md p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Confidentiality Agreement</h3>
                      <p className="text-sm text-muted-foreground">Uploaded on {format(new Date('2023-01-15'), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                
                <div className="border rounded-md p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Performance Review - Q2 2023</h3>
                      <p className="text-sm text-muted-foreground">Uploaded on {format(new Date('2023-07-10'), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                
                <div className="border rounded-md p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Training Certificates</h3>
                      <p className="text-sm text-muted-foreground">Uploaded on {format(new Date('2023-05-22'), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
