
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp,
  Info,
  Lightbulb,
  RefreshCw,
  Zap,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { marketingService } from '@/services/api';
import { MarketingTrend, CompetitorInsight } from '@/interfaces/marketing';

const MarketingTrends = () => {
  const { data: trends, isLoading: isLoadingTrends } = useQuery({
    queryKey: ['marketing', 'trends'],
    queryFn: () => marketingService.getMarketingTrends(),
  });
  
  const { data: competitorInsights, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['marketing', 'competitor-insights'],
    queryFn: () => marketingService.getCompetitorInsights(),
  });
  
  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { color: string, icon: React.ReactNode }> = {
      'industry': { color: 'bg-blue-50 text-blue-600', icon: <TrendingUp className="h-3 w-3 mr-1" /> },
      'competitor': { color: 'bg-orange-50 text-orange-600', icon: <Zap className="h-3 w-3 mr-1" /> },
      'technology': { color: 'bg-purple-50 text-purple-600', icon: <Lightbulb className="h-3 w-3 mr-1" /> },
      'customer_behavior': { color: 'bg-green-50 text-green-600', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'other': { color: 'bg-gray-50 text-gray-600', icon: <Info className="h-3 w-3 mr-1" /> },
    };
    
    const { color, icon } = categories[category] || categories.other;
    return (
      <Badge className={color} variant="outline">
        {icon}
        {category.replace('_', ' ')}
      </Badge>
    );
  };
  
  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case 'high':
        return <Badge className="bg-red-50 text-red-600">High Impact</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-50 text-yellow-600">Medium Impact</Badge>;
      case 'low':
        return <Badge className="bg-blue-50 text-blue-600">Low Impact</Badge>;
      default:
        return <Badge>{impact}</Badge>;
    }
  };
  
  return (
    <Tabs defaultValue="trends">
      <TabsList>
        <TabsTrigger value="trends">Market Trends</TabsTrigger>
        <TabsTrigger value="competitors">Competitor Insights</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trends" className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Latest Market Trends</h3>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Analysis
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {isLoadingTrends ? (
            <Card>
              <CardContent className="pt-6">
                <p>Loading trends...</p>
              </CardContent>
            </Card>
          ) : !trends || trends.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p>No trends available.</p>
              </CardContent>
            </Card>
          ) : (
            trends.map((trend: MarketingTrend) => (
              <Card key={trend.id} className={trend.relevanceScore > 70 ? "border-green-200" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{trend.title}</CardTitle>
                      <CardDescription>
                        Discovered {format(new Date(trend.discoveredAt), 'MMM dd, yyyy')} • Source: {trend.source}
                      </CardDescription>
                    </div>
                    <div>
                      {getCategoryBadge(trend.category)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{trend.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">Relevance:</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            trend.relevanceScore > 80 ? 'bg-green-500' : 
                            trend.relevanceScore > 60 ? 'bg-yellow-500' : 
                            'bg-gray-400'
                          }`}
                          style={{ width: `${trend.relevanceScore}%` }}
                        />
                      </div>
                      <span className="text-sm ml-2">{trend.relevanceScore}%</span>
                    </div>
                    
                    {trend.actionable && (
                      <Button size="sm">
                        <Zap className="h-4 w-4 mr-1" />
                        Actionable
                      </Button>
                    )}
                  </div>
                  
                  {trend.suggestedActions && trend.suggestedActions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Suggested Actions:</h4>
                      <ul className="text-sm space-y-1">
                        {trend.suggestedActions.map((action, idx) => (
                          <li key={idx} className="flex items-start">
                            <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-blue-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="competitors" className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Competitor Insights</h3>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Analysis
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {isLoadingInsights ? (
            <Card>
              <CardContent className="pt-6">
                <p>Loading competitor insights...</p>
              </CardContent>
            </Card>
          ) : !competitorInsights || competitorInsights.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p>No competitor insights available.</p>
              </CardContent>
            </Card>
          ) : (
            competitorInsights.map((insight: CompetitorInsight) => (
              <Card key={insight.id} className={insight.impact === 'high' ? "border-red-200" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{insight.competitorName}</CardTitle>
                      <CardDescription>
                        Discovered {format(new Date(insight.discoveredAt), 'MMM dd, yyyy')} • Source: {insight.source}
                      </CardDescription>
                    </div>
                    <div>
                      {getImpactBadge(insight.impact)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{insight.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="capitalize">
                      {insight.type.replace('_', ' ')}
                    </Badge>
                    
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                  
                  {insight.suggestedResponse && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                      <h4 className="text-sm font-medium flex items-center text-blue-700 mb-1">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Suggested Response:
                      </h4>
                      <p className="text-sm text-blue-700">{insight.suggestedResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MarketingTrends;
