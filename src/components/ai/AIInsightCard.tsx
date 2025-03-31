
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

interface AIInsightCardProps {
  title: string;
  insights: string[] | React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
  isLoading?: boolean;
  animation?: 'pulse' | 'fade';
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title,
  insights,
  type = 'info',
  icon,
  isLoading = false,
  animation = 'pulse'
}) => {
  // Determine card styling based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'danger':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success': return 'text-green-800 dark:text-green-300';
      case 'warning': return 'text-yellow-800 dark:text-yellow-300';
      case 'danger': return 'text-red-800 dark:text-red-300';
      case 'info':
      default: return 'text-blue-800 dark:text-blue-300';
    }
  };

  const getBadgeColor = () => {
    switch (type) {
      case 'success': return 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'warning': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      case 'danger': return 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200';
      case 'info':
      default: return 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
    }
  };

  // Determine animation styling
  const getAnimationClass = () => {
    if (isLoading) {
      return animation === 'pulse' ? 'animate-pulse' : 'animate-fade-in';
    }
    return '';
  };

  return (
    <Card className={`${getTypeStyles()} ${getAnimationClass()}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-md font-medium flex items-center ${getTextColor()}`}>
          {icon || <Brain className="mr-2 h-5 w-5" />}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ) : (
          Array.isArray(insights) ? (
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <Badge 
                    variant="outline"
                    className={`px-2 mr-2 mt-0.5 ${getBadgeColor()}`}
                  >
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          ) : (
            insights
          )
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;
