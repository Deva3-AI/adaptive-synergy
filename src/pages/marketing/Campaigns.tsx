
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, BarChart, Filter, MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data
const campaigns = [
  {
    id: 1,
    name: "Summer Product Launch",
    type: "Email",
    status: "Active",
    start: "2023-06-01",
    end: "2023-08-31",
    budget: 5000,
    spent: 2800,
    leads: 128,
    conversion: 4.2,
  },
  {
    id: 2,
    name: "Q3 Social Media Push",
    type: "Social",
    status: "Active",
    start: "2023-07-01",
    end: "2023-09-30",
    budget: 7500,
    spent: 3200,
    leads: 215,
    conversion: 3.8,
  },
  {
    id: 3,
    name: "Website Retargeting",
    type: "Display",
    status: "Active",
    start: "2023-05-15",
    end: "2023-08-15",
    budget: 3000,
    spent: 2700,
    leads: 92,
    conversion: 2.6,
  },
  {
    id: 4,
    name: "Spring Promotion",
    type: "Email",
    status: "Completed",
    start: "2023-03-01",
    end: "2023-05-31",
    budget: 4500,
    spent: 4500,
    leads: 167,
    conversion: 3.7,
  },
  {
    id: 5,
    name: "New Product Announcement",
    type: "Multi-channel",
    status: "Planned",
    start: "2023-09-15",
    end: "2023-11-30",
    budget: 9000,
    spent: 0,
    leads: 0,
    conversion: 0,
  },
];

// Status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Active":
      return "success";
    case "Planned":
      return "secondary";
    case "Completed":
      return "default";
    case "Paused":
      return "warning";
    default:
      return "outline";
  }
};

const MarketingCampaigns = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Management</h1>
          <p className="text-muted-foreground">
            Create and manage your marketing campaigns
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Active Campaigns</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="display">Display</SelectItem>
                  <SelectItem value="multi">Multi-channel</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="planned">Planned</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.type}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 max-w-[180px]">
                          <div className="text-xs text-muted-foreground">
                            {new Date(campaign.start).toLocaleDateString()} - {new Date(campaign.end).toLocaleDateString()}
                          </div>
                          {campaign.status !== "Planned" && (
                            <Progress 
                              value={campaign.spent / campaign.budget * 100} 
                              className="h-1.5" 
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">${campaign.spent.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            of ${campaign.budget.toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{campaign.leads}</TableCell>
                      <TableCell>{campaign.conversion}%</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <BarChart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="active">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Active Campaigns View</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing only active campaigns would appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="planned">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Planned Campaigns View</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing only planned campaigns would appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Completed Campaigns View</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing only completed campaigns would appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingCampaigns;
