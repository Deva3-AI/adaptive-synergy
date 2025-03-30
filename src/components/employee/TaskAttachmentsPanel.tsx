import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Download, Paperclip, FileText, FileImage, FileArchive, Film, X } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import taskService from "@/services/api/taskService";
import { TaskAttachment } from '@/services/api';

interface TaskAttachmentsPanelProps {
  taskId: number;
  className?: string;
}

const TaskAttachmentsPanel: React.FC<TaskAttachmentsPanelProps> = ({ taskId, className }) => {
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock function to simulate fetching attachments
  const fetchAttachments = async (taskId: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock attachment data
      const mockAttachments: TaskAttachment[] = [
        {
          id: 1,
          task_id: taskId,
          file_name: 'Project_Brief.pdf',
          file_type: 'pdf',
          file_size: 256,
          url: '/example-files/Project_Brief.pdf',
          uploaded_by: 'John Doe',
          uploaded_at: new Date().toISOString()
        },
        {
          id: 2,
          task_id: taskId,
          file_name: 'Design_Mockup.png',
          file_type: 'png',
          file_size: 1024,
          url: '/example-files/Design_Mockup.png',
          uploaded_by: 'Jane Smith',
          uploaded_at: new Date().toISOString()
        }
      ];
      
      setAttachments(mockAttachments);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load attachments');
      setAttachments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load attachments on component mount
  React.useEffect(() => {
    if (taskId) {
      fetchAttachments(taskId);
    }
  }, [taskId]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Task Attachments</CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add File
          </Button>
        </div>
        <CardDescription>
          Files and documents related to this task
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : attachments.length === 0 ? (
          <div className="text-muted-foreground text-center py-4">
            No attachments found
          </div>
        ) : (
          <div className="space-y-4">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  {attachment.file_type === 'pdf' && <FileText className="h-5 w-5 mr-2 text-blue-500" />}
                  {attachment.file_type === 'png' && <FileImage className="h-5 w-5 mr-2 text-green-500" />}
                  {attachment.file_type === 'zip' && <FileArchive className="h-5 w-5 mr-2 text-yellow-500" />}
                  {attachment.file_type === 'mp4' && <Film className="h-5 w-5 mr-2 text-purple-500" />}
                  <span className="font-medium">{attachment.file_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="icon" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAttachmentsPanel;
