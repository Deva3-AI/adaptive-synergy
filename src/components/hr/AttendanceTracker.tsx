import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { format } from 'date-fns';
import { toast } from 'sonner';
import hrServiceSupabase, { Attendance } from '@/services/api/hrServiceSupabase';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { supabase } from "@/integrations/supabase/client";

interface AttendanceTrackerProps {
  userId: number;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ userId }) => {
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(null);
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  const { data: todayAttendance, refetch: refetchAttendance } = useQuery({
    queryKey: ['today-attendance', userId],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('employee_attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('work_date', today)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (todayAttendance) {
      setCurrentAttendance(todayAttendance);
      
      if (todayAttendance.login_time && !todayAttendance.logout_time) {
        setIsWorking(true);
        setWorkStartTime(new Date(todayAttendance.login_time));
      } else {
        setIsWorking(false);
        setWorkStartTime(null);
      }
    } else {
      setIsWorking(false);
      setWorkStartTime(null);
      setCurrentAttendance(null);
    }
  }, [todayAttendance]);

  useEffect(() => {
    let intervalId: number;
    
    if (isWorking && workStartTime) {
      intervalId = window.setInterval(() => {
        const now = new Date();
        const diffMs = now.getTime() - workStartTime.getTime();
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isWorking, workStartTime]);

  const handleStartWork = async () => {
    try {
      await hrServiceSupabase.startWork(userId);
      toast.success("Work started successfully");
      refetchAttendance();
      queryClient.invalidateQueries({ queryKey: ['employee-attendance-supabase'] });
    } catch (error) {
      console.error("Error starting work:", error);
      toast.error("Failed to start work");
    }
  };

  const handleStopWork = async (attendanceId: number) => {
    try {
      setActionInProgress(true);
      await hrServiceSupabase.stopWork(attendanceId);
      
      fetchAttendance();
      toast.success('Work session ended successfully');
    } catch (error) {
      console.error('Error stopping work:', error);
      toast.error('Failed to end work session');
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Attendance Tracker</CardTitle>
          <Badge variant={isWorking ? "success" : "secondary"}>
            {isWorking ? "Working" : "Not Working"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{format(new Date(), 'EEEE, MMMM do, yyyy')}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{format(new Date(), 'h:mm a')}</span>
          </div>
        </div>
        
        {isWorking && (
          <div className="text-center py-6">
            <div className="text-4xl font-mono font-bold mb-2">{elapsedTime}</div>
            <div className="text-muted-foreground text-sm">
              Started at {workStartTime && format(workStartTime, 'h:mm a')}
            </div>
          </div>
        )}
        
        {!isWorking && todayAttendance?.login_time && todayAttendance?.logout_time && (
          <div className="text-center py-6">
            <div className="text-2xl font-bold mb-1">Work Completed</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(todayAttendance.login_time), 'h:mm a')} - {format(new Date(todayAttendance.logout_time), 'h:mm a')}
            </div>
          </div>
        )}
        
        {!isWorking && !todayAttendance?.login_time && (
          <div className="text-center py-6">
            <div className="text-2xl font-bold mb-1">Not Started</div>
            <div className="text-sm text-muted-foreground">
              Click 'Start Work' to begin tracking
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isWorking ? (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleStopWork}
          >
            Stop Work
          </Button>
        ) : (
          <Button 
            className="w-full"
            onClick={handleStartWork}
            disabled={!!(todayAttendance?.login_time && todayAttendance?.logout_time)}
          >
            {todayAttendance?.login_time && todayAttendance?.logout_time
              ? "Work Completed"
              : "Start Work"
            }
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AttendanceTracker;
