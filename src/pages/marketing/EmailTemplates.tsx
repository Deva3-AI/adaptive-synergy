
import React from 'react';
import EmailTemplatesComponent from '@/components/marketing/EmailTemplates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Settings, BarChart3 } from 'lucide-react';

const EmailTemplates = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Create, manage and track performance of email templates for marketing campaigns
      </p>
      
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-3">
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="outreach">Outreach</TabsTrigger>
            <TabsTrigger value="followup">Follow-up</TabsTrigger>
            <TabsTrigger value="nurture">Nurture</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
      
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Email Template Management</CardTitle>
              <CardDescription>
                Manage your templates, track usage metrics, and optimize your messaging.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplatesComponent />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outreach" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Outreach Templates</CardTitle>
              <CardDescription>Initial contact and cold outreach templates</CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplatesComponent />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="followup" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Templates</CardTitle>
              <CardDescription>Templates for following up after meetings and conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplatesComponent />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nurture" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Nurture Templates</CardTitle>
              <CardDescription>Long-term engagement and relationship building templates</CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplatesComponent />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archived" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Archived Templates</CardTitle>
              <CardDescription>Previously used or deprecated templates</CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplatesComponent />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailTemplates;
