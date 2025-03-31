
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, TrendingUp, Users, Check, Edit } from 'lucide-react';

const MarketingOutreachPlans = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Plans</h1>
          <p className="text-muted-foreground">
            Create, manage and track marketing campaign plans
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Q3 Engagement Strategy",
                description: "Boost customer engagement through multi-channel approach",
                dueDate: "October 30, 2025",
                progress: 65,
                owner: "Sarah Wilson"
              },
              {
                title: "Product Launch Campaign",
                description: "Marketing strategy for new product rollout",
                dueDate: "September 15, 2025",
                progress: 42,
                owner: "Michael Chen"
              },
              {
                title: "Social Media Revamp",
                description: "Refresh social presence across all platforms",
                dueDate: "August 22, 2025",
                progress: 78,
                owner: "Jessica Taylor"
              }
            ].map((plan, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.owner}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{plan.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${plan.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm">
                      <Check className="h-4 w-4 mr-1" />
                      Tasks
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="drafts" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-muted-foreground">
                No draft plans available
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-muted-foreground">
                No completed plans available
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Product Launch Template",
                description: "Standard marketing plan for new product releases",
                tasks: 12,
                timeline: "90 days"
              },
              {
                title: "Social Media Campaign",
                description: "Multi-platform social engagement strategy",
                tasks: 8,
                timeline: "45 days"
              }
            ].map((template, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <span>{template.tasks} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{template.timeline}</span>
                    </div>
                  </div>
                  <Button className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingOutreachPlans;
