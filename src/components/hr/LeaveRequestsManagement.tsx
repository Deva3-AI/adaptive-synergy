import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format, differenceInDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Calendar, Check, X, Eye, Filter, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hrService } from '@/services/api/hrService';

// Define updated LeaveRequest interface with required fields
interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leaveType: string;
  days: number;
}

const LeaveRequestsManagement = () => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');

  // Fetch leave requests
  const { data: leaveRequests, isLoading, refetch } = useQuery({
    queryKey: ['leaveRequests'],
    queryFn: async () => {
      try {
        return await hrService.getLeaveRequests();
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        throw error;
      }
    }
  });

  // Fetch employees for filtering
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => hrService.getEmployees()
  });

  // Handle updating leave request status
  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected', reason: string = '') => {
    try {
      // Call the correct function and pass it the right parameters
      await hrService.updateLeaveRequestStatus(id, status, reason);
      
      toast.success(`Leave request ${status}`);
      refetch();
      
      // Close dialogs
      setApproveDialogOpen(false);
      setRejectDialogOpen(false);
      setRejectReason('');
    } catch (error) {
      console.error(`Error ${status} leave request:`, error);
      toast.error(`Failed to ${status} leave request`);
    }
  };

  // Filter leave requests
  const filteredRequests = React.useMemo(() => {
    if (!leaveRequests) return [];
    
    return (leaveRequests as any[]).filter(request => {
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      const matchesEmployee = filterEmployee === 'all' || request.employee_id.toString() === filterEmployee;
      
      return matchesStatus && matchesEmployee;
    });
  }, [leaveRequests, filterStatus, filterEmployee]);

  // Calculate leave duration
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return differenceInDays(end, start) + 1;
  };

  // View request details
  const handleViewRequest = (request: any) => {
    // Enhance the request with calculated days field
    const enhancedRequest: LeaveRequest = {
      ...request,
      leaveType: request.leaveType || 'vacation', // Set default if missing
      days: calculateDuration(request.start_date, request.end_date)
    };
    
    setSelectedRequest(enhancedRequest);
    setViewDialogOpen(true);
  };

  // Approve request
  const handleApproveClick = (request: any) => {
    // Enhance the request with calculated days field
    const enhancedRequest: LeaveRequest = {
      ...request,
      leaveType: request.leaveType || 'vacation', // Set default if missing
      days: calculateDuration(request.start_date, request.end_date)
    };
    
    setSelectedRequest(enhancedRequest);
    setApproveDialogOpen(true);
  };

  // Reject request
  const handleRejectClick = (request: any) => {
    // Enhance the request with calculated days field
    const enhancedRequest: LeaveRequest = {
      ...request,
      leaveType: request.leaveType || 'vacation', // Set default if missing
      days: calculateDuration(request.start_date, request.end_date)
    };
    
    setSelectedRequest(enhancedRequest);
    setRejectDialogOpen(true);
  };

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>Leave Requests Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Filter by Status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 w-40">
                <Filter className="mr-2 h-4 w-4" />
                Status
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4" align="start">
              <ScrollArea className="h-[200px] w-full pr-1">
                <RadioGroup defaultValue={filterStatus} onValueChange={setFilterStatus} className="flex flex-col space-y-1">
                  <Label htmlFor="all" className="cursor-pointer flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
                    <RadioGroupItem value="all" id="all" className="h-4 w-4" />
                    <span>All</span>
                  </Label>
                  <Label htmlFor="pending" className="cursor-pointer flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
                    <RadioGroupItem value="pending" id="pending" className="h-4 w-4" />
                    <span>Pending</span>
                  </Label>
                  <Label htmlFor="approved" className="cursor-pointer flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
                    <RadioGroupItem value="approved" id="approved" className="h-4 w-4" />
                    <span>Approved</span>
                  </Label>
                  <Label htmlFor="rejected" className="cursor-pointer flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
                    <RadioGroupItem value="rejected" id="rejected" className="h-4 w-4" />
                    <span>Rejected</span>
                  </Label>
                </RadioGroup>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          {/* Filter by Employee */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 w-40">
                <Filter className="mr-2 h-4 w-4" />
                Employee
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4" align="start">
              <ScrollArea className="h-[200px] w-full pr-1">
                <RadioGroup defaultValue={filterEmployee} onValueChange={setFilterEmployee} className="flex flex-col space-y-1">
                  <Label htmlFor="all-employees" className="cursor-pointer flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
                    <RadioGroupItem value="all" id="all-employees" className="h-4 w-4" />
                    <span>All Employees</span>
                  </Label>
                  {employees?.map(employee => (
                    <Label key={employee.id} htmlFor={`employee-${employee.id}`} className="cursor-pointer flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
                      <RadioGroupItem value={employee.id.toString()} id={`employee-${employee.id}`} className="h-4 w-4" />
                      <span>{employee.name}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading leave requests...</div>
        ) : leaveRequests && leaveRequests.length > 0 ? (
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request: any) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.employee_name}</TableCell>
                    <TableCell>{format(new Date(request.start_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(request.end_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === 'approved' ? 'success' : 
                        request.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewRequest(request)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleApproveClick(request)}>
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleRejectClick(request)}>
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">No leave requests found.</div>
        )}
      </CardContent>

      {/* View Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">Employee:</Label>
              <div className="col-span-3 font-medium">{selectedRequest?.employee_name}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-date" className="text-right">Start Date:</Label>
              <div className="col-span-3">{selectedRequest?.start_date ? format(new Date(selectedRequest.start_date), 'MMM dd, yyyy') : 'N/A'}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-date" className="text-right">End Date:</Label>
              <div className="col-span-3">{selectedRequest?.end_date ? format(new Date(selectedRequest.end_date), 'MMM dd, yyyy') : 'N/A'}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leave-type" className="text-right">Leave Type:</Label>
              <div className="col-span-3">{selectedRequest?.leaveType}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration:</Label>
              <div className="col-span-3">{selectedRequest?.days} days</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">Reason:</Label>
              <div className="col-span-3">{selectedRequest?.reason}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status:</Label>
              <div className="col-span-3">
                <Badge variant={
                  selectedRequest?.status === 'approved' ? 'success' : 
                  selectedRequest?.status === 'rejected' ? 'destructive' : 
                  'secondary'
                }>
                  {selectedRequest?.status}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Request Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>Are you sure you want to approve this leave request?</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleUpdateStatus(selectedRequest!.id, 'approved')}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Request Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="reject-reason">Reason for Rejection</Label>
            <Textarea 
              id="reject-reason" 
              placeholder="Enter reason for rejection" 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleUpdateStatus(selectedRequest!.id, 'rejected', rejectReason)}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LeaveRequestsManagement;
