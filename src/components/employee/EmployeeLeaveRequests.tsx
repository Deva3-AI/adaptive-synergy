
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

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

import LeaveRequestForm from '@/components/hr/LeaveRequestForm';
import LeaveRequestsList from '@/components/hr/LeaveRequestsList';
import { useAuth } from '@/hooks/use-auth';

// Mock data - in a real app, this would come from your API
const MOCK_LEAVE_REQUESTS = [
  { 
    id: 1, 
    employeeId: 1, 
    employeeName: 'John Doe', 
    leaveType: 'annual', 
    startDate: '2023-09-15', 
    endDate: '2023-09-20', 
    reason: 'Family vacation', 
    status: 'approved',
    createdAt: '2023-09-01T10:23:45Z',
    updatedAt: '2023-09-02T14:12:30Z'
  },
  { 
    id: 2, 
    employeeId: 1, 
    employeeName: 'John Doe', 
    leaveType: 'sick', 
    startDate: '2023-09-05', 
    endDate: '2023-09-06', 
    reason: 'Feeling unwell, doctor recommended rest', 
    status: 'approved',
    documentUrl: '/documents/medical-note.pdf',
    createdAt: '2023-09-04T09:15:22Z',
    updatedAt: '2023-09-04T11:45:10Z'
  },
  { 
    id: 3, 
    employeeId: 1, 
    employeeName: 'John Doe', 
    leaveType: 'wfh', 
    startDate: '2023-09-10', 
    reason: 'Internet installation at home', 
    status: 'pending',
    createdAt: '2023-09-08T16:30:00Z',
    updatedAt: '2023-09-08T16:30:00Z'
  },
  { 
    id: 4, 
    employeeId: 1, 
    employeeName: 'John Doe', 
    leaveType: 'halfDay', 
    startDate: '2023-10-12', 
    reason: 'Doctor appointment in the afternoon', 
    status: 'rejected',
    createdAt: '2023-09-09T14:20:15Z',
    updatedAt: '2023-09-10T09:15:30Z'
  },
];

const EmployeeLeaveRequests: React.FC = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fetch leave requests for the current employee
  const { data: leaveRequests, isLoading, refetch } = useQuery({
    queryKey: ['employeeLeaveRequests', user?.id],
    queryFn: async () => {
      try {
        // In a real implementation, this would call the backend API
        // const response = await fetch(`/api/employee/leave-requests?employeeId=${user?.id}`);
        // return await response.json();
        
        // For mock purposes, filter the data for the current employee
        // In a real app, the API would handle this filtering
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use user.id from auth context if available, otherwise default to 1 for demo
        const employeeId = user?.id || 1;
        return MOCK_LEAVE_REQUESTS.filter(req => req.employeeId === employeeId);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        return [];
      }
    },
  });
  
  const handleFormSubmit = () => {
    toast.success('Leave request submitted successfully');
    setDialogOpen(false);
    refetch();
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
              <LeaveRequestForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading your leave requests...</p>
          </div>
        ) : leaveRequests && leaveRequests.length > 0 ? (
          <LeaveRequestsList 
            requests={leaveRequests} 
            forEmployee={true}
          />
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
            Leave balance: <span className="font-medium">18</span> annual days, 
            <span className="font-medium"> 5</span> sick days remaining
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmployeeLeaveRequests;
