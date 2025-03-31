
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hrService } from '@/services/api';
import { Candidate } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Plus, ArrowUpDown, UserPlus, Download, User, FileText, Building, MailOpen } from 'lucide-react';

// Helper function to convert string status to enum type
const normalizeStatus = (status: string): "new" | "rejected" | "screening" | "interview" | "offer" | "hired" => {
  const validStatuses = ["new", "rejected", "screening", "interview", "offer", "hired"];
  return validStatuses.includes(status.toLowerCase()) 
    ? status.toLowerCase() as "new" | "rejected" | "screening" | "interview" | "offer" | "hired"
    : "new";
};

const RecruitmentTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);

  // Fetch candidates
  const { data: candidatesData, isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const data = await hrService.getCandidates();
      
      // Normalize the data to match the Candidate type
      return data.map((candidate: any) => ({
        ...candidate,
        status: normalizeStatus(candidate.status)
      })) as Candidate[];
    }
  });

  // Fetch open positions
  const { data: positions, isLoading: isLoadingPositions } = useQuery({
    queryKey: ['openPositions'],
    queryFn: () => hrService.getOpenPositions()
  });

  // Filter candidates based on search term and filters
  const filteredCandidates = candidatesData?.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? candidate.status === statusFilter : true;
    const matchesSource = sourceFilter ? candidate.source === sourceFilter : true;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      case 'screening':
        return <Badge variant="outline">Screening</Badge>;
      case 'interview':
        return <Badge variant="primary">Interview</Badge>;
      case 'offer':
        return <Badge variant="warning">Offer</Badge>;
      case 'hired':
        return <Badge variant="success">Hired</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const countCandidatesByStatus = (status: string) => {
    return candidatesData?.filter(candidate => candidate.status === status).length || 0;
  };

  const sources = candidatesData ? Array.from(new Set(candidatesData.map(c => c.source))) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recruitment Tracker</h1>
          <p className="text-muted-foreground">Manage candidates and job openings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Position
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidatesData?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {countCandidatesByStatus('screening') + countCandidatesByStatus('interview')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countCandidatesByStatus('offer')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStatusFilter(null)} className={!statusFilter ? "bg-muted" : ""}>
              All
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStatusFilter('new')} className={statusFilter === 'new' ? "bg-muted" : ""}>
              New
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStatusFilter('screening')} className={statusFilter === 'screening' ? "bg-muted" : ""}>
              Screening
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStatusFilter('interview')} className={statusFilter === 'interview' ? "bg-muted" : ""}>
              Interview
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStatusFilter('offer')} className={statusFilter === 'offer' ? "bg-muted" : ""}>
              Offer
            </Button>
          </div>
          <div className="inline-flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="candidates">
        <TabsList className="mb-4">
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidates">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[60vh] w-full">
                  <div className="p-4 flex flex-col gap-3">
                    {filteredCandidates && filteredCandidates.length > 0 ? (
                      filteredCandidates.map((candidate) => (
                        <div key={candidate.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="md:w-1/4">
                            <div className="flex gap-3 items-center">
                              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">{candidate.name}</h3>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:w-1/4">
                            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <Building className="h-3 w-3" /> Position
                            </div>
                            <p className="font-medium">{candidate.job_title}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{candidate.source}</Badge>
                            </div>
                          </div>
                          
                          <div className="md:w-1/4">
                            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <FileText className="h-3 w-3" /> Experience & Education
                            </div>
                            <p className="text-sm">{candidate.experience} years • {candidate.education}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.skills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">{skill}</span>
                              ))}
                              {candidate.skills.length > 3 && (
                                <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">+{candidate.skills.length - 3}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="md:w-1/4 flex flex-col md:items-end justify-between">
                            <div className="flex gap-2 mb-2">
                              {getStatusBadge(candidate.status)}
                              <span className="text-xs text-muted-foreground">
                                {new Date(candidate.application_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="secondary" size="sm">Update</Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {candidatesData?.length === 0 ? 
                          "No candidates found. Start by adding your first candidate." : 
                          "No candidates match your search criteria."
                        }
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="positions">
          <Card>
            <CardContent className="p-6">
              {isLoadingPositions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                positions && positions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {positions.map((position: any) => (
                      <Card key={position.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{position.title}</CardTitle>
                            <Badge>{position.department}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Location</p>
                              <p>{position.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Candidates</p>
                              <div className="flex items-center">
                                <MailOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                                <p>{position.applicants} applicants</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Posted Date</p>
                              <p>{new Date(position.posted_date).toLocaleDateString()}</p>
                            </div>
                            <div className="pt-2 flex justify-between">
                              <Button variant="outline" size="sm">View Candidates</Button>
                              <Button variant="secondary" size="sm">Edit</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No open positions found. Create a position to get started.
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pipeline">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pipeline charts would go here */}
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Pipeline Stage Distribution Chart</p>
                </div>
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Time in Stage Chart</p>
                </div>
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Source Effectiveness Chart</p>
                </div>
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Conversion Rate Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruitmentTracker;
