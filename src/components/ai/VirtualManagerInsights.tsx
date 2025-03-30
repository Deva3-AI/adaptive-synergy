
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Info, BrainCircuit } from 'lucide-react';

interface Insight {
  type: 'tip' | 'warning' | 'info';
  content: string;
}

interface VirtualManagerInsightsProps {
  clientName: string;
  insights: Insight[];
  className?: string;
}

const VirtualManagerInsights: React.FC<VirtualManagerInsightsProps> = ({ 
  clientName, 
  insights, 
  className = "" 
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center pb-2">
        <BrainCircuit className="h-5 w-5 mr-2 text-purple-500" />
        <CardTitle className="text-md font-medium">Virtual Manager Insights</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="text-sm font-semibold mb-3">Working with {clientName}</h3>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div key={index} className="flex gap-2 text-sm">
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <p>{insight.content}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No insights available for this client yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualManagerInsights;
