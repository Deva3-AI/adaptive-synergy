
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, FileText, Paperclip, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskService from '@/services/api/taskService';
import type { TaskAttachment } from '@/services/api/taskService';

interface TaskAttachmentsPanelProps {
  taskId: number;
}

const TaskAttachmentsPanel = ({ taskId }: TaskAttachmentsPanelProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  // Fetch attachments
  const { data: attachments, isLoading } = useQuery({
    queryKey: ['task-attachments', taskId],
    queryFn: () => taskService.getTaskAttachments(taskId),
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadAttachment(taskId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      setIsUploading(false);
      setDescription('');
      toast.success("Attachment uploaded successfully");
    },
    onError: () => {
      setIsUploading(false);
      toast.error("Failed to upload attachment");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (attachmentId: number) => taskService.deleteTaskAttachment(taskId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      toast.success("Attachment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete attachment");
    },
  });

  // Dropzone setup
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      uploadMutation.mutate(formData);
      setIsUploading(true);
    },
  });

  // Fix the uploadAttachment function to accept FormData instead of File
  const uploadAttachment = async (taskId: number, formData: FormData) => {
    try {
      const result = await taskService.uploadTaskAttachment(taskId, formData);
      return result;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  };

  // Delete attachment
  const handleDeleteAttachment = async (attachmentId: number) => {
    deleteMutation.mutate(attachmentId);
  };

  // Make sure the TaskAttachment fields match what the component is using
  const renderAttachmentItem = (attachment: TaskAttachment) => {
    return (
      <div className="flex items-start p-3 border rounded-md mb-2">
        <div className="mr-3">
          <FileText className="h-10 w-10 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium truncate">{attachment.filename}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Uploaded {formatDistanceToNow(new Date(attachment.uploaded_at), { addSuffix: true })}
              </p>
            </div>
            <div className="flex">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  if (attachment.file_url) {
                    window.open(attachment.file_url, '_blank');
                  }
                }}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
                onClick={() => handleDeleteAttachment(attachment.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {attachment.description && (
            <p className="text-sm mt-1 text-muted-foreground">{attachment.description}</p>
          )}
          <Badge variant="outline" className="mt-2">
            {attachment.file_size ? (attachment.file_size / 1024).toFixed(2) : 'Unknown'} KB
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div {...getRootProps()} className="relative border rounded-md p-6 cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
          <input {...getInputProps()} />
          <div className="text-center">
            <Paperclip className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isUploading ? 'Uploading...' : 'Drag and drop files here, or click to select files'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              (jpeg, png, pdf, doc, txt, etc.)
            </p>
          </div>
          {uploadMutation.isError && (
            <div className="absolute top-2 right-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          )}
        </div>

        <Textarea
          placeholder="Add a description for the attachment"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isUploading}
        />

        {attachments && attachments.length > 0 ? (
          <div className="space-y-3">
            {attachments.map((attachment) => (
              renderAttachmentItem(attachment)
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No attachments yet. Upload files to track progress.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAttachmentsPanel;
