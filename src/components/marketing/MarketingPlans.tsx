
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronRight,
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  Target,
  Calendar,
  Users,
  BarChart,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { marketingService } from '@/services/api';
import { MarketingPlan, MarketingPlanAction } from '@/interfaces/marketing';

const MarketingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  
  const { data: plans, isLoading } = useQuery({
    queryKey: ['marketing', 'plans'],
    queryFn: () => marketingService.getMarketingPlans(),
  });
  
  const { data: planDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['marketing', 'plan', selectedPlan],
    queryFn: () => selectedPlan ? marketingService.getMarketingPlanById(selectedPlan) : null,
    enabled: !!selectedPlan,
  });
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600">Draft</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-600">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-50 text-red-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-50 text-yellow-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-50 text-green-600">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  const getTimeframeCapitalized = (timeframe: string) => {
    return timeframe.charAt(0).toUpperCase() + timeframe.slice(1);
  };
  
  const calculatePlanCompletion = (plan: MarketingPlan) => {
    if (!plan.actions || plan.actions.length === 0) return 0;
    
    const completedActions = plan.actions.filter(action => action.status === 'completed').length;
    return Math.round((completedActions / plan.actions.length) * 100);
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="md:col-span-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Marketing Plans</h3>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <p>Loading plans...</p>
              </CardContent>
            </Card>
          ) : !plans || plans.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p>No marketing plans available.</p>
              </CardContent>
            </Card>
          ) : (
            plans.map((plan: MarketingPlan) => {
              const completionPercentage = calculatePlanCompletion(plan);
              
              return (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${plan.id === selectedPlan ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      {getStatusBadge(plan.status)}
                    </div>
                    <CardDescription>
                      {getTimeframeCapitalized(plan.timeframe)} plan • Updated {format(new Date(plan.updatedAt), 'MMM dd, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{plan.description}</p>
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="text-xs">
                        <span className="block text-gray-500">Objectives</span>
                        <span className="font-medium">{plan.objectives.length}</span>
                      </div>
                      <div className="text-xs">
                        <span className="block text-gray-500">Actions</span>
                        <span className="font-medium">{plan.actions.length}</span>
                      </div>
                      <div className="text-xs">
                        <span className="block text-gray-500">Completed</span>
                        <span className="font-medium">
                          {plan.actions.filter(a => a.status === 'completed').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
      
      <div className="md:col-span-8">
        {!selectedPlan ? (
          <div className="h-full flex items-center justify-center border rounded-lg bg-gray-50 p-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Select a Marketing Plan</h3>
              <p className="text-gray-500">Choose a plan from the list to view its details</p>
            </div>
          </div>
        ) : isLoadingDetails ? (
          <Card>
            <CardContent className="pt-6">
              <p>Loading plan details...</p>
            </CardContent>
          </Card>
        ) : planDetails ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{planDetails.title}</CardTitle>
                    <CardDescription>
                      {getTimeframeCapitalized(planDetails.timeframe)} plan • Created {format(new Date(planDetails.createdAt), 'MMM dd, yyyy')}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {planDetails.status === 'draft' && (
                      <Button size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center p-3 border rounded-md bg-gray-50">
                    <Target className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <h4 className="text-sm font-medium">Objectives</h4>
                      <p className="text-2xl font-bold">{planDetails.objectives.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-md bg-gray-50">
                    <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <h4 className="text-sm font-medium">Actions</h4>
                      <p className="text-2xl font-bold">{planDetails.actions.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-md bg-gray-50">
                    <BarChart className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <h4 className="text-sm font-medium">Completion</h4>
                      <p className="text-2xl font-bold">{calculatePlanCompletion(planDetails)}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{planDetails.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Objectives</h3>
                  <ul className="space-y-2">
                    {planDetails.objectives.map((objective, idx) => (
                      <li key={idx} className="flex items-start">
                        <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium">Target Metrics</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {Object.entries(planDetails.targetMetrics).map(([key, value]) => (
                      <div key={key} className="p-3 border rounded-md">
                        <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-lg font-semibold">
                          {typeof value === 'number' && value <= 1 ? `${Math.round(value * 100)}%` : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Action Items</CardTitle>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {planDetails.actions.map((action: MarketingPlanAction) => (
                      <Card key={action.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-md">{action.title}</CardTitle>
                              {action.dueDate && (
                                <CardDescription>
                                  Due: {format(new Date(action.dueDate), 'MMM dd, yyyy')}
                                </CardDescription>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(action.priority)}
                              <Badge variant="outline">
                                {action.status === 'completed' ? 
                                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : 
                                  <Clock className="h-3 w-3 mr-1" />}
                                {action.status.charAt(0).toUpperCase() + action.status.slice(1).replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700 mb-3">{action.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="block text-gray-500">Estimated Impact</span>
                              <span className="font-medium capitalize">{action.estimatedImpact}</span>
                            </div>
                            <div>
                              <span className="block text-gray-500">Effort Required</span>
                              <span className="font-medium capitalize">{action.effort}</span>
                            </div>
                            <div>
                              <span className="block text-gray-500">Assignee</span>
                              <span className="font-medium">
                                {action.assignee ? `User #${action.assignee}` : 'Unassigned'}
                              </span>
                            </div>
                            <div>
                              <span className="block text-gray-500">Progress</span>
                              <span className="font-medium">{action.progress || 0}%</span>
                            </div>
                          </div>
                          
                          {action.progress !== undefined && action.progress > 0 && (
                            <Progress value={action.progress} className="h-1 mt-2" />
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2 pt-0">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p>No plan details available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MarketingPlans;
