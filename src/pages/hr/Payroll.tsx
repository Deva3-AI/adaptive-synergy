
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PayrollManagement } from '@/components/hr/PayrollManagement';

const Payroll = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
        <p className="text-muted-foreground">
          Generate and manage employee payslips and salary payments
        </p>
      </div>
      
      <Tabs defaultValue="payslips">
        <TabsList>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payslips" className="pt-4">
          <PayrollManagement />
        </TabsContent>
        
        <TabsContent value="processing" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-muted-foreground">
                Payroll processing features coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-muted-foreground">
                Payroll settings configuration coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-muted-foreground">
                Payroll reporting features coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
