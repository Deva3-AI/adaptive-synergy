
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FileText, Book, Code, Users, Calendar, Bell, BarChart2, CreditCard, Briefcase, Layout } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

// Import the documentation content
import documentationContent from '../../docs/FrontendDocumentation.md';

const DocumentationViewer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [docContent, setDocContent] = useState(documentationContent);

  // Sections for navigation
  const sections = [
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
            Comprehensive documentation of the platform's frontend features and components
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
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
                {sections.map((section) => (
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
        <Card className="flex-1">
          <CardContent className="p-6">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <ReactMarkdown>{docContent}</ReactMarkdown>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentationViewer;
