
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, TrendingUp, AlertTriangle, ArrowUpRight, ExternalLink, MessageCircle, ThumbsUp, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { marketingService } from "@/services/api";
import { MarketingTrend, CompetitorInsight } from "@/interfaces/marketing";
import { Skeleton } from "@/components/ui/skeleton";

const MarketingTrends = () => {
  const [selectedTrend, setSelectedTrend] = useState<MarketingTrend | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<CompetitorInsight | null>(null);
  
  // Fetch marketing trends data
  const { data: marketingTrends = [], isLoading: trendsLoading } = useQuery({
    queryKey: ['marketing-trends'],
    queryFn: () => marketingService.getMarketingTrends()
  });
  
  // Fetch competitor insights data
  const { data: competitorInsights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ['competitor-insights'],
    queryFn: () => marketingService.getCompetitorInsights()
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 5) return "bg-amber-500";
    return "bg-gray-400";
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return "bg-red-500";
      case 'medium':
        return "bg-amber-500";
      case 'low':
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">
            <Lightbulb className="h-4 w-4 mr-2" />
            Industry Trends
          </TabsTrigger>
          <TabsTrigger value="competitors">
            <TrendingUp className="h-4 w-4 mr-2" />
            Competitor Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4 pt-4">
          {trendsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-[180px] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketingTrends.map((trend: MarketingTrend) => {
                // Get the relevance score, handling both property names
                const relevanceScore = trend.relevance_score ?? (trend as any).relevanceScore ?? 0;
                
                return (
                <Card 
                  key={trend.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTrend(trend)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge className="mb-2">{trend.category}</Badge>
                      <div className={`w-10 h-1 rounded-full ${getRelevanceColor(relevanceScore)}`}></div>
                    </div>
                    <CardTitle className="text-lg">{trend.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{trend.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {trend.discoveredAt ? formatDate(trend.discoveredAt) : "Recent"}
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">Relevance:</span>
                        <span className="font-medium">{relevanceScore}/10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="competitors" className="space-y-4 pt-4">
          {insightsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-[180px] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitorInsights.map((insight: CompetitorInsight) => {
                // Get the competitor name, handling both property names
                const competitor = insight.competitor_name ?? (insight as any).competitorName ?? "Unknown";
                
                return (
                <Card 
                  key={insight.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedInsight(insight)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge variant="outline" className="mb-2">
                        {competitor}
                      </Badge>
                      <div className={`w-10 h-1 rounded-full ${getImpactColor(insight.impact)}`}></div>
                    </div>
                    <CardTitle className="text-lg">{insight.type}</CardTitle>
                    <CardDescription className="line-clamp-2">{insight.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-muted-foreground">
                        {insight.discoveredAt && (
                          <>
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatDate(insight.discoveredAt)}
                          </>
                        )}
                        {insight.source && (
                          <>
                            <ExternalLink className="h-3 w-3 inline mx-1" />
                            {insight.source}
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Badge 
                          variant={
                            insight.impact === 'high' ? "destructive" : 
                            insight.impact === 'medium' ? "warning" : 
                            "success"
                          }
                        >
                          {insight.impact} impact
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Trend Detail Dialog */}
      {selectedTrend && (
        <Dialog open={!!selectedTrend} onOpenChange={(open) => !open && setSelectedTrend(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge>{selectedTrend.category}</Badge>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Relevance:</span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 dark:bg-gray-700" style={{ width: '100px' }}>
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${(selectedTrend.relevance_score ?? (selectedTrend as any).relevanceScore ?? 0) * 10}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {selectedTrend.relevance_score ?? (selectedTrend as any).relevanceScore ?? 0}/10
                  </span>
                </div>
              </div>
              <DialogTitle className="mt-2">{selectedTrend.title}</DialogTitle>
              <DialogDescription className="text-base font-normal">
                {selectedTrend.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Source */}
              {selectedTrend.source && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Source</h4>
                  <p className="text-sm flex items-center">
                    <ExternalLink className="h-4 w-4 mr-1 text-muted-foreground" />
                    {selectedTrend.source}
                  </p>
                </div>
              )}
              
              {/* Actionable Status */}
              <div>
                <h4 className="text-sm font-semibold mb-1">Status</h4>
                <Badge variant={selectedTrend.actionable ? "success" : "outline"}>
                  {selectedTrend.actionable ? "Actionable" : "For awareness"}
                </Badge>
              </div>
              
              {/* Suggested Actions */}
              {selectedTrend.suggestedActions && selectedTrend.suggestedActions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Suggested Actions</h4>
                  <ul className="space-y-2">
                    {selectedTrend.suggestedActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowUpRight className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setSelectedTrend(null)}>
                Close
              </Button>
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Share with Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Competitor Insight Detail Dialog */}
      {selectedInsight && (
        <Dialog open={!!selectedInsight} onOpenChange={(open) => !open && setSelectedInsight(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  {selectedInsight.competitor_name ?? (selectedInsight as any).competitorName ?? "Unknown"}
                </Badge>
                <Badge 
                  variant={
                    selectedInsight.impact === 'high' ? "destructive" : 
                    selectedInsight.impact === 'medium' ? "warning" : 
                    "success"
                  }
                >
                  {selectedInsight.impact} impact
                </Badge>
              </div>
              <DialogTitle className="mt-2">{selectedInsight.type}</DialogTitle>
              <DialogDescription className="text-base font-normal">
                {selectedInsight.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Source and Discovery */}
              <div className="flex justify-between text-sm">
                {selectedInsight.discoveredAt && (
                  <div>
                    <h4 className="font-semibold mb-1">Discovered</h4>
                    <p className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(selectedInsight.discoveredAt)}
                    </p>
                  </div>
                )}
                
                {selectedInsight.source && (
                  <div>
                    <h4 className="font-semibold mb-1">Source</h4>
                    <p className="flex items-center text-muted-foreground">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {selectedInsight.source}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Suggested Response */}
              {selectedInsight.suggestedResponse && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Suggested Response</h4>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    {selectedInsight.suggestedResponse}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setSelectedInsight(null)}>
                Close
              </Button>
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Discuss Strategy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MarketingTrends;
