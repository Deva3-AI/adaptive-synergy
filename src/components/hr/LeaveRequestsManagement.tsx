
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, FileText, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { LeaveRequest } from '@/interfaces/hr';
import hrServiceSupabase from '@/services/api/hrServiceSupabase';

const LeaveRequestsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Fetch all leave requests
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leaveRequests'],
    queryFn: async () => {
      try {
        return await hrServiceSupabase.getLeaveRequests();
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        throw error;
      }
    },
  });
  
  // Mutation to approve/reject leave requests
  const updateLeaveRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, notes }: { requestId: number; status: 'approved' | 'rejected'; notes?: string }) => {
      return await hrServiceSupabase.updateLeaveRequest(requestId, status, notes);
    },
    onSuccess: () => {
      toast.success(`Leave request ${selectedRequest?.status === 'approved' ? 'approved' : 'rejected'} successfully`);
      setDetailsDialogOpen(false);
      setSelectedRequest(null);
      setApprovalNotes('');
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
    },
    onError: (error) => {
      console.error('Error updating leave request:', error);
      toast.error('Failed to update leave request');
    },
  });
  
  const handleApprove = () => {
    if (!selectedRequest) return;
    updateLeaveRequestMutation.mutate({ 
      requestId: selectedRequest.id, 
      status: 'approved',
      notes: approvalNotes
    });
  };
  
  const handleReject = () => {
    if (!selectedRequest) return;
    updateLeaveRequestMutation.mutate({ 
      requestId: selectedRequest.id, 
      status: 'rejected',
      notes: approvalNotes
    });
  };
  
  // Helper function to filter leave requests
  const getFilteredRequests = () => {
    if (!leaveRequests) return [];
    
    // First filter by status tab
    let filtered = leaveRequests;
    if (activeTab !== 'all') {
      filtered = filtered.filter(request => request.status === activeTab);
    }
    
    // Then filter by search term (employee name or ID)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        request => 
          request.employee_name.toLowerCase().includes(term) || 
          request.employee_id.toString().includes(term) ||
          getLeaveTypeText(request.leaveType).toLowerCase().includes(term)
      );
    }
    
    return filtered;
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
  
  const filteredRequests = getFilteredRequests();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Leave Requests Management</CardTitle>
        <CardDescription>
          Approve or reject employee leave requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by employee or type..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading leave requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No {activeTab !== 'all' ? activeTab : ''} leave requests found.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-6 font-medium p-4 border-b bg-muted">
                <div className="md:col-span-1">Employee</div>
                <div className="md:col-span-1">Type</div>
                <div className="md:col-span-1">Dates</div>
                <div className="md:col-span-1">Days</div>
                <div className="md:col-span-1">Status</div>
                <div className="md:col-span-1 text-right">Actions</div>
              </div>
              
              {filteredRequests.map((request) => (
                <div key={request.id} className="grid grid-cols-1 md:grid-cols-6 items-center p-4 border-b last:border-b-0 hover:bg-muted/50">
                  <div className="md:col-span-1 font-medium">{request.employee_name}</div>
                  <div className="md:col-span-1">{getLeaveTypeText(request.leaveType)}</div>
                  <div className="md:col-span-1 text-sm">
                    {format(new Date(request.start_date), 'MMM d, yyyy')}
                    {request.end_date && request.start_date !== request.end_date && 
                      <span> - <br className="md:hidden" /> {format(new Date(request.end_date), 'MMM d, yyyy')}</span>}
                  </div>
                  <div className="md:col-span-1">{request.days}</div>
                  <div className="md:col-span-1">
                    <Badge variant={getStatusBadge(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="md:col-span-1 flex justify-end items-center gap-2 mt-2 md:mt-0">
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => {
                            setSelectedRequest(request);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setSelectedRequest(request);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setDetailsDialogOpen(true);
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Leave request details dialog */}
      {selectedRequest && (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
              <DialogDescription>
                Request from {selectedRequest.employee_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-semibold">Employee ID:</div>
                <div>{selectedRequest.employee_id}</div>
                
                <div className="font-semibold">Employee:</div>
                <div>{selectedRequest.employee_name}</div>
                
                <div className="font-semibold">Type:</div>
                <div>{getLeaveTypeText(selectedRequest.leaveType)}</div>
                
                <div className="font-semibold">Period:</div>
                <div>
                  {format(new Date(selectedRequest.start_date), 'MMM d, yyyy')}
                  {selectedRequest.end_date && selectedRequest.start_date !== selectedRequest.end_date && 
                    ` - ${format(new Date(selectedRequest.end_date), 'MMM d, yyyy')}`}
                </div>
                
                <div className="font-semibold">Days:</div>
                <div>{selectedRequest.days}</div>
                
                <div className="font-semibold">Status:</div>
                <div>
                  <Badge variant={getStatusBadge(selectedRequest.status)}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="font-semibold">Reason:</div>
                <div className="text-sm bg-muted p-3 rounded-md">{selectedRequest.reason}</div>
              </div>
              
              {selectedRequest.document_url && (
                <Button 
                  className="w-full gap-2"
                  onClick={() => window.open(selectedRequest.document_url, '_blank')}
                >
                  <FileText className="h-4 w-4" />
                  View Document
                </Button>
              )}
              
              {selectedRequest.status === 'pending' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="notes" className="font-semibold text-sm">Approval/Rejection Notes:</label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes for approving or rejecting this request..."
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={handleReject}
                      disabled={updateLeaveRequestMutation.isPending}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={updateLeaveRequestMutation.isPending}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default LeaveRequestsManagement;
