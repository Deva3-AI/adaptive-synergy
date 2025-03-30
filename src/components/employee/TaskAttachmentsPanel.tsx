
import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Paperclip, Upload, File, FileText, Image, Film, Archive, MoreHorizontal, Download, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { taskService, TaskAttachment } from '@/services/api';

interface TaskAttachmentsPanelProps {
  taskId: number;
}

const TaskAttachmentsPanel: React.FC<TaskAttachmentsPanelProps> = ({ taskId }) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  // Fetch task attachments
  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['task-attachments', taskId],
    queryFn: () => taskService.getTaskAttachments(taskId),
  });
  
  // Upload attachment mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      // Simulate upload progress
      const uploadPromise = new Promise<any>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
            // Call the actual upload function
            resolve(taskService.uploadTaskAttachment(taskId, file));
          }
        }, 300);
      });
      
      return uploadPromise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      toast.success('File uploaded successfully');
      setIsUploadDialogOpen(false);
      setUploadProgress(0);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
      setUploadProgress(0);
    }
  });
  
  // Delete attachment mutation
  const deleteMutation = useMutation({
    mutationFn: (attachmentId: number) => taskService.deleteTaskAttachment(taskId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      toast.success('Attachment deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete attachment');
    }
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };
  
  const handleDeleteAttachment = (attachmentId: number) => {
    if (confirm('Are you sure you want to delete this attachment?')) {
      deleteMutation.mutate(attachmentId);
    }
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-10 w-10 text-blue-500" />;
    } else if (fileType.startsWith('video/')) {
      return <Film className="h-10 w-10 text-purple-500" />;
    } else if (fileType.startsWith('application/pdf')) {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else if (fileType.includes('zip') || fileType.includes('archive')) {
      return <Archive className="h-10 w-10 text-yellow-500" />;
    } else {
      return <File className="h-10 w-10 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">
          Attachments
        </CardTitle>
        <Button 
          size="sm"
          onClick={() => setIsUploadDialogOpen(true)}
        >
          <Paperclip className="mr-2 h-4 w-4" />
          Add File
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading attachments...</p>
            </div>
          </div>
        ) : attachments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Paperclip className="mx-auto h-12 w-12 text-muted-foreground/80" />
            <p className="mt-2">No attachments yet</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              Upload Your First File
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {attachments.map((attachment: TaskAttachment) => (
              <div key={attachment.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  {getFileIcon(attachment.file_type)}
                  <div>
                    <p className="font-medium">{attachment.filename}</p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>{formatFileSize(attachment.file_size)}</span>
                      <span>•</span>
                      <span>{format(new Date(attachment.uploaded_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={attachment.file_path} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteAttachment(attachment.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Attachment</DialogTitle>
            <DialogDescription>
              Add a file attachment to this task
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag & drop your file here</p>
              <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
              >
                Select File
              </Button>
            </div>
          </div>
          
          {uploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUploadDialogOpen(false)}
              disabled={uploadMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskAttachmentsPanel;
