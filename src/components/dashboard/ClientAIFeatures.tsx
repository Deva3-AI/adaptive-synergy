
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Clock, Lightbulb, UserRound, MessageSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientAIFeatures = () => {
  const features = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Client-Centric Memory',
      description: 'AI builds profiles for each client and brand, storing their preferences from communications and feedback.',
      link: '/ai/client-requirements'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Task Time Optimization',
      description: 'Time estimates factor in employee efficiency and historical completion times for similar client tasks.',
      link: '/employee/tasks'
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: 'Client Feedback Integration',
      description: 'AI continuously learns from client interactions, improving suggestions for future tasks.',
      link: '/ai/client-requirements'
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: 'Proactive Reminders',
      description: 'Receive client-specific notes and warnings to prevent missteps during task execution.',
      link: '/ai/client-requirements'
    },
    {
      icon: <UserRound className="h-8 w-8 text-primary" />,
      title: 'Client Dashboard',
      description: 'Clients can assign tasks, track progress, and access comprehensive reports on their projects.',
      link: '/client/dashboard'
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: 'Virtual Manager',
      description: 'Receive intelligent guidance on client preferences, deadlines, and communication styles.',
      link: '/ai/client-requirements'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI-Powered Client Tools</h2>
        <p className="text-muted-foreground">
          Intelligent features that enhance client relationships and optimize workflows
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="mb-3">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button variant="outline" asChild className="w-full">
                <Link to={feature.link}>
                  Explore Feature
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
            Client Requirements Analyzer
          </CardTitle>
          <CardDescription>
            Analyze client inputs and generate actionable tasks with time estimates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Upload client communications or requirements to extract key insights, analyze sentiment, and generate 
            task recommendations with accurate time estimates based on historical performance.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link to="/ai/client-requirements">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Get Started
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientAIFeatures;
