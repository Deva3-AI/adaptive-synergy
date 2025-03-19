
import React from "react";
import {
  BarChart,
  PieChart,
  Briefcase,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  AlertCircle,
  Calendar,
  MessageSquare,
  FileText,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample data for charts
const projectStatusData = [
  { name: "Completed", value: 12 },
  { name: "In Progress", value: 8 },
  { name: "Planning", value: 4 },
  { name: "On Hold", value: 2 },
];

const timeAllocationData = [
  { name: "Design", value: 35 },
  { name: "Development", value: 25 },
  { name: "Research", value: 15 },
  { name: "Meetings", value: 15 },
  { name: "Admin", value: 10 },
];

const monthlyHoursData = [
  { name: "Jan", hours: 120 },
  { name: "Feb", hours: 145 },
  { name: "Mar", hours: 132 },
  { name: "Apr", hours: 165 },
  { name: "May", hours: 178 },
  { name: "Jun", hours: 150 },
  { name: "Jul", hours: 187 },
  { name: "Aug", hours: 192 },
  { name: "Sep", hours: 170 },
];

const currentProjects = [
  {
    id: 1,
    name: "Website Redesign",
    type: "Design & Development",
    progress: 65,
    status: "In Progress",
    dueDate: "Sep 30, 2023",
    team: ["JD", "MS", "RJ", "AL"],
  },
  {
    id: 2,
    name: "Mobile App Development",
    type: "Development",
    progress: 34,
    status: "In Progress",
    dueDate: "Oct 15, 2023",
    team: ["JD", "MS", "SC"],
  },
  {
    id: 3,
    name: "Marketing Campaign",
    type: "Marketing",
    progress: 78,
    status: "In Progress",
    dueDate: "Sep 25, 2023",
    team: ["AL", "JD"],
  },
  {
    id: 4,
    name: "Brand Guidelines",
    type: "Design",
    progress: 100,
    status: "Completed",
    dueDate: "Sep 10, 2023",
    team: ["RJ", "JD"],
  },
];

const recentDeliverables = [
  {
    id: 1,
    name: "Homepage Mockup",
    project: "Website Redesign",
    type: "Design",
    deliveredDate: "Sep 18, 2023",
    status: "Approved",
  },
  {
    id: 2,
    name: "User Authentication Flow",
    project: "Mobile App Development",
    type: "Development",
    deliveredDate: "Sep 15, 2023",
    status: "Needs Revision",
  },
  {
    id: 3,
    name: "Logo Variations",
    project: "Brand Guidelines",
    type: "Design",
    deliveredDate: "Sep 8, 2023",
    status: "Approved",
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Needs Revision":
      return "warning";
    case "Rejected":
      return "destructive";
    case "In Progress":
      return "accent";
    case "Completed":
      return "success";
    case "On Hold":
      return "secondary";
    default:
      return "outline";
  }
};

const ClientDashboard = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your projects, tasks, and team activity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 in design, 5 in development</p>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">170</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex -space-x-2 mt-1">
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback>RJ</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback>+8</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deliverables</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Next: Mobile App Designs (2 days)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Monthly Hours"
          icon={<BarChart className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={monthlyHoursData} 
            height={250}
            defaultType="bar"
          />
        </DashboardCard>

        <DashboardCard
          title="Time Allocation"
          icon={<PieChart className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={timeAllocationData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Current Projects"
        icon={<Briefcase className="h-5 w-5" />}
        badgeText="Status"
        badgeVariant="outline"
      >
        <div className="space-y-4">
          {currentProjects.map(project => (
            <div 
              key={project.id} 
              className="p-4 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.type} • Due {project.dueDate}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.team.map((member, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback>{member}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Project Status Overview"
          icon={<CheckCircle className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={projectStatusData} 
            height={200}
            defaultType="donut"
          />
        </DashboardCard>

        <DashboardCard
          title="Recent Deliverables"
          icon={<FileText className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {recentDeliverables.map(deliverable => (
              <div 
                key={deliverable.id} 
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{deliverable.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {deliverable.project} • {deliverable.type} • Delivered {deliverable.deliveredDate}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(deliverable.status)}>
                  {deliverable.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">View All Deliverables</Button>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="Recent Communications"
        icon={<MessageSquare className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-md border border-border bg-muted/30">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Jane Doe</h4>
                  <p className="text-xs text-muted-foreground">Today at 10:23 AM</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Just sent over the updated homepage mockups for the website redesign. Please take a look when you have a chance and let me know your thoughts.
                </p>
                <div className="mt-3 flex items-center space-x-2">
                  <Button variant="outline" size="sm">View Mockups</Button>
                  <Button variant="ghost" size="sm">Reply</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-md border border-border bg-muted/30">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Mike Smith</h4>
                  <p className="text-xs text-muted-foreground">Yesterday at 4:15 PM</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  The development team has completed the user authentication flow for the mobile app. Would you like to schedule a demo this week?
                </p>
                <div className="mt-3 flex items-center space-x-2">
                  <Button variant="outline" size="sm">Schedule Demo</Button>
                  <Button variant="ghost" size="sm">Reply</Button>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">View All Messages</Button>
        </div>
      </DashboardCard>
    </div>
  );
};

export default ClientDashboard;
