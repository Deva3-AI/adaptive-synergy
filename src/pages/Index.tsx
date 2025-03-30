
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Calendar, Clock, FileText, LayoutDashboard, ListTodo, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hyper-Integrated AI Workflow</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
              Intelligent workflows powered by adaptive AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unify communication, task management, and performance tracking across all departments with AI-driven insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/ai/client-requirements">
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  Try AI Client Analyzer
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Key Platform Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={<BrainCircuit className="h-10 w-10 text-primary" />}
                title="Client-Centric Memory"
                description="AI builds profiles for each client, learning preferences and requirements to ensure consistency across projects."
              />
              <FeatureCard 
                icon={<Clock className="h-10 w-10 text-primary" />}
                title="Task Time Optimization"
                description="Time estimates based on historical performance data for similar client tasks and employee efficiency."
              />
              <FeatureCard 
                icon={<ListTodo className="h-10 w-10 text-primary" />}
                title="AI Task Generation"
                description="Automatically generate and assign tasks with client-specific details and accurate time estimates."
              />
              <FeatureCard 
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Client Dashboard"
                description="Centralized task management where clients can assign projects and track progress in real-time."
              />
              <FeatureCard 
                icon={<Calendar className="h-10 w-10 text-primary" />}
                title="Attendance Tracking"
                description="Automated login/logout tracking with productivity metrics and detailed reporting."
              />
              <FeatureCard 
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Virtual Manager"
                description="Proactive insights and reminders about client preferences and project requirements."
              />
            </div>
          </div>
        </section>

        <section className="bg-primary/5 py-16">
          <div className="container">
            <div className="bg-background rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Experience AI-Powered Client Analysis</h2>
              <p className="text-muted-foreground mb-6">
                Try our Client Requirements Analyzer to see how our AI can extract insights, 
                generate tasks, and provide guidance based on client communications.
              </p>
              <Button size="lg" asChild>
                <Link to="/ai/client-requirements">
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  Try It Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6">
        <div className="container text-center text-muted-foreground">
          <p>© 2023 Hyper-Integrated AI Workflow & Insights Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-background rounded-lg border p-6 transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
