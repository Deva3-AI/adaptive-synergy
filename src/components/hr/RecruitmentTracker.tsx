import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Building, Upload, Users, Search, UserPlus, Filter, FileText, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { hrService, JobPosting, JobCandidate } from '@/services/api/hrService';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

const RecruitmentTracker = () => {
  const [selectedPosting, setSelectedPosting] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { data: jobPostings, isLoading: loadingPostings } = useQuery({
    queryKey: ['hr-job-postings'],
    queryFn: () => hrService.getJobPostings(),
  });
  
  const { data: candidates, isLoading: loadingCandidates } = useQuery({
    queryKey: ['hr-candidates', selectedPosting],
    queryFn: () => hrService.getJobCandidates(selectedPosting || undefined),
    enabled: !!selectedPosting,
  });
  
  const filteredCandidates = candidates ? candidates.filter((candidate: JobCandidate) => {
    if (statusFilter !== 'all' && candidate.status !== statusFilter) {
      return false;
    }
    
    if (searchTerm && 
        !candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !candidate.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }) : [];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">Open</Badge>;
      case 'closed':
        return <Badge className="bg-red-500">Closed</Badge>;
      case 'on_hold':
        return <Badge className="bg-amber-500">On Hold</Badge>;
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'screening':
        return <Badge className="bg-purple-500">Screening</Badge>;
      case 'interview':
        return <Badge className="bg-indigo-500">Interview</Badge>;
      case 'technical':
        return <Badge className="bg-cyan-500">Technical</Badge>;
      case 'offer':
        return <Badge className="bg-emerald-500">Offer</Badge>;
      case 'hired':
        return <Badge className="bg-teal-500">Hired</Badge>;
      case 'rejected':
        return <Badge className="bg-slate-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const renderCandidateStatus = (status: string) => {
    const statuses = ['new', 'screening', 'interview', 'technical', 'offer', 'hired', 'rejected'];
    const currentIndex = statuses.indexOf(status);
    
    if (status === 'rejected') {
      return (
        <div className="flex items-center">
          <XCircle className="h-4 w-4 text-red-500 mr-2" />
          <span>Rejected</span>
        </div>
      );
    }
    
    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span>New</span>
          <span>Screening</span>
          <span>Interview</span>
          <span>Technical</span>
          <span>Offer</span>
          <span>Hired</span>
        </div>
        <Progress value={(currentIndex / (statuses.length - 2)) * 100} className="h-1.5" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="positions">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="positions">Open Positions</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Briefcase className="h-4 w-4 mr-2" />
                  New Position
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Job Posting</DialogTitle>
                  <DialogDescription>
                    Enter details for the new position
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" placeholder="e.g., Senior Frontend Developer" />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea id="description" rows={4} placeholder="Enter detailed job description" />
                  </div>
                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea id="requirements" rows={3} placeholder="List key requirements separated by new lines" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="lead">Team Lead</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="e.g., Remote, New York" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Create Position</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <TabsContent value="positions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobPostings?.filter((job: JobPosting) => job.status === 'open').length || 8}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across 5 departments
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {candidates?.length || 42}
                </div>
                <p className="text-xs text-muted-foreground">
                  Past 30 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  18.5 days
                </div>
                <p className="text-xs text-muted-foreground">
                  Average for last 5 hires
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-background rounded-md border overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Job Postings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium">Position</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Applications</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Posted</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Platform</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingPostings ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 text-center">Loading...</td>
                    </tr>
                  ) : jobPostings && jobPostings.length > 0 ? (
                    jobPostings.map((job: JobPosting) => (
                      <tr key={job.posting_id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{job.title}</td>
                        <td className="px-4 py-3">{job.department}</td>
                        <td className="px-4 py-3">{getStatusBadge(job.status)}</td>
                        <td className="px-4 py-3">{job.applications_count}</td>
                        <td className="px-4 py-3 text-sm">
                          {format(new Date(job.created_at), 'MMM d, yyyy')}
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="capitalize">
                            {job.platform}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedPosting(job.posting_id)}
                          >
                            View Candidates
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 text-center">No job postings found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-2">
              <InputWithIcon
                placeholder="Search job postings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs mb-4"
                icon={<Search className="h-4 w-4" />}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="max-w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              {selectedPosting && (
                <Button variant="outline" size="sm" onClick={() => setSelectedPosting(null)}>
                  Clear Position Filter
                </Button>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Candidate</DialogTitle>
                  <DialogDescription>
                    Enter candidate details or upload resume
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobPostings && jobPostings.map((job: JobPosting) => (
                          <SelectItem key={job.posting_id} value={job.posting_id.toString()}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="resume">Resume</Label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="flex text-sm">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-primary"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1 text-muted-foreground">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOC, DOCX up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Add Candidate</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {loadingCandidates ? (
              <div className="text-center py-4">Loading candidates...</div>
            ) : filteredCandidates && filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate: JobCandidate) => (
                <Card key={candidate.candidate_id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm">
                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{candidate.position_applied}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Applied {formatDistanceToNow(new Date(candidate.application_date), { addSuffix: true })}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Source: {candidate.source}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="font-normal">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 4 && (
                            <Badge variant="outline" className="font-normal">
                              +{candidate.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                        
                        {candidate.resume_url && (
                          <div className="mt-4">
                            <a 
                              href={candidate.resume_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-primary"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Resume
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-3/4 space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Application Status</p>
                          {renderCandidateStatus(candidate.status)}
                        </div>
                        
                        {candidate.match_score !== undefined && (
                          <div>
                            <p className="text-sm font-medium mb-2">Match Score</p>
                            <div className="flex items-center">
                              <Progress value={candidate.match_score} className="h-2 flex-1 mr-3" />
                              <span className="text-sm font-medium">{candidate.match_score}%</span>
                            </div>
                          </div>
                        )}
                        
                        {candidate.interview_notes && candidate.interview_notes.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Interview Notes</p>
                            <div className="text-sm bg-muted p-3 rounded-md max-h-[100px] overflow-y-auto">
                              {candidate.interview_notes.slice(-1)[0]}
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4 border-t flex justify-between items-center">
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Add Notes
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Interview Notes</DialogTitle>
                                  <DialogDescription>
                                    Add notes from your interview with {candidate.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Textarea 
                                    placeholder="Enter your interview notes here..."
                                    rows={6}
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <Button>Save Notes</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          <div className="flex gap-2">
                            <Select>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="screening">Move to Screening</SelectItem>
                                <SelectItem value="interview">Schedule Interview</SelectItem>
                                <SelectItem value="technical">Technical Assessment</SelectItem>
                                <SelectItem value="offer">Send Offer</SelectItem>
                                <SelectItem value="hired">Mark as Hired</SelectItem>
                                <SelectItem value="rejected">Reject Candidate</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-4">
                {selectedPosting ? 
                  "No candidates found for this position. Try a different filter or add candidates." :
                  "Select a position from the Open Positions tab to view candidates."}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5 days</div>
                <p className="text-xs text-muted-foreground">Industry avg: 25 days</p>
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-600/20">
                  26% faster
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Application-to-Hire Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12:1</div>
                <p className="text-xs text-muted-foreground">Industry avg: 18:1</p>
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-600/20">
                  Better efficiency
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cost per Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,850</div>
                <p className="text-xs text-muted-foreground">Industry avg: $4,200</p>
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-600/20">
                  32% savings
                </Badge>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Pipeline</CardTitle>
              <CardDescription>
                Application flow across all positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                [Recruitment Funnel Chart - Would display conversion rates]
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Sources</CardTitle>
                <CardDescription>
                  Where our applicants come from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Pie Chart - Would display source breakdown]
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hiring Efficiency by Department</CardTitle>
                <CardDescription>
                  Time-to-hire metrics by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Bar Chart - Would display department comparison]
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruitmentTracker;
