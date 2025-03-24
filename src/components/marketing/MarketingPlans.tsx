import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { marketingService } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const MarketingPlans = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  
  const { data: marketingPlans, isLoading } = useQuery({
    queryKey: ['marketing-plans'],
    queryFn: () => marketingService.getMarketingPlans(),
  });
  
  const { data: planDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['marketing-plan', selectedPlanId],
    queryFn: () => selectedPlanId ? marketingService.getMarketingPlanById(selectedPlanId) : null,
    enabled: !!selectedPlanId,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Marketing Plans</CardTitle>
            <CardDescription>
              View and manage your marketing strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="space-y-3">
                {marketingPlans?.map((plan: any) => (
                  <div 
                    key={plan.id} 
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <div>
                      <h3 className="text-sm font-medium">{plan.title}</h3>
                      <p className="text-xs text-muted-foreground">{plan.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create New Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        {selectedPlanId && planDetails ? (
          <Card>
            <CardHeader>
              <CardTitle>{planDetails.title}</CardTitle>
              <CardDescription>
                {planDetails.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingDetails ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Plan Details
                  </div>
                  {typeof planDetails?.content === 'string' ? planDetails.content : null}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Progress
                    </div>
                    <div className="text-sm font-medium">
                      {planDetails.progress}%
                    </div>
                  </div>
                  <Progress value={planDetails.progress} className="h-2" />
                  <div className="flex justify-end">
                    <Button>
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Select a Plan</CardTitle>
              <CardDescription>
                Choose a marketing plan to view details
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              No plan selected
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MarketingPlans;
