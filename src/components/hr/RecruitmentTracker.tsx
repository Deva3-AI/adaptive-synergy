import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Calendar, Check, Clock, Download, Filter, Plus, Search, User } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { hrService } from '@/services/api';
import { format, parseISO, addDays } from 'date-fns';

const RecruitmentTracker = () => {
  const [activeTab, setActiveTab] = useState("openings");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: jobOpenings, isLoading: loadingJobs } = useQuery({
    queryKey: ['job-openings'],
    queryFn: () => hrService.getJobOpenings(),
  });
  
  const { data: candidates, isLoading: loadingCandidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => hrService.getCandidates(),
  });
  
  const filteredJobs = jobOpenings ? jobOpenings.filter((job) => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && job.status !== statusFilter) {
      return false;
    }
    return true;
  }) : [];
  
  const filteredCandidates = candidates ? candidates.filter((candidate) => {
    if (searchTerm && !candidate.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && candidate.status !== statusFilter) {
      return false;
    }
    return true;
  }) : [];
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">Open</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700">Closed</Badge>;
      case 'draft':
        return <Badge className="bg-amber-500">Draft</Badge>;
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'screening':
        return <Badge className="bg-purple-500">Screening</Badge>;
      case 'interview':
        return <Badge className="bg-indigo-500">Interview</Badge>;
      case 'offer':
        return <Badge className="bg-teal-500">Offer</Badge>;
      case 'hired':
        return <Badge className="bg-green-500">Hired</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="openings">Job Openings</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {activeTab === "openings" ? "Add Job" : activeTab === "candidates" ? "Add Candidate" : "Schedule Interview"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === "openings" ? "Add New Job Opening" : activeTab === "candidates" ? "Add New Candidate" : "Schedule Interview"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {activeTab === "openings" && (
                    <>
                      <div className="grid gap-2">
                        <label htmlFor="title">Job Title</label>
                        <Input id="title" placeholder="e.g. Senior Developer" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="department">Department</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="description">Job Description</label>
                        <textarea 
                          id="description" 
                          className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Enter job description..."
                        />
                      </div>
                    </>
                  )}
                  
                  {activeTab === "candidates" && (
                    <>
                      <div className="grid gap-2">
                        <label htmlFor="name">Full Name</label>
                        <Input id="name" placeholder="e.g. John Smith" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="email">Email</label>
                        <Input id="email" type="email" placeholder="e.g. john@example.com" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="position">Position Applied For</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="senior-developer">Senior Developer</SelectItem>
                            <SelectItem value="ux-designer">UX Designer</SelectItem>
                            <SelectItem value="marketing-specialist">Marketing Specialist</SelectItem>
                            <SelectItem value="sales-rep">Sales Representative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  {activeTab === "interviews" && (
                    <>
                      <div className="grid gap-2">
                        <label htmlFor="candidate">Candidate</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select candidate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="john-smith">John Smith</SelectItem>
                            <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                            <SelectItem value="michael-brown">Michael Brown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="interviewer">Interviewer</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alex-wong">Alex Wong (Engineering Lead)</SelectItem>
                            <SelectItem value="jessica-miller">Jessica Miller (Design Director)</SelectItem>
                            <SelectItem value="david-chen">David Chen (CTO)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="date">Date & Time</label>
                        <Input id="date" type="datetime-local" />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
          <div className="flex flex-1 gap-2">
            <InputWithIcon
              placeholder={`Search ${activeTab === "openings" ? "jobs" : activeTab === "candidates" ? "candidates" : "interviews"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
              icon={<Search className="h-4 w-4" />}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="max-w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {activeTab === "openings" ? (
                  <>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </>
                ) : activeTab === "candidates" ? (
                  <>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        <TabsContent value="openings" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Position</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Posted Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Applications</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingJobs ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center">Loading...</td>
                      </tr>
                    ) : filteredJobs && filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <tr key={job.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{job.title}</div>
                            <div className="text-xs text-muted-foreground">{job.location}</div>
                          </td>
                          <td className="px-4 py-3">{job.department}</td>
                          <td className="px-4 py-3">{format(parseISO(job.postedDate), 'MMM d, yyyy')}</td>
                          <td className="px-4 py-3">{job.applications}</td>
                          <td className="px-4 py-3">{getStatusBadge(job.status)}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center">No job openings found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobOpenings ? jobOpenings.filter(job => job.status === 'open').length : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {jobOpenings ? new Set(jobOpenings.map(job => job.department)).size : 0} departments
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobOpenings ? jobOpenings.reduce((total, job) => total + job.applications, 0) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time to Fill</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  24 days
                </div>
                <p className="text-xs text-muted-foreground">
                  Average time to fill a position
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Candidate</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Position</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Applied Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Source</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingCandidates ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center">Loading...</td>
                      </tr>
                    ) : filteredCandidates && filteredCandidates.length > 0 ? (
                      filteredCandidates.map((candidate) => (
                        <tr key={candidate.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{candidate.name}</div>
                                <div className="text-xs text-muted-foreground">{candidate.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{candidate.position}</td>
                          <td className="px-4 py-3">{format(parseISO(candidate.appliedDate), 'MMM d, yyyy')}</td>
                          <td className="px-4 py-3">{candidate.source}</td>
                          <td className="px-4 py-3">{getStatusBadge(candidate.status)}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">View Profile</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center">No candidates found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {candidates ? candidates.filter(c => c.status === 'new').length : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Interview Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {candidates ? candidates.filter(c => c.status === 'interview').length : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all positions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Offers Extended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {candidates ? candidates.filter(c => c.status === 'offer').length : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting candidate response
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    candidate: "Sarah Johnson",
                    position: "UX Designer",
                    interviewer: "Jessica Miller",
                    date: addDays(new Date(), 1),
                    type: "Technical Interview"
                  },
                  {
                    id: 2,
                    candidate: "Michael Brown",
                    position: "Senior Developer",
                    interviewer: "Alex Wong",
                    date: addDays(new Date(), 2),
                    type: "Final Interview"
                  },
                  {
                    id: 3,
                    candidate: "Emily Davis",
                    position: "Marketing Specialist",
                    interviewer: "Robert Chen",
                    date: addDays(new Date(), 3),
                    type: "Initial Screening"
                  }
                ].map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{interview.candidate}</h4>
                        <div className="text-sm text-muted-foreground">{interview.position} - {interview.type}</div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(interview.date, 'MMM d, yyyy')}
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          {format(interview.date, 'h:mm a')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button size="sm">Join</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interview Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                [Calendar View - Would display interview schedule]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruitmentTracker;
