
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, Briefcase, DollarSign } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import TaskList from "@/components/employee/TaskList";
import { useAuth } from "@/hooks/useAuth";

interface DashboardProps {
  // Add any necessary props
}

const Dashboard: React.FC<DashboardProps> = () => {
  const { user, isAdmin, isEmployee, isClient, isMarketing, isHR, isFinance } = useAuth();
  
  // Show different content based on user role
  const renderRoleDashboard = () => {
    if (isEmployee) {
      return <EmployeeDashboard />;
    } else if (isClient) {
      return <ClientDashboard />;
    } else if (isMarketing) {
      return <MarketingDashboard />;
    } else if (isHR) {
      return <HrDashboard />;
    } else if (isFinance) {
      return <FinanceDashboard />;
    } else {
      return <GeneralDashboard />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      {renderRoleDashboard()}
    </div>
  );
};

const GeneralDashboard = () => {
  return (
    <div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Total Clients"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              value="28"
              description="Active clients this month"
            />
            
            <DashboardCard 
              title="Total Projects"
              icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
              value="93"
              description="12 added this month"
            />
            
            <DashboardCard 
              title="Team Members"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              value="14"
              description="2 joined this month"
            />
            
            <DashboardCard 
              title="Total Revenue"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              value="$45,231.89"
              description="+20.1% from last month"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <AnalyticsChart
                  data={[]}
                  categories={['Revenue']}
                  index="month"
                  colors={['#0ea5e9']}
                  height={350}
                  valueFormatter={(value) => `$${value}`}
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest activities across your clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={[]}
                  categories={['Tasks']}
                  index="day" 
                  colors={['#10b981']}
                  valueFormatter={(value) => `${value} tasks`}
                  height={350}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <TaskList className="col-span-4" />
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Tasks due in the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Upcoming deadlines content */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics content */}
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          {/* Reports content */}
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          {/* Notifications content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmployeeDashboard = () => {
  return <div>Employee Dashboard Content</div>;
};

const ClientDashboard = () => {
  return <div>Client Dashboard Content</div>;
};

const MarketingDashboard = () => {
  return <div>Marketing Dashboard Content</div>;
};

const HrDashboard = () => {
  return <div>HR Dashboard Content</div>;
};

const FinanceDashboard = () => {
  return <div>Finance Dashboard Content</div>;
};

export default Dashboard;
