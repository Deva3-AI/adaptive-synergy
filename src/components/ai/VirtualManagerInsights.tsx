
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, TrendingUp, AlertCircle, Calendar, Target } from 'lucide-react';

interface VirtualManagerInsightsProps {
  client?: {
    name: string;
    dos?: string[];
    donts?: string[];
    preferences?: {
      [key: string]: any;
    };
  };
}

const VirtualManagerInsights = ({ client }: VirtualManagerInsightsProps) => {
  if (!client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a client to get AI-powered insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sample insights based on client preferences
  const insights = [
    {
      icon: <Check className="h-4 w-4 text-green-500" />,
      title: `${client.name} Dos:`,
      items: client.dos || [
        "Provide weekly progress updates",
        "Use custom branding guidelines",
        "Prioritize mobile responsiveness"
      ]
    },
    {
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      title: `${client.name} Don'ts:`,
      items: client.donts || [
        "Don't miss deadlines without notice",
        "Avoid using stock photography",
        "Don't use competing brands' color schemes"
      ]
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      title: "Performance Insights:",
      items: [
        "You complete tasks for this client 15% faster than average",
        "Client satisfaction rating: 4.8/5.0",
        "Response time to client messages: 1.2 hours (excellent)"
      ]
    },
    {
      icon: <Calendar className="h-4 w-4 text-purple-500" />,
      title: "Upcoming Deadlines:",
      items: [
        "Homepage redesign due in 3 days",
        "Monthly report due in 5 days",
        "Client review meeting on Thursday at 2pm"
      ]
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Virtual Manager Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index}>
              <p className="font-medium flex items-center gap-1 mb-1">
                {insight.icon}
                {insight.title}
              </p>
              <ul className="space-y-1">
                {insight.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground pl-5 relative">
                    <span className="absolute left-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="mt-4">
            <p className="font-medium flex items-center gap-1 mb-1">
              <Target className="h-4 w-4 text-indigo-500" />
              AI Suggestion:
            </p>
            <p className="text-sm text-muted-foreground">
              Based on this client's feedback history, consider providing more frequent updates on the homepage redesign project. Their engagement increases by 30% when they receive regular progress reports.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualManagerInsights;
