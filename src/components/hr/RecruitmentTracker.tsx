
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Building, Users, Calendar, Check, X, Mail, Phone, Filter, Download, Plus } from "lucide-react";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

// Mock data for the job positions and candidates
// In a real implementation, you would fetch this from your API
const mockPositions = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    openDate: "2024-03-15",
    status: "open",
    applicantsCount: 8,
    shortlistedCount: 3,
    interviewedCount: 2
  },
  {
    id: 2,
    title: "Graphic Designer",
    department: "Design",
    openDate: "2024-03-20",
    status: "open",
    applicantsCount: 12,
    shortlistedCount: 5,
    interviewedCount: 3
  },
  {
    id: 3,
    title: "Marketing Specialist",
    department: "Marketing",
    openDate: "2024-03-10",
    status: "on-hold",
    applicantsCount: 6,
    shortlistedCount: 2,
    interviewedCount: 0
  }
];

const mockCandidates = [
  {
    id: 1,
    name: "John Smith",
    position: "Senior Frontend Developer",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "shortlisted",
    source: "LinkedIn",
    appliedDate: "2024-03-18",
    avatarUrl: ""
  },
  {
    id: 2,
    name: "Emily Johnson",
    position: "Graphic Designer",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 234-5678",
    status: "interviewed",
    source: "Indeed",
    appliedDate: "2024-03-22",
    avatarUrl: ""
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "Senior Frontend Developer",
    email: "michael.brown@example.com",
    phone: "+1 (555) 345-6789",
    status: "applied",
    source: "Referral",
    appliedDate: "2024-03-25",
    avatarUrl: ""
  },
  {
    id: 4,
    name: "Sarah Davis",
    position: "Graphic Designer",
    email: "sarah.davis@example.com",
    phone: "+1 (555) 456-7890",
    status: "offer-sent",
    source: "Company Website",
    appliedDate: "2024-03-21",
    avatarUrl: ""
  },
  {
    id: 5,
    name: "James Wilson",
    position: "Marketing Specialist",
    email: "james.wilson@example.com",
    phone: "+1 (555) 567-8901",
    status: "rejected",
    source: "LinkedIn",
    appliedDate: "2024-03-12",
    avatarUrl: ""
  }
];

const RecruitmentTracker = () => {
  const [activeTab, setActiveTab] = useState<string>("positions");
  const [jobDialogOpen, setJobDialogOpen] = useState<boolean>(false);
  const [candidateDialogOpen, setCandidateDialogOpen] = useState<boolean>(false);
  
  // Get all job positions
  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: ['job-positions'],
    queryFn: async () => {
      // Since we don't have a job_positions table yet, using mock data
      return mockPositions;
      
      // When you create a job_positions table, use this:
      /*
      const { data, error } = await supabase
        .from('job_positions')
        .select('*')
        .order('open_date', { ascending: false });
      
      if (error) throw error;
      return data;
      */
    }
  });
  
  // Get all candidates
  const { data: candidates, isLoading: candidatesLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      // Since we don't have a candidates table yet, using mock data
      return mockCandidates;
      
      // When you create a candidates table, use this:
      /*
      const { data, error } = await supabase
        .from('candidates')
        .select('*, job_positions(title)')
        .order('applied_date', { ascending: false });
      
      if (error) throw error;
      return data;
      */
    }
  });

  // Get all roles for department selection
  const { data: roles } = useQuery({
    queryKey: ['roles-for-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('role_name');
      
      if (error) throw error;
      return data;
    }
  });
  
  // Form for adding new job position
  const jobForm = useForm({
    defaultValues: {
      title: "",
      department: "",
      description: "",
      requirements: "",
      location: "",
      salary: ""
    }
  });
  
  // Form for adding new candidate
  const candidateForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      source: "",
      resume: null
    }
  });
  
  const handleAddJobPosition = (data: any) => {
    console.log("Adding job position:", data);
    toast.success("Job position added successfully");
    setJobDialogOpen(false);
    jobForm.reset();
  };
  
  const handleAddCandidate = (data: any) => {
    console.log("Adding candidate:", data);
    toast.success("Candidate added successfully");
    setCandidateDialogOpen(false);
    candidateForm.reset();
  };
  
  const handleUpdateCandidateStatus = (candidateId: number, newStatus: string) => {
    console.log(`Updating candidate ${candidateId} status to ${newStatus}`);
    toast.success(`Candidate status updated to ${newStatus}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "default";
      case "shortlisted":
        return "success";
      case "interviewed":
        return "info";
      case "offer-sent":
        return "warning";
      case "hired":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };
  
  if (positionsLoading || candidatesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="positions" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="positions">Job Positions</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>
          
          {activeTab === "positions" ? (
            <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Job Position
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Job Position</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new job opening.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...jobForm}>
                  <form onSubmit={jobForm.handleSubmit(handleAddJobPosition)} className="space-y-4">
                    <FormField
                      control={jobForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Senior Frontend Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={jobForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles?.map(role => (
                                <SelectItem key={role.role_id} value={role.role_name}>
                                  {role.role_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={jobForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the job description..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={jobForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Remote, Office, Hybrid" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={jobForm.control}
                        name="salary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salary Range</FormLabel>
                            <FormControl>
                              <Input placeholder="$50,000 - $70,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Create Job Position</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={candidateDialogOpen} onOpenChange={setCandidateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Candidate</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new candidate to your recruitment pipeline.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...candidateForm}>
                  <form onSubmit={candidateForm.handleSubmit(handleAddCandidate)} className="space-y-4">
                    <FormField
                      control={candidateForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={candidateForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.smith@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={candidateForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={candidateForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {positions.map(position => (
                                <SelectItem key={position.id} value={position.title}>
                                  {position.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={candidateForm.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Where did they apply from?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                              <SelectItem value="Indeed">Indeed</SelectItem>
                              <SelectItem value="Referral">Referral</SelectItem>
                              <SelectItem value="Company Website">Company Website</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={candidateForm.control}
                      name="resume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume</FormLabel>
                          <FormControl>
                            <Input type="file" onChange={(e) => {
                              const file = e.target.files ? e.target.files[0] : null;
                              field.onChange(file);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Add Candidate</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <TabsContent value="positions">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Open Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pipeline</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell className="font-medium">{position.title}</TableCell>
                        <TableCell>{position.department}</TableCell>
                        <TableCell>{format(new Date(position.openDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant={position.status === "open" ? "success" : "secondary"}>
                            {position.status === "open" ? "Open" : "On Hold"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Applications ({position.applicantsCount})</span>
                              <span>Hired (0)</span>
                            </div>
                            <Progress value={(position.shortlistedCount / position.applicantsCount) * 100} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Shortlisted: {position.shortlistedCount}</span>
                              <span>Interviewed: {position.interviewedCount}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="candidates">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email Selected
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Interview
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{candidate.name}</div>
                              <div className="text-sm text-muted-foreground">{candidate.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.position}</TableCell>
                        <TableCell>{format(new Date(candidate.appliedDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>{candidate.source}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(candidate.status)}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1).replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleUpdateCandidateStatus(candidate.id, "shortlisted")}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleUpdateCandidateStatus(candidate.id, "rejected")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruitmentTracker;
