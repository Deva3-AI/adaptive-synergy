
import React from "react";
import {
  BarChart,
  Clock,
  Briefcase,
  CalendarCheck,
  Users,
  CheckCircle,
  Clock8,
  Calendar,
  User,
  LineChart,
  ArrowUpRight,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmployeeWorkTracker from "@/components/dashboard/EmployeeWorkTracker";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample data for charts
const weeklyActivityData = [
  { name: "Mon", hours: 7.5, tasks: 5, completed: 4 },
  { name: "Tue", hours: 8.2, tasks: 7, completed: 6 },
  { name: "Wed", hours: 7.8, tasks: 6, completed: 5 },
  { name: "Thu", hours: 8.5, tasks: 8, completed: 7 },
  { name: "Fri", hours: 6.5, tasks: 4, completed: 4 },
  { name: "Sat", hours: 2.0, tasks: 2, completed: 2 },
  { name: "Sun", hours: 0, tasks: 0, completed: 0 },
];

const taskPriorityData = [
  { name: "High", value: 4 },
  { name: "Medium", value: 8 },
  { name: "Low", value: 3 },
];

const taskStatusData = [
  { name: "Not Started", value: 2 },
  { name: "In Progress", value: 8 },
  { name: "Completed", value: 12 },
  { name: "On Hold", value: 1 },
];

const upcomingTasks = [
  {
    id: 1,
    title: "Website redesign for TechCorp",
    client: "TechCorp",
    due: "Today at 4:00 PM",
    priority: "High",
    status: "In Progress",
    progress: 65,
  },
  {
    id: 2,
    title: "Mobile app wireframes",
    client: "Acme Inc.",
    due: "Tomorrow at 12:00 PM",
    priority: "Medium",
    status: "Not Started",
    progress: 0,
  },
  {
    id: 3,
    title: "Marketing banner designs",
    client: "Growth Hackers",
    due: "Sep 22, 2023",
    priority: "Medium",
    status: "In Progress",
    progress: 30,
  },
  {
    id: 4,
    title: "Client presentation slides",
    client: "NewStart LLC",
    due: "Sep 23, 2023",
    priority: "High",
    status: "Not Started",
    progress: 0,
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
    case "Not Started":
      return "outline";
    case "On Hold":
      return "warning";
    default:
      return "outline";
  }
};

const EmployeeDashboard = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Monitor your tasks, track your time, and enhance your productivity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 completed, 3 remaining</p>
            <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "40%" }} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4h 25m</div>
            <p className="text-xs text-muted-foreground">Target: 8 hours</p>
            <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "55%" }} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Performance</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">4%</span> from last week
            </p>
            <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: "92%" }} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next: Client check-in at 2:00 PM</p>
            <div className="flex items-center mt-2">
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6 border-2 border-background -ml-2">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground ml-2">with TechCorp Team</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Work Session"
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
            defaultType="bar"
          />
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <DashboardCard
          title="Task Priority"
          icon={<AlertCircle className="h-5 w-5" />}
          badgeText="Current"
          badgeVariant="outline"
          className="md:col-span-2"
        >
          <AnalyticsChart 
            data={taskPriorityData} 
            height={200}
            defaultType="pie"
          />
        </DashboardCard>

        <DashboardCard
          title="Task Status"
          icon={<CheckCircle className="h-5 w-5" />}
          badgeText="Overall"
          badgeVariant="outline"
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={taskStatusData} 
            height={200}
            defaultType="bar"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Upcoming Tasks"
        icon={<Briefcase className="h-5 w-5" />}
        badgeText="Priority"
        badgeVariant="outline"
      >
        <div className="space-y-4">
          {upcomingTasks.map((task) => (
            <div 
              key={task.id} 
              className="p-4 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {task.client} • Due {task.due}
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
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Today's Schedule"
          icon={<Calendar className="h-5 w-5" />}
          badgeText="Today"
          badgeVariant="outline"
        >
          <div className="space-y-4">
            <div className="relative pl-5 border-l-2 border-accent">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-accent"></div>
              <p className="text-xs text-muted-foreground">9:00 AM - 10:30 AM</p>
              <h4 className="font-medium">Team Standup Meeting</h4>
              <p className="text-sm text-muted-foreground">
                Weekly sprint planning with the design team
              </p>
            </div>
            <div className="relative pl-5 border-l-2 border-green-500">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
              <p className="text-xs text-muted-foreground">11:00 AM - 12:00 PM</p>
              <h4 className="font-medium">Website Redesign Work</h4>
              <p className="text-sm text-muted-foreground">
                Work on TechCorp homepage mockups
              </p>
            </div>
            <div className="relative pl-5 border-l-2 border-yellow-500">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-yellow-500"></div>
              <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
              <h4 className="font-medium">Client Check-in</h4>
              <p className="text-sm text-muted-foreground">
                Progress review with TechCorp team
              </p>
            </div>
            <div className="relative pl-5 border-l-2 border-muted-foreground">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-muted-foreground"></div>
              <p className="text-xs text-muted-foreground">4:00 PM - 5:30 PM</p>
              <h4 className="font-medium">Mobile App Wireframes</h4>
              <p className="text-sm text-muted-foreground">
                Start work on Acme Inc. mobile app concepts
              </p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Team Members"
          icon={<Users className="h-5 w-5" />}
          badgeText="Online"
          badgeVariant="success"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-green-500">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Jane Doe</h4>
                  <Badge variant="outline" size="sm">Team Lead</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Online • Working on TechCorp Project
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-green-500">
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Mike Smith</h4>
                  <Badge variant="outline" size="sm">Developer</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Online • Working on API Integration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-muted">
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Sarah Chen</h4>
                  <Badge variant="outline" size="sm">Designer</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Offline • Last active 35 min ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-green-500">
                <AvatarFallback>RJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Robert Johnson</h4>
                  <Badge variant="outline" size="sm">Designer</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Online • Working on Acme Inc. Project
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
