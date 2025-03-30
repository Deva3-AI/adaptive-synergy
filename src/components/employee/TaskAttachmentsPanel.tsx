import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paperclip, Upload, X, Image, FileText, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import taskService from "@/services/api/taskService";
import type { TaskAttachment } from "@/services/api/taskService";

interface TaskAttachmentsPanelProps {
  taskId?: number;
}

const TaskAttachmentsPanel = ({ taskId }: TaskAttachmentsPanelProps) => {
  const queryClient = useQueryClient();

  const { data: attachments, isLoading } = useQuery({
    queryKey: ['taskAttachments', taskId],
    queryFn: () => taskId ? taskService.getTaskAttachments(taskId) : Promise.resolve([]),
    enabled: !!taskId,
  });

  const uploadAttachmentMutation = useMutation({
    mutationFn: (file: File) => taskId ? taskService.uploadTaskAttachment(taskId, file) : Promise.reject('No taskId provided'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAttachments', taskId] });
      toast.success('Attachment uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to upload attachment: ${error.message || error}`);
    },
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: (attachmentId: number) => taskId ? taskService.deleteTaskAttachment(taskId, attachmentId) : Promise.reject('No taskId provided'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAttachments', taskId] });
      toast.success('Attachment deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete attachment: ${error.message || error}`);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && taskId) {
      uploadAttachmentMutation.mutate(file);
    }
  };

  const handleDeleteAttachment = (attachmentId: number) => {
    deleteAttachmentMutation.mutate(attachmentId);
  };

  const renderAttachmentIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 mr-2" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4 mr-2" />;
    } else {
      return <Paperclip className="h-4 w-4 mr-2" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Attachments</CardTitle>
          <CardDescription>Loading attachments...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Attachments</CardTitle>
        <CardDescription>Manage files related to this task</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="upload-attachment" className="cursor-pointer">
            <Button variant="outline" asChild>
              <span className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </span>
            </Button>
          </label>
          <input
            type="file"
            id="upload-attachment"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {attachments && attachments.length > 0 ? (
          <div className="divide-y divide-border">
            {attachments.map((attachment: TaskAttachment) => (
              <div key={attachment.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center">
                  {renderAttachmentIcon(attachment.fileType)}
                  <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer" className="underline text-sm hover:text-primary">
                    {attachment.filename}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteAttachment(attachment.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">No attachments found for this task.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAttachmentsPanel;
