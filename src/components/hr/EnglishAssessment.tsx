
import React, { useState } from 'react';
import { EnglishAssessment as IEnglishAssessment } from '@/interfaces/hr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookText } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EnglishAssessmentProps {
  assessments: IEnglishAssessment[];
  onAssess: (score: number, notes: string) => void;
  initialScore?: number;
  initialNotes?: string;
}

const EnglishAssessment: React.FC<EnglishAssessmentProps> = ({
  assessments,
  onAssess,
  initialScore = 0,
  initialNotes = ''
}) => {
  const [selectedAssessment, setSelectedAssessment] = useState<IEnglishAssessment | null>(
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

  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No English assessments available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookText className="h-5 w-5 mr-2" />
          English Proficiency Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="assessment-select">Select Assessment</Label>
            <Select
              value={selectedAssessment?.id.toString()}
              onValueChange={handleAssessmentChange}
            >
              <SelectTrigger id="assessment-select">
                <SelectValue placeholder="Select an assessment" />
              </SelectTrigger>
              <SelectContent>
                {assessments.map(assessment => (
                  <SelectItem key={assessment.id} value={assessment.id.toString()}>
                    {assessment.title} ({assessment.type})
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
                  
                  {selectedAssessment.questions.map((question, index) => (
                    <div key={question.id} className="mb-6 p-4 border rounded-md">
                      <p className="font-medium mb-3">
                        Question {index + 1}: {question.question}
                      </p>
                      
                      {question.type === 'essay' && (
                        <Textarea
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="h-[100px]"
                          placeholder="Candidate's answer..."
                        />
                      )}
                      
                      {question.type === 'multiple-choice' && question.options && (
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
                      )}
                      
                      {question.type === 'fill-in-blank' && (
                        <Input
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Candidate's answer..."
                        />
                      )}
                      
                      {question.correct_answer && (
                        <div className="mt-3 text-sm">
                          <span className="font-medium">Correct answer: </span>
                          {question.correct_answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="assessment" className="space-y-4">
                <div className="mt-4">
                  <Label htmlFor="english-score">Score (0-100)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="english-score"
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
                  <Label htmlFor="english-notes">Assessment Notes</Label>
                  <Textarea
                    id="english-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-[150px]"
                    placeholder="Enter your assessment notes, feedback on English proficiency, communication clarity, etc."
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

export default EnglishAssessment;
