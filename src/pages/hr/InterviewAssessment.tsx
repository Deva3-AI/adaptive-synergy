
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { hrService } from '@/services/api';
import { CandidateAssessmentForm } from '@/components/hr/CandidateAssessmentForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Save, User, FileCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Candidate, InterviewAssessment } from '@/interfaces/hr';
import CodingChallengeAssessment from '@/components/hr/CodingChallengeAssessment';
import EnglishAssessment from '@/components/hr/EnglishAssessment';
import AptitudeAssessment from '@/components/hr/AptitudeAssessment';

const InterviewAssessmentPage = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('coding');
  const [assessment, setAssessment] = useState<Partial<InterviewAssessment>>({
    status: 'draft',
    assessment_date: new Date().toISOString().split('T')[0]
  });
  
  // Fetch candidate data
  const { data: candidate, isLoading: loadingCandidate } = useQuery({
    queryKey: ['candidate', candidateId],
    queryFn: () => {
      if (!candidateId) return null;
      return hrService.getCandidates(parseInt(candidateId))
        .then(candidates => candidates.length > 0 ? candidates[0] : null);
    }
  });
  
  // Fetch existing assessment if available
  const { data: existingAssessments, isLoading: loadingAssessment } = useQuery({
    queryKey: ['assessment', candidateId],
    queryFn: () => {
      if (!candidateId) return [];
      return hrService.getInterviewAssessments(parseInt(candidateId));
    }
  });
  
  // Fetch assessment resources
  const { data: codingChallenges, isLoading: loadingChallenges } = useQuery({
    queryKey: ['coding-challenges'],
    queryFn: () => hrService.getCodingChallenges()
  });
  
  const { data: englishAssessments, isLoading: loadingEnglish } = useQuery({
    queryKey: ['english-assessments'],
    queryFn: () => hrService.getEnglishAssessments()
  });
  
  const { data: aptitudeAssessments, isLoading: loadingAptitude } = useQuery({
    queryKey: ['aptitude-assessments'],
    queryFn: () => hrService.getAptitudeAssessments()
  });
  
  // Set up assessment if existing one is found
  useEffect(() => {
    if (existingAssessments && existingAssessments.length > 0) {
      const latestAssessment = existingAssessments[0];
      setAssessment(latestAssessment);
    } else if (candidate) {
      setAssessment(prev => ({
        ...prev,
        candidate_id: candidate.id,
        candidate_name: candidate.name,
        position: candidate.job_title
      }));
    }
  }, [existingAssessments, candidate]);
  
  const handleCodingAssessment = (score: number, notes: string) => {
    setAssessment(prev => ({
      ...prev,
      coding_score: score,
      coding_notes: notes
    }));
    
    toast.success('Coding assessment saved');
  };
  
  const handleEnglishAssessment = (score: number, notes: string) => {
    setAssessment(prev => ({
      ...prev,
      english_score: score,
      english_notes: notes
    }));
    
    toast.success('English assessment saved');
  };
  
  const handleAptitudeAssessment = (score: number, notes: string) => {
    setAssessment(prev => ({
      ...prev,
      aptitude_score: score,
      aptitude_notes: notes
    }));
    
    toast.success('Aptitude assessment saved');
  };
  
  const calculateTotalScore = () => {
    let scores = 0;
    let count = 0;
    
    if (assessment.coding_score !== undefined) {
      scores += assessment.coding_score;
      count++;
    }
    
    if (assessment.english_score !== undefined) {
      scores += assessment.english_score;
      count++;
    }
    
    if (assessment.aptitude_score !== undefined) {
      scores += assessment.aptitude_score;
      count++;
    }
    
    return count > 0 ? Math.round(scores / count) : 0;
  };
  
  const handleSaveAssessment = async () => {
    try {
      const totalScore = calculateTotalScore();
      const result = totalScore >= 70 ? 'pass' : 'fail';
      
      const updatedAssessment = {
        ...assessment,
        total_score: totalScore,
        result,
        status: 'completed',
        conducted_by: 'HR Manager' // In a real app, this would be the current user's name
      };
      
      if (assessment.id) {
        await hrService.updateInterviewAssessment(assessment.id, updatedAssessment);
      } else {
        await hrService.createInterviewAssessment(updatedAssessment);
      }
      
      toast.success('Assessment saved successfully');
      navigate('/hr/recruitment');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment');
    }
  };
  
  const isLoading = loadingCandidate || loadingAssessment || 
                   loadingChallenges || loadingEnglish || loadingAptitude;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate('/hr/recruitment')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
        </div>
      </div>
    );
  }
  
  if (!candidate) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Candidate not found. Please go back and select a valid candidate.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/hr/recruitment')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Recruitment
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate('/hr/recruitment')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Interview Assessment</h1>
        </div>
        <Button onClick={handleSaveAssessment}>
          <Save className="h-4 w-4 mr-2" />
          Complete Assessment
        </Button>
      </div>
      
      <Card>
        <CardHeader className="bg-secondary/30">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{candidate.name}</CardTitle>
              <CardDescription className="mt-1">
                Position: {candidate.job_title} | Experience: {candidate.experience} years
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Contact Information</h3>
              <p className="text-sm">Email: {candidate.email}</p>
              <p className="text-sm">Phone: {candidate.phone}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Education</h3>
              <p className="text-sm">{candidate.education}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {candidate.skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="inline-block px-2 py-1 rounded-full text-xs bg-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {assessment.coding_score ?? 'N/A'}
                  </div>
                  <p className="text-sm text-muted-foreground">Coding Score</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {assessment.english_score ?? 'N/A'}
                  </div>
                  <p className="text-sm text-muted-foreground">English Score</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {assessment.aptitude_score ?? 'N/A'}
                  </div>
                  <p className="text-sm text-muted-foreground">Aptitude Score</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Assessment Areas</h2>
            <div className="flex items-center space-x-2">
              <div>Overall: </div>
              <span className="font-bold text-lg">{calculateTotalScore()}</span>
              <div className="ml-2">
                {assessment.status === 'completed' && (
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    assessment.result === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {assessment.result === 'pass' ? 'PASS' : 'FAIL'}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="coding">Coding Challenge</TabsTrigger>
              <TabsTrigger value="english">English Proficiency</TabsTrigger>
              <TabsTrigger value="aptitude">Aptitude Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="coding" className="mt-6">
              <CodingChallengeAssessment 
                challenges={codingChallenges || []}
                onAssess={handleCodingAssessment}
                initialScore={assessment.coding_score}
                initialNotes={assessment.coding_notes}
              />
            </TabsContent>
            
            <TabsContent value="english" className="mt-6">
              <EnglishAssessment 
                assessments={englishAssessments || []}
                onAssess={handleEnglishAssessment}
                initialScore={assessment.english_score}
                initialNotes={assessment.english_notes}
              />
            </TabsContent>
            
            <TabsContent value="aptitude" className="mt-6">
              <AptitudeAssessment 
                assessments={aptitudeAssessments || []}
                onAssess={handleAptitudeAssessment}
                initialScore={assessment.aptitude_score}
                initialNotes={assessment.aptitude_notes}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button 
          size="lg" 
          className="gap-2"
          onClick={handleSaveAssessment}
        >
          <FileCheck className="h-5 w-5" />
          Complete & Save Assessment
        </Button>
      </div>
    </div>
  );
};

export default InterviewAssessmentPage;
