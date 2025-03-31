import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { hrService } from '@/services/api';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from 'date-fns';

const EmployeeLeaveRequests = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({
    start_date: '',
    end_date: '',
    reason: '',
  });

  // Function to fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const requests = await hrService.getLeaveRequests(user?.id);
      setLeaveRequests(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, [user]);

  // Function to handle input changes for the new leave request form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewRequest({
      ...newRequest,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle submitting a new leave request
  const handleSubmitRequest = async (requestData: any) => {
    try {
      // Convert user.id to number if it's not already
      const userId = typeof user?.id === 'string' ? parseInt(user.id, 10) : user?.id;
      
      // Make sure userId is a number
      if (!userId || isNaN(Number(userId))) {
        toast.error('Invalid user ID');
        return;
      }
      
      const response = await hrService.submitLeaveRequest({
        ...requestData,
        employee_id: Number(userId) 
      });
      
      if (response.success) {
        toast.success('Leave request submitted successfully');
        setNewRequest({
          start_date: '',
          end_date: '',
          reason: '',
        });
        fetchLeaveRequests(); // Refresh leave requests
      } else {
        toast.error(response.error || 'Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Submit Leave Request</CardTitle>
          <CardDescription>Fill in the details below to request time off</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              type="date"
              id="start_date"
              name="start_date"
              value={newRequest.start_date}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input
              type="date"
              id="end_date"
              name="end_date"
              value={newRequest.end_date}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              name="reason"
              placeholder="Enter reason for leave"
              value={newRequest.reason}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={() => handleSubmitRequest(newRequest)}>Submit Request</Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Your Leave Requests</CardTitle>
          <CardDescription>View the status of your submitted requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading leave requests...</div>
          ) : (
            <div className="divide-y">
              {leaveRequests.map((request: any) => (
                <div key={request.id} className="py-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {format(new Date(request.start_date), 'MMM d, yyyy')} - {format(new Date(request.end_date), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground">{request.reason}</p>
                    </div>
                    <div className="text-right">
                      {request.status === 'pending' && <span className="text-yellow-500">Pending</span>}
                      {request.status === 'approved' && <span className="text-green-500">Approved</span>}
                      {request.status === 'rejected' && <span className="text-red-500">Rejected</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeLeaveRequests;
