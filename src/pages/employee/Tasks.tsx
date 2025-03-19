
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Search, 
  Check, 
  Clock, 
  Filter, 
  Calendar, 
  ArrowUpDown, 
  CheckCircle, 
  XCircle,
  PauseCircle,
  Clock8
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Sample task data
const tasks = [
  {
    id: 1,
    title: "Website redesign for TechCorp",
    client: "TechCorp",
    dueDate: new Date("2023-09-21T16:00:00"),
    priority: "High",
    status: "In Progress",
    progress: 65,
    estimatedHours: 24,
    assignedBy: "Jane Doe",
  },
  {
    id: 2,
    title: "Mobile app wireframes for finance app",
    client: "Acme Inc.",
    dueDate: new Date("2023-09-22T12:00:00"),
    priority: "Medium",
    status: "Not Started",
    progress: 0,
    estimatedHours: 12,
    assignedBy: "Mike Smith",
  },
  {
    id: 3,
    title: "Marketing banner designs for seasonal campaign",
    client: "Growth Hackers",
    dueDate: new Date("2023-09-23T12:00:00"),
    priority: "Medium",
    status: "In Progress",
    progress: 30,
    estimatedHours: 8,
    assignedBy: "Sarah Chen",
  },
  {
    id: 4,
    title: "Client presentation deck for quarterly review",
    client: "NewStart LLC",
    dueDate: new Date("2023-09-23T12:00:00"),
    priority: "High",
    status: "Not Started",
    progress: 0,
    estimatedHours: 6,
    assignedBy: "Jane Doe",
  },
  {
    id: 5,
    title: "Brochure design for new product launch",
    client: "Innovate Solutions",
    dueDate: new Date("2023-09-25T17:00:00"),
    priority: "Low",
    status: "Not Started",
    progress: 0,
    estimatedHours: 4,
    assignedBy: "Robert Johnson",
  },
  {
    id: 6,
    title: "Social media graphics for upcoming event",
    client: "TechConf 2023",
    dueDate: new Date("2023-09-20T09:00:00"),
    priority: "Medium",
    status: "Completed",
    progress: 100,
    estimatedHours: 3,
    assignedBy: "Sarah Chen",
  },
  {
    id: 7,
    title: "Email template design for newsletter",
    client: "TechCorp",
    dueDate: new Date("2023-09-19T14:00:00"),
    priority: "Medium",
    status: "Completed",
    progress: 100,
    estimatedHours: 4,
    assignedBy: "Jane Doe",
  },
  {
    id: 8,
    title: "Update brand guidelines documentation",
    client: "Acme Inc.",
    dueDate: new Date("2023-09-26T16:00:00"),
    priority: "Low",
    status: "On Hold",
    progress: 15,
    estimatedHours: 10,
    assignedBy: "Robert Johnson",
  },
];

const priorityColorMap: Record<string, string> = {
  "High": "destructive",
  "Medium": "warning",
  "Low": "secondary",
};

const statusIconMap: Record<string, React.ReactNode> = {
  "Completed": <CheckCircle className="h-5 w-5 text-green-500" />,
  "In Progress": <Clock8 className="h-5 w-5 text-blue-500" />,
  "Not Started": <Clock className="h-5 w-5 text-gray-500" />,
  "On Hold": <PauseCircle className="h-5 w-5 text-yellow-500" />,
  "Cancelled": <XCircle className="h-5 w-5 text-red-500" />,
};

const EmployeeTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  // Filter tasks based on search term and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    setSearchTerm("");
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else {
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="space-y-6 animate-blur-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          View and manage all your assigned tasks
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4 mr-1" />
            Status
            {statusFilter && <Badge variant="secondary" className="ml-1">{statusFilter}</Badge>}
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            Priority
            {priorityFilter && (
              <Badge 
                variant={priorityFilter ? (priorityColorMap[priorityFilter] as any) : "secondary"} 
                className="ml-1"
              >
                {priorityFilter}
              </Badge>
            )}
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4 mr-1" />
            Date
          </Button>
          
          {(statusFilter || priorityFilter || searchTerm) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
          
          <Button className="ml-2 hidden sm:flex">
            <Check className="h-4 w-4 mr-2" />
            Mark Selected
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <div className="flex items-center h-4">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </div>
              </TableHead>
              <TableHead>Task & Client</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="hidden md:table-cell">Priority</TableHead>
              <TableHead className="hidden lg:table-cell">Status</TableHead>
              <TableHead className="hidden xl:table-cell">Progress</TableHead>
              <TableHead className="text-right">Time Est.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id} className="group cursor-pointer hover:bg-muted/50">
                <TableCell className="p-2 md:p-4">
                  <div className="flex items-center h-4">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </div>
                </TableCell>
                <TableCell className="p-2 md:p-4">
                  <Link to={`/employee/tasks/${task.id}`} className="block group-hover:underline">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {task.client}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="p-2 md:p-4 hidden md:table-cell">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                </TableCell>
                <TableCell className="p-2 md:p-4 hidden md:table-cell">
                  <Badge variant={priorityColorMap[task.priority] as any}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className="p-2 md:p-4 hidden lg:table-cell">
                  <div className="flex items-center">
                    {statusIconMap[task.status]}
                    <span className="ml-2">{task.status}</span>
                  </div>
                </TableCell>
                <TableCell className="p-2 md:p-4 hidden xl:table-cell">
                  <div className="w-full max-w-24 space-y-1">
                    <Progress value={task.progress} className="h-2" />
                    <div className="text-xs text-right text-muted-foreground">
                      {task.progress}%
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-2 md:p-4 text-right">
                  <div className="flex items-center justify-end">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{task.estimatedHours}h</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredTasks.length}</span> of{" "}
          <span className="font-medium">{tasks.length}</span> tasks
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTasks;
