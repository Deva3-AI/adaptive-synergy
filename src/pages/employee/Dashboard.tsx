
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Calendar,
  AlertCircle,
  BarChart,
  FileText,
  ListTodo
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

import AttendanceTracker from '@/components/employee/AttendanceTracker';
import EmployeeLeaveRequests from '@/components/employee/EmployeeLeaveRequests';
import EmployeePayslipWidget from '@/components/employee/EmployeePayslipWidget';

// Mock data
const MOCK_TASKS = [
  {
    id: 1,
    title: 'Complete UI Design',
    deadline: '2023-09-10',
    priority: 'high',
    status: 'in_progress',
    project: 'Website Redesign',
    client: 'Acme Inc.'
  },
  {
    id: 2,
    title: 'API Integration',
    deadline: '2023-09-15',
    priority: 'medium',
    status: 'pending',
    project: 'Mobile App',
    client: 'TechCorp'
  },
  {
    id: 3,
    title: 'Documentation Update',
    deadline: '2023-09-08',
    priority: 'low',
    status: 'completed',
    project: 'Internal Tools',
    client: 'Internal'
  },
  {
    id: 4,
    title: 'Client Meeting Preparation',
    deadline: '2023-09-07',
    priority: 'high',
    status: 'in_progress',
    project: 'Client Onboarding',
    client: 'NewStart LLC'
  },
];

const getPriorityBadge = (priority: string) => {
  switch(priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'warning';
    case 'low':
    default:
      return 'secondary';
  }
};

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'pending':
    default:
      return 'outline';
  }
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['employeeTasks'],
    queryFn: async () => {
      try {
        // In a real implementation, this would call your backend API
        // const response = await fetch('/api/employee/tasks');
        // if (!response.ok) throw new Error('Failed to fetch tasks');
        // return await response.json();
        
        // For mock purposes, simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_TASKS;
      } catch (error) {
        console.error("Error fetching tasks, using fallback data:", error);
        return MOCK_TASKS;
      }
    }
  });
  
  const pendingTasks = tasks?.filter(task => task.status !== 'completed') || [];
  const completedTasks = tasks?.filter(task => task.status === 'completed') || [];
  const highPriorityTasks = tasks?.filter(task => task.priority === 'high') || [];
  
  // Calculate task completion percentage
  const taskCompletionPercentage = tasks && tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'Employee'}. Here's what's happening today.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks.length} completed
            </p>
            <div className="mt-2">
              <Progress value={taskCompletionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {highPriorityTasks.filter(t => t.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Work Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5h</div>
            <p className="text-xs text-muted-foreground">
              This week (75% of target)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 days</div>
            <p className="text-xs text-muted-foreground">
              Annual leave remaining
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks">
        <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Your Tasks
                <ListTodo className="ml-2 h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                View and manage your assigned tasks and projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTasks ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Loading tasks...</p>
                </div>
              ) : tasks && tasks.length > 0 ? (
                <div className="space-y-4">
                  {pendingTasks.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Pending Tasks</h3>
                      <div className="space-y-2">
                        {pendingTasks.map(task => (
                          <div key={task.id} className="border rounded-md p-3 bg-card">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{task.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {task.project} • {task.client}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={getPriorityBadge(task.priority)}>
                                  {task.priority}
                                </Badge>
                                <Badge variant={getStatusBadge(task.status)}>
                                  {task.status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div className="text-sm text-muted-foreground">
                                Due: {new Date(task.deadline).toLocaleDateString()}
                              </div>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {completedTasks.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Completed Tasks</h3>
                      <div className="space-y-2">
                        {completedTasks.slice(0, 2).map(task => (
                          <div key={task.id} className="border rounded-md p-3 bg-card flex justify-between items-center">
                            <div>
                              <div className="font-medium line-through opacity-70">{task.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {task.project} • {task.client}
                              </div>
                            </div>
                            <Badge variant="success">completed</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No tasks assigned to you yet.</p>
                  <Button variant="outline" className="mt-4">Check Available Tasks</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  Upcoming Deadlines
                  <Calendar className="ml-2 h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTasks
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .slice(0, 3)
                    .map(task => (
                      <div key={task.id} className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          new Date(task.deadline).getTime() < new Date().getTime()
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {new Date(task.deadline).getTime() < new Date().getTime()
                            ? <AlertCircle className="h-5 w-5" />
                            : <Clock className="h-5 w-5" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  }
                  
                  {pendingTasks.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">No upcoming deadlines.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  Task Statistics
                  <BarChart className="ml-2 h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Task Completion</span>
                      <span>{taskCompletionPercentage}%</span>
                    </div>
                    <Progress value={taskCompletionPercentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">By Priority</p>
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>High</span>
                          <span>{highPriorityTasks.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Medium</span>
                          <span>{tasks?.filter(t => t.priority === 'medium').length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Low</span>
                          <span>{tasks?.filter(t => t.priority === 'low').length || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">By Status</p>
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Pending</span>
                          <span>{tasks?.filter(t => t.status === 'pending').length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>In Progress</span>
                          <span>{tasks?.filter(t => t.status === 'in_progress').length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Completed</span>
                          <span>{completedTasks.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AttendanceTracker />
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    Weekly Work Summary
                    <CheckCircle2 className="ml-2 h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>
                    Your working hours for the current week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
                      <div key={day} className="flex justify-between items-center">
                        <span>{day}</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-sm font-medium">
                            {i < new Date().getDay() ? `${7 + i}:${['30', '45', '15', '00', '30'][i]}h` : '—'}
                          </span>
                          <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: i < new Date().getDay() ? `${75 + i * 5}%` : '0%' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    Attendance Records
                    <FileText className="ml-2 h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-3 border-b">
                      <div>
                        <div className="font-medium">August 2023</div>
                        <div className="text-sm text-muted-foreground">Monthly Summary</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <div>
                        <div className="font-medium">July 2023</div>
                        <div className="text-sm text-muted-foreground">Monthly Summary</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <div>
                        <div className="font-medium">June 2023</div>
                        <div className="text-sm text-muted-foreground">Monthly Summary</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="leave" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <EmployeeLeaveRequests />
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    Leave Balance
                    <Calendar className="ml-2 h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Annual Leave</span>
                        <span className="font-medium">18 / 24 days</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sick Leave</span>
                        <span className="font-medium">5 / 10 days</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Personal Leave</span>
                        <span className="font-medium">2 / 3 days</span>
                      </div>
                      <Progress value={66.67} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    Leave History
                    <FileText className="ml-2 h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Annual Leave</div>
                          <div className="text-sm text-muted-foreground">
                            Jul 10 - Jul 14, 2023 (5 days)
                          </div>
                        </div>
                        <Badge variant="success">Approved</Badge>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Sick Leave</div>
                          <div className="text-sm text-muted-foreground">
                            May 23 - May 24, 2023 (2 days)
                          </div>
                        </div>
                        <Badge variant="success">Approved</Badge>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Work From Home</div>
                          <div className="text-sm text-muted-foreground">
                            Apr 18, 2023 (1 day)
                          </div>
                        </div>
                        <Badge variant="success">Approved</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payroll" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <EmployeePayslipWidget />
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    Earnings Summary
                    <BarChart className="ml-2 h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Last 6 Months Earnings</h3>
                      <div className="h-48 w-full bg-muted/30 rounded-md flex items-end justify-between p-4">
                        {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => (
                          <div key={month} className="flex flex-col items-center gap-2">
                            <div 
                              className="w-10 bg-primary rounded-t-sm"
                              style={{ 
                                height: `${70 + Math.floor(Math.random() * 30)}px`,
                                opacity: 0.6 + (i * 0.1)
                              }}
                            />
                            <span className="text-xs">{month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Earnings Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Basic Salary</span>
                          <span className="font-medium">$5,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Performance Bonus</span>
                          <span className="font-medium">$320.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Transportation Allowance</span>
                          <span className="font-medium">$240.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Other Allowances</span>
                          <span className="font-medium">$240.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    Tax & Benefits
                    <Briefcase className="ml-2 h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">YTD Income Tax</p>
                        <p className="text-xl font-bold mt-1">$5,760.00</p>
                        <p className="text-xs text-muted-foreground mt-1">12% of gross income</p>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">YTD Benefits</p>
                        <p className="text-xl font-bold mt-1">$2,400.00</p>
                        <p className="text-xs text-muted-foreground mt-1">Health insurance, pension</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      View Tax Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
