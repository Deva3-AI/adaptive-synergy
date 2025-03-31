
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Check, X, Clock } from 'lucide-react';
import hrService from '@/services/api/hrService';

const LeaveRequestsManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { 
      id: 1, 
      employee_id: 1, 
      employee_name: 'John Doe', 
      start_date: '2023-07-10', 
      end_date: '2023-07-14', 
      reason: 'Annual vacation', 
      status: 'pending',
      leaveType: 'vacation'
    },
    { 
      id: 2, 
      employee_id: 2, 
      employee_name: 'Jane Smith', 
      start_date: '2023-07-05', 
      end_date: '2023-07-06', 
      reason: 'Medical appointment', 
      status: 'approved',
      leaveType: 'sick'
    },
    { 
      id: 3, 
      employee_id: 3, 
      employee_name: 'Mike Johnson', 
      start_date: '2023-07-20', 
      end_date: '2023-07-25', 
      reason: 'Family emergency', 
      status: 'rejected',
      leaveType: 'emergency'
    }
  ]);

  const updateRequestStatus = (id: number, status: 'approved' | 'rejected') => {
    setLeaveRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const getDaysCount = (startDate: string, endDate?: string) => {
    if (!endDate) return 1; // Single day
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1; // Include both start and end day
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {leaveRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No leave requests found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map(request => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.employee_name}</TableCell>
                  <TableCell className="capitalize">{request.leaveType}</TableCell>
                  <TableCell>{getDaysCount(request.start_date, request.end_date)} days</TableCell>
                  <TableCell>
                    {format(new Date(request.start_date), 'MMM dd, yyyy')}
                    {request.end_date && ` - ${format(new Date(request.end_date), 'MMM dd, yyyy')}`}
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
                          onClick={() => updateRequestStatus(request.id, 'approved')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          onClick={() => updateRequestStatus(request.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {request.status !== 'pending' && (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {request.status === 'approved' ? 'Approved' : 'Rejected'}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestsManagement;
