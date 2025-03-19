
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart, Clock, Target, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="container py-6 px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <span className="font-display font-bold text-xl">HyperFlow</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/login">
            <Button className="button-shine">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="container px-4 mx-auto flex-1 flex flex-col lg:flex-row items-center gap-8 py-12 lg:py-20">
        <div className="lg:w-1/2 space-y-6 animate-fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            AI-Powered Workflow Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
            Optimize Your Workflow with{" "}
            <span className="text-gradient">Intelligent AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            HyperFlow combines state-of-the-art AI with intuitive dashboards to streamline your workflow, optimize resource allocation, and drive real-time insights.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/login">
              <Button size="lg" className="button-shine">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 animate-blur-in" style={{ animationDelay: "150ms" }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 blur-xl opacity-20 rounded-2xl"></div>
            <div className="relative glass-card rounded-2xl overflow-hidden border border-white/20 shadow-xl">
              <img 
                src="https://placehold.co/800x500/2A2F3E/FFFFFF/png?text=Dashboard+Preview" 
                alt="Dashboard Preview" 
                className="w-full rounded-xl object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-xl border border-white/20 shadow-lg w-24 h-24 flex items-center justify-center animate-float">
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <div className="absolute -top-6 -left-6 glass-card p-4 rounded-xl border border-white/20 shadow-lg w-24 h-24 flex items-center justify-center animate-float" style={{ animationDelay: "0.5s" }}>
              <BarChart className="h-8 w-8 text-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container px-4 mx-auto py-16">
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <h2 className="text-3xl font-display font-bold">Intelligent Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Harness the power of AI to optimize every aspect of your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <BarChart className="h-10 w-10 text-accent" />,
              title: "AI-Driven Analytics",
              description: "Gain deep insights with predictive analytics that forecast task durations and suggest resource optimization.",
            },
            {
              icon: <Target className="h-10 w-10 text-accent" />,
              title: "Automated Task Allocation",
              description: "Our AI analyzes client requirements, historical data, and team skills to optimally assign tasks.",
            },
            {
              icon: <Clock className="h-10 w-10 text-accent" />,
              title: "Intelligent Work Tracking",
              description: "Track work sessions with precision and generate detailed reports on productivity and task completion.",
            },
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 rounded-xl hover-scale shadow-subtle animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container px-4 mx-auto py-16">
        <div className="glass-card relative overflow-hidden rounded-xl p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Ready to transform your workflow?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of teams already using HyperFlow to optimize their workflows and drive productivity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="button-shine">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Book a Demo
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent z-0"></div>
          <div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-1/4">
            <div className="text-accent/5 dark:text-accent/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="400"
                height="400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={0.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container px-4 mx-auto py-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="font-display font-bold">HyperFlow</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HyperFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
