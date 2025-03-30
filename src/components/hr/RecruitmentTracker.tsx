
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Plus,
  Star,
  StarHalf,
  Calendar,
  Briefcase,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  FileText,
  Send,
  Download
} from "lucide-react";
import { format } from 'date-fns';
import { JobOpening, Candidate } from '@/interfaces/hr';
import { getInitials } from '@/lib/utils';

const RecruitmentTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Fetch job openings
  const { data: jobOpenings } = useQuery({
    queryKey: ['job-openings'],
    queryFn: () => {
      // This would normally call an API
      return new Promise<JobOpening[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: "Senior Frontend Developer",
              department: "Engineering",
              location: "Remote",
              type: "full_time",
              description: "We're looking for a Senior Frontend Developer experienced in React, TypeScript, and modern web technologies to join our growing team.",
              requirements: [
                "5+ years of experience with React",
                "Strong TypeScript skills",
                "Experience with state management solutions",
                "Understanding of responsive design principles"
              ],
              responsibilities: [
                "Develop and maintain frontend applications",
                "Collaborate with UI/UX designers",
                "Optimize applications for performance",
                "Mentor junior developers"
              ],
              salary_range: {
                min: 100000,
                max: 140000
              },
              posted_date: new Date(Date.now() - 15 * 86400000).toISOString(), // 15 days ago
              status: "open",
              applicants_count: 18,
              source: "linkedin"
            },
            {
              id: 2,
              title: "Product Designer",
              department: "Design",
              location: "New York, NY",
              type: "full_time",
              description: "Join our design team to create beautiful, functional interfaces for our products and services.",
              requirements: [
                "3+ years of product design experience",
                "Proficiency in Figma and design tools",
                "Portfolio demonstrating UI/UX skills",
                "Experience working with development teams"
              ],
              responsibilities: [
                "Create wireframes and prototypes",
                "Conduct user research and testing",
                "Develop design systems",
                "Collaborate with product and engineering teams"
              ],
              salary_range: {
                min: 85000,
                max: 120000
              },
              posted_date: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
              status: "open",
              applicants_count: 12,
              source: "indeed"
            },
            {
              id: 3,
              title: "Marketing Manager",
              department: "Marketing",
              location: "Chicago, IL",
              type: "full_time",
              description: "Lead our marketing efforts to drive growth and brand awareness.",
              requirements: [
                "5+ years of marketing experience",
                "Experience with digital marketing",
                "Strong analytical skills",
                "Excellent communication"
              ],
              responsibilities: [
                "Develop marketing strategies",
                "Manage social media campaigns",
                "Analyze marketing performance",
                "Collaborate with sales team"
              ],
              salary_range: {
                min: 90000,
                max: 110000
              },
              posted_date: new Date(Date.now() - 30 * 86400000).toISOString(), // 30 days ago
              status: "closed",
              applicants_count: 24,
              source: "linkedin"
            },
            {
              id: 4,
              title: "DevOps Engineer",
              department: "Engineering",
              location: "Remote",
              type: "contract",
              description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines.",
              requirements: [
                "Experience with AWS or GCP",
                "Knowledge of Docker and Kubernetes",
                "Familiarity with CI/CD tools",
                "Understanding of security best practices"
              ],
              responsibilities: [
                "Maintain cloud infrastructure",
                "Automate deployment processes",
                "Monitor system performance",
                "Implement security measures"
              ],
              salary_range: {
                min: 100000,
                max: 130000
              },
              posted_date: new Date(Date.now() - 10 * 86400000).toISOString(), // 10 days ago
              status: "open",
              applicants_count: 8,
              source: "website"
            }
          ]);
        }, 500);
      });
    }
  });
  
  // Fetch candidates
  const { data: candidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => {
      // This would normally call an API
      return new Promise<Candidate[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "Sarah Johnson",
              email: "sarah.j@example.com",
              phone: "+1 555-123-4567",
              job_id: 1,
              job_title: "Senior Frontend Developer",
              resume_url: "/resumes/sarah-johnson.pdf",
              application_date: new Date(Date.now() - 12 * 86400000).toISOString(), // 12 days ago
              skills: ["React", "TypeScript", "Redux", "CSS/SASS", "Jest"],
              experience: 6,
              education: "BS Computer Science, Stanford University",
              status: "interview",
              match_score: 92,
              notes: "Great cultural fit, strong portfolio with similar projects to our needs.",
              strengths: ["Technical expertise", "Communication skills", "Problem-solving"],
              gaps: ["Limited backend experience"],
              source: "linkedin",
              last_contact: new Date(Date.now() - 2 * 86400000).toISOString() // 2 days ago
            },
            {
              id: 2,
              name: "Michael Chen",
              email: "michael.c@example.com",
              phone: "+1 555-987-6543",
              job_id: 1,
              job_title: "Senior Frontend Developer",
              resume_url: "/resumes/michael-chen.pdf",
              application_date: new Date(Date.now() - 10 * 86400000).toISOString(), // 10 days ago
              skills: ["React", "Angular", "JavaScript", "TypeScript", "HTML/CSS"],
              experience: 7,
              education: "MS Computer Science, MIT",
              status: "screening",
              match_score: 85,
              notes: "Strong technical background, primarily Angular experience but willing to adapt.",
              strengths: ["Technical depth", "Project leadership"],
              gaps: ["Limited React experience", "No TypeScript examples in portfolio"],
              source: "indeed",
              last_contact: new Date(Date.now() - 5 * 86400000).toISOString() // 5 days ago
            },
            {
              id: 3,
              name: "Emily Rodriguez",
              email: "emily.r@example.com",
              phone: "+1 555-456-7890",
              job_id: 2,
              job_title: "Product Designer",
              resume_url: "/resumes/emily-rodriguez.pdf",
              application_date: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
              skills: ["Figma", "UI/UX", "Wireframing", "User Research", "Design Systems"],
              experience: 4,
              education: "BFA Design, Rhode Island School of Design",
              status: "interview",
              match_score: 95,
              notes: "Outstanding portfolio, experience with similar products, great communication skills.",
              strengths: ["Visual design", "User-centered thinking", "Design systems"],
              gaps: ["Limited experience with analytics"],
              source: "referral",
              last_contact: new Date(Date.now() - 1 * 86400000).toISOString() // 1 day ago
            },
            {
              id: 4,
              name: "David Wilson",
              email: "david.w@example.com",
              phone: "+1 555-789-0123",
              job_id: 4,
              job_title: "DevOps Engineer",
              resume_url: "/resumes/david-wilson.pdf",
              application_date: new Date(Date.now() - 8 * 86400000).toISOString(), // 8 days ago
              skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Python"],
              experience: 5,
              education: "BS Computer Engineering, Georgia Tech",
              status: "offer",
              match_score: 90,
              notes: "Strong background in AWS, has implemented similar CI/CD pipelines to what we need.",
              strengths: ["Infrastructure as code", "Automation", "Security best practices"],
              gaps: ["Limited GCP experience"],
              source: "linkedin",
              last_contact: new Date(Date.now() - 1 * 86400000).toISOString() // 1 day ago
            },
            {
              id: 5,
              name: "Jennifer Lee",
              email: "jennifer.l@example.com",
              phone: "+1 555-234-5678",
              job_id: 2,
              job_title: "Product Designer",
              resume_url: "/resumes/jennifer-lee.pdf",
              application_date: new Date(Date.now() - 6 * 86400000).toISOString(), // 6 days ago
              skills: ["Figma", "Adobe XD", "UI Design", "Prototyping", "User Testing"],
              experience: 3,
              education: "MS Human-Computer Interaction, Carnegie Mellon",
              status: "new",
              match_score: 80,
              notes: "Good portfolio, strong academic background, limited professional experience.",
              strengths: ["User research", "Interaction design"],
              gaps: ["Limited professional experience"],
              source: "indeed",
              last_contact: null
            }
          ]);
        }, 500);
      });
    }
  });
  
  // Calculate recruitment statistics
  const stats = React.useMemo(() => {
    if (!jobOpenings || !candidates) {
      return {
        openPositions: 0,
        totalApplicants: 0,
        interviewStage: 0,
        offerStage: 0,
        averageMatchScore: 0,
        timeToHire: 0
      };
    }
    
    const openPositions = jobOpenings.filter(job => job.status === 'open').length;
    const totalApplicants = candidates.length;
    const interviewStage = candidates.filter(c => c.status === 'interview').length;
    const offerStage = candidates.filter(c => c.status === 'offer').length;
    const averageMatchScore = candidates.reduce((sum, c) => sum + c.match_score, 0) / candidates.length;
    
    // Calculate average time to hire in days (simulation)
    const timeToHire = 18; // In a real app, this would be calculated from actual data
    
    return {
      openPositions,
      totalApplicants,
      interviewStage,
      offerStage,
      averageMatchScore,
      timeToHire
    };
  }, [jobOpenings, candidates]);
  
  // Filter candidates based on search query and selected status
  const filteredCandidates = React.useMemo(() => {
    if (!candidates) return [];
    
    return candidates.filter(candidate => {
      // Check if the candidate matches the search query
      const matchesSearch = searchQuery === '' || 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Check if the candidate matches the selected status
      const matchesStatus = selectedStatus === 'all' || candidate.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, selectedStatus]);
  
  // Get color for candidate status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'secondary';
      case 'screening':
        return 'default';
      case 'interview':
        return 'warning';
      case 'offer':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'hired':
        return 'success';
      default:
        return 'secondary';
    }
  };
  
  // Get color for match score
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-amber-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };
  
  // Render stars for match score
  const renderMatchScore = (score: number) => {
    const fullStars = Math.floor(score / 20);
    const hasHalfStar = (score % 20) >= 10;
    
    return (
      <div className="flex items-center">
        <span className={`font-medium mr-2 ${getMatchScoreColor(score)}`}>{score}%</span>
        <div className="flex text-amber-400">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
          {hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openPositions}</div>
            <p className="text-xs text-muted-foreground">
              Actively recruiting
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">
              Total candidates
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Stage</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviewStage}</div>
            <p className="text-xs text-muted-foreground">
              Currently interviewing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offer Stage</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offerStage}</div>
            <p className="text-xs text-muted-foreground">
              Offers extended
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Match Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageMatchScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average candidate fit
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeToHire} days</div>
            <p className="text-xs text-muted-foreground">
              Average hiring time
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recruitment Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">New Applications</h3>
                  <Badge variant="outline">{candidates?.filter(c => c.status === 'new').length || 0}</Badge>
                </div>
                <Progress value={20} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">Screening</h3>
                  <Badge variant="outline">{candidates?.filter(c => c.status === 'screening').length || 0}</Badge>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">Interview</h3>
                  <Badge variant="outline">{candidates?.filter(c => c.status === 'interview').length || 0}</Badge>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">Offer</h3>
                  <Badge variant="outline">{candidates?.filter(c => c.status === 'offer').length || 0}</Badge>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">Hired</h3>
                  <Badge variant="outline">{candidates?.filter(c => c.status === 'hired').length || 0}</Badge>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Job Openings / Candidates Tabs */}
      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="candidates">
            <TabsList className="mb-4">
              <TabsTrigger value="openings">Job Openings</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="openings">
              <div className="flex justify-between mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-8"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>
              
              <div className="space-y-4">
                {jobOpenings?.map(job => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.department}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {job.applicants_count} applicants
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Posted {format(new Date(job.posted_date), 'MMM dd, yyyy')}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-row md:flex-col gap-2 self-start">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 bg-secondary/30 border-t flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            ${job.salary_range?.min.toLocaleString()} - ${job.salary_range?.max.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Source: </span>
                          <Badge variant="outline" className="ml-1">
                            {job.source?.charAt(0).toUpperCase() + job.source?.slice(1) || 'Website'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="candidates">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex flex-1 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search candidates..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedStatus === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedStatus('all')}
                    >
                      All
                    </Button>
                    <Button 
                      variant={selectedStatus === 'new' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedStatus('new')}
                    >
                      New
                    </Button>
                    <Button 
                      variant={selectedStatus === 'interview' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedStatus('interview')}
                    >
                      Interview
                    </Button>
                    <Button 
                      variant={selectedStatus === 'offer' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedStatus('offer')}
                    >
                      Offer
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                {filteredCandidates.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">No candidates found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  filteredCandidates.map(candidate => (
                    <Card key={candidate.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-9 flex gap-4">
                            <Avatar className="h-12 w-12 border">
                              <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1.5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <h3 className="font-semibold">{candidate.name}</h3>
                                  <Badge variant={getStatusColor(candidate.status)}>
                                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                  </Badge>
                                </div>
                                
                                {renderMatchScore(candidate.match_score)}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-1">
                                {candidate.job_title} • {candidate.experience} years experience
                              </p>
                              
                              <div className="flex flex-wrap gap-1 mb-2">
                                {candidate.skills.slice(0, 5).map((skill, i) => (
                                  <Badge key={i} variant="secondary" className="font-normal">
                                    {skill}
                                  </Badge>
                                ))}
                                {candidate.skills.length > 5 && (
                                  <Badge variant="secondary" className="font-normal">
                                    +{candidate.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  Applied {format(new Date(candidate.application_date), 'MMM dd, yyyy')}
                                </div>
                                
                                {candidate.source && (
                                  <div className="flex items-center">
                                    <ArrowRight className="h-3.5 w-3.5 mr-1" />
                                    Source: {candidate.source.charAt(0).toUpperCase() + candidate.source.slice(1)}
                                  </div>
                                )}
                                
                                {candidate.last_contact && (
                                  <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    Last contact: {format(new Date(candidate.last_contact), 'MMM dd, yyyy')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-3 flex flex-row md:flex-col gap-2 self-start">
                            <Button className="w-full" size="sm">
                              View Profile
                            </Button>
                            
                            <Button variant="outline" size="sm" className="w-full">
                              {candidate.status === 'new' && (
                                <>
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Schedule Screening
                                </>
                              )}
                              
                              {candidate.status === 'screening' && (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-1" />
                                  Move to Interview
                                </>
                              )}
                              
                              {candidate.status === 'interview' && (
                                <>
                                  <Send className="h-4 w-4 mr-1" />
                                  Extend Offer
                                </>
                              )}
                              
                              {candidate.status === 'offer' && (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Mark as Hired
                                </>
                              )}
                              
                              {(candidate.status === 'rejected' || candidate.status === 'hired') && (
                                <>
                                  <FileText className="h-4 w-4 mr-1" />
                                  View Details
                                </>
                              )}
                            </Button>
                            
                            {(candidate.status === 'new' || candidate.status === 'screening' || candidate.status === 'interview') && (
                              <Button variant="outline" size="sm" className="w-full">
                                <Download className="h-4 w-4 mr-1" />
                                Resume
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {candidate.notes && (
                          <div className="px-4 py-3 bg-secondary/30 border-t">
                            <p className="text-sm">
                              <span className="font-medium">Notes:</span> {candidate.notes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* AI-Generated Insights */}
      <Card className="border-blue-200 bg-blue-50/40 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Recruitment Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1.5">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Sourcing Analysis:</span> LinkedIn is outperforming other channels with 2.5x higher quality candidates. Consider increasing LinkedIn job advertising budget by 15%.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1.5">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Response Time:</span> Average candidate response time has increased to 3.5 days. Recommend implementing an automated follow-up system to reduce this to 1 day.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1.5">
                <Star className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Candidate Quality:</span> Referrals are yielding 30% higher match scores than job boards. Consider implementing a referral bonus program to encourage more employee referrals.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentTracker;
