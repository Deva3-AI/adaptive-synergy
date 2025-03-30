
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, StopCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceWidgetProps {
  isWorking: boolean;
  onStartWork: () => void;
  onEndWork: () => void;
  startTime: Date | null;
  todayHours: number;
}

const AttendanceWidget = ({ isWorking, onStartWork, onEndWork, startTime, todayHours }: AttendanceWidgetProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Time Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold mb-2">
            {isWorking ? (
              <span>Working since {startTime ? format(startTime, 'h:mm a') : '--:--'}</span>
            ) : (
              <span>Not working</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span>Today's hours: {todayHours.toFixed(1)}h</span>
          </div>
          
          {isWorking ? (
            <Button 
              onClick={onEndWork} 
              variant="destructive" 
              className="w-full flex gap-2 items-center"
            >
              <StopCircle className="h-4 w-4" />
              End Work
            </Button>
          ) : (
            <Button 
              onClick={onStartWork} 
              variant="default" 
              className="w-full flex gap-2 items-center"
            >
              <PlayCircle className="h-4 w-4" />
              Start Work
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceWidget;
