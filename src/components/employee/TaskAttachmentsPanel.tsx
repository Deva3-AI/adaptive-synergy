
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, Download, FileText, Image, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from 'react-dropzone';
import { taskService } from '@/services/api';
import { TaskAttachment } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

interface TaskAttachmentsPanelProps {
  taskId: number;
  userId: number;
}

// Helper function for formatting file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Helper function for formatting dates
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

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
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">
            <File className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading attachments...</p>
          </div>
        ) : !attachments || attachments.length === 0 ? (
          <div className="py-8 text-center border rounded-lg">
            <File className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No attachments yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload files using the area above
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Uploaded Files</h3>
            <div className="border rounded-lg divide-y">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(attachment.file_type || '')}
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {attachment.file_name}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <span>{formatFileSize(attachment.file_size)}</span>
                        <span>{formatDate(attachment.uploaded_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={attachment.url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAttachmentsPanel;
