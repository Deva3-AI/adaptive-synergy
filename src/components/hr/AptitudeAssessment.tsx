
import React, { useState } from 'react';
import { AptitudeAssessment as IAptitudeAssessment } from '@/interfaces/hr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BrainCircuit } from 'lucide-react';

interface AptitudeAssessmentProps {
  assessments: IAptitudeAssessment[];
  onAssess: (score: number, notes: string) => void;
  initialScore?: number;
  initialNotes?: string;
}

const AptitudeAssessment: React.FC<AptitudeAssessmentProps> = ({
  assessments,
  onAssess,
  initialScore = 0,
  initialNotes = ''
}) => {
  const [selectedAssessment, setSelectedAssessment] = useState<IAptitudeAssessment | null>(
    assessments.length > 0 ? assessments[0] : null
  );
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(initialScore);
  const [notes, setNotes] = useState<string>(initialNotes);

  const handleAssessmentChange = (assessmentId: string) => {
    const assessment = assessments.find(a => a.id.toString() === assessmentId);
    if (assessment) {
      setSelectedAssessment(assessment);
      setAnswers({});
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    onAssess(score, notes);
  };

  const calculateCorrectAnswers = () => {
    if (!selectedAssessment) return { correct: 0, total: 0 };
    
    const questions = selectedAssessment.questions;
    let correct = 0;
    
    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correct++;
      }
    });
    
    return { correct, total: questions.length };
  };

  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No aptitude assessments available.</p>
        </CardContent>
      </Card>
    );
  }

  const { correct, total } = calculateCorrectAnswers();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2" />
          Aptitude Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="aptitude-select">Select Assessment</Label>
            <Select
              value={selectedAssessment?.id.toString()}
              onValueChange={handleAssessmentChange}
            >
              <SelectTrigger id="aptitude-select">
                <SelectValue placeholder="Select an assessment" />
              </SelectTrigger>
              <SelectContent>
                {assessments.map(assessment => (
                  <SelectItem key={assessment.id} value={assessment.id.toString()}>
                    {assessment.title} ({assessment.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAssessment && (
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="questions" className="space-y-6">
                <div className="mt-4">
                  <h3 className="font-medium text-lg mb-4">{selectedAssessment.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Category: {selectedAssessment.category}</p>
                  
                  {selectedAssessment.questions.map((question, index) => (
                    <div key={question.id} className="mb-6 p-4 border rounded-md">
                      <p className="font-medium mb-3">
                        Question {index + 1}: {question.question}
                      </p>
                      
                      <RadioGroup
                        value={answers[question.id] || ''}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                      >
                        {question.options.map((option, i) => (
                          <div key={i} className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value={option} id={`q${question.id}-option${i}`} />
                            <Label htmlFor={`q${question.id}-option${i}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      <div className="mt-3 text-sm">
                        <span className="font-medium">Correct answer: </span>
                        {question.correct_answer}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="assessment" className="space-y-4">
                <div className="mt-4 p-4 bg-secondary/30 rounded-md">
                  <h3 className="font-medium mb-2">Automatic Score Summary</h3>
                  <p>Correct answers: {correct} out of {total}</p>
                  <p>Accuracy: {total > 0 ? Math.round((correct / total) * 100) : 0}%</p>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="aptitude-score">Score (0-100)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="aptitude-score"
                      value={[score]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(values) => setScore(values[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{score}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="aptitude-notes">Assessment Notes</Label>
                  <Textarea
                    id="aptitude-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-[150px]"
                    placeholder="Enter your assessment notes, observations on problem-solving approach, reasoning skills, etc."
                  />
                </div>
                
                <Button className="w-full" onClick={handleSubmit}>Save Assessment</Button>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AptitudeAssessment;
