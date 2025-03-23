
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, FileIcon, Calendar, Download, Upload, ExternalLink, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskAttachment } from '@/services/api/taskService';
import { toast } from 'sonner';

interface TaskAttachmentsPanelProps {
  taskId: number;
  attachments: TaskAttachment[];
  isLoading?: boolean;
  onUploadScreenshot: (file: File, description: string) => Promise<void>;
}

const TaskAttachmentsPanel = ({ 
  taskId, 
  attachments = [], 
  isLoading = false,
  onUploadScreenshot
}: TaskAttachmentsPanelProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [screenshotDescription, setScreenshotDescription] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (PNG, JPG, etc.)');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File is too large. Please select an image under 5MB.');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Simulate progress for demonstration
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 20);
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

      await onUploadScreenshot(selectedFile, screenshotDescription);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset form
      setSelectedFile(null);
      setScreenshotDescription('');
      setShowUploadForm(false);
      
      toast.success('Screenshot uploaded successfully');
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      toast.error('Failed to upload screenshot');
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setScreenshotDescription('');
    setShowUploadForm(false);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    }
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 pb-3 border-b">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-36 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Task Screenshots</CardTitle>
          {!showUploadForm && (
            <Button 
              size="sm" 
              onClick={() => setShowUploadForm(true)}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Screenshot
            </Button>
          )}
        </div>
        <CardDescription>
          Document your progress with screenshots
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showUploadForm && (
          <div className="border rounded-md p-4 mb-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">
                  Screenshot
                </label>
                <div className="mt-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </div>
                {selectedFile && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium">
                  Progress Description
                </label>
                <Textarea
                  placeholder="Describe what you've accomplished in this screenshot..."
                  value={screenshotDescription}
                  onChange={(e) => setScreenshotDescription(e.target.value)}
                  className="mt-1"
                  disabled={isUploading}
                />
              </div>
              
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={cancelUpload}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {attachments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No screenshots uploaded yet</p>
            <p className="text-xs mt-1">Upload screenshots to document your progress</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {attachments.map((attachment) => (
                <div key={attachment.attachment_id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                    {attachment.file_type.startsWith('image/') ? (
                      <img 
                        src={attachment.file_url} 
                        alt={attachment.file_name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getFileIcon(attachment.file_type)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{attachment.file_name}</span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={attachment.file_url} download={attachment.file_name}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{formatFileSize(attachment.file_size)}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(attachment.created_at).toLocaleDateString()}
                      </span>
                    </div>
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
