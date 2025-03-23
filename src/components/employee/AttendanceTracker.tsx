
import React from 'react';
import { Button } from "@/components/ui/button";
import { employeeService } from '@/services/api';
import { toast } from "sonner";
import { Clock, Play, Square } from "lucide-react";
import { format } from 'date-fns';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

interface AttendanceTrackerProps {
  attendance: any;
  onAttendanceUpdate: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
}

const AttendanceTracker = ({ attendance, onAttendanceUpdate }: AttendanceTrackerProps) => {
  const handleStartWork = async () => {
    try {
      await employeeService.startWork();
      await onAttendanceUpdate();
      toast.success('Work session started');
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Failed to start work session');
    }
  };
  
  const handleStopWork = async () => {
    if (!attendance?.attendance_id) {
      toast.error('No active work session to end');
      return;
    }
    
    try {
      await employeeService.stopWork(attendance.attendance_id);
      await onAttendanceUpdate();
      toast.success('Work session ended');
    } catch (error) {
      console.error('Error stopping work:', error);
      toast.error('Failed to end work session');
    }
  };
  
  const formatDuration = () => {
    if (!attendance?.login_time) return '0h 0m';
    
    const start = new Date(attendance.login_time);
    const end = attendance.logout_time ? new Date(attendance.logout_time) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };
  
  return (
    <div className="flex items-center gap-2 text-sm p-2 border rounded-md bg-background">
      <div className="flex items-center gap-2 pr-2 border-r">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>Today:</span>
        <span className="font-medium">
          {formatDuration()}
        </span>
      </div>
      
      {attendance ? (
        <div className="flex items-center gap-1">
          <div className="text-green-600 font-medium flex items-center">
            <span className="h-2 w-2 bg-green-600 rounded-full mr-1.5"></span>
            Working since {format(new Date(attendance.login_time), 'h:mm a')}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleStopWork}
            className="h-7 gap-1"
          >
            <Square className="h-3.5 w-3.5" />
            Stop
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleStartWork}
          className="h-7 gap-1"
        >
          <Play className="h-3.5 w-3.5" />
          Start Work
        </Button>
      )}
    </div>
  );
};

export default AttendanceTracker;
