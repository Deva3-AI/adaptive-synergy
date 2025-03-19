
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { employeeService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlayCircle, StopCircle, Calendar, Clock } from "lucide-react";

interface AttendanceData {
  attendance_id: number;
  login_time: string | null;
  logout_time: string | null;
}

const EmployeeWorkTracker = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceData | null>(null);
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const [workDuration, setWorkDuration] = useState<string>("00:00:00");
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const { toast } = useToast();

  // Format time from ISO string to readable format
  const formatTime = (isoTime: string | null) => {
    if (!isoTime) return "Not logged";
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate duration between login and current time or logout time
  const calculateDuration = (loginTime: string | null, logoutTime: string | null) => {
    if (!loginTime) return "00:00:00";
    
    const startTime = new Date(loginTime).getTime();
    const endTime = logoutTime ? new Date(logoutTime).getTime() : Date.now();
    
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Start timer to update work duration
  const startTimer = (loginTimeStr: string) => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = setInterval(() => {
      setWorkDuration(calculateDuration(loginTimeStr, null));
    }, 1000);
    
    setTimerInterval(interval as unknown as number);
  };

  // Stop timer
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Fetch today's attendance
  const fetchTodayAttendance = async () => {
    try {
      const data = await employeeService.getTodayAttendance();
      setTodayAttendance(data);
      
      if (data) {
        setLoginTime(data.login_time);
        
        if (data.login_time && !data.logout_time) {
          setIsWorking(true);
          startTimer(data.login_time);
        } else if (data.login_time && data.logout_time) {
          setIsWorking(false);
          setWorkDuration(calculateDuration(data.login_time, data.logout_time));
        }
      }
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
    }
  };

  // Handle start work
  const handleStartWork = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.startWork();
      setTodayAttendance(data);
      setLoginTime(data.login_time);
      setIsWorking(true);
      
      if (data.login_time) {
        startTimer(data.login_time);
      }
      
      toast({
        title: "Work Started",
        description: `You started working at ${formatTime(data.login_time)}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to start work",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stop work
  const handleStopWork = async () => {
    if (!todayAttendance?.attendance_id) return;
    
    setIsLoading(true);
    try {
      const data = await employeeService.stopWork(todayAttendance.attendance_id);
      setTodayAttendance(data);
      setIsWorking(false);
      stopTimer();
      
      if (data.login_time && data.logout_time) {
        setWorkDuration(calculateDuration(data.login_time, data.logout_time));
      }
      
      toast({
        title: "Work Stopped",
        description: `You stopped working at ${formatTime(data.logout_time)}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to stop work",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attendance on component mount
  useEffect(() => {
    fetchTodayAttendance();
    
    // Cleanup timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Work Tracking</CardTitle>
        <CardDescription>Track your daily work hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Login Time</span>
            </div>
            <span className="text-sm font-medium">{formatTime(loginTime)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Duration</span>
            </div>
            <span className="text-sm font-medium">{workDuration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {isWorking ? (
          <Button 
            onClick={handleStopWork} 
            disabled={isLoading} 
            variant="destructive"
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <StopCircle className="mr-2 h-4 w-4" />
            )}
            Stop Work
          </Button>
        ) : (
          <Button 
            onClick={handleStartWork} 
            disabled={isLoading} 
            className="w-full bg-green-500 hover:bg-green-600"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            Start Work
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EmployeeWorkTracker;
