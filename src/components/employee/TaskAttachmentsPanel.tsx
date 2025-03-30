
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDropzone } from 'react-dropzone';
import { File, Upload, Paperclip, FileText, Image, Film, FileArchive, FileX, Trash2 } from 'lucide-react';
import { taskService, TaskAttachment } from '@/services/api';
import { toast } from 'sonner';

interface TaskAttachmentsPanelProps {
  taskId: number;
  className?: string;
}

const TaskAttachmentsPanel: React.FC<TaskAttachmentsPanelProps> = ({ taskId, className }) => {
  const [uploading, setUploading] = useState(false);

  // Fetch task attachments
  const { data: attachments = [], isLoading, refetch } = useQuery({
    queryKey: ['taskAttachments', taskId],
    queryFn: async () => {
      return await taskService.getTaskAttachments(taskId);
    }
  });

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    maxSize: 10485760, // 10MB
    disabled: uploading
  });

  // Handle file upload
  async function handleFileDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const files = Array.from(acceptedFiles);

    try {
      // In a real app, you would upload the files to a storage service
      // For this demo, we'll mock the upload and simulate adding to the database
      
      // Mock file upload with a random URL
      const uploadPromises = files.map(async (file) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock storage URL for the file
        const mockFileUrl = `https://storage.example.com/tasks/${taskId}/${file.name}`;
        
        // Add file to database
        await taskService.addTaskAttachment({
          task_id: taskId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          url: mockFileUrl,
          uploaded_by: 'Current User' // In a real app, this would be the current user's name
        });
      });

      await Promise.all(uploadPromises);
      
      toast.success(`${files.length} file(s) uploaded successfully.`);
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (fileType.startsWith('video/')) return <Film className="h-5 w-5 text-purple-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('tar')) 
      return <FileArchive className="h-5 w-5 text-yellow-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Delete attachment
  const handleDelete = async (attachmentId: number) => {
    try {
      // In a real app, this would call a delete endpoint
      // For demo we assume it was deleted
      toast.success('File deleted successfully.');
      
      // Refresh the list to show the file is gone
      refetch();
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('Failed to delete file.');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Paperclip className="h-5 w-5 mr-2 text-primary" />
          Attachments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:bg-muted/50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            {isDragActive
              ? 'Drop the files here...'
              : uploading
              ? 'Uploading...'
              : 'Drag & drop files here, or click to select files'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max file size: 10MB
          </p>
        </div>

        <Separator />

        {/* File list */}
        {isLoading ? (
          <div className="py-4 text-center text-muted-foreground">
            Loading attachments...
          </div>
        ) : attachments.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            <FileX className="h-10 w-10 mx-auto mb-2" />
            <p>No attachments yet</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {attachments.map((attachment: TaskAttachment) => (
              <li
                key={attachment.id}
                className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50"
              >
                <div className="flex items-center">
                  {getFileIcon(attachment.file_type)}
                  <div className="ml-3">
                    <p className="text-sm font-medium">{attachment.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.file_size)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(attachment.url, '_blank')}
                    title="Download"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(attachment.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAttachmentsPanel;
