
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecruitmentTracker } from '@/components/hr/RecruitmentTracker';

const Recruitment = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
        <p className="text-muted-foreground">
          Manage job postings, candidates, and recruitment pipeline
        </p>
      </div>

      <Tabs defaultValue="candidates">
        <TabsList>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidates" className="pt-4">
          <RecruitmentTracker />
        </TabsContent>
        
        <TabsContent value="jobs" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-muted-foreground">
                Job postings management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pipeline" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-muted-foreground">
                Recruitment pipeline view coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-muted-foreground">
                Recruitment analytics coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recruitment;
