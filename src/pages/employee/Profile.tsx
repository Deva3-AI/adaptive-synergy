import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock as ClockIcon, 
  Mail, 
  Phone, 
  Calendar, 
  BarChart, 
  FileText as FileTextIcon,
  Star as StarIcon,
  Target, 
  Award as AwardIcon, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/hooks/useUser';
import { userService } from '@/services/api/userService';
import { format } from 'date-fns';
import PerformanceChart from '@/components/employee/PerformanceChart';
import ProductivityStats from '@/components/employee/ProductivityStats';
import SkillsRadarChart from '@/components/employee/SkillsRadarChart';
import LeaveBalanceDisplay from '@/components/employee/LeaveBalanceDisplay';
import EmployeeLeaveRequests from '@/components/employee/EmployeeLeaveRequests';
import EmployeeTaskStats from '@/components/employee/EmployeeTaskStats';
import { useQuery } from '@tanstack/react-query';
import { DateRange } from "react-day-picker";
import { DateRangePicker } from '@/components/ui/date-range-picker';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: authUser } = useAuth();
  const { user, loading, error } = useUser(userId);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const { data: employeeDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['employeeDetails', userId],
    queryFn: async () => {
      if (!userId) return null;
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      return await userService.getEmployeeDetails(numericUserId);
    },
    enabled: !!userId,
  });

  const { data: performanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['performanceData', userId],
    queryFn: async () => {
      if (!userId) return null;
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      return await userService.getEmployeePerformance(numericUserId);
    },
    enabled: !!userId,
  });

  const { data: attendanceData, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['attendanceData', userId],
    queryFn: async () => {
      if (!userId) return null;
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      return await userService.getEmployeeAttendance(numericUserId);
    },
    enabled: !!userId,
  });

  const { data: leaveBalanceData, isLoading: isLoadingLeaveBalance } = useQuery({
    queryKey: ['leaveBalanceData', userId],
    queryFn: async () => {
      if (!userId) return null;
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      return await userService.getEmployeeLeaveBalances(numericUserId);
    },
    enabled: !!userId,
  });

  if (loading || isLoadingDetails || isLoadingPerformance || isLoadingAttendance || isLoadingLeaveBalance) {
    return <div>Loading...</div>;
  }

  if (error || !user || !employeeDetails) {
    return <div>Error: {error || 'Employee not found'}</div>;
  }

  const getRoleName = () => {
    if (employeeDetails.roles && employeeDetails.roles.length > 0) {
      return employeeDetails.roles[0].role_name;
    }
    return 'Unknown Role';
  };

  const taskCompletionData = [
    { name: 'Completed', value: 75 },
    { name: 'In Progress', value: 25 },
  ];

  const productivityData = [
    { name: 'On Time', value: 80 },
    { name: 'Delayed', value: 20 },
  ];

  const skillsData = [
    { name: 'Communication', value: 85 },
    { name: 'Teamwork', value: 90 },
    { name: 'Problem Solving', value: 78 },
    { name: 'Technical Skills', value: 92 },
  ];

  const leaveBalance = {
    annualLeave: 15,
    sickLeave: 10,
  };

  const activityFeed = [
    {
      activity: 'Completed Project Alpha',
      date: '2023-05-20',
      type: 'task',
    },
    {
      activity: 'Received positive client feedback',
      date: '2023-05-15',
      type: 'feedback',
    },
    {
      activity: 'Attended training session',
      date: '2023-05-10',
      type: 'training',
    },
  ];

  const awards = [
    {
      name: 'Employee of the Month',
      date: '2023-04-01',
    },
    {
      name: 'Team Player Award',
      date: '2023-03-15',
    },
  ];

  const education = [
    {
      name: 'Bachelor of Science in Computer Science',
      date: '2015-05-01',
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user?.name || 'Employee Profile'}</h1>
          <p className="text-muted-foreground">
            Manage your profile and view your performance metrics
          </p>
        </div>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/employee/leave-requests')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Apply for Leave
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Employee Profile</CardTitle>
          <CardDescription>View and manage employee information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="flex flex-col items-center justify-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    {user.email}
                    <br />
                    {getRoleName()}
                  </CardDescription>
                  <div className="flex items-center space-x-2 mt-4">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>(123) 456-7890</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined on {format(new Date(employeeDetails.joinDate), 'MMMM dd, yyyy')}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart data={performanceData} />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Tabs defaultValue="tasks" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="productivity">Productivity</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="leave">Leave Balance</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="awards">Awards</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks" className="space-y-2">
                  <EmployeeTaskStats userId={Number(userId)} />
                </TabsContent>
                <TabsContent value="productivity" className="space-y-2">
                  <ProductivityStats data={productivityData} />
                </TabsContent>
                <TabsContent value="skills" className="space-y-2">
                  <SkillsRadarChart data={skillsData} />
                </TabsContent>
                <TabsContent value="leave" className="space-y-2">
                  <LeaveBalanceDisplay leaveBalance={leaveBalance} />
                  <EmployeeLeaveRequests />
                </TabsContent>
                <TabsContent value="activity" className="space-y-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activity</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activityFeed.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.activity}</TableCell>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>{item.type}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="awards" className="space-y-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Awards</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Award</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {awards.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="education" className="space-y-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Education</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Degree</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {education.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
