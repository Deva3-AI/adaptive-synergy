
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FileText, Book, Code, Users, Calendar, Bell, BarChart2, CreditCard, Briefcase, Layout, Database, Server, Shield, Wifi } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

// Import the documentation content
import frontendDocumentation from '../../docs/FrontendDocumentation.md';
import backendDocumentation from '../../docs/BackendDocumentation.md';

const DocumentationViewer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("frontend");

  // Sections for navigation - Frontend
  const frontendSections = [
    { id: "overview", name: "Overview", icon: FileText },
    { id: "authentication-module", name: "Authentication", icon: Users },
    { id: "dashboard", name: "Dashboard", icon: Layout },
    { id: "announcements", name: "Announcements", icon: Bell },
    { id: "calendar", name: "Calendar", icon: Calendar },
    { id: "employee-module", name: "Employee", icon: Users },
    { id: "hr-module", name: "HR", icon: Users },
    { id: "marketing-module", name: "Marketing", icon: BarChart2 },
    { id: "finance-module", name: "Finance", icon: CreditCard },
    { id: "client-module", name: "Client", icon: Briefcase },
    { id: "task-management", name: "Tasks", icon: Code },
    { id: "ai-features", name: "AI Features", icon: Book },
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
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
                  {activeTab === "frontend" ? 
                    frontendSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                      >
                        <section.icon className="mr-2 h-4 w-4" />
                        {section.name}
                      </button>
                    )) : 
                    backendSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                      >
                        <section.icon className="mr-2 h-4 w-4" />
                        {section.name}
                      </button>
                    ))
                  }
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Main Content */}
          <TabsContent value="frontend" className="flex-1 mt-0">
            <Card className="w-full">
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <ReactMarkdown>{frontendDocumentation}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backend" className="flex-1 mt-0">
            <Card className="w-full">
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <ReactMarkdown>{backendDocumentation}</ReactMarkdown>
                  </div>
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
