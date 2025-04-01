import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hrService } from '@/services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Candidate } from '@/interfaces/hr';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, User, Mail, Phone, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const RecruitmentTracker = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => hrService.getCandidates(),
  });

  useEffect(() => {
    if (data) {
      setCandidates(data);
    }
  }, [data]);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseCandidateDetail = () => {
    setSelectedCandidate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Recruitment Tracker</h1>
        <Input
          type="search"
          placeholder="Search candidates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Table>
        <TableCaption>A list of your recent candidates.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Application Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Loading candidates...</TableCell>
            </TableRow>
          ) : filteredCandidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No candidates found.</TableCell>
            </TableRow>
          ) : (
            filteredCandidates.map((candidate) => (
              <TableRow key={candidate.id} onClick={() => handleCandidateClick(candidate)} className="cursor-pointer">
                <TableCell className="font-medium">{candidate.name}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>{candidate.job_title}</TableCell>
                <TableCell>{candidate.application_date}</TableCell>
                <TableCell className="text-right">
                  {candidate.status === 'new' && <Badge variant="secondary">New</Badge>}
                  {candidate.status === 'screening' && <Badge variant="outline">Screening</Badge>}
                  {candidate.status === 'interview' && <Badge>Interview</Badge>}
                  {candidate.status === 'offer' && <Badge variant="success">Offer</Badge>}
                  {candidate.status === 'hired' && <Badge variant="success">Hired</Badge>}
                  {candidate.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={selectedCandidate !== null} onOpenChange={(open) => {
        if (!open) handleCloseCandidateDetail();
      }}>
        <DialogContent className="sm:max-w-[825px]">
          <ScrollArea className="h-[600px] w-full">
            {selectedCandidate && (
              <CandidateDetail candidate={selectedCandidate} onClose={handleCloseCandidateDetail} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { Button } from '@/components/ui/button';
import { Candidate } from '@/interfaces/hr';
import { useNavigate } from 'react-router-dom';

// Find the Candidate detail view section of the code and add the assessment button
const CandidateDetail = ({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) => {
  const navigate = useNavigate();
  
  const handleStartAssessment = () => {
    navigate(`/hr/interview-assessment/${candidate.id}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{candidate.name}</h2>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="text-muted-foreground space-y-1">
            <p className="flex items-center"><Mail className="h-4 w-4 mr-2" /> {candidate.email}</p>
            <p className="flex items-center"><Phone className="h-4 w-4 mr-2" /> {candidate.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Job Details</h3>
          <div className="text-muted-foreground space-y-1">
            <p className="flex items-center"><Briefcase className="h-4 w-4 mr-2" /> {candidate.job_title}</p>
            <p className="flex items-center"><CalendarClock className="h-4 w-4 mr-2" /> Applied on {candidate.application_date}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, index) => (
            <Badge key={index}>{skill}</Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Notes</h3>
        <p className="text-muted-foreground">{candidate.notes || 'No notes provided.'}</p>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Send Email</Button>
        <Button variant="outline">Schedule Interview</Button>
        <Button onClick={handleStartAssessment}>Start Assessment</Button>
      </div>
    </div>
  );
};

export default RecruitmentTracker;
