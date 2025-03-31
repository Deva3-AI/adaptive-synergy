import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { hrService } from '@/services/api';
import { useAuth } from '@/hooks/use-auth';

const EmployeeLeaveRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    start_date: '',
    end_date: '',
    reason: '',
    leaveType: 'vacation'
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, [user]);

  const fetchLeaveRequests = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await hrService.getEmployeeLeaveRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('User information not available');
      return;
    }
    
    try {
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      
      await hrService.submitLeaveRequest({
        employee_id: userId,
        start_date: newRequest.start_date,
        end_date: newRequest.end_date,
        reason: newRequest.reason,
        leaveType: newRequest.leaveType,
      });
      
      toast.success('Leave request submitted successfully');
      setIsDialogOpen(false);
      fetchLeaveRequests();
      
      setNewRequest({
        start_date: '',
        end_date: '',
        reason: '',
        leaveType: 'vacation'
      });
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewRequest({
      ...newRequest,
      [e.target.name]: e.target.value,
    });
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vacation">Vacation</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="maternity">Maternity</SelectItem>
              <SelectItem value="paternity">Paternity</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleSubmit(newRequest)}>Submit Request</Button>
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
              {requests.map((request: any) => (
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
