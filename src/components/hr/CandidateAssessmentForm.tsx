
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Candidate, InterviewAssessment } from '@/interfaces/hr';

interface CandidateAssessmentFormProps {
  candidate: Candidate;
  assessment: Partial<InterviewAssessment>;
  onUpdateAssessment: (assessment: Partial<InterviewAssessment>) => void;
  onSave: () => void;
}

export const CandidateAssessmentForm: React.FC<CandidateAssessmentFormProps> = ({
  candidate,
  assessment,
  onUpdateAssessment,
  onSave
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateAssessment({
      ...assessment,
      [name]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="candidate_name">Candidate Name</Label>
              <Input 
                id="candidate_name" 
                name="candidate_name" 
                value={assessment.candidate_name || candidate.name} 
                onChange={handleChange}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position" 
                name="position" 
                value={assessment.position || candidate.job_title} 
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assessment_date">Assessment Date</Label>
              <Input 
                id="assessment_date" 
                name="assessment_date" 
                type="date"
                value={assessment.assessment_date || new Date().toISOString().split('T')[0]} 
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="conducted_by">Conducted By</Label>
              <Input 
                id="conducted_by" 
                name="conducted_by" 
                value={assessment.conducted_by || ''} 
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
