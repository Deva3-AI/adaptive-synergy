
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, StopCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

interface WorkSessionRecord {
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
}

const EmployeeWorkTracker = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(0);
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);
  const [todayTotal, setTodayTotal] = useState(0);
  const [sessions, setSessions] = useState<WorkSessionRecord[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWorking) {
      interval = setInterval(() => {
        setCurrentTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorking]);

  // Calculate today's total based on sessions and current timer
  useEffect(() => {
    const sessionsTotal = sessions.reduce((total, session) => total + session.duration, 0);
    setTodayTotal(sessionsTotal + currentTimer);
  }, [sessions, currentTimer]);

  const startWork = () => {
    const startTime = new Date();
    setWorkStartTime(startTime);
    setIsWorking(true);
    setCurrentTimer(0);
    toast.success("Work session started");
  };

  const stopWork = () => {
    if (!workStartTime) return;
    
    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime.getTime() - workStartTime.getTime()) / 1000);
    
    const newSession: WorkSessionRecord = {
      startTime: workStartTime,
      endTime,
      duration: durationInSeconds
    };
    
    setSessions(prev => [...prev, newSession]);
    setWorkStartTime(null);
    setIsWorking(false);
    setCurrentTimer(0);
    toast.success(`Work session completed: ${formatTime(durationInSeconds)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Work Session</h3>
          <Badge variant={isWorking ? "success" : "outline"}>
            {isWorking ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="text-xl font-semibold font-mono">{formatTime(currentTimer)}</div>
      </div>
      
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${Math.min((currentTimer / (8 * 3600)) * 100, 100)}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>Today's total: <span className="font-medium">{formatTime(todayTotal)}</span></div>
        <div>Target: <span className="font-medium">08:00:00</span></div>
      </div>
      
      <div className="flex space-x-3 pt-2">
        {!isWorking ? (
          <Button 
            onClick={startWork} 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white button-shine"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Work
          </Button>
        ) : (
          <Button 
            onClick={stopWork} 
            variant="destructive" 
            className="flex-1 button-shine"
          >
            <StopCircle className="h-4 w-4 mr-2" />
            Stop Work
          </Button>
        )}
      </div>
      
      {sessions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Today's Sessions</h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {sessions.map((session, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-2 bg-muted/50 rounded-md text-sm"
              >
                <div>
                  {session.startTime.toLocaleTimeString()} - {session.endTime?.toLocaleTimeString()}
                </div>
                <div className="font-mono">{formatTime(session.duration)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeWorkTracker;
