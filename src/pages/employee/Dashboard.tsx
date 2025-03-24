import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, FileText, ListChecks, Mail, MessageSquare, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { userService, aiService, taskService } from "@/services/api";
import { format } from "date-fns";

const EmployeeDashboard = () => {
  const [taskDescription, setTaskDescription] = useState("");
  const [suggestedTasks, setSuggestedTasks] = useState<any[]>([]);
  const [isLoadingTaskSuggestions, setIsLoadingTaskSuggestions] = useState(false);
  
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: userService.getUserProfile,
  });
  
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["employee-tasks"],
    queryFn: taskService.getEmployeeTasks,
  });
  
  const { data: upcomingEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ["employee-events"],
    queryFn: userService.getUpcomingEvents,
  });

  const handleGenerateTasks = async () => {
    if (!taskDescription.trim()) {
      toast.error("Please enter a task description");
      return;
    }
    
    setIsLoadingTaskSuggestions(true);
    try {
      const result = await aiService.generateSuggestedTasks(taskDescription);
      console.log("Suggested tasks result:", result);
      setSuggestedTasks(result.suggested_tasks || []);
      setTaskDescription("");
      toast.success("Task suggestions generated");
    } catch (error) {
      console.error("Failed to generate task suggestions:", error);
      toast.error("Failed to generate task suggestions");
    } finally {
      setIsLoadingTaskSuggestions(false);
    }
  };

  return (
    <div className="space-y-6 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Track tasks, manage schedule, and collaborate with team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Assigned</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {tasks?.filter((task: any) => task.status === "open").length} open
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Next: {upcomingEvents && upcomingEvents.length > 0 ? format(new Date(upcomingEvents[0].date), 'MMM dd, h:mm a') : 'None scheduled'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Tracked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">Add skills and experience</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
            <CardDescription>
              Track progress and manage deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks?.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{task.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {task.priority === "high" && (
                    <Badge variant="destructive">High Priority</Badge>
                  )}
                  {task.status === "open" && (
                    <Badge variant="outline">Open</Badge>
                  )}
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Collaborate and communicate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Alex Johnson", role: "Frontend Developer" },
              { name: "Sarah Williams", role: "UX Designer" },
              { name: "Michael Brown", role: "Backend Developer" },
            ].map((member, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-medium">{member.name}</h4>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Task Suggestions</CardTitle>
            <CardDescription>
              Get AI-powered task suggestions based on a description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe the project or task..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="resize-none"
              />
              <Button onClick={handleGenerateTasks} disabled={isLoadingTaskSuggestions}>
                {isLoadingTaskSuggestions ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Generate Suggestions
                  </>
                )}
              </Button>
            </div>
            {suggestedTasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Suggested Tasks:</h4>
                <ul className="list-disc pl-5">
                  {suggestedTasks.map((task, index) => (
                    <li key={index} className="text-sm">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Stay informed about important meetings and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents?.map((event: any) => (
              <div key={event.id} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{event.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.date), "MMM dd, yyyy")} at {format(new Date(event.date), "h:mm a")}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
