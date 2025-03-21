
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesDashboard from "@/components/finance/SalesDashboard";

const FinanceDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor financial performance, track revenue, and analyze sales data
        </p>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="projections">Financial Projections</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="pt-4">
          <SalesDashboard />
        </TabsContent>
        <TabsContent value="expenses" className="pt-4">
          <div className="p-12 text-center text-muted-foreground">
            Expenses dashboard coming soon
          </div>
        </TabsContent>
        <TabsContent value="invoices" className="pt-4">
          <div className="p-12 text-center text-muted-foreground">
            Invoices dashboard coming soon
          </div>
        </TabsContent>
        <TabsContent value="projections" className="pt-4">
          <div className="p-12 text-center text-muted-foreground">
            Financial projections coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceDashboard;
