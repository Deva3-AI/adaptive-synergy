
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, BrainCircuit, CheckCircle, Clock } from "lucide-react";
import { cn } from '@/lib/utils';

interface AIInsightCardProps {
  title: string;
  insights: string[] | React.ReactNode;
  source?: string;
  timestamp?: string;
  type?: "info" | "warning" | "success" | "danger";
  className?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const AIInsightCard = ({
  title,
  insights,
  source,
  timestamp,
  type = "info",
  className,
  footer,
  isLoading = false,
  icon,
}: AIInsightCardProps) => {
  // Badge variant based on insight type
  const getBadgeVariant = () => {
    switch (type) {
      case "success": return "success";
      case "warning": return "warning";
      case "danger": return "destructive";
      default: return "secondary";
    }
  };

  // Icon based on insight type
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4" />;
      case "warning": return <Clock className="h-4 w-4" />;
      case "danger": return <BrainCircuit className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn("overflow-hidden transition-all", 
      isLoading && "opacity-70",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant={getBadgeVariant()} className="flex items-center gap-1 px-2 py-1">
            {getIcon()}
            <span>AI Insight</span>
          </Badge>
        </div>
        {source && (
          <CardDescription className="text-sm text-muted-foreground">
            Source: {source}
            {timestamp && <span className="ml-2">• {timestamp}</span>}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={isLoading ? "animate-pulse" : ""}>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-[90%]"></div>
            <div className="h-4 bg-muted rounded w-[80%]"></div>
          </div>
        ) : Array.isArray(insights) ? (
          <ul className="space-y-2 list-disc pl-5">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-sm">{insight}</li>
            ))}
          </ul>
        ) : (
          insights
        )}
      </CardContent>
      {footer && <CardFooter className="pt-0 border-t">{footer}</CardFooter>}
    </Card>
  );
};

export default AIInsightCard;
