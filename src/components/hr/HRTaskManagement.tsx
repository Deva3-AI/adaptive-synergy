
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlusCircle } from "lucide-react";

// Define mock task data since we don't have the API methods
const MOCK_TASKS = [
  { 
    id: 1, 
    title: 'Review job applications', 
    description: 'Review applications for Frontend Developer position', 
    due_date: '2023-06-15', 
    priority: 'high', 
    status: 'pending' 
  },
  { 
    id: 2, 
    title: 'Prepare payroll', 
    description: 'Process monthly payroll for all employees', 
    due_date: '2023-06-30', 
    priority: 'high', 
    status: 'pending' 
  },
  { 
    id: 3, 
    title: 'Schedule interviews', 
    description: 'Schedule interviews for UX Designer candidates', 
    due_date: '2023-06-10', 
    priority: 'medium', 
    status: 'completed' 
  }
];

// Define mock trend data
const MOCK_TRENDS = {
  employeeGrowth: [
    { month: 'Jan', employees: 24 },
    { month: 'Feb', employees: 25 },
    { month: 'Mar', employees: 27 },
    { month: 'Apr', employees: 29 },
    { month: 'May', employees: 30 },
    { month: 'Jun', employees: 32 }
  ],
  turnoverRate: [
    { month: 'Jan', rate: 3.2 },
    { month: 'Feb', rate: 2.8 },
    { month: 'Mar', rate: 2.5 },
    { month: 'Apr', rate: 2.2 },
    { month: 'May', rate: 2.0 },
    { month: 'Jun', rate: 1.8 }
  ],
  insights: [
    'Employee growth trending positively at 5% per month',
    'Turnover rate has decreased by 43% since January',
    'Most common reason for leaving: better opportunities',
    'Top performing department: Engineering'
  ]
};

const HRTaskManagement = () => {
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const completeTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' } 
        : task
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">HR Tasks</CardTitle>
          <Button size="sm" variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.filter(task => task.status === 'pending').map(task => (
              <div 
                key={task.id} 
                className="flex items-start justify-between border-b pb-4"
              >
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">
                      Due: {task.due_date}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => completeTask(task.id)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              </div>
            ))}
            {tasks.filter(task => task.status === 'pending').length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No pending tasks.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">HR Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_TRENDS.insights.map((insight, index) => (
              <div key={index} className="text-sm p-3 bg-slate-50 rounded-md">
                {insight}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRTaskManagement;
