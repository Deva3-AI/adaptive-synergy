
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Calendar as CalendarIcon, BriefcaseBusiness, UserCircle, FileCheck, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for job listings
const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    posted: "2023-09-01",
    applications: 28,
    status: "active",
    urgency: "high",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    posted: "2023-09-05",
    applications: 15,
    status: "active",
    urgency: "medium",
  },
  {
    id: 3,
    title: "Marketing Manager",
    department: "Marketing",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "2023-08-25",
    applications: 22,
    status: "active",
    urgency: "high",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    posted: "2023-09-10",
    applications: 10,
    status: "active",
    urgency: "medium",
  },
  {
    id: 5,
    title: "Content Writer",
    department: "Marketing",
    location: "Remote",
    type: "Contract",
    posted: "2023-08-20",
    applications: 35,
    status: "closed",
    urgency: "low",
  },
  {
    id: 6,
    title: "Junior Backend Developer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    posted: "2023-09-12",
    applications: 8,
    status: "active",
    urgency: "medium",
  },
  {
    id: 7,
    title: "Human Resources Specialist",
    department: "HR",
    location: "Chicago, IL",
    type: "Full-time",
    posted: "2023-08-15",
    applications: 18,
    status: "closed",
    urgency: "low",
  },
  {
    id: 8,
    title: "Financial Analyst",
    department: "Finance",
    location: "New York, NY",
    type: "Full-time",
    posted: "2023-09-08",
    applications: 12,
    status: "active",
    urgency: "medium",
  },
];

// Sample data for candidates
const candidates = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Senior Frontend Developer",
    source: "LinkedIn",
    appliedDate: "2023-09-10",
    stage: "interview",
    rating: 4.5,
    skills: ["React", "TypeScript", "NextJS"],
  },
  {
    id: 2,
    name: "Maria Garcia",
    position: "UX/UI Designer",
    source: "Referral",
    appliedDate: "2023-09-08",
    stage: "screening",
    rating: 4.0,
    skills: ["Figma", "UI Design", "Prototyping"],
  },
  {
    id: 3,
    name: "David Lee",
    position: "Senior Frontend Developer",
    source: "Indeed",
    appliedDate: "2023-09-05",
    stage: "offer",
    rating: 4.8,
    skills: ["React", "Vue", "CSS"],
  },
  {
    id: 4,
    name: "Sophia Williams",
    position: "Marketing Manager",
    source: "Company Website",
    appliedDate: "2023-09-02",
    stage: "interview",
    rating: 4.2,
    skills: ["Content Strategy", "Social Media", "Analytics"],
  },
  {
    id: 5,
    name: "James Smith",
    position: "DevOps Engineer",
    source: "LinkedIn",
    appliedDate: "2023-09-12",
    stage: "application",
    rating: 3.5,
    skills: ["AWS", "Docker", "CI/CD"],
  },
];

// Sample chart data for recruitment analytics
const recruitmentSourceData = [
  { name: "LinkedIn", value: 42 },
  { name: "Referrals", value: 28 },
  { name: "Indeed", value: 18 },
  { name: "Company Website", value: 12 },
];

const hiringTimelineData = [
  { name: "Engineering", days: 35 },
  { name: "Design", days: 28 },
  { name: "Marketing", days: 24 },
  { name: "HR", days: 18 },
  { name: "Finance", days: 22 },
];

// Badge variants by status and urgency
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "closed":
      return "secondary";
    case "draft":
      return "outline";
    default:
      return "default";
  }
};

const getUrgencyBadgeVariant = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "destructive";
    case "medium":
      return "warning";
    case "low":
      return "outline";
    default:
      return "default";
  }
};

const getStageBadgeVariant = (stage: string) => {
  switch (stage) {
    case "application":
      return "outline";
    case "screening":
      return "secondary";
    case "interview":
      return "warning";
    case "offer":
      return "success";
    case "rejected":
      return "destructive";
    default:
      return "default";
  }
};

const HrRecruitment = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
          <p className="text-muted-foreground">
            Manage job positions, candidates, and hiring processes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Job Posting
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>18%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviewed</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">12 scheduled this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">avg. days from posting to offer</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Hiring Timeline by Department</CardTitle>
            <CardDescription>Average number of days to hire</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              data={hiringTimelineData} 
              height={250}
              defaultType="bar"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Candidate Sources</CardTitle>
            <CardDescription>Where candidates are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              data={recruitmentSourceData} 
              height={250}
              defaultType="pie"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Job Postings</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search jobs..."
                  className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urgency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobListings
                    .filter(job => job.status === "active")
                    .map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>{new Date(job.posted).toLocaleDateString()}</TableCell>
                      <TableCell>{job.applications}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(job.status)}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getUrgencyBadgeVariant(job.urgency)}>
                          {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="closed">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urgency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobListings
                    .filter(job => job.status === "closed")
                    .map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>{new Date(job.posted).toLocaleDateString()}</TableCell>
                      <TableCell>{job.applications}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(job.status)}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getUrgencyBadgeVariant(job.urgency)}>
                          {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="all">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">All Job Postings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All job postings would be displayed here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidate Pipeline</CardTitle>
          <CardDescription>Track and manage applicants through the hiring process</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Candidates</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="screening">Screening</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
              <TabsTrigger value="offer">Offer</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Skills</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {candidate.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{candidate.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.position}</TableCell>
                      <TableCell>{candidate.source}</TableCell>
                      <TableCell>{new Date(candidate.appliedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStageBadgeVariant(candidate.stage)}>
                          {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={candidate.rating * 20} className="h-1.5 w-16" />
                          <span>{candidate.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            {["application", "screening", "interview", "offer"].map((stage) => (
              <TabsContent key={stage} value={stage}>
                <div className="rounded-md border p-8 text-center">
                  <h3 className="font-medium capitalize">{stage} Stage</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Candidates in the {stage} stage would be shown here
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HrRecruitment;
