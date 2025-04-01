
import React, { useState } from 'react';
import { CodingChallenge } from '@/interfaces/hr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Code } from 'lucide-react';

interface CodingChallengeAssessmentProps {
  challenges: CodingChallenge[];
  onAssess: (score: number, notes: string) => void;
  initialScore?: number;
  initialNotes?: string;
}

const CodingChallengeAssessment: React.FC<CodingChallengeAssessmentProps> = ({
  challenges,
  onAssess,
  initialScore = 0,
  initialNotes = ''
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(challenges.length > 0 ? challenges[0] : null);
  const [candidateCode, setCandidateCode] = useState<string>('');
  const [score, setScore] = useState<number>(initialScore);
  const [notes, setNotes] = useState<string>(initialNotes);

  const handleChallengeChange = (challengeId: string) => {
    const challenge = challenges.find(c => c.id.toString() === challengeId);
    if (challenge) {
      setSelectedChallenge(challenge);
    }
  };

  const handleSubmit = () => {
    onAssess(score, notes);
  };

  if (challenges.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No coding challenges available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Coding Challenge Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="challenge-select">Select Challenge</Label>
            <Select
              value={selectedChallenge?.id.toString()}
              onValueChange={handleChallengeChange}
            >
              <SelectTrigger id="challenge-select">
                <SelectValue placeholder="Select a challenge" />
              </SelectTrigger>
              <SelectContent>
                {challenges.map(challenge => (
                  <SelectItem key={challenge.id} value={challenge.id.toString()}>
                    {challenge.title} ({challenge.difficulty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedChallenge && (
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="solution">Candidate's Solution</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4">
                <div className="mt-4">
                  <h3 className="font-medium mb-2">{selectedChallenge.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Difficulty: <span className="font-medium">{selectedChallenge.difficulty}</span> | 
                    Expected time: <span className="font-medium">{selectedChallenge.expected_duration} min</span> | 
                    Language: <span className="font-medium">{selectedChallenge.language}</span>
                  </p>
                  <p className="mb-4">{selectedChallenge.description}</p>
                  
                  <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm">
                    <pre>{selectedChallenge.content}</pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="solution">
                <div className="mt-4">
                  <Label htmlFor="candidate-solution">Candidate's Code</Label>
                  <Textarea
                    id="candidate-solution"
                    value={candidateCode}
                    onChange={(e) => setCandidateCode(e.target.value)}
                    className="font-mono h-[300px] mt-2"
                    placeholder="Paste or type the candidate's solution here..."
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="assessment" className="space-y-4">
                <div className="mt-4">
                  <Label htmlFor="coding-score">Score (0-100)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="coding-score"
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
                  <Label htmlFor="coding-notes">Assessment Notes</Label>
                  <Textarea
                    id="coding-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-[150px]"
                    placeholder="Enter your assessment notes, feedback, and observations about the candidate's solution..."
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

export default CodingChallengeAssessment;
