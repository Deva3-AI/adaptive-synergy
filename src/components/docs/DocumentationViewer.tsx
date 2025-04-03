
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FileText, Book, Code, Users, Calendar, Bell, BarChart2, CreditCard, Briefcase, Layout, Database, Server, Shield, Wifi } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { documentationService } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';

const DocumentationViewer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("frontend");
  const [frontendDocumentation, setFrontendDocumentation] = useState("");
  const [backendDocumentation, setBackendDocumentation] = useState("");
  const [aiDocumentation, setAIDocumentation] = useState("");

  // Fetch documentation content using the documentationService
  const { data: frontendDocs, isLoading: frontendLoading } = useQuery({
    queryKey: ['frontend-documentation'],
    queryFn: () => documentationService.getFrontendDocs(),
    onSuccess: (data) => {
      if (data?.content) {
        setFrontendDocumentation(data.content);
      }
    }
  });

  const { data: backendDocs, isLoading: backendLoading } = useQuery({
    queryKey: ['backend-documentation'],
    queryFn: () => documentationService.getBackendDocs(),
    onSuccess: (data) => {
      if (data?.content) {
        setBackendDocumentation(data.content);
      }
    }
  });

  const { data: aiDocs, isLoading: aiLoading } = useQuery({
    queryKey: ['ai-documentation'],
    queryFn: () => documentationService.getAIDocs(),
    onSuccess: (data) => {
      if (data?.content) {
        setAIDocumentation(data.content);
      }
    }
  });

  // Fallback to local content if API fails
  useEffect(() => {
    const loadLocalDocs = async () => {
      try {
        // Only load local docs if the API request didn't return content
        if (!frontendDocumentation) {
          const frontendModule = await import('../../docs/FrontendDocumentation.md');
          setFrontendDocumentation(frontendModule.default);
        }
        
        if (!backendDocumentation) {
          const backendModule = await import('../../docs/BackendDocumentation.md');
          setBackendDocumentation(backendModule.default);
        }
        
        if (!aiDocumentation) {
          const aiModule = await import('../../docs/AIDocumentation.md');
          setAIDocumentation(aiModule.default);
        }
      } catch (error) {
        console.error("Error loading documentation files:", error);
      }
    };

    loadLocalDocs();
  }, [frontendDocumentation, backendDocumentation, aiDocumentation]);

  // Sections for navigation - Frontend
  const frontendSections = [
    { id: "overview", name: "Overview", icon: FileText },
    { id: "authentication-module", name: "Authentication", icon: Shield },
    { id: "dashboard", name: "Dashboard", icon: Layout },
    { id: "announcements", name: "Announcements", icon: Bell },
    { id: "calendar", name: "Calendar", icon: Calendar },
    { id: "employee-module", name: "Employee", icon: Users },
    { id: "hr-module", name: "HR", icon: Users },
    { id: "marketing-module", name: "Marketing", icon: BarChart2 },
    { id: "finance-module", name: "Finance", icon: CreditCard },
    { id: "client-module", name: "Client", icon: Briefcase },
    { id: "task-management", name: "Tasks", icon: Code },
    { id: "common-components", name: "Components", icon: Layout },
    { id: "interfaces-services", name: "Services", icon: Code },
  ];

  // Sections for navigation - Backend
  const backendSections = [
    { id: "overview", name: "Overview", icon: FileText },
    { id: "architecture", name: "Architecture", icon: Layout },
    { id: "database-schema", name: "Database Schema", icon: Database },
    { id: "api-endpoints", name: "API Endpoints", icon: Server },
    { id: "authentication-module", name: "Authentication", icon: Shield },
    { id: "employee-module", name: "Employee API", icon: Users },
    { id: "client-module", name: "Client API", icon: Briefcase },
    { id: "hr-module", name: "HR API", icon: Users },
    { id: "finance-module", name: "Finance API", icon: CreditCard },
    { id: "marketing-module", name: "Marketing API", icon: BarChart2 },
    { id: "ai-module", name: "AI API", icon: Book },
    { id: "platform-integrations", name: "Integrations", icon: Wifi },
    { id: "development-deployment", name: "Deployment", icon: Server },
  ];

  // Sections for navigation - AI
  const aiSections = [
    { id: "overview", name: "Overview", icon: Book },
    { id: "core-ai-technologies", name: "Core AI Technologies", icon: Brain },
    { id: "client-module-ai-features", name: "Client AI Features", icon: Briefcase },
    { id: "employee-module-ai-features", name: "Employee AI Features", icon: Users },
    { id: "marketing-module-ai-features", name: "Marketing AI Features", icon: BarChart2 },
    { id: "finance-module-ai-features", name: "Finance AI Features", icon: CreditCard },
    { id: "hr-module-ai-features", name: "HR AI Features", icon: Users },
    { id: "platform-integration-ai-features", name: "Platform Integration", icon: Wifi },
    { id: "implementation-details", name: "Implementation", icon: Code },
    { id: "future-ai-enhancements", name: "Future Enhancements", icon: Lightbulb },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filterContent = (content: string) => {
    if (!searchTerm.trim()) return content;
    
    // Simple filtering - highlight matched sections in a production app
    // would be more sophisticated
    return content;
  };

  const getSections = () => {
    switch (activeTab) {
      case 'frontend':
        return frontendSections;
      case 'backend':
        return backendSections;
      case 'ai':
        return aiSections;
      default:
        return frontendSections;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Book className="mr-2 h-8 w-8 text-primary" />
            Documentation
          </h1>
          <p className="text-muted-foreground">
            Comprehensive documentation of the HyperFlow platform
          </p>
        </div>
      </div>

      <Tabs defaultValue="frontend" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
        </TabsList>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Sidebar */}
          <Card className="w-full lg:w-64 flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle>Navigation</CardTitle>
              <CardDescription>Browse documentation sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <ScrollArea className="h-[calc(100vh-240px)]">
                <div className="space-y-1">
                  {getSections().map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      <section.icon className="mr-2 h-4 w-4" />
                      {section.name}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Main Content */}
          <TabsContent value="frontend" className="flex-1 mt-0">
            <Card className="w-full">
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  {frontendLoading ? (
                    <div className="flex items-center justify-center h-96">
                      <Spinner size="lg" />
                      <span className="ml-3">Loading documentation...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                      <ReactMarkdown>{filterContent(frontendDocumentation)}</ReactMarkdown>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backend" className="flex-1 mt-0">
            <Card className="w-full">
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  {backendLoading ? (
                    <div className="flex items-center justify-center h-96">
                      <Spinner size="lg" />
                      <span className="ml-3">Loading documentation...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                      <ReactMarkdown>{filterContent(backendDocumentation)}</ReactMarkdown>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="flex-1 mt-0">
            <Card className="w-full">
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  {aiLoading ? (
                    <div className="flex items-center justify-center h-96">
                      <Spinner size="lg" />
                      <span className="ml-3">Loading documentation...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                      <ReactMarkdown>{filterContent(aiDocumentation)}</ReactMarkdown>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DocumentationViewer;
