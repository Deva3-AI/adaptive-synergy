
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

interface FinancialMetricsCardProps {
  metrics: any;
  isLoading: boolean;
}

const FinancialMetricsCard = ({ metrics, isLoading }: FinancialMetricsCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'excellent':
      case 'good':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'satisfactory':
      case 'fair':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'concerning':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'critical':
      case 'poor':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="h-5 w-5 mr-1.5 text-primary/80" />
          Financial Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        ) : metrics?.analysis ? (
          <>
            <Alert className={`border ${getStatusColor(metrics.analysis.financial_health.status)}`}>
              <div className="flex gap-2 items-center">
                {metrics.analysis.financial_health.status.toLowerCase() === 'good' || 
                 metrics.analysis.financial_health.status.toLowerCase() === 'excellent' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : metrics.analysis.financial_health.status.toLowerCase() === 'poor' ||
                     metrics.analysis.financial_health.status.toLowerCase() === 'critical' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                <span className="font-semibold">
                  Status: {metrics.analysis.financial_health.status}
                </span>
              </div>
              <AlertDescription className="mt-2 text-sm">
                {metrics.analysis.financial_health.explanation}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Key Insights</h4>
                <ul className="space-y-1.5">
                  {metrics.analysis.key_insights.map((insight: string, index: number) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              
              {metrics.analysis.areas_of_concern && metrics.analysis.areas_of_concern.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Areas of Concern</h4>
                  <ul className="space-y-1.5">
                    {metrics.analysis.areas_of_concern.map((concern: string, index: number) => (
                      <li key={index} className="text-sm flex items-start text-amber-600">
                        <AlertTriangle className="h-3.5 w-3.5 mr-2 flex-shrink-0 mt-0.5" />
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {metrics.analysis.recommendations && metrics.analysis.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1.5">
                    {metrics.analysis.recommendations.map((rec: any, index: number) => (
                      <li key={index} className="text-sm">
                        <Badge variant="outline" className="mr-2 bg-primary/10">
                          {rec.area}
                        </Badge>
                        {rec.action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No financial metrics available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialMetricsCard;
