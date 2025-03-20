
import React, { useState, useEffect } from "react";
import { Clock, Play, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { differenceInSeconds, format, formatDistance } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const EmployeeWorkTracker = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const queryClient = useQueryClient();
  const { isEmployee } = useAuth();

  // Get today's attendance
  const { data: attendance, isLoading } = useQuery({
    queryKey: ['employee-attendance-today'],
    queryFn: employeeService.getTodayAttendance,
    staleTime: 1000 * 60, // 1 minute
  });

  // Start work mutation
  const startWorkMutation = useMutation({
    mutationFn: employeeService.startWork,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employee-attendance-today'] });
      toast.success("Work session started successfully");
      setIsActive(true);
      setStartTime(new Date());
    },
    onError: (error) => {
      console.error("Failed to start work:", error);
      toast.error("Failed to start work. Please try again.");
    }
  });

  // Stop work mutation
  const stopWorkMutation = useMutation({
    mutationFn: (attendanceId: number) => employeeService.stopWork(attendanceId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employee-attendance-today'] });
      toast.success("Work session ended successfully");
      setIsActive(false);
      setStartTime(null);
    },
    onError: (error) => {
      console.error("Failed to stop work:", error);
      toast.error("Failed to end work session. Please try again.");
    }
  });

  useEffect(() => {
    // If there's an ongoing session (login_time exists but no logout_time)
    if (attendance && attendance.login_time && !attendance.logout_time) {
      setIsActive(true);
      setStartTime(new Date(attendance.login_time));
    } else {
      setIsActive(false);
      setStartTime(null);
    }
  }, [attendance]);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && startTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const seconds = differenceInSeconds(now, startTime);
        setElapsedTime(seconds);
      }, 1000);
    } else {
      setElapsedTime(0);
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  const handleStartWork = () => {
    if (!isEmployee) {
      toast.error("Only employees can track work time");
      return;
    }
    startWorkMutation.mutate();
  };

  const handleStopWork = () => {
    if (!attendance || !attendance.attendance_id) {
      toast.error("No active work session found");
      return;
    }
    stopWorkMutation.mutate(attendance.attendance_id);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSessionStatus = () => {
    if (isLoading) return "Loading...";
    if (!attendance) return "No session today";
    if (attendance.login_time && attendance.logout_time) {
      const startTime = new Date(attendance.login_time);
      const endTime = new Date(attendance.logout_time);
      const duration = formatDistance(endTime, startTime);
      return `Completed session (${duration})`;
    }
    if (attendance.login_time) {
      return "Session in progress";
    }
    return "No active session";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Work Timer</h3>
          <p className="text-sm text-muted-foreground">{getSessionStatus()}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isActive ? (
            <Button
              onClick={handleStartWork}
              size="sm"
              disabled={startWorkMutation.isPending || !isEmployee}
            >
              <Play className="h-4 w-4 mr-1" />
              Start Work
            </Button>
          ) : (
            <Button
              onClick={handleStopWork}
              variant="outline"
              size="sm"
              disabled={stopWorkMutation.isPending || !isEmployee}
            >
              <StopCircle className="h-4 w-4 mr-1" />
              Stop Work
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="h-8 w-8" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold mb-2">
            {isActive ? formatTime(elapsedTime) : "00:00:00"}
          </div>
          <CardDescription>
            {isActive && startTime 
              ? `Started at ${format(startTime, 'hh:mm a')}`
              : "Not currently tracking time"
            }
          </CardDescription>
        </CardContent>
      </Card>

      {attendance && attendance.login_time && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-md bg-background border">
            <div className="text-sm text-muted-foreground">Login Time</div>
            <div className="font-medium">
              {attendance.login_time ? format(new Date(attendance.login_time), 'hh:mm a') : "N/A"}
            </div>
          </div>
          <div className="p-4 rounded-md bg-background border">
            <div className="text-sm text-muted-foreground">Logout Time</div>
            <div className="font-medium">
              {attendance.logout_time ? format(new Date(attendance.logout_time), 'hh:mm a') : "Pending"}
            </div>
          </div>
        </div>
      )}

      {isEmployee && (
        <div className="text-xs text-muted-foreground mt-2">
          Remember to stop your work timer before leaving for the day.
        </div>
      )}
    </div>
  );
};

export default EmployeeWorkTracker;
