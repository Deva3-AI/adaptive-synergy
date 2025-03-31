import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { hrService } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, ChevronDown, User, AlertTriangle } from "lucide-react";
import { format, addDays } from 'date-fns';
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const LeaveRequestsList = () => {
  const [statusFilter, setStatusFilter] = useState('pending');
  const queryClient = useQueryClient();

  const { user, hasRole } = useAuth();
  
  // Update conditional rendering logic
  const isAdminOrHR = hasRole('admin') || hasRole('hr');

  const canApprove = isAdminOrHR;

  // Fetch leave requests
  const { data: leaveRequests, isLoading: isLeaveRequestsLoading } = useQuery({
    queryKey: ['leave-requests', statusFilter],
    queryFn: () => hrService.getLeaveRequests(statusFilter),
  });

  // Mutation to approve a leave request
  const approveLeaveRequestMutation = useMutation({
    mutationFn: (leaveRequestId: number) => hrService.approveLeaveRequest(leaveRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests', statusFilter] });
      toast.success('Leave request approved');
    },
  });

  // Mutation to reject a leave request
  const rejectLeaveRequestMutation = useMutation({
    mutationFn: (leaveRequestId: number) => hrService.rejectLeaveRequest(leaveRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests', statusFilter] });
      toast.success('Leave request rejected');
    },
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Requests</CardTitle>
        <CardDescription>
          Manage employee leave requests and track their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <Label htmlFor="status">Filter by Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pending" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLeaveRequestsLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                {canApprove && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(leaveRequests || []).map((request: any) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{request.employee_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(request.start_date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(request.end_date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                    {request.status === 'approved' && (
                      <Badge variant="success">Approved</Badge>
                    )}
                    {request.status === 'rejected' && (
                      <Badge variant="destructive">Rejected</Badge>
                    )}
                  </TableCell>
                  {canApprove && (
                    <TableCell className="text-right">
                      {request.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => approveLeaveRequestMutation.mutate(request.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => rejectLeaveRequestMutation.mutate(request.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestsList;
