
import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  FileIcon, Plus, Trash2, Download, File, FileText, FileImage, FileArchive 
} from "lucide-react";
import { taskService } from '@/services/api';
import { TaskAttachment } from '@/services/api';
import { toast } from 'sonner';

const TaskAttachmentsPanel = ({ taskId }: { taskId: number }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Upload attachment mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return taskService.uploadTaskAttachment(taskId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAttachments', taskId] });
      toast.success('File uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload file');
    }
  });

  // Delete attachment mutation
  const deleteMutation = useMutation({
    mutationFn: (attachmentId: number) => taskService.deleteTaskAttachment(taskId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAttachments', taskId] });
      toast.success('Attachment deleted');
    },
    onError: () => {
      toast.error('Failed to delete attachment');
    }
  });

  // Fetch task attachments
  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['taskAttachments', taskId],
    queryFn: () => taskService.getTaskAttachments(taskId),
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    uploadMutation.mutate(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="h-5 w-5" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FileArchive className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Attachments</CardTitle>
        <CardDescription>Files and documents related to this task</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInput}
          />
          <FileIcon className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">
            {dragActive 
              ? 'Drop file to upload' 
              : 'Drag & drop a file here or click to browse'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports images, documents, and archives up to 10MB
          </p>
        </div>

        {/* Attachments list */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : attachments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No attachments yet
          </p>
        ) : (
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-3">
              {attachments.map((attachment: TaskAttachment) => (
                <div 
                  key={attachment.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted p-2 rounded-md">
                      {getFileIcon(attachment.file_type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{attachment.file_name}</p>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {formatBytes(attachment.file_size)}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attachment.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(attachment.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(attachment.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAttachmentsPanel;
