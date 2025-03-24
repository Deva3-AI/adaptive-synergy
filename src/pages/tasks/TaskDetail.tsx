
import React from 'react';
import { useParams } from 'react-router-dom';

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
      <p className="text-muted-foreground">Task ID: {taskId}</p>
      
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>Task details will be displayed here.</p>
      </div>
    </div>
  );
};

export default TaskDetail;
