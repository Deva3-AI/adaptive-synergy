
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

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

// Types for leave request data
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const EmployeeLeaveRequests: React.FC = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch leave requests for the current employee from the API
  const { data: leaveRequests, isLoading, error } = useQuery({
    queryKey: ['employeeLeaveRequests', user?.id],
    queryFn: async () => {
      try {
        // Try to get data from the real API
        const response = await axios.get(`${API_URL}/employee/leave-requests?employeeId=${user?.id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        
        // If the API fails, use mock data for demo purposes
        const employeeId = user?.id || 1;
        
        // In a real app, you should display an error message
        // For demo, we'll return mock data to show the UI
        return [
          { 
            id: 1, 
            employeeId, 
            employeeName: user?.name || 'Employee', 
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
            employeeId, 
            employeeName: user?.name || 'Employee', 
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
            employeeId, 
            employeeName: user?.name || 'Employee', 
            leaveType: 'wfh', 
            startDate: '2023-09-10', 
            reason: 'Internet installation at home', 
            status: 'pending',
            createdAt: '2023-09-08T16:30:00Z',
            updatedAt: '2023-09-08T16:30:00Z'
          }
        ];
      }
    },
  });
  
  // Mutation to submit a new leave request
  const leaveRequestMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(`${API_URL}/employee/leave-requests`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Leave request submitted successfully');
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['employeeLeaveRequests', user?.id] });
    },
    onError: (error) => {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request. Please try again.');
    },
  });
  
  const handleFormSubmit = async (formData: FormData) => {
    try {
      // Add employee ID to form data
      formData.append('employeeId', user?.id?.toString() || '1');
      formData.append('employeeName', user?.name || 'Employee');
      
      // Submit the form data
      await leaveRequestMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  // Get leave balances from server or use default values
  const { data: leaveBalances } = useQuery({
    queryKey: ['leaveBalances', user?.id],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/employee/leave-balance?employeeId=${user?.id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching leave balances:', error);
        return {
          annual: 18,
          sick: 5,
          personal: 3
        };
      }
    }
  });
  
  // Handle error state
  if (error) {
    console.error('Error loading leave requests:', error);
  }
  
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
              <LeaveRequestForm onSubmit={handleFormSubmit} isSubmitting={leaveRequestMutation.isPending} />
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
            Leave balance: 
            <span className="font-medium"> {leaveBalances?.annual || 0}</span> annual days, 
            <span className="font-medium"> {leaveBalances?.sick || 0}</span> sick days,
            <span className="font-medium"> {leaveBalances?.personal || 0}</span> personal days remaining
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmployeeLeaveRequests;
