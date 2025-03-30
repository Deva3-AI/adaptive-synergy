
import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskService from '@/services/api/taskService';
import type { TaskAttachment } from '@/services/api/taskService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Upload,
  FileUp,
  Download,
  Trash,
  Plus,
  File,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { formatFileSize } from '@/utils/formatters';

interface TaskAttachmentsPanelProps {
  taskId: number;
  className?: string;
}

const TaskAttachmentsPanel: React.FC<TaskAttachmentsPanelProps> = ({ taskId, className }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();

  // Fetch task attachments
  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['taskAttachments', taskId],
    queryFn: () => taskService.getTaskAttachments(taskId),
  });

  // Upload attachment mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file, description }: { file: File, description?: string }) => {
      return taskService.uploadTaskAttachment(taskId, file, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAttachments', taskId] });
      toast.success('Attachment uploaded successfully');
      setSelectedFile(null);
      setDescription('');
    },
    onError: (error) => {
      console.error('Error uploading attachment:', error);
      toast.error('Failed to upload attachment');
    }
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync({ 
        file: selectedFile,
        description: description || undefined
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file selection button click
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  // Handle cancel file selection
  const handleCancelSelection = () => {
    setSelectedFile(null);
    setDescription('');
  };

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    // Simple file type detection
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('zip') || fileType.includes('archive')) return '🗄️';
    return '📁';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Task Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Section */}
        <div className="border rounded-lg p-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <File className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCancelSelection}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for this file..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-20 resize-none"
                />
              </div>
              
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-2">Drag and drop files or</p>
              <Button onClick={handleSelectFile}>
                <Plus className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </div>
          )}
        </div>
        
        {/* Attachments List */}
        {isLoading ? (
          <div className="text-center py-4">Loading attachments...</div>
        ) : attachments.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No attachments found for this task
          </div>
        ) : (
          <div className="space-y-3">
            {attachments.map((attachment: TaskAttachment) => (
              <div key={attachment.id} className="flex items-start justify-between border rounded-md p-3">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">
                      {getFileIcon(attachment.file_type)}
                    </span>
                    <div>
                      <h4 className="font-medium text-sm">{attachment.file_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.file_size)} • Uploaded {format(new Date(attachment.upload_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  {attachment.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{attachment.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash className="h-4 w-4" />
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
