
import React from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  start_date: string;
  end_date?: string;
  reason: string;
  status: string;
  leaveType: string;
  documentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LeaveRequestsListProps {
  requests: LeaveRequest[];
  onUpdateStatus: (id: number, status: 'approved' | 'rejected') => Promise<void>;
}

const LeaveRequestsList: React.FC<LeaveRequestsListProps> = ({ requests, onUpdateStatus }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  const handleApprove = (id: number) => {
    onUpdateStatus(id, 'approved');
  };

  const handleReject = (id: number) => {
    onUpdateStatus(id, 'rejected');
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No leave requests found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Leave Type</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.employee_name}</TableCell>
            <TableCell className="capitalize">{request.leaveType}</TableCell>
            <TableCell>{format(new Date(request.start_date), 'MMM dd, yyyy')}</TableCell>
            <TableCell>
              {request.end_date 
                ? format(new Date(request.end_date), 'MMM dd, yyyy')
                : '-'
              }
            </TableCell>
            <TableCell className="max-w-[200px] truncate" title={request.reason}>
              {request.reason}
            </TableCell>
            <TableCell>{getStatusBadge(request.status)}</TableCell>
            <TableCell className="text-right">
              {request.status === 'pending' && (
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={() => handleApprove(request.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    onClick={() => handleReject(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeaveRequestsList;
