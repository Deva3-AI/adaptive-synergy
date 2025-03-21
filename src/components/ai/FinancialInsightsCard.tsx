
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  BadgePercent,
  RefreshCw,
  AlertCircle,
  LineChart
} from "lucide-react";
import { analyzeFinancialData } from '@/utils/aiUtils';
import { toast } from 'sonner';
import AIInsightCard from './AIInsightCard';

interface FinancialInsightsCardProps {
  financialRecords: any[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const FinancialInsightsCard = ({
  financialRecords,
  isLoading = false,
  onRefresh
}: FinancialInsightsCardProps) => {
  const [insights, setInsights] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateInsights = async () => {
    if (financialRecords.length === 0) {
      toast.error('No financial records available for analysis');
      return;
    }

    setIsAnalyzing(true);
    try {
      const results = await analyzeFinancialData(financialRecords);
      setInsights(results);
      toast.success('Financial insights generated successfully');
    } catch (error) {
      console.error('Error generating financial insights:', error);
      toast.error('Failed to generate financial insights');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    generateInsights();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
      case 'good':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'satisfactory':
      case 'fair':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'concerning':
      case 'poor':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'critical':
      case 'bad':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          <Brain className="mr-2 h-5 w-5 text-accent" />
          AI Financial Analysis
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 px-2">
            <LineChart className="h-3 w-3" />
            <span>{financialRecords.length} Records</span>
          </Badge>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRefresh}
            disabled={isAnalyzing || isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${(isAnalyzing || isLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isAnalyzing || isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-5 bg-muted rounded w-3/4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
        ) : !insights ? (
          <div className="text-center py-8">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="mb-4 text-muted-foreground">No financial insights generated yet</p>
            <Button onClick={generateInsights} disabled={financialRecords.length === 0}>
              Generate Financial Insights
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Financial Health Status Banner */}
            <Alert className={`border ${getStatusColor(insights.financial_health.status)}`}>
              <div className="flex gap-2 items-center">
                {insights.financial_health.status.toLowerCase() === 'good' || 
                 insights.financial_health.status.toLowerCase() === 'excellent' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : insights.financial_health.status.toLowerCase() === 'poor' ||
                     insights.financial_health.status.toLowerCase() === 'critical' ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span className="font-semibold">
                  Financial Health: {insights.financial_health.status}
                </span>
              </div>
              <AlertDescription className="mt-2 text-sm">
                {insights.financial_health.explanation}
              </AlertDescription>
            </Alert>
            
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-card/50">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <DollarSign className="h-8 w-8 text-accent mb-2" />
                  <div className="text-xl font-bold">
                    ${insights.summary_metrics.net_profit.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Net Profit</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <BadgePercent className="h-8 w-8 text-accent mb-2" />
                  <div className="text-xl font-bold">
                    {insights.summary_metrics.profit_margin.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Profit Margin</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-accent mb-2" />
                  <div className="text-xl font-bold capitalize">
                    {insights.summary_metrics.recent_trend}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Recent Trend</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Key Insights */}
            <AIInsightCard
              title="Key Insights"
              insights={insights.key_insights}
            />
            
            {/* Recommendations */}
            <AIInsightCard
              title="Recommendations"
              insights={insights.recommendations.map((r: any) => `${r.area}: ${r.action}`)}
              type="success"
            />
            
            {/* Financial Prediction */}
            <AIInsightCard
              title="Financial Prediction"
              insights={[insights.prediction]}
              type="info"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialInsightsCard;
