import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Building,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  GraduationCap,
  Handshake,
  Home,
  Mail,
  MessageSquare,
  PenSquare,
  Phone,
  Plus,
  Search,
  Star,
  Users,
  DollarSign
} from "lucide-react";
import { format, addDays, subDays } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'remote';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary_range?: {
    min: number;
    max: number;
  };
  posted_date: string;
  status: 'open' | 'closed' | 'on_hold';
  applicants_count: number;
  source?: 'linkedin' | 'indeed' | 'website' | 'referral' | 'other';
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  job_id: number;
  job_title: string;
  resume_url: string;
  application_date: string;
  skills: string[];
  experience: number;
  education: string;
  status: "new" | "screening" | "interview" | "offer" | "rejected" | "hired";
  match_score: number;
  notes: string;
  strengths: string[];
  gaps: string[];
  source?: 'linkedin' | 'indeed' | 'website' | 'referral' | 'email' | 'other';
  last_contact?: string;
}

const RecruitmentTracker = () => {
  const [activeTab, setActiveTab] = useState('openings');
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Fetch job openings
  const { data: jobOpenings, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['job-openings'],
    queryFn: async () => {
      // This would normally call an API
      return new Promise<JobOpening[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: "Senior React Developer",
              department: "Engineering",
              location: "Remote",
              type: "full_time",
              description: "We're looking for an experienced React developer to join our team...",
              requirements: [
                "5+ years of experience with React",
                "Strong TypeScript skills",
                "Experience with state management (Redux, Context API)",
                "Knowledge of modern frontend build tools"
              ],
              responsibilities: [
                "Develop new features for our web application",
                "Maintain and improve existing codebase",
                "Collaborate with design and backend teams",
                "Mentor junior developers"
              ],
              salary_range: {
                min: 90000,
                max: 120000
              },
              posted_date: subDays(new Date(), 10).toISOString(),
              status: "open",
              applicants_count: 15,
              source: "linkedin"
            },
            {
              id: 2,
              title: "UX/UI Designer",
              department: "Design",
              location: "New York, NY",
              type: "full_time",
              description: "Looking for a talented UX/UI designer to create amazing user experiences...",
              requirements: [
                "3+ years of experience in UX/UI design",
                "Proficiency in Figma and Adobe Creative Suite",
                "Portfolio demonstrating strong visual design skills",
                "Experience with design systems"
              ],
              responsibilities: [
                "Create wireframes, prototypes, and high-fidelity designs",
                "Conduct user research and usability testing",
                "Collaborate with product managers and developers",
                "Maintain and expand our design system"
              ],
              salary_range: {
                min: 80000,
                max: 110000
              },
              posted_date: subDays(new Date(), 5).toISOString(),
              status: "open",
              applicants_count: 8,
              source: "indeed"
            },
            {
              id: 3,
              title: "Marketing Specialist",
              department: "Marketing",
              location: "Remote",
              type: "part_time",
              description: "We need a marketing specialist to help grow our digital presence...",
              requirements: [
                "2+ years of experience in digital marketing",
                "Experience with social media platforms",
                "Knowledge of SEO/SEM",
                "Analytical mindset"
              ],
              responsibilities: [
                "Manage social media accounts",
                "Create and implement marketing campaigns",
                "Analyze marketing metrics",
                "Collaborate with content team"
              ],
              salary_range: {
                min: 40000,
                max: 60000
              },
              posted_date: subDays(new Date(), 15).toISOString(),
              status: "on_hold",
              applicants_count: 12,
              source: "website"
            }
          ]);
        }, 1000);
      });
    }
  });
  
  // Fetch candidates
  const { data: candidates, isLoading: isLoadingCandidates } = useQuery({
    queryKey: ['candidates', activeJobId],
    queryFn: async () => {
      // This would normally call an API
      return new Promise<Candidate[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "John Smith",
              email: "john.smith@example.com",
              phone: "+1 212-555-1234",
              job_id: 1,
              job_title: "Senior React Developer",
              resume_url: "/resumes/john_smith_resume.pdf",
              application_date: subDays(new Date(), 8).toISOString(),
              skills: ["React", "TypeScript", "Redux", "Node.js", "GraphQL"],
              experience: 6,
              education: "BS in Computer Science, MIT",
              status: "interview",
              match_score: 92,
              notes: "Great candidate with strong React experience. Has worked on similar projects before.",
              strengths: ["Technical skills", "Project experience", "Communication"],
              gaps: ["No experience with our specific tech stack"],
              source: "linkedin",
              last_contact: subDays(new Date(), 2).toISOString()
            },
            {
              id: 2,
              name: "Jane Doe",
              email: "jane.doe@example.com",
              phone: "+1 415-555-6789",
              job_id: 1,
              job_title: "Senior React Developer",
              resume_url: "/resumes/jane_doe_resume.pdf",
              application_date: subDays(new Date(), 6).toISOString(),
              skills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
              experience: 4,
              education: "MS in Web Development, Stanford",
              status: "screening",
              match_score: 85,
              notes: "Good technical skills but less experience than required. Strong portfolio.",
              strengths: ["Portfolio quality", "Education"],
              gaps: ["Experience years", "No TypeScript"],
              source: "indeed",
              last_contact: subDays(new Date(), 4).toISOString()
            },
            {
              id: 3,
              name: "David Johnson",
              email: "david.johnson@example.com",
              phone: "+1 312-555-9876",
              job_id: 2,
              job_title: "UX/UI Designer",
              resume_url: "/resumes/david_johnson_resume.pdf",
              application_date: subDays(new Date(), 3).toISOString(),
              skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping"],
              experience: 5,
              education: "BFA in Graphic Design, RISD",
              status: "new",
              match_score: 88,
              notes: "Impressive portfolio with experience in similar industries.",
              strengths: ["Portfolio", "Industry experience"],
              gaps: ["No experience with our product type"],
              source: "referral",
              last_contact: null
            }
          ].filter(candidate => 
            activeJobId ? candidate.job_id === activeJobId : true
          ));
        }, 1000);
      });
    },
    enabled: true // We want this to run even if activeJobId is null (to show all candidates)
  });
  
  const filteredJobs = jobOpenings?.filter(job => 
    (filterStatus === 'all' || job.status === filterStatus) &&
    (searchText === '' || 
     job.title.toLowerCase().includes(searchText.toLowerCase()) ||
     job.department.toLowerCase().includes(searchText.toLowerCase()))
  );
  
  const filteredCandidates = candidates?.filter(candidate => 
    (filterStatus === 'all' || candidate.status === filterStatus) &&
    (searchText === '' || 
     candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
     candidate.skills.some(skill => skill.toLowerCase().includes(searchText.toLowerCase())))
  );
  
  const renderJobStatus = (status: string) => {
    switch(status) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800">Open</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      case 'on_hold':
        return <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const renderCandidateStatus = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case 'screening':
        return <Badge className="bg-purple-100 text-purple-800">Screening</Badge>;
      case 'interview':
        return <Badge className="bg-indigo-100 text-indigo-800">Interview</Badge>;
      case 'offer':
        return <Badge className="bg-green-100 text-green-800">Offer</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'hired':
        return <Badge className="bg-teal-100 text-teal-800">Hired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const renderSkeletonJobs = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  const renderSkeletonCandidates = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="ml-auto">
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Recruitment Tracker</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Job Opening
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="space-y-1">
                <CardTitle>Recruitment Overview</CardTitle>
                <CardDescription>
                  Track all job openings, candidates, and hiring metrics
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs or candidates..."
                    className="pl-8 w-full md:w-[260px]"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="new">New Candidates</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Positions</p>
                  <p className="text-2xl font-bold">
                    {isLoadingJobs ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      jobOpenings?.filter(job => job.status === 'open').length || 0
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Candidates</p>
                  <p className="text-2xl font-bold">
                    {isLoadingCandidates ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      candidates?.filter(c => !['rejected', 'hired'].includes(c.status)).length || 0
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interviews This Week</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Hiring Cost</p>
                  <p className="text-2xl font-bold">$4,200</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="openings" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:w-[400px]">
          <TabsTrigger value="openings">Job Openings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="openings" className="space-y-4">
          <div className="border rounded-md">
            <div className="p-4 bg-muted/50">
              <h3 className="font-medium">All Job Openings ({filteredJobs?.length || 0})</h3>
            </div>
            
            {isLoadingJobs ? (
              renderSkeletonJobs()
            ) : filteredJobs && filteredJobs.length > 0 ? (
              <div className="divide-y">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="p-4 hover:bg-muted/50">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="flex gap-1 items-center">
                            <Building className="h-3 w-3" />
                            {job.department}
                          </Badge>
                          <Badge variant="outline" className="flex gap-1 items-center">
                            <Home className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge variant="outline" className="flex gap-1 items-center">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(job.posted_date), 'MMM d, yyyy')}
                          </Badge>
                          {renderJobStatus(job.status)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="text-center px-3 py-1 bg-primary/5 rounded-md">
                          <p className="text-sm font-medium">{job.applicants_count}</p>
                          <p className="text-xs text-muted-foreground">Applicants</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveJobId(job.id === activeJobId ? null : job.id)}
                        >
                          {job.id === activeJobId ? 'Hide Details' : 'View Details'}
                        </Button>
                        <Button size="sm">Edit</Button>
                      </div>
                    </div>
                    
                    {job.id === activeJobId && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium mb-2">Job Description</h5>
                            <p className="text-sm text-muted-foreground">{job.description}</p>
                            
                            <h5 className="font-medium mt-4 mb-2">Requirements</h5>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                              {job.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                            
                            <h5 className="font-medium mt-4 mb-2">Responsibilities</h5>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                              {job.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Job Details</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Employment Type:</span>
                                <span className="font-medium">
                                  {job.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Location:</span>
                                <span className="font-medium">{job.location}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Department:</span>
                                <span className="font-medium">{job.department}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Posted Date:</span>
                                <span className="font-medium">{format(new Date(job.posted_date), 'MMMM d, yyyy')}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <span>{renderJobStatus(job.status)}</span>
                              </div>
                              {job.salary_range && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Salary Range:</span>
                                  <span className="font-medium">
                                    ${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Source:</span>
                                <span className="font-medium capitalize">{job.source}</span>
                              </div>
                            </div>
                            
                            <h5 className="font-medium mt-4 mb-2">Applicants by Stage</h5>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>New</span>
                                  <span>2</span>
                                </div>
                                <Progress value={20} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Screening</span>
                                  <span>5</span>
                                </div>
                                <Progress value={40} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Interview</span>
                                  <span>3</span>
                                </div>
                                <Progress value={30} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Offer</span>
                                  <span>1</span>
                                </div>
                                <Progress value={10} className="h-2" />
                              </div>
                            </div>
                            
                            <div className="mt-4 flex gap-2 justify-end">
                              <Button variant="outline" size="sm" className="gap-1">
                                <MessageSquare className="h-4 w-4" />
                                Share
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <PenSquare className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button size="sm">View Candidates</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No job openings found matching your criteria.</p>
                <Button variant="outline" className="mt-4">Clear Filters</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-4">
          <div className="border rounded-md">
            <div className="p-4 bg-muted/50">
              <h3 className="font-medium">All Candidates ({filteredCandidates?.length || 0})</h3>
            </div>
            
            {isLoadingCandidates ? (
              renderSkeletonCandidates()
            ) : filteredCandidates && filteredCandidates.length > 0 ? (
              <div className="divide-y">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-4 hover:bg-muted/50">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex gap-4 items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{candidate.name}</h4>
                          <p className="text-sm text-muted-foreground">{candidate.job_title}</p>
                        </div>
                      </div>
                      
                      <div className="ml-0 md:ml-auto flex flex-wrap gap-2 items-center">
                        <Badge className="flex gap-1 items-center">
                          <Star className="h-3 w-3" />
                          {candidate.match_score}% Match
                        </Badge>
                        {renderCandidateStatus(candidate.status)}
                        <Button variant="outline" size="sm" className="gap-1 ml-auto">
                          <Mail className="h-4 w-4" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileText className="h-4 w-4" />
                          Resume
                        </Button>
                        <Button size="sm" className="gap-1">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {candidate.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary/5">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex gap-2 items-center text-sm">
                          <BarChart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Experience:</span>
                          <span>{candidate.experience} years</span>
                        </div>
                        <div className="flex gap-2 items-center text-sm">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Education:</span>
                          <span>{candidate.education}</span>
                        </div>
                        <div className="flex gap-2 items-center text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Applied:</span>
                          <span>{format(new Date(candidate.application_date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      
                      {candidate.last_contact && (
                        <div className="mt-2 text-sm flex gap-2 items-center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Last Contact:</span>
                          <span>{format(new Date(candidate.last_contact), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      
                      {candidate.notes && (
                        <div className="mt-3 text-sm text-muted-foreground border-l-2 border-primary/30 pl-3">
                          {candidate.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No candidates found matching your criteria.</p>
                <Button variant="outline" className="mt-4">Clear Filters</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruitmentTracker;
