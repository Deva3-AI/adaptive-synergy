
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Clock } from "lucide-react";
import { formatDuration } from '@/utils/dateUtils';
import { toast } from 'sonner';
import { employeeService } from '@/services/api';

interface AttendanceTrackerProps {
  attendance?: {
    attendance_id: number;
    login_time: string;
    logout_time?: string;
  };
  onAttendanceUpdate: () => void;
}

const AttendanceTracker = ({ attendance, onAttendanceUpdate }: AttendanceTrackerProps) => {
  const isWorking = attendance && !attendance.logout_time;
  
  const handleStartWork = async () => {
    try {
      await employeeService.startWork();
      onAttendanceUpdate();
      toast.success('Work session started');
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Failed to start work session');
    }
  };
  
  const handleStopWork = async () => {
    if (!attendance) return;
    
    try {
      await employeeService.stopWork(attendance.attendance_id);
      onAttendanceUpdate();
      toast.success('Work session ended');
    } catch (error) {
      console.error('Error stopping work:', error);
      toast.error('Failed to end work session');
    }
  };
  
  // Calculate current duration if working
  const calculateDuration = () => {
    if (!attendance || !attendance.login_time) return '0h 0m';
    return formatDuration(new Date(attendance.login_time));
  };
  
  return (
    <Card className="border-accent/40">
      <CardContent className="pt-4 flex items-center gap-3">
        <div className="flex flex-col">
          <div className="text-sm text-muted-foreground mb-1">Today's Status</div>
          <div className="font-semibold text-md flex items-center">
            <Clock className="h-4 w-4 mr-1 text-accent" />
            {isWorking ? (
              <span className="text-green-600">Working</span>
            ) : (
              <span className="text-amber-600">Not Working</span>
            )}
          </div>
          {isWorking && (
            <div className="text-xs text-muted-foreground mt-1">
              Duration: {calculateDuration()}
            </div>
          )}
        </div>
        
        {isWorking ? (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleStopWork}
            className="ml-auto"
          >
            <Pause className="h-4 w-4 mr-1" />
            End Work
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm"
            onClick={handleStartWork}
            className="ml-auto"
          >
            <Play className="h-4 w-4 mr-1" />
            Start Work
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;
