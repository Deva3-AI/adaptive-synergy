
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { MessageSquare, Paperclip, Calendar, Clock, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/api';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Comment {
  id: number;
  user: string;
  text: string;
  created_at: string;
}

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  // Fetch task details from taskService
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task-detail', taskId],
    enabled: !!taskId,
    queryFn: async () => {
      try {
        const taskData = await taskService.getTaskById(parseInt(taskId || '0'));
        
        // Mock additional data for UI demonstration
        return {
          ...taskData,
          priority: 'Medium', // Default priority
          progress: 70, // Mock progress percentage
          comments: [], // Mock empty comments array
        };
      } catch (error) {
        console.error('Error fetching task details:', error);
        throw error;
      }
    }
  });

  // Mutation for adding a comment
  const addCommentMutation = useMutation({
    mutationFn: async (commentText: string) => {
      // In a real app, call an API endpoint to add the comment
      // For now, we'll just return a mock result
      const mockComment = {
        id: Date.now(),
        task_id: parseInt(taskId || '0'),
        user_id: 1, // Current user ID
        comment: commentText,
        created_at: new Date().toISOString(),
        user: { name: 'Current User' } // Mock user object
      };
      
      // In a real app:
      // return await taskService.addTaskComment({
      //   task_id: parseInt(taskId || '0'),
      //   user_id: 1, // Current user ID
      //   comment: commentText
      // });
      
      return mockComment;
    },
    onSuccess: () => {
      setComment(''); // Clear the input
      toast.success('Comment added');
      queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  });

  const handleAddComment = () => {
    if (comment.trim() !== '') {
      addCommentMutation.mutate(comment);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/employee/tasks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-72" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
              Error loading task details. Please try again later.
            </div>
            <Button variant="outline" size="sm" asChild className="mt-4">
              <Link to="/employee/tasks">Back to Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/employee/tasks">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Link>
      </Button>
      
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{task.status}</Badge>
            <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}>
              {task.priority}
            </Badge>
            {task.end_time && (
              <Badge variant="outline" className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Due: {new Date(task.end_time).toLocaleDateString()}
              </Badge>
            )}
          </div>
          
          <div>
            <p className="text-gray-600">{task.description}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Progress</h4>
            <Progress value={task.progress} />
            <p className="text-sm text-gray-500">{task.progress}% Completed</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-semibold mb-2">Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Client:</span>
                  <span>{task.clients?.client_name || 'Unknown Client'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Hours:</span>
                  <span>{task.estimated_time || 0}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Actual Hours:</span>
                  <span>{task.actual_time || 0}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
                {task.end_time && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Due Date:</span>
                    <span>{new Date(task.end_time).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Assigned To</h4>
              <div className="flex items-center">
                <Avatar className="mr-2">
                  <AvatarFallback>{(task.users?.name || 'User').charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{task.users?.name || 'Unassigned'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Comments</h4>
            {task.comments && task.comments.length > 0 ? (
              <div className="space-y-4">
                {task.comments.map((comment: Comment, index: number) => (
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
              </div>
            ) : (
              <p className="text-sm text-gray-500">No comments yet</p>
            )}
            <div className="flex items-center mt-4">
              <InputWithIcon
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-grow mr-2"
                icon={<MessageSquare className="h-4 w-4 text-gray-500" />}
              />
              <Button onClick={handleAddComment} disabled={addCommentMutation.isPending}>
                {addCommentMutation.isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;
