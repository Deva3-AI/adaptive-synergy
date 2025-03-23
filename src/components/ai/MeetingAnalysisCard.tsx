
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Calendar, FileText, FolderSearch, ListChecks } from "lucide-react";
import { toast } from 'sonner';
import { analyzeMeetingTranscript } from '@/utils/aiUtils';
import AIInsightCard from './AIInsightCard';

const MeetingAnalysisCard = () => {
  const [transcript, setTranscript] = useState('');
  const [meetingType, setMeetingType] = useState('client');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      toast.error('Please enter a meeting transcript to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Fixed: removed the second argument
      const result = await analyzeMeetingTranscript(transcript);
      setAnalysisResult(result);
      toast.success('Meeting transcript analyzed successfully');
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      toast.error('Failed to analyze meeting transcript');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">Meeting Transcript Analysis</CardTitle>
              <CardDescription>
                Paste in a meeting transcript to generate a summary, action items, and key insights
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1 px-2">
              <Brain className="h-4 w-4" />
              <span>AI Powered</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Button 
                variant={meetingType === 'client' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setMeetingType('client')}
              >
                Client Meeting
              </Button>
              <Button 
                variant={meetingType === 'internal' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setMeetingType('internal')}
              >
                Internal Meeting
              </Button>
              <Button 
                variant={meetingType === 'sales' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setMeetingType('sales')}
              >
                Sales Meeting
              </Button>
            </div>
            <Textarea
              placeholder="Paste your meeting transcript here..."
              className="min-h-[200px]"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !transcript.trim()}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Transcript'}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <div className="space-y-4">
          <AIInsightCard
            title="Meeting Summary"
            insights={analysisResult.summary}
            icon={<FileText className="h-4 w-4" />}
          />

          <AIInsightCard
            title="Action Items"
            insights={
              <div className="space-y-2">
                {analysisResult.action_items.length > 0 ? (
                  analysisResult.action_items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <ListChecks className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{item.task}</div>
                        {item.assignee && (
                          <div className="text-xs text-muted-foreground">Assignee: {item.assignee}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No action items identified</p>
                )}
              </div>
            }
          />

          <AIInsightCard
            title="Key Insights"
            insights={analysisResult.key_insights.length > 0 ? 
              analysisResult.key_insights : 
              ["No key insights identified"]
            }
            icon={<FolderSearch className="h-4 w-4" />}
          />

          <AIInsightCard
            title="Sentiment Analysis"
            insights={[
              `Overall sentiment: ${analysisResult.sentiment_analysis.sentiment}`,
              `Confidence: ${(analysisResult.sentiment_analysis.confidence * 100).toFixed(0)}%`
            ]}
            type={
              analysisResult.sentiment_analysis.sentiment === 'positive' ? 'success' : 
              analysisResult.sentiment_analysis.sentiment === 'negative' ? 'danger' : 
              'info'
            }
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>
      )}
    </div>
  );
};

export default MeetingAnalysisCard;
