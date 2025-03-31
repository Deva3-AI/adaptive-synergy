
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Square } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface EmployeeWorkTrackerProps {
  isWorking: boolean;
  onStartWork: () => void;
  onEndWork: () => void;
  startTime: Date;
  todayHours: number;
}

const EmployeeWorkTracker: React.FC<EmployeeWorkTrackerProps> = ({
  isWorking,
  onStartWork,
  onEndWork,
  startTime,
  todayHours
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Work Tracker</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {isWorking ? (
            <>
              <div className="text-xs text-muted-foreground">Current Session</div>
              <div className="text-lg font-semibold">
                Started {formatDistanceToNow(startTime)} ago
              </div>
              <div className="text-xs text-muted-foreground">Started at {format(startTime, 'h:mm a')}</div>
              <Button variant="destructive" size="sm" className="mt-2" onClick={onEndWork}>
                <Square className="mr-2 h-4 w-4" />
                End Work Session
              </Button>
            </>
          ) : (
            <>
              <div className="text-sm">Click to start your work day</div>
              <Button variant="outline" size="sm" className="mt-2" onClick={onStartWork}>
                <Play className="mr-2 h-4 w-4" />
                Start Work Session
              </Button>
            </>
          )}
          <div className="mt-4 text-xs text-muted-foreground border-t pt-2">
            Today's total: <span className="font-medium">{todayHours.toFixed(2)} hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeWorkTracker;
