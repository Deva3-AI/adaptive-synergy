
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { 
  Plus,
  Search,
  CalendarDays,
  Users,
  BarChart4,
  Target,
  ChevronRight,
  Mail,
  MessageSquare,
  Phone,
  File,
  Calendar,
  CheckCircle2,
  Clock,
  Megaphone,
} from 'lucide-react';
import { marketingService } from '@/services/api';
import { Input } from '@/components/ui/input';

interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  owner: string;
  objectives: string[];
  actions: {
    id: number;
    type: string;
    description: string;
    dueDate: string;
    assignee: string;
    status: string;
  }[];
  metrics: {
    name: string;
    target: number;
    current: number;
    unit: string;
  }[];
  tags: string[];
}

const OutreachPlans = () => {
  const [planFilter, setPlanFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePlan, setActivePlan] = useState<MarketingPlan | null>(null);
  
  const { data: marketingPlans = [], isLoading } = useQuery({
    queryKey: ['marketing-plans'],
    queryFn: () => marketingService.getMarketingPlans(),
  });
  
  const filteredPlans = marketingPlans.filter((plan: MarketingPlan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = planFilter === 'all' || 
                          (planFilter === 'active' && plan.status === 'active') ||
                          (planFilter === 'upcoming' && plan.status === 'upcoming') ||
                          (planFilter === 'completed' && plan.status === 'completed');
                         
    return matchesSearch && matchesFilter;
  });
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Completed</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getActionTypeIcon = (type: string) => {
    switch(type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <CalendarDays className="h-4 w-4" />;
      case 'content':
        return <File className="h-4 w-4" />;
      case 'social':
        return <MessageSquare className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'campaign':
        return <Megaphone className="h-4 w-4" />;
      default:
        return <ChevronRight className="h-4 w-4" />;
    }
  };
  
  const getActionStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container py-6 mx-auto space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Outreach Plans</h1>
          <p className="text-muted-foreground">
            Manage and track marketing plans, campaigns, and initiatives
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Plan
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                marketingPlans.filter((plan: MarketingPlan) => plan.status === 'active').length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running outreach plans
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                marketingPlans.filter((plan: MarketingPlan) => plan.status === 'upcoming').length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Plans scheduled to begin soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                marketingPlans.length > 0 
                  ? Math.round(marketingPlans.filter((plan: MarketingPlan) => plan.status === 'active')
                      .reduce((acc: number, plan: MarketingPlan) => acc + plan.progress, 0) / 
                      Math.max(1, marketingPlans.filter((plan: MarketingPlan) => plan.status === 'active').length)) + '%'
                  : '0%'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Mean completion rate of active plans
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plans..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex">
          <Tabs defaultValue="all" className="w-full" onValueChange={setPlanFilter}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-2 w-full mb-1" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : filteredPlans.length === 0 ? (
          <div className="col-span-full flex justify-center p-12">
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No plans found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try changing your search or filter criteria
              </p>
              <Button>Create New Plan</Button>
            </div>
          </div>
        ) : (
          filteredPlans.map((plan: MarketingPlan) => (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{plan.title}</CardTitle>
                  {getStatusBadge(plan.status)}
                </div>
                <CardDescription className="line-clamp-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center">
                    <CalendarDays className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {format(new Date(plan.startDate), 'MMM d')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{plan.owner}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs flex justify-between font-medium">
                    <span>Progress</span>
                    <span>{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {plan.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="ghost" className="w-full" onClick={() => setActivePlan(plan)}>
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Plan Details Dialog */}
      {activePlan && (
        <Dialog open={!!activePlan} onOpenChange={(open) => !open && setActivePlan(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl">{activePlan.title}</DialogTitle>
                {getStatusBadge(activePlan.status)}
              </div>
              <DialogDescription className="text-base">
                {activePlan.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Date Range</h4>
                  <p className="text-sm flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                    {format(new Date(activePlan.startDate), 'MMM d, yyyy')} - {format(new Date(activePlan.endDate), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Owner</h4>
                  <p className="text-sm flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    {activePlan.owner}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Objectives</h4>
                <ul className="space-y-1">
                  {activePlan.objectives.map((objective, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <Target className="h-4 w-4 mr-2 mt-0.5 text-primary-foreground bg-primary rounded-full p-0.5" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Key Metrics</h4>
                {activePlan.metrics.map((metric, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{metric.name}</span>
                      <span>
                        {metric.current}/{metric.target} {metric.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(metric.current / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Action Items</h4>
                <ul className="space-y-2">
                  {activePlan.actions.map((action) => (
                    <li key={action.id} className="text-sm border rounded-md p-2">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <div className="bg-muted mr-2 p-1 rounded">
                            {getActionTypeIcon(action.type)}
                          </div>
                          <span className="font-medium">{action.description}</span>
                        </div>
                        {getActionStatusBadge(action.status)}
                      </div>
                      <div className="text-xs text-muted-foreground ml-8 flex justify-between">
                        <span>Due: {format(new Date(action.dueDate), 'MMM d, yyyy')}</span>
                        <span>Assignee: {action.assignee}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setActivePlan(null)}>
                Close
              </Button>
              <Button>
                <BarChart4 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OutreachPlans;
