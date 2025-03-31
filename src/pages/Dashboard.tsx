import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Activity, Users, Briefcase, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { userService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isEmployee, isClient, isMarketing, isHR, isFinance } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Redirect to role-specific dashboard if user has a specific role
    if (isEmployee) {
      navigate("/employee/dashboard");
    } else if (isClient) {
      navigate("/client/dashboard");
    } else if (isMarketing) {
      navigate("/marketing/dashboard");
    } else if (isHR) {
      navigate("/hr/dashboard");
    } else if (isFinance) {
      navigate("/finance/dashboard");
    }
  }, [isEmployee, isClient, isMarketing, isHR, isFinance, navigate]);

  // Sample data for charts
  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 4500 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 4800 },
    { name: "May", revenue: 5500 },
    { name: "Jun", revenue: 6000 },
  ];

  const clientData = [
    { name: "Tech", value: 35 },
    { name: "Healthcare", value: 25 },
    { name: "Finance", value: 20 },
    { name: "Retail", value: 15 },
    { name: "Other", value: 5 },
  ];

  const projectStatusData = [
    { name: "Completed", value: 45 },
    { name: "In Progress", value: 35 },
    { name: "Planning", value: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button>
            <Briefcase className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">
                  +2 since last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Clients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+24</div>
                <p className="text-xs text-muted-foreground">
                  +4 since last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+18</div>
                <p className="text-xs text-muted-foreground">
                  +2 since last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <DashboardCard
              title="Revenue Over Time"
              icon={<BarChart className="h-5 w-5" />}
              className="col-span-4"
            >
              <AnalyticsChart 
                data={revenueData} 
                height={350}
                defaultType="bar"
              />
            </DashboardCard>
            <DashboardCard
              title="Clients by Industry"
              icon={<Users className="h-5 w-5" />}
              className="col-span-3"
            >
              <AnalyticsChart 
                data={clientData} 
                height={350}
                defaultType="pie"
              />
            </DashboardCard>
          </div>

          <DashboardCard
            title="Recent Projects"
            icon={<Briefcase className="h-5 w-5" />}
          >
            <div className="space-y-8">
              {[
                {
                  name: "Website Redesign",
                  client: "Acme Corp",
                  status: "In Progress",
                  completion: 65,
                  dueDate: "Oct 28, 2023",
                },
                {
                  name: "Mobile App Development",
                  client: "Globex Inc",
                  status: "Planning",
                  completion: 25,
                  dueDate: "Nov 15, 2023",
                },
                {
                  name: "Brand Identity",
                  client: "Stark Industries",
                  status: "Completed",
                  completion: 100,
                  dueDate: "Oct 10, 2023",
                },
              ].map((project, index) => (
                <div key={index} className="flex items-center">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {project.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {project.client}
                    </p>
                  </div>
                  <div className="ml-auto font-medium flex flex-col items-end gap-1">
                    <div className="text-sm">{project.status}</div>
                    <div className="text-xs text-muted-foreground">
                      Due: {project.dueDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <DashboardCard
            title="Project Status Distribution"
            icon={<BarChart className="h-5 w-5" />}
          >
            <AnalyticsChart 
              data={projectStatusData} 
              height={350}
              defaultType="pie"
            />
          </DashboardCard>
        </TabsContent>
        <TabsContent value="reports">
          <div className="p-12 text-center text-muted-foreground">
            Reports dashboard coming soon
          </div>
        </TabsContent>
        <TabsContent value="clients">
          <div className="p-12 text-center text-muted-foreground">
            Clients dashboard coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
