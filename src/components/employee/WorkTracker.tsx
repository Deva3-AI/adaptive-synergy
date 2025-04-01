
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { employeeService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Clock, Play, Square, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface WorkTrackerProps {
  isWorking: boolean;
  onStartWork: () => Promise<void>;
  onEndWork: () => Promise<void>;
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
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startingWork, setStartingWork] = useState(false);
  const [stoppingWork, setStoppingWork] = useState(false);

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      if (user && user.id) {
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        const attendanceData = await employeeService.getTodayAttendance(userId);
        setTodayAttendance(attendanceData);
      }
    } catch (error) {
      console.error('Error fetching today attendance:', error);
      toast.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, [user]);

  const startWork = async () => {
    try {
      setStartingWork(true);
      if (user && user.id) {
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        await employeeService.startWork(userId);
      }
      
      // Refresh attendance data
      fetchTodayAttendance();
      toast.success('Work session started successfully');
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Failed to start work session');
    } finally {
      setStartingWork(false);
    }
  };

  const stopWork = async () => {
    if (!todayAttendance) return;
    
    try {
      setStoppingWork(true);
      if (user && user.id && todayAttendance.attendance_id) {
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        
        // Make sure attendanceId is a number
        const attendanceId = typeof todayAttendance.attendance_id === 'string' 
          ? parseInt(todayAttendance.attendance_id, 10) 
          : todayAttendance.attendance_id;
        
        await employeeService.stopWork(attendanceId, userId);
      }
      
      // Refresh attendance data
      fetchTodayAttendance();
      toast.success('Work session ended successfully');
    } catch (error) {
      console.error('Error stopping work:', error);
      toast.error('Failed to end work session');
    } finally {
      setStoppingWork(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-lg font-semibold">Work Tracker</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading attendance data...</p>
          ) : todayAttendance ? (
            <>
              <p className="text-sm text-muted-foreground">
                You started working at {format(new Date(todayAttendance.login_time), 'h:mm a')}
              </p>
              <p className="text-sm text-muted-foreground">
                Today is {format(new Date(todayAttendance.work_date), 'MMMM d, yyyy')}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">You have not started working today.</p>
          )}
        </div>
        <div>
          {loading ? (
            <Button disabled>Loading...</Button>
          ) : todayAttendance ? (
            <Button variant="destructive" onClick={stopWork} disabled={stoppingWork}>
              {stoppingWork ? (
                <>
                  <Square className="mr-2 h-4 w-4 animate-spin" />
                  Ending...
                </>
              ) : (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  End Work
                </>
              )}
            </Button>
          ) : (
            <Button onClick={startWork} disabled={startingWork}>
              {startingWork ? (
                <>
                  <Play className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Work
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkTracker;
