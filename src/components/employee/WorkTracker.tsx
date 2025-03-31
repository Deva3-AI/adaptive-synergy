
import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, Calendar, BarChart, History } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import userService from '@/services/api/userService';

interface WorkTrackerProps {
  isWorking: boolean;
  onStartWork: () => void;
  onEndWork: () => void;
  startTime: Date;
  todayHours: number;
}

const WorkTracker: React.FC<WorkTrackerProps> = ({
  isWorking,
  onStartWork,
  onEndWork,
  startTime,
  todayHours
}) => {
  const { user } = useAuth();
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(isWorking);
  
  // Fetch attendance history
  const { data: attendanceHistory } = useQuery({
    queryKey: ['attendance-history', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) return [];
        
        // Get last 7 days
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
        
        return await userService.getUserAttendance(user.id, startDate, endDate);
      } catch (error) {
        console.error('Error fetching attendance history:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
  
  // Initialize timer based on startTime if currently working
  useEffect(() => {
    if (isWorking) {
      const initialSeconds = differenceInSeconds(new Date(), startTime);
      setSeconds(initialSeconds);
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  }, [isWorking, startTime]);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);
  
  // Format timer display
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate weekly stats
  const calculateWeeklyStats = () => {
    if (!attendanceHistory) return { totalHours: 0, averageHours: 0, daysWorked: 0 };
    
    let totalHours = 0;
    let daysWorked = 0;
    
    attendanceHistory.forEach((record: any) => {
      if (record.login_time) {
        const loginTime = new Date(record.login_time);
        const logoutTime = record.logout_time ? new Date(record.logout_time) : null;
        
        if (logoutTime) {
          const hours = (logoutTime.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
          totalHours += hours;
          daysWorked++;
        }
      }
    });
    
    return {
      totalHours: Math.round(totalHours * 10) / 10,
      averageHours: daysWorked > 0 ? Math.round((totalHours / daysWorked) * 10) / 10 : 0,
      daysWorked
    };
  };
  
  const weeklyStats = calculateWeeklyStats();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Time Tracker</span>
            <Badge variant={isWorking ? "default" : "secondary"}>
              {isWorking ? "Currently Working" : "Not Working"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold mb-2">
              {isWorking ? formatTime(seconds) : "00:00:00"}
            </div>
            <div className="text-sm text-muted-foreground">
              {isWorking 
                ? `Started at ${format(startTime, 'h:mm a')}`
                : "Press Start to begin tracking your time"
              }
            </div>
          </div>
          
          <div className="flex justify-center">
            {isWorking ? (
              <Button 
                className="w-32 gap-2" 
                variant="destructive"
                onClick={onEndWork}
              >
                <Pause className="h-4 w-4" />
                End Work
              </Button>
            ) : (
              <Button 
                className="w-32 gap-2" 
                onClick={onStartWork}
              >
                <Play className="h-4 w-4" />
                Start Work
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-4 border-t">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Today</div>
              <div className="font-semibold">{todayHours} hrs</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">This Week</div>
              <div className="font-semibold">{weeklyStats.totalHours} hrs</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Avg/Day</div>
              <div className="font-semibold">{weeklyStats.averageHours} hrs</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceHistory && attendanceHistory.slice(0, 5).map((record: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(record.work_date), 'EEE, MMM d')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {record.login_time 
                        ? format(new Date(record.login_time), 'h:mm a')
                        : "N/A"
                      }
                    </span>
                  </div>
                  <span>-</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {record.logout_time 
                        ? format(new Date(record.logout_time), 'h:mm a')
                        : "N/A"
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {(!attendanceHistory || attendanceHistory.length === 0) && (
              <div className="text-center py-4 text-muted-foreground">
                No recent activity found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkTracker;
