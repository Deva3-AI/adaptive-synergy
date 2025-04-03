
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentationViewer from '@/components/docs/DocumentationViewer';
import { Helmet } from 'react-helmet-async';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('frontend');

  return (
    <div className="container mx-auto py-4">
      <Helmet>
        <title>Documentation | HyperFlow</title>
      </Helmet>

      <Tabs defaultValue="frontend" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <DocumentationViewer />
      </Tabs>
    </div>
  );
};

export default Documentation;
