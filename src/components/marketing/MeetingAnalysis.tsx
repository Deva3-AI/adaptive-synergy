
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MeetingAnalysisProps {
  meetingId: string;
  analysis?: {
    sentiment: string;
    keyTopics: string[];
    nextSteps: string[];
    riskFactors: string[];
    transcript: string;
    attendees: string[];
  };
  isLoading?: boolean;
}

const MeetingAnalysis: React.FC<MeetingAnalysisProps> = ({ meetingId, analysis, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meeting Analysis</CardTitle>
          <CardDescription>Loading analysis for meeting #{meetingId}...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meeting Analysis</CardTitle>
          <CardDescription>No analysis available for this meeting</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Function to get badge variant based on sentiment
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return <Badge variant="success">Positive</Badge>;
      case 'negative':
        return <Badge variant="destructive">Negative</Badge>;
      case 'neutral':
        return <Badge variant="secondary">Neutral</Badge>;
      default:
        return <Badge>{sentiment}</Badge>;
    }
  };

  // Function to get badge for risk factors
  const getRiskBadge = (risk: string) => {
    if (risk.toLowerCase().includes('critical') || risk.toLowerCase().includes('high')) {
      return <Badge variant="destructive">{risk}</Badge>;
    } else if (risk.toLowerCase().includes('medium')) {
      return <Badge variant="warning">{risk}</Badge>;
    } else if (risk.toLowerCase().includes('low')) {
      return <Badge variant="secondary">{risk}</Badge>;
    } else {
      return <Badge>{risk}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Analysis</CardTitle>
        <CardDescription>AI-generated insights from meeting #{meetingId}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Sentiment Analysis</h3>
          <div>
            {getSentimentBadge(analysis.sentiment)}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Key Topics Discussed</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.keyTopics.map((topic, index) => (
              <Badge key={index} variant="outline">{topic}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Recommended Next Steps</h3>
          <ul className="space-y-1">
            {analysis.nextSteps.map((step, index) => (
              <li key={index} className="text-sm">• {step}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Risk Factors</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.riskFactors.map((risk, index) => (
              <div key={index}>{getRiskBadge(risk)}</div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Attendees</h3>
          <div className="flex flex-wrap gap-1">
            {analysis.attendees.map((attendee, index) => (
              <Badge key={index} variant="outline">{attendee}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Transcript Excerpt</h3>
          <p className="text-xs text-muted-foreground bg-muted p-3 rounded-md max-h-32 overflow-y-auto">
            {analysis.transcript}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <CardDescription>See full transcript for more details</CardDescription>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export { MeetingAnalysis };
