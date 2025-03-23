
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  FileText,
  FileAudio,
  ListChecks,
  MessageCircle,
  Lightbulb,
  Clock,
  Upload,
  CheckCircle,
  X,
  User,
  AlertTriangle
} from 'lucide-react';
import { marketingService } from '@/services/api';

const MeetingAnalysis = () => {
  const [transcript, setTranscript] = useState('');
  const [meetingId, setMeetingId] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();
  
  const handleAnalyzeTranscript = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a meeting transcript to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await marketingService.analyzeMeetingTranscript({
        text: transcript,
        meetingId: meetingId || 0
      });
      
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Meeting transcript has been successfully analyzed",
        variant: "default"
      });
    } catch (error) {
      console.error('Error analyzing transcript:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze meeting transcript. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-50 text-red-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-50 text-yellow-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-50 text-green-600">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  const getSentimentBadge = (sentiment: string) => {
    switch(sentiment) {
      case 'positive':
        return <Badge className="bg-green-50 text-green-600">Positive</Badge>;
      case 'negative':
        return <Badge className="bg-red-50 text-red-600">Negative</Badge>;
      case 'neutral':
        return <Badge className="bg-blue-50 text-blue-600">Neutral</Badge>;
      default:
        return <Badge>{sentiment}</Badge>;
    }
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="md:col-span-5">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Transcript Analysis</CardTitle>
            <CardDescription>
              Enter your meeting transcript or upload an audio file for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Transcript
                </Button>
                <Button variant="outline" className="w-full">
                  <FileAudio className="h-4 w-4 mr-2" />
                  Upload Audio
                </Button>
              </div>
              
              <div>
                <label htmlFor="transcript" className="text-sm font-medium block mb-1.5">
                  Enter Meeting Transcript
                </label>
                <Textarea
                  id="transcript"
                  placeholder="Paste meeting transcript here..."
                  className="resize-none h-48"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleAnalyzeTranscript}
                disabled={isAnalyzing || !transcript.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Analyze Transcript
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-7">
        {!analysisResult ? (
          <div className="h-full flex items-center justify-center border rounded-lg bg-gray-50 p-6">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Analysis Yet</h3>
              <p className="text-gray-500">Enter a meeting transcript and click 'Analyze' to get insights</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Insights</CardTitle>
                <CardDescription>
                  AI-generated insights from your meeting transcript
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                      Summary
                    </h4>
                    <p className="text-sm text-gray-700 p-3 bg-blue-50 rounded-md">
                      {analysisResult.summary}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium">Overall Sentiment:</h4>
                    {getSentimentBadge(analysisResult.sentiment)}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Key Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.keyPoints.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Action Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.actionItems.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-start p-2 bg-gray-50 rounded-md">
                      <div className="mr-3 mt-0.5">
                        <ListChecks className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium">{item.description}</p>
                          {item.priority && getPriorityBadge(item.priority)}
                        </div>
                        {item.assignee && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            Assignee: {item.assignee}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Client Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.clientPreferences.map((pref: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                      <span className="text-sm">{pref}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <CardTitle className="text-base">Next Steps</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm p-3 bg-gray-50 rounded-md">
                  {analysisResult.nextSteps}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingAnalysis;
