import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Play, Square, TimerIcon, ClockIcon, AlertCircle } from "lucide-react";
import { differenceInHours, differenceInMinutes, format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const EmployeeWorkTracker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00');
  const { user, isAuthenticated, isEmployee } = useAuth();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isWorking && startTime) {
      intervalId = setInterval(() => {
        const now = new Date();
        const diffInMinutes = differenceInMinutes(now, startTime);
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        setElapsedTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
      }, 1000);
    }
    
    return () => clearInterval(intervalId);
  }, [isWorking, startTime]);
  
  const startWork = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      setStartTime(now);
      setIsWorking(true);
      
      // Save start time to database
      const { data, error } = await supabase
        .from('employee_attendance')
        .insert([
          {
            user_id: user?.id,
            login_time: now.toISOString(),
            work_date: now.toISOString()
          }
        ]);
        
      if (error) throw error;
      
      toast.success('Work tracker started');
    } catch (error) {
      console.error('Error starting work tracker:', error);
      toast.error('Failed to start work tracker');
    } finally {
      setIsLoading(false);
    }
  };
  
  const endWork = async () => {
    setIsLoading(true);
    try {
      setIsWorking(false);
      
      // Save end time to database
      const now = new Date();
      const { data, error } = await supabase
        .from('employee_attendance')
        .update({ logout_time: now.toISOString() })
        .eq('user_id', user?.id)
        .is('logout_time', null);
        
      if (error) throw error;
      
      toast.success('Work tracker ended');
    } catch (error) {
      console.error('Error ending work tracker:', error);
      toast.error('Failed to end work tracker');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Only show the tracker for employees or in development
  if (!isEmployee && process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Work Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TimerIcon className="h-5 w-5 text-muted-foreground" />
            <span>Time Elapsed:</span>
            <Badge variant="secondary">{elapsedTime}</Badge>
          </div>
          
          {isWorking ? (
            <Button 
              variant="destructive" 
              onClick={endWork} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ClockIcon className="mr-2 h-4 w-4 animate-spin" />
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
            <Button 
              onClick={startWork} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ClockIcon className="mr-2 h-4 w-4 animate-spin" />
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
        
        {!isAuthenticated && (
          <AlertCircle className="text-yellow-500" />
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeWorkTracker;
