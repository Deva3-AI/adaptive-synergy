
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LeaveRequestsManagement from '@/components/hr/LeaveRequestsManagement';
import { useQuery } from '@tanstack/react-query';
import hrServiceSupabase from '@/services/api/hrServiceSupabase';

const LeaveManagement: React.FC = () => {
  // Fetch leave requests for summary statistics
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leaveRequests'],
    queryFn: async () => {
      try {
        return await hrServiceSupabase.getLeaveRequests();
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        return [];
      }
    },
  });
  
  // Calculate summary statistics
  const pendingCount = leaveRequests?.filter(req => req.status === 'pending').length || 0;
  const approvedCount = leaveRequests?.filter(req => req.status === 'approved').length || 0;
  const rejectedCount = leaveRequests?.filter(req => req.status === 'rejected').length || 0;
  
  const sickLeaveCount = leaveRequests?.filter(req => req.leaveType === 'sick').length || 0;
  const annualLeaveCount = leaveRequests?.filter(req => req.leaveType === 'annual').length || 0;
  const wfhCount = leaveRequests?.filter(req => req.leaveType === 'wfh').length || 0;
  const personalLeaveCount = leaveRequests?.filter(req => req.leaveType === 'personal').length || 0;
  
  // Get employees currently on leave
  const today = new Date().toISOString().split('T')[0];
  const employeesOnLeave = leaveRequests?.filter(req => 
    req.status === 'approved' && 
    new Date(req.start_date) <= new Date(today) && 
    new Date(req.end_date) >= new Date(today)
  ) || [];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
        <p className="text-muted-foreground">
          Manage employee leave requests and approvals
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Badge className="bg-yellow-500">{pendingCount}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Requests awaiting approval/rejection
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
            <Badge className="bg-green-500">{approvedCount}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total approved leave requests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Employees On Leave</CardTitle>
            <Badge className="bg-blue-500">{employeesOnLeave.length}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Currently out of office today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leave Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 text-xs">
              <Badge variant="outline" className="bg-blue-50">Annual: {annualLeaveCount}</Badge>
              <Badge variant="outline" className="bg-red-50">Sick: {sickLeaveCount}</Badge>
              <Badge variant="outline" className="bg-green-50">WFH: {wfhCount}</Badge>
              <Badge variant="outline" className="bg-purple-50">Personal: {personalLeaveCount}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="leave-management" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leave-management">Leave Requests</TabsTrigger>
          <TabsTrigger value="leave-calendar">Leave Calendar</TabsTrigger>
          <TabsTrigger value="leave-balances">Leave Balances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leave-management">
          <LeaveRequestsManagement />
        </TabsContent>
        
        <TabsContent value="leave-calendar">
          <Card>
            <CardHeader>
              <CardTitle>Leave Calendar</CardTitle>
              <CardDescription>
                View scheduled leaves in calendar format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Leave calendar view will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leave-balances">
          <Card>
            <CardHeader>
              <CardTitle>Employee Leave Balances</CardTitle>
              <CardDescription>
                View and manage leave balances for all employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Leave balances view will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveManagement;
