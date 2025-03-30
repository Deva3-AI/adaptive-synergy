
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { MessageSquare, Paperclip } from "lucide-react";
import taskService from '@/services/api/taskService';
import { useQuery } from '@tanstack/react-query';

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [comment, setComment] = useState('');

  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTaskDetails(taskId ? parseInt(taskId) : 0)
  });

  if (isLoading) {
    return <div>Loading task details...</div>;
  }

  if (error) {
    return <div>Error loading task details.</div>;
  }

  if (!task) {
    return <div>Task not found.</div>;
  }

  const handleAddComment = () => {
    if (comment.trim() !== '') {
      // Implement the logic to add the comment to the task
      console.log('Adding comment:', comment);
      setComment(''); // Clear the input after adding the comment
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Badge variant="secondary">{task.priority}</Badge>
          </div>
          <div className="mb-6">
            <p className="text-gray-600">{task.description}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Progress</h4>
            <Progress value={task.progress} />
            <p className="text-sm text-gray-500 mt-1">{task.progress}% Completed</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Assigned To</h4>
            <div className="flex items-center">
              <Avatar className="mr-2">
                <AvatarFallback>{task.assignedTo.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{task.assignedTo}</span>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Comments</h4>
            <div className="space-y-4">
              {task.comments && task.comments.map((comment, index) => (
                <div key={index} className="flex items-start text-sm">
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{comment.user}</div>
                    <div className="text-gray-600">{comment.text}</div>
                  </div>
                </div>
              ))}
              <div className="flex items-center">
                <InputWithIcon
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-grow mr-2"
                  icon={<MessageSquare className="h-4 w-4 text-gray-500" />}
                />
                <Button onClick={handleAddComment}>Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;
