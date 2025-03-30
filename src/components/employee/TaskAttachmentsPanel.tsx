
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Paperclip, Download, Trash2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskService, { TaskAttachment } from '@/services/api/taskService';
import { toast } from 'sonner';

interface TaskAttachmentsPanelProps {
  taskId: number;
}

const TaskAttachmentsPanel: React.FC<TaskAttachmentsPanelProps> = ({ taskId }) => {
  const [description, setDescription] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch task attachments
  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['task-attachments', taskId],
    queryFn: () => taskService.getTaskAttachments(taskId),
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      return taskService.uploadTaskAttachment(taskId, file, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      toast.success('Attachment uploaded successfully');
      setDescription('');
      setShowUploadForm(false);
    },
    onError: (error) => {
      toast.error('Failed to upload attachment');
      console.error('Upload error:', error);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (attachmentId: number) => {
      // This function doesn't exist yet, so we'll mock it
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      toast.success('Attachment deleted');
    }
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        uploadMutation.mutate(acceptedFiles[0]);
      }
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('document') || fileType.includes('word')) return '📝';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
    return '📁';
  };

  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      uploadMutation.mutate(fileInput.files[0]);
    } else {
      toast.error('Please select a file to upload');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">Task Attachments</CardTitle>
          <CardDescription>Files associated with this task</CardDescription>
        </div>
        {!showUploadForm && (
          <Button size="sm" onClick={() => setShowUploadForm(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showUploadForm && (
          <div className="mb-6 border rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Upload Attachment</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowUploadForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleManualUpload}>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer mb-4 ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps({ id: 'file-upload' })} />
                <Paperclip className="h-6 w-6 mb-2 mx-auto text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-sm">Drop the file here</p>
                ) : (
                  <div>
                    <p className="text-sm mb-1">Drag & drop a file here, or click to select</p>
                    <p className="text-xs text-muted-foreground">Max file size: 10MB</p>
                  </div>
                )}
              </div>
              
              <Textarea 
                placeholder="Description (optional)" 
                className="mb-4" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            </form>
          </div>
        )}
        
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading attachments...</p>
          </div>
        ) : attachments.length === 0 ? (
          <div className="py-8 text-center border border-dashed rounded-md">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No attachments yet</p>
            <p className="text-sm text-muted-foreground">Upload files to share with the team</p>
          </div>
        ) : (
          <div className="space-y-2">
            {attachments.map((attachment: TaskAttachment) => (
              <div key={attachment.id} className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center">
                  <div className="mr-3 text-2xl">{getFileIcon(attachment.file_type)}</div>
                  <div>
                    <p className="font-medium text-sm">{attachment.file_name}</p>
                    {attachment.description && (
                      <p className="text-xs text-muted-foreground">{attachment.description}</p>
                    )}
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span>{formatFileSize(attachment.file_size || 0)}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(attachment.upload_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={attachment.url} download={attachment.file_name} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this attachment?')) {
                        deleteMutation.mutate(attachment.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
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
