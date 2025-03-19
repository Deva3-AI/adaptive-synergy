
import React from "react";
import { BarChart, Clock, Briefcase, CalendarCheck, Users, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmployeeWorkTracker from "@/components/dashboard/EmployeeWorkTracker";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Badge } from "@/components/ui/Badge";

// Sample data for charts
const weeklyActivityData = [
  { name: "Mon", tasks: 5, meetings: 2, completed: 4 },
  { name: "Tue", tasks: 7, meetings: 1, completed: 6 },
  { name: "Wed", tasks: 3, meetings: 3, completed: 3 },
  { name: "Thu", tasks: 8, meetings: 2, completed: 7 },
  { name: "Fri", tasks: 4, meetings: 0, completed: 4 },
  { name: "Sat", tasks: 2, meetings: 0, completed: 2 },
  { name: "Sun", tasks: 0, meetings: 0, completed: 0 },
];

const taskDistributionData = [
  { name: "Design", value: 35 },
  { name: "Development", value: 45 },
  { name: "Research", value: 15 },
  { name: "Meetings", value: 5 },
];

const taskItems = [
  {
    title: "Update client dashboard design",
    client: "Acme Inc.",
    dueDate: "Today",
    priority: "High",
    status: "In Progress",
  },
  {
    title: "Prepare monthly analytics report",
    client: "TechCorp",
    dueDate: "Tomorrow",
    priority: "Medium",
    status: "Not Started",
  },
  {
    title: "Client onboarding meeting",
    client: "NewStart LLC",
    dueDate: "Today",
    priority: "High", 
    status: "Upcoming",
  },
  {
    title: "Review marketing materials",
    client: "GrowthHackers",
    dueDate: "Sep 21",
    priority: "Low",
    status: "Not Started",
  },
];

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "High":
      return "danger";
    case "Medium":
      return "warning";
    case "Low":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "accent";
    case "Upcoming":
      return "warning";
    default:
      return "outline";
  }
};

const StatCard = ({ title, value, description, icon: Icon }: { title: string; value: string; description: string; icon: React.ElementType }) => (
  <Card className="hover-scale shadow-subtle">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your workflow today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value="12"
          description="4 tasks due today"
          icon={Briefcase}
        />
        <StatCard
          title="Weekly Hours"
          value="32.5h"
          description="8.1h more than last week"
          icon={Clock}
        />
        <StatCard
          title="Meetings"
          value="3"
          description="1 upcoming in 30 minutes"
          icon={CalendarCheck}
        />
        <StatCard
          title="Active Clients"
          value="8"
          description="2 recently active"
          icon={Users}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Work Timer"
          icon={<Clock className="h-5 w-5" />}
          badgeText="Daily"
          badgeVariant="outline"
        >
          <EmployeeWorkTracker />
        </DashboardCard>

        <DashboardCard
          title="Weekly Activity"
          icon={<BarChart className="h-5 w-5" />}
          badgeText="This Week"
          badgeVariant="outline"
        >
          <AnalyticsChart 
            data={weeklyActivityData} 
            height={250}
            defaultType="area"
          />
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <DashboardCard
          title="Task Distribution"
          icon={<BarChart className="h-5 w-5" />}
          badgeText="Categories"
          badgeVariant="outline"
          className="md:col-span-2"
        >
          <AnalyticsChart 
            data={taskDistributionData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>

        <DashboardCard
          title="Today's Tasks"
          icon={<Briefcase className="h-5 w-5" />}
          badgeText="Priority"
          badgeVariant="outline"
          className="md:col-span-3"
        >
          <div className="space-y-3">
            {taskItems.map((task, index) => (
              <div 
                key={index} 
                className="p-3 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.client} • Due {task.dueDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityBadgeVariant(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(task.status)} size="sm">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="Recent Notifications"
        icon={<Bell className="h-5 w-5" />}
        badgeText="3 New"
        badgeVariant="accent"
      >
        <div className="space-y-4">
          <div className="flex gap-3 items-start pb-3 border-b">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium">New client assignment</h4>
              <p className="text-sm text-muted-foreground">You've been assigned to a new client project: TechCorp Website Redesign</p>
              <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
            </div>
          </div>
          <div className="flex gap-3 items-start pb-3 border-b">
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium">Task completed</h4>
              <p className="text-sm text-muted-foreground">Your task "Create wireframes for mobile app" has been marked as complete</p>
              <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium">Meeting reminder</h4>
              <p className="text-sm text-muted-foreground">Upcoming client meeting with Acme Inc. at 2:00 PM</p>
              <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Dashboard;
