
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { employeeService } from '@/services/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Clock, Play, Square } from 'lucide-react';

const EmployeeWorkTracker = () => {
  const { user, isAuthenticated, isEmployee } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startingWork, setStartingWork] = useState(false);
  const [stoppingWork, setStoppingWork] = useState(false);

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      if (!isAuthenticated || !isEmployee || !user) return;

      try {
        setLoading(true);
        const attendanceData = await employeeService.getTodayAttendance(user.id);
        setTodayAttendance(attendanceData);
      } catch (error) {
        console.error('Error fetching today attendance:', error);
        toast.error('Failed to fetch today attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAttendance();
  }, [isAuthenticated, isEmployee, user]);

  const startWork = async () => {
    if (!isAuthenticated || !isEmployee || !user) return;

    try {
      setStartingWork(true);
      const attendanceData = await employeeService.startWork(user.id);
      setTodayAttendance(attendanceData);
      toast.success('Work session started successfully');
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Failed to start work session');
    } finally {
      setStartingWork(false);
    }
  };

  const stopWork = async () => {
    if (!isAuthenticated || !isEmployee || !user) return;

    if (!todayAttendance) return;

    try {
      setStoppingWork(true);
      await employeeService.stopWork(todayAttendance.attendance_id, user.id);
      setTodayAttendance(null);
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
      <CardHeader>
        <CardTitle>Work Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading attendance data...</p>
        ) : todayAttendance ? (
          <div className="space-y-2">
            <p>
              You started working at{' '}
              {format(new Date(todayAttendance.login_time), 'hh:mm a')} today.
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={stopWork}
              disabled={stoppingWork}
            >
              {stoppingWork ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Ending Work...
                </>
              ) : (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  End Work Session
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={startWork}
            disabled={startingWork}
          >
            {startingWork ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Starting Work...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Work Session
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeWorkTracker;
