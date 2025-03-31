
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Check, X, FileText, Clock, Calendar, Home } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import LeaveRequestForm from './LeaveRequestForm';
import { useAuth } from '@/hooks/use-auth';
import { LeaveRequest } from '@/interfaces/hr';
import hrServiceSupabase from '@/services/api/hrServiceSupabase';

const EmployeeLeaveRequests: React.FC = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch leave requests for the current user
  const { data: leaveRequests, isLoading, error } = useQuery({
    queryKey: ['employeeLeaveRequests', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) return [];
        const allRequests = await hrServiceSupabase.getLeaveRequests();
        return allRequests.filter(request => request.employee_id === user.id);
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        throw err;
      }
    },
    enabled: !!user?.id,
  });
  
  // Fetch leave balance for the current user
  const { data: leaveBalance } = useQuery({
    queryKey: ['leaveBalance', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) return null;
        return await hrServiceSupabase.getLeaveBalance(user.id);
      } catch (err) {
        console.error('Error fetching leave balance:', err);
        return {
          annual: 18,
          sick: 10,
          personal: 5,
          remaining_annual: 12,
          remaining_sick: 8,
          remaining_personal: 3
        };
      }
    },
    enabled: !!user?.id,
  });
  
  // Mutation to create a new leave request
  const createLeaveRequestMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Calculate number of days
      const startDate = new Date(formData.startDate);
      let endDate = formData.endDate ? new Date(formData.endDate) : startDate;
      
      // For half-day or WFH, just use the start date
      if (['halfDay', 'wfh'].includes(formData.leaveType)) {
        endDate = startDate;
      }
      
      // Calculate days difference (including both start and end date)
      const daysDiff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // Adjust for half-day
      const days = formData.leaveType === 'halfDay' ? 0.5 : daysDiff;
      
      const leaveRequest: Partial<LeaveRequest> = {
        employee_id: user.id,
        employee_name: user.name,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        days,
        reason: formData.reason,
        status: 'pending',
        leaveType: formData.leaveType,
        document_url: formData.document ? URL.createObjectURL(formData.document) : undefined,
      };
      
      return await hrServiceSupabase.createLeaveRequest(leaveRequest);
    },
    onSuccess: () => {
      toast.success('Leave request submitted successfully');
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['employeeLeaveRequests', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalance', user?.id] });
    },
    onError: (error) => {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request. Please try again.');
    },
  });
  
  const handleFormSubmit = async (formData: any) => {
    try {
      await createLeaveRequestMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  // Helper function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
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
      case 'personal':
        return 'Personal Leave';
      case 'wfh':
        return 'Work From Home';
      case 'halfDay':
        return 'Half Day';
      default:
        return 'Other';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>
              Manage your leave applications and view their status
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Request Leave</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval by management
                </DialogDescription>
              </DialogHeader>
              <LeaveRequestForm 
                onSubmit={handleFormSubmit} 
                isSubmitting={createLeaveRequestMutation.isPending} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading your leave requests...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-500">Error loading leave requests. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['employeeLeaveRequests', user?.id] })}
            >
              Retry
            </Button>
          </div>
        ) : leaveRequests && leaveRequests.length > 0 ? (
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {getLeaveTypeText(request.leaveType)}
                    </CardTitle>
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
                        {format(new Date(request.start_date), 'PP')}
                        {request.end_date && request.start_date !== request.end_date && 
                          ` - ${format(new Date(request.end_date), 'PP')}`}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{request.reason}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  {request.document_url && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => window.open(request.document_url, '_blank')}
                    >
                      <FileText className="h-4 w-4" />
                      View Document
                    </Button>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">View Details</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Leave Request Details</DialogTitle>
                        <DialogDescription>
                          Your leave request
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="font-semibold">Type:</div>
                          <div>{getLeaveTypeText(request.leaveType)}</div>
                          
                          <div className="font-semibold">Period:</div>
                          <div>
                            {format(new Date(request.start_date), 'PP')}
                            {request.end_date && request.start_date !== request.end_date && 
                              ` - ${format(new Date(request.end_date), 'PP')}`}
                          </div>
                          
                          <div className="font-semibold">Days:</div>
                          <div>{request.days}</div>
                          
                          <div className="font-semibold">Status:</div>
                          <div>
                            <Badge variant={getStatusBadge(request.status)}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          
                          {request.approver_name && (
                            <>
                              <div className="font-semibold">Approved By:</div>
                              <div>{request.approver_name}</div>
                            </>
                          )}
                          
                          {request.notes && (
                            <>
                              <div className="font-semibold">Notes:</div>
                              <div>{request.notes}</div>
                            </>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="font-semibold">Reason:</div>
                          <div className="text-sm bg-muted p-3 rounded-md">{request.reason}</div>
                        </div>
                        
                        {request.document_url && (
                          <Button 
                            className="w-full gap-2"
                            onClick={() => window.open(request.document_url, '_blank')}
                          >
                            <FileText className="h-4 w-4" />
                            View Document
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">You have no leave requests.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setDialogOpen(true)}
            >
              Create your first leave request
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full text-sm text-muted-foreground">
          <p>
            Leave balance: 
            <span className="font-medium ml-1">{leaveBalance?.remaining_annual || 0}</span> annual days, 
            <span className="font-medium ml-1">{leaveBalance?.remaining_sick || 0}</span> sick days,
            <span className="font-medium ml-1">{leaveBalance?.remaining_personal || 0}</span> personal days remaining
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmployeeLeaveRequests;
