
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, FileText, Clock, Calendar, Home, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import axios from 'axios';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';

// Types
interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'wfh' | 'halfDay' | 'other';
  startDate: string;
  endDate?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeaveRequestsListProps {
  requests: LeaveRequest[];
  forEmployee?: boolean;
  onUpdateStatus?: (id: number, status: 'approved' | 'rejected') => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function to get badge variant based on status
const getStatusBadge = (status: string) => {
  switch(status) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Helper function to get icon based on leave type
const getLeaveTypeIcon = (leaveType: string) => {
  switch(leaveType) {
    case 'wfh':
      return <Home className="h-4 w-4" />;
    case 'halfDay':
      return <Clock className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

// Helper function to get leave type display text
const getLeaveTypeText = (leaveType: string) => {
  switch(leaveType) {
    case 'annual':
      return 'Annual Leave';
    case 'sick':
      return 'Sick Leave';
    case 'wfh':
      return 'Work From Home';
    case 'halfDay':
      return 'Half Day';
    default:
      return 'Other';
  }
};

const LeaveRequestsList: React.FC<LeaveRequestsListProps> = ({ 
  requests, 
  forEmployee = false,
  onUpdateStatus 
}) => {
  const { isHR, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  
  // Mutation for updating leave request status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
      const response = await axios.put(`${API_URL}/hr/leave-requests/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['employeeLeaveRequests'] });
    },
    onError: (error) => {
      console.error('Error updating leave request status:', error);
      toast.error('Failed to update request status. Please try again.');
    }
  });
  
  const handleApprove = async (id: number) => {
    try {
      if (onUpdateStatus) {
        await onUpdateStatus(id, 'approved');
      } else {
        await updateStatusMutation.mutateAsync({ id, status: 'approved' });
        toast.success('Leave request approved');
      }
    } catch (error) {
      console.error('Error approving leave request:', error);
    }
  };
  
  const handleReject = async (id: number) => {
    try {
      if (onUpdateStatus) {
        await onUpdateStatus(id, 'rejected');
      } else {
        await updateStatusMutation.mutateAsync({ id, status: 'rejected' });
        toast.success('Leave request rejected');
      }
    } catch (error) {
      console.error('Error rejecting leave request:', error);
    }
  };
  
  const handleDownloadDocument = async (documentUrl?: string, requestId?: number) => {
    if (!documentUrl) return;
    
    try {
      // Check if it's a full URL or a relative path
      const url = documentUrl.startsWith('http') 
        ? documentUrl
        : `${API_URL}${documentUrl.startsWith('/') ? documentUrl : `/${documentUrl}`}`;
      
      // Try to fetch the document
      const response = await axios.get(url, { responseType: 'blob' });
      
      // Create a download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `document-${requestId || 'leave-request'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };
  
  const canManageRequests = !forEmployee && (isHR || isAdmin);
  
  if (requests.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">No leave requests found.</p>;
  }
  
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {forEmployee ? getLeaveTypeText(request.leaveType) : request.employeeName}
                </CardTitle>
                <CardDescription>
                  {!forEmployee && getLeaveTypeText(request.leaveType)} 
                  {' • '}
                  {format(new Date(request.createdAt), 'PPP')}
                </CardDescription>
              </div>
              <Badge variant={getStatusBadge(request.status)}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid gap-2">
              <div className="flex gap-2 items-center">
                {getLeaveTypeIcon(request.leaveType)}
                <span className="text-sm">
                  {format(new Date(request.startDate), 'PP')}
                  {request.endDate && ` - ${format(new Date(request.endDate), 'PP')}`}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{request.reason}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            {request.documentUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => handleDownloadDocument(request.documentUrl, request.id)}
              >
                <FileText className="h-4 w-4" />
                View Document
              </Button>
            )}
            
            {canManageRequests && request.status === 'pending' ? (
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleApprove(request.id)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Approve Request</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleReject(request.id)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reject Request</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Leave Request Details</DialogTitle>
                      <DialogDescription>
                        Request from {request.employeeName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-semibold">Employee:</div>
                        <div>{request.employeeName}</div>
                        
                        <div className="font-semibold">Type:</div>
                        <div>{getLeaveTypeText(request.leaveType)}</div>
                        
                        <div className="font-semibold">Period:</div>
                        <div>
                          {format(new Date(request.startDate), 'PP')}
                          {request.endDate && ` - ${format(new Date(request.endDate), 'PP')}`}
                        </div>
                        
                        <div className="font-semibold">Status:</div>
                        <div>
                          <Badge variant={getStatusBadge(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="font-semibold">Submitted:</div>
                        <div>{format(new Date(request.createdAt), 'PPP')}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-semibold">Reason:</div>
                        <div className="text-sm bg-muted p-3 rounded-md">{request.reason}</div>
                      </div>
                      
                      {request.documentUrl && (
                        <Button 
                          className="w-full gap-2"
                          onClick={() => handleDownloadDocument(request.documentUrl, request.id)}
                        >
                          <Download className="h-4 w-4" />
                          Download Document
                        </Button>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          disabled={updateStatusMutation.isPending}
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleApprove(request.id)}
                          disabled={updateStatusMutation.isPending}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">View Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Leave Request Details</DialogTitle>
                    <DialogDescription>
                      {forEmployee ? 'Your leave request' : `Request from ${request.employeeName}`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {!forEmployee && (
                        <>
                          <div className="font-semibold">Employee:</div>
                          <div>{request.employeeName}</div>
                        </>
                      )}
                      
                      <div className="font-semibold">Type:</div>
                      <div>{getLeaveTypeText(request.leaveType)}</div>
                      
                      <div className="font-semibold">Period:</div>
                      <div>
                        {format(new Date(request.startDate), 'PP')}
                        {request.endDate && ` - ${format(new Date(request.endDate), 'PP')}`}
                      </div>
                      
                      <div className="font-semibold">Status:</div>
                      <div>
                        <Badge variant={getStatusBadge(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="font-semibold">Submitted:</div>
                      <div>{format(new Date(request.createdAt), 'PPP')}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-semibold">Reason:</div>
                      <div className="text-sm bg-muted p-3 rounded-md">{request.reason}</div>
                    </div>
                    
                    {request.documentUrl && (
                      <Button 
                        className="w-full gap-2"
                        onClick={() => handleDownloadDocument(request.documentUrl, request.id)}
                      >
                        <Download className="h-4 w-4" />
                        Download Document
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LeaveRequestsList;
