
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronDown, Download, FileText, Filter, GraduationCap, MessagesSquare, Plus, RefreshCw, Search, Send, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

const RecruitmentTracker = () => {
  const [activeTab, setActiveTab] = useState<string>("positions");
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Fetch roles for position titles
  const { data: roles } = useQuery({
    queryKey: ['roles-recruitment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('role_name');
      
      if (error) throw error;
      return data;
    }
  });

  // Mock data for open positions - in a real implementation, this would come from the database
  const openPositions = [
    {
      id: 1,
      title: 'UI/UX Designer',
      department: 'Design',
      status: 'active',
      applications: 8,
      created_at: '2024-03-01',
      deadline: '2024-04-15',
      priority: 'high',
      description: 'We are looking for a talented UI/UX Designer to create amazing user experiences.'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      department: 'Engineering',
      status: 'active',
      applications: 12,
      created_at: '2024-03-05',
      deadline: '2024-04-20',
      priority: 'high',
      description: 'Experienced Full Stack Developer with React and Node.js skills.'
    },
    {
      id: 3,
      title: 'Content Writer',
      department: 'Marketing',
      status: 'active',
      applications: 5,
      created_at: '2024-03-10',
      deadline: '2024-04-10',
      priority: 'medium',
      description: 'Content Writer with SEO experience for our marketing team.'
    }
  ];
  
  // Mock data for applications - in a real implementation, this would come from the database
  const applications = [
    {
      id: 1,
      candidate_name: 'Jane Smith',
      position: 'UI/UX Designer',
      status: 'interview',
      applied_date: '2024-03-03',
      email: 'jane.smith@example.com',
      resume_url: '#',
      experience: '4 years',
      skills_match: 85,
      interview_date: '2024-03-20',
      notes: 'Great portfolio. Scheduled for second interview.'
    },
    {
      id: 2,
      candidate_name: 'Michael Brown',
      position: 'Full Stack Developer',
      status: 'screening',
      applied_date: '2024-03-07',
      email: 'michael.brown@example.com',
      resume_url: '#',
      experience: '6 years',
      skills_match: 90,
      interview_date: null,
      notes: 'Strong technical background. Pending technical assessment.'
    },
    {
      id: 3,
      candidate_name: 'Emily Chen',
      position: 'Content Writer',
      status: 'applied',
      applied_date: '2024-03-12',
      email: 'emily.chen@example.com',
      resume_url: '#',
      experience: '3 years',
      skills_match: 75,
      interview_date: null,
      notes: 'Good writing samples. Need to schedule initial screening.'
    },
    {
      id: 4,
      candidate_name: 'David Wilson',
      position: 'UI/UX Designer',
      status: 'offer',
      applied_date: '2024-02-25',
      email: 'david.wilson@example.com',
      resume_url: '#',
      experience: '5 years',
      skills_match: 95,
      interview_date: '2024-03-15',
      notes: 'Excellent candidate. Offer letter being prepared.'
    },
    {
      id: 5,
      candidate_name: 'Sarah Johnson',
      position: 'Full Stack Developer',
      status: 'rejected',
      applied_date: '2024-03-02',
      email: 'sarah.johnson@example.com',
      resume_url: '#',
      experience: '2 years',
      skills_match: 60,
      interview_date: '2024-03-10',
      notes: 'Not enough experience for senior position.'
    }
  ];
  
  // Filter positions based on search and filters
  const filteredPositions = openPositions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPositionFilter = positionFilter === 'all' || position.title === positionFilter;
    const matchesStatusFilter = statusFilter === 'all' || position.status === statusFilter;
    
    return matchesSearch && matchesPositionFilter && matchesStatusFilter;
  });
  
  // Filter applications based on search and filters
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPositionFilter = positionFilter === 'all' || app.position === positionFilter;
    const matchesStatusFilter = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesPositionFilter && matchesStatusFilter;
  });
  
  // Handle application status change
  const handleStatusChange = (applicationId: number, newStatus: string) => {
    toast.success(`Application status updated to ${newStatus}`);
  };
  
  // Handle scheduling interview
  const handleScheduleInterview = (applicationId: number) => {
    toast.success("Interview scheduled successfully");
  };
  
  // Handle adding a new position
  const handleAddPosition = () => {
    toast.success("New position added successfully");
  };
  
  // Get badge color based on priority
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">{priority}</Badge>;
      case 'medium':
        return <Badge variant="warning">{priority}</Badge>;
      case 'low':
        return <Badge variant="outline">{priority}</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  // Get badge color based on application status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge variant="outline">Applied</Badge>;
      case 'screening':
        return <Badge variant="secondary">Screening</Badge>;
      case 'interview':
        return <Badge variant="warning">Interview</Badge>;
      case 'offer':
        return <Badge variant="success">Offer</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Calculate application progress
  const getApplicationProgress = (status: string) => {
    switch (status) {
      case 'applied':
        return 20;
      case 'screening':
        return 40;
      case 'interview':
        return 60;
      case 'offer':
        return 80;
      case 'hired':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 0;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle>Recruitment Dashboard</CardTitle>
            <Button className="mt-2 md:mt-0" onClick={handleAddPosition}>
              <Plus className="mr-2 h-4 w-4" />
              Add Position
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="positions" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="positions">Open Positions</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 my-4">
              <div className="grid w-full md:w-auto gap-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="search"
                    placeholder={activeTab === "positions" ? "Search positions..." : "Search candidates..."}
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-end gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="positionFilter">Position</Label>
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Positions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      {openPositions.map(position => (
                        <SelectItem key={position.id} value={position.title}>
                          {position.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="statusFilter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {activeTab === "positions" ? (
                        <>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="screening">Screening</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => {
                  setSearchTerm('');
                  setPositionFilter('all');
                  setStatusFilter('all');
                }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="positions" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPositions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No positions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPositions.map((position) => (
                        <TableRow key={position.id}>
                          <TableCell className="font-medium">{position.title}</TableCell>
                          <TableCell>{position.department}</TableCell>
                          <TableCell>{format(new Date(position.created_at), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{format(new Date(position.deadline), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{position.applications}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getPriorityBadge(position.priority)}</TableCell>
                          <TableCell>
                            <Badge variant={position.status === 'active' ? 'success' : 'secondary'}>
                              {position.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Skills Match</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="font-medium">{application.candidate_name}</div>
                            <div className="text-sm text-muted-foreground">{application.email}</div>
                          </TableCell>
                          <TableCell>{application.position}</TableCell>
                          <TableCell>{format(new Date(application.applied_date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={application.skills_match} className="h-2 w-[60px]" />
                              <span className="text-sm">{application.skills_match}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell>
                            <Progress 
                              value={getApplicationProgress(application.status)} 
                              className="h-2"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Status <ChevronDown className="ml-1 h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-0" align="end">
                                  <div className="grid gap-1 p-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="justify-start font-normal"
                                      onClick={() => handleStatusChange(application.id, 'screening')}
                                    >
                                      <span className="mr-2">📋</span> Screening
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="justify-start font-normal"
                                      onClick={() => handleStatusChange(application.id, 'interview')}
                                    >
                                      <span className="mr-2">🗣️</span> Interview
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="justify-start font-normal"
                                      onClick={() => handleStatusChange(application.id, 'offer')}
                                    >
                                      <span className="mr-2">📝</span> Offer
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="justify-start font-normal"
                                      onClick={() => handleStatusChange(application.id, 'hired')}
                                    >
                                      <span className="mr-2">✅</span> Hired
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="justify-start font-normal text-destructive"
                                      onClick={() => handleStatusChange(application.id, 'rejected')}
                                    >
                                      <span className="mr-2">❌</span> Reject
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MessagesSquare className="h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80" align="end">
                                  <div className="grid gap-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Candidate Notes</h4>
                                      <Textarea 
                                        placeholder="Add notes about this candidate"
                                        className="min-h-[100px]"
                                        defaultValue={application.notes}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Schedule Interview</h4>
                                      <Calendar 
                                        mode="single"
                                        className="border rounded-md p-3"
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          className="w-full"
                                          onClick={() => handleScheduleInterview(application.id)}
                                        >
                                          Schedule
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <Button variant="outline" size="sm">
                                        <FileText className="mr-1 h-3 w-3" />
                                        Resume
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Send className="mr-1 h-3 w-3" />
                                        Email
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {openPositions.length} open positions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'applied').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Needs action
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interview Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'interview').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled for interviews
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offer Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'offer').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for hire
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Hiring Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm">Applied</div>
                <span className="text-muted-foreground text-sm">
                  {applications.filter(app => app.status === 'applied').length}
                </span>
              </div>
              <Progress 
                value={(applications.filter(app => app.status === 'applied').length / applications.length) * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm">Screening</div>
                <span className="text-muted-foreground text-sm">
                  {applications.filter(app => app.status === 'screening').length}
                </span>
              </div>
              <Progress 
                value={(applications.filter(app => app.status === 'screening').length / applications.length) * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm">Interview</div>
                <span className="text-muted-foreground text-sm">
                  {applications.filter(app => app.status === 'interview').length}
                </span>
              </div>
              <Progress 
                value={(applications.filter(app => app.status === 'interview').length / applications.length) * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm">Offer</div>
                <span className="text-muted-foreground text-sm">
                  {applications.filter(app => app.status === 'offer').length}
                </span>
              </div>
              <Progress 
                value={(applications.filter(app => app.status === 'offer').length / applications.length) * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm">Rejected</div>
                <span className="text-muted-foreground text-sm">
                  {applications.filter(app => app.status === 'rejected').length}
                </span>
              </div>
              <Progress 
                value={(applications.filter(app => app.status === 'rejected').length / applications.length) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentTracker;
