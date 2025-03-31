
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import hrServiceSupabase from '@/services/api/hrServiceSupabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import LeaveRequestForm from '@/components/employee/LeaveRequestForm';
import EmployeeLeaveRequests from '@/components/employee/EmployeeLeaveRequests';

const LeaveRequests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch leave requests
  const { data: leaveRequests, isLoading, refetch } = useQuery({
    queryKey: ['leaveRequests', user?.id],
    queryFn: async () => {
      try {
        if (user?.id) {
          return await hrServiceSupabase.getLeaveRequests();
        }
        return [];
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        return [];
      }
    },
  });

  // Handle leave request submission
  const handleSubmitLeaveRequest = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      
      if (!user?.id) {
        toast.error('Please log in to submit a leave request');
        return;
      }
      
      const leaveType = formData.get('leaveType') as string;
      const startDate = formData.get('startDate') as string;
      const endDate = formData.get('endDate') as string;
      const reason = formData.get('reason') as string;
      
      const leaveData = {
        employee_id: user.id,
        leaveType,
        start_date: startDate,
        end_date: endDate || startDate, // Use start date if end date is not provided
        reason,
        status: 'pending'
      };
      
      const result = await hrServiceSupabase.submitLeaveRequest(leaveData);
      
      if (result.success) {
        toast.success('Leave request submitted successfully');
        refetch(); // Refresh the leave requests list
      } else {
        toast.error('Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
        <p className="text-muted-foreground">
          Submit and track your leave requests
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Badge className="bg-yellow-500">{leaveRequests?.filter(req => req.status === 'pending').length || 0}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Badge className="bg-green-500">{leaveRequests?.filter(req => req.status === 'approved').length || 0}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Approved requests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Work From Home</CardTitle>
            <Badge className="bg-blue-500">{leaveRequests?.filter(req => req.leaveType === 'wfh').length || 0}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Remote work requests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
            <Badge className="bg-red-500">{leaveRequests?.filter(req => req.leaveType === 'sick').length || 0}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Health-related absences
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="apply-leave" className="space-y-4">
        <TabsList>
          <TabsTrigger value="apply-leave">Apply for Leave</TabsTrigger>
          <TabsTrigger value="my-leaves">My Leave Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="apply-leave">
          <Card>
            <CardHeader>
              <CardTitle>Submit Leave Request</CardTitle>
              <CardDescription>
                Fill in the details below to request time off or work from home
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestForm onSubmit={handleSubmitLeaveRequest} isSubmitting={isSubmitting} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-leaves">
          <EmployeeLeaveRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveRequests;
