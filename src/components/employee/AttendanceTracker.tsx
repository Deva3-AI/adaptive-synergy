
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, PauseCircle, Loader2, ClockIcon, CalendarCheck } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/utils/apiUtils';

interface Attendance {
  attendance_id: number;
  user_id: number;
  login_time: string;
  logout_time?: string;
  work_date: string;
  total_hours?: number;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const AttendanceTracker: React.FC = () => {
  const { user } = useAuth();
  const [timer, setTimer] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const queryClient = useQueryClient();
  
  // Fetch today's attendance record
  const { data: todayAttendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['todayAttendance', user?.id],
    queryFn: async () => {
      const endpoint = `/employee/attendance/today?userId=${user?.id}`;
      const mockData: Attendance | null = null;
      
      return apiRequest<Attendance | null>(endpoint, 'get', undefined, mockData);
    },
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Mutation for starting work (login)
  const startWorkMutation = useMutation({
    mutationFn: async () => {
      return apiRequest<Attendance>(
        '/employee/attendance/login',
        'post',
        { user_id: user?.id }
      );
    },
    onSuccess: (data) => {
      toast.success('Work session started');
      queryClient.setQueryData(['todayAttendance', user?.id], data);
      queryClient.invalidateQueries({ queryKey: ['todayAttendance', user?.id] });
    },
    onError: (error) => {
      console.error('Error starting work session:', error);
      toast.error('Failed to start work session');
    }
  });
  
  // Mutation for stopping work (logout)
  const stopWorkMutation = useMutation({
    mutationFn: async () => {
      if (!todayAttendance) return null;
      
      return apiRequest<Attendance>(
        '/employee/attendance/logout',
        'post',
        { 
          attendance_id: todayAttendance.attendance_id,
          user_id: user?.id 
        }
      );
    },
    onSuccess: (data) => {
      if (data) {
        toast.success('Work session ended');
        queryClient.setQueryData(['todayAttendance', user?.id], data);
        queryClient.invalidateQueries({ queryKey: ['todayAttendance', user?.id] });
        setTimerRunning(false);
      }
    },
    onError: (error) => {
      console.error('Error stopping work session:', error);
      toast.error('Failed to end work session');
    }
  });
  
  // Update timer based on attendance data
  useEffect(() => {
    if (todayAttendance?.login_time && !todayAttendance.logout_time) {
      const loginTime = new Date(todayAttendance.login_time);
      const updateTimer = () => {
        const now = new Date();
        const secondsElapsed = differenceInSeconds(now, loginTime);
        setTimer(secondsElapsed);
      };
      
      updateTimer();
      setTimerRunning(true);
      
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } else if (todayAttendance?.login_time && todayAttendance.logout_time) {
      const loginTime = new Date(todayAttendance.login_time);
      const logoutTime = new Date(todayAttendance.logout_time);
      const secondsElapsed = differenceInSeconds(logoutTime, loginTime);
      setTimer(secondsElapsed);
      setTimerRunning(false);
    } else {
      setTimer(0);
      setTimerRunning(false);
    }
  }, [todayAttendance]);
  
  // Handle start work button click
  const handleStartWork = async () => {
    if (!user) {
      toast.error('You must be logged in to start work');
      return;
    }
    
    try {
      await startWorkMutation.mutateAsync();
    } catch (error) {
      console.error('Error in start work:', error);
    }
  };
  
  // Handle stop work button click
  const handleStopWork = async () => {
    if (!user || !todayAttendance) {
      toast.error('No active work session found');
      return;
    }
    
    try {
      await stopWorkMutation.mutateAsync();
    } catch (error) {
      console.error('Error in stop work:', error);
    }
  };
  
  const isStartingWork = startWorkMutation.isPending;
  const isStoppingWork = stopWorkMutation.isPending;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Time Tracker
          <ClockIcon className="ml-2 h-5 w-5 text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          Track your daily work hours
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        {isLoadingAttendance ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading your attendance...</p>
          </div>
        ) : (
          <>
            <div className="text-5xl font-bold mb-6">{formatTime(timer)}</div>
            <div className="flex gap-4">
              <Button
                size="lg"
                variant={timerRunning ? "outline" : "default"}
                className="gap-2"
                onClick={handleStartWork}
                disabled={isStartingWork || timerRunning}
              >
                {isStartingWork ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Start Work
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant={timerRunning ? "default" : "outline"}
                className="gap-2"
                onClick={handleStopWork}
                disabled={isStoppingWork || !timerRunning}
              >
                {isStoppingWork ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Stopping...
                  </>
                ) : (
                  <>
                    <PauseCircle className="h-5 w-5" />
                    Stop Work
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2">
        <div className="w-full text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Today:</span>
            <span className="font-medium">{format(new Date(), 'PPP')}</span>
          </div>
          {todayAttendance ? (
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started:</span>
                <span className="font-medium">
                  {todayAttendance.login_time 
                    ? format(new Date(todayAttendance.login_time), 'p')
                    : 'Not started'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ended:</span>
                <span className="font-medium">
                  {todayAttendance.logout_time 
                    ? format(new Date(todayAttendance.logout_time), 'p')
                    : timerRunning ? 'In progress' : 'Not ended'}
                </span>
              </div>
              {todayAttendance.logout_time && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total hours:</span>
                  <span className="font-medium">
                    {todayAttendance.total_hours 
                      ? `${todayAttendance.total_hours.toFixed(2)}h`
                      : `${(timer / 3600).toFixed(2)}h`}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-2">
              No attendance recorded for today
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AttendanceTracker;
