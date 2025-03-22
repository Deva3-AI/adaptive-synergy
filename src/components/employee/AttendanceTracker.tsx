
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Square, Clock, CalendarDays, BarChart, LogOut } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { employeeService, Attendance } from '@/services/api/employeeService';

const AttendanceTracker: React.FC = () => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<Attendance | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Fetch today's attendance record
  const { data: todayAttendance, isLoading, refetch } = useQuery({
    queryKey: ['todayAttendance'],
    queryFn: async () => {
      try {
        const attendance = await employeeService.getTodayAttendance();
        return attendance;
      } catch (error) {
        console.error('Error fetching today\'s attendance:', error);
        return null;
      }
    },
  });
  
  // Fetch attendance history
  const { data: attendanceHistory } = useQuery({
    queryKey: ['attendanceHistory'],
    queryFn: async () => {
      try {
        const history = await employeeService.getAttendanceHistory();
        return history;
      } catch (error) {
        console.error('Error fetching attendance history:', error);
        return [];
      }
    },
  });
  
  // Update elapsed time when tracking is active
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isTracking && startTime) {
      intervalId = setInterval(() => {
        const secondsElapsed = differenceInSeconds(new Date(), startTime);
        setElapsedTime(secondsElapsed);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTracking, startTime]);
  
  // Initialize tracking state based on today's attendance
  useEffect(() => {
    if (todayAttendance) {
      setCurrentSession(todayAttendance);
      
      if (todayAttendance.login_time && !todayAttendance.logout_time) {
        setIsTracking(true);
        setStartTime(new Date(todayAttendance.login_time));
        const secondsElapsed = differenceInSeconds(
          new Date(),
          new Date(todayAttendance.login_time)
        );
        setElapsedTime(secondsElapsed);
      } else {
        setIsTracking(false);
        setStartTime(null);
        setElapsedTime(0);
      }
    }
  }, [todayAttendance]);
  
  const handleStartWork = async () => {
    try {
      const response = await employeeService.startWork();
      
      setIsTracking(true);
      setStartTime(new Date());
      setCurrentSession(response);
      refetch(); // Refetch today's attendance
      
      toast.success('Work session started successfully');
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Failed to start work session');
    }
  };
  
  const handleStopWork = async () => {
    if (!currentSession) return;
    
    try {
      await employeeService.stopWork(currentSession.attendance_id);
      
      setIsTracking(false);
      setStartTime(null);
      setElapsedTime(0);
      refetch(); // Refetch today's attendance
      
      toast.success('Work session ended successfully');
    } catch (error) {
      console.error('Error stopping work:', error);
      toast.error('Failed to end work session');
    }
  };
  
  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Calculate workday progress (8 hours = 100%)
  const workdayProgress = Math.min(Math.floor((elapsedTime / (8 * 3600)) * 100), 100);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            Work Time Tracker
            <Clock className="ml-2 h-5 w-5 text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Track your daily work hours with start and stop functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="text-4xl font-bold tracking-tighter">
                    {formatTime(elapsedTime)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isTracking 
                      ? `Started at ${startTime ? format(startTime, 'h:mm a') : 'Unknown'}`
                      : 'Not currently working'
                    }
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Workday Progress</span>
                    <span>{workdayProgress}%</span>
                  </div>
                  <Progress value={workdayProgress} className="h-2" />
                </div>
                
                <div className="flex flex-col xs:flex-row gap-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleStartWork}
                    disabled={isTracking}
                  >
                    <Play className="h-4 w-4" />
                    Start Work
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={handleStopWork}
                    disabled={!isTracking}
                  >
                    <Square className="h-4 w-4" />
                    Stop Work
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full text-center text-sm text-muted-foreground">
            {todayAttendance && todayAttendance.login_time ? (
              <p>
                Today's Hours: {
                  todayAttendance.logout_time 
                    ? `${formatTime(differenceInSeconds(
                        new Date(todayAttendance.logout_time),
                        new Date(todayAttendance.login_time)
                      ))} (Complete)`
                    : 'In progress'
                }
              </p>
            ) : (
              <p>No work recorded today</p>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            Recent Activity
            <CalendarDays className="ml-2 h-5 w-5 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendanceHistory && attendanceHistory.length > 0 ? (
              attendanceHistory.slice(0, 5).map((record, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{format(new Date(record.work_date), 'EEEE, MMMM d')}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.login_time ? format(new Date(record.login_time), 'h:mm a') : 'N/A'} 
                      {' - '}
                      {record.logout_time ? format(new Date(record.logout_time), 'h:mm a') : 'In progress'}
                    </p>
                  </div>
                  <Badge variant={record.logout_time ? 'outline' : 'secondary'}>
                    {record.logout_time 
                      ? formatTime(differenceInSeconds(
                          new Date(record.logout_time),
                          new Date(record.login_time)
                        ))
                      : 'Active'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p>No recent activity found</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" className="w-full gap-2">
            <BarChart className="h-4 w-4" />
            View Full History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AttendanceTracker;
