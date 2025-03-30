
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, Download, FileText, Image, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from 'react-dropzone';
import { TaskAttachment } from '@/services/api/taskService';
import taskService from '@/services/api/taskService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { formatFileSize, formatDate } from '@/utils/formatters';

interface TaskAttachmentsPanelProps {
  taskId: number;
  userId: number;
}

const TaskAttachmentsPanel: React.FC<TaskAttachmentsPanelProps> = ({ taskId, userId }) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: attachments, isLoading } = useQuery({
    queryKey: ['task-attachments', taskId],
    queryFn: () => taskService.getTaskAttachments(taskId)
  });
  
  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      setIsUploading(true);
      setUploadProgress(0);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      return taskService.uploadTaskAttachment(taskId, file, userId).finally(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    }
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadMutation.mutate(acceptedFiles[0]);
    }
  }, [uploadMutation]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false,
    maxSize: 10485760 // 10MB
  });
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-6 w-6" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6" />;
    } else {
      return <File className="h-6 w-6" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Task Attachments</CardTitle>
        <CardDescription>Upload and manage files related to this task</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum file size: 10MB
          </p>
          {isUploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading attachments...</p>
          </div>
        ) : attachments && attachments.length > 0 ? (
          <div className="space-y-3">
            {attachments.map((attachment) => (
              <div 
                key={attachment.id}
                className="flex items-center gap-3 p-3 rounded-lg border group hover:bg-accent"
              >
                {getFileIcon(attachment.file_type)}
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{attachment.file_name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{formatFileSize(attachment.file_size)}</span>
                    <span>•</span>
                    <span>{formatDate(attachment.uploaded_at, 'MMM d, yyyy, h:mm a')}</span>
                    {attachment.description && (
                      <>
                        <span>•</span>
                        <span className="truncate">{attachment.description}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    window.open(attachment.url, '_blank');
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <File className="h-10 w-10 mx-auto opacity-20 mb-2" />
            <p>No attachments yet</p>
            <p className="text-sm mt-1">Upload files to share with the team</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAttachmentsPanel;
