
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Clock } from "lucide-react";
import { format, formatDistanceStrict } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface Attendance {
  attendance_id: number;
  login_time: string;
  logout_time: string | null;
}

interface AttendanceTrackerProps {
  attendance?: Attendance;
  onAttendanceUpdate: () => void;
}

const AttendanceTracker = ({ attendance, onAttendanceUpdate }: AttendanceTrackerProps) => {
  const { user } = useAuth();
  const [elapsedTime, setElapsedTime] = useState('0h 0m');
  const isWorking = attendance && !attendance.logout_time;
  
  // Update elapsed time every minute if working
  useEffect(() => {
    if (!isWorking) return;
    
    const updateElapsedTime = () => {
      if (attendance?.login_time) {
        const startTime = new Date(attendance.login_time);
        const now = new Date();
        setElapsedTime(formatDistanceStrict(now, startTime, { 
          addSuffix: false,
          roundingMethod: 'floor'
        }));
      }
    };
    
    // Update immediately and then every minute
    updateElapsedTime();
    const interval = setInterval(updateElapsedTime, 60000);
    
    return () => clearInterval(interval);
  }, [attendance, isWorking]);
  
  const handleStartWork = async () => {
    if (!user) {
      toast.error('You must be logged in to track attendance');
      return;
    }
    
    try {
      // Create new attendance record
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('employee_attendance')
        .insert({
          user_id: user.id,
          login_time: new Date().toISOString(),
          work_date: today
        })
        .select();
      
      if (error) throw error;
      
      onAttendanceUpdate();
      toast.success('Work session started');
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Failed to start work session');
    }
  };
  
  const handleStopWork = async () => {
    if (!attendance || !user) return;
    
    try {
      // Update attendance record with logout time
      const { error } = await supabase
        .from('employee_attendance')
        .update({
          logout_time: new Date().toISOString()
        })
        .eq('attendance_id', attendance.attendance_id);
      
      if (error) throw error;
      
      onAttendanceUpdate();
      toast.success('Work session ended');
    } catch (error) {
      console.error('Error stopping work:', error);
      toast.error('Failed to end work session');
    }
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
              Duration: {elapsedTime}
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
