
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Clock,
  Video,
  Users,
  Calendar,
  FileText,
  BarChart
} from 'lucide-react';
import { format } from 'date-fns';
import { marketingService } from '@/services/api';
import { MarketingMeeting } from '@/interfaces/marketing';

const MarketingMeetings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: meetings, isLoading, error } = useQuery({
    queryKey: ['marketing', 'meetings'],
    queryFn: () => marketingService.getMeetings(),
  });
  
  const filteredMeetings = meetings ? meetings.filter((meeting: MarketingMeeting) => 
    meeting.leadName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    meeting.leadCompany.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50"><Calendar className="h-3 w-3 mr-1 text-blue-500" /> Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50"><Clock className="h-3 w-3 mr-1 text-green-500" /> Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50">Cancelled</Badge>;
      case 'rescheduled':
        return <Badge variant="outline" className="bg-yellow-50">Rescheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'google_meet':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'zoom':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'teams':
        return <Video className="h-4 w-4 text-purple-500" />;
      case 'in_person':
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search meetings..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Insights</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500">Error loading meetings</TableCell>
              </TableRow>
            ) : filteredMeetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No meetings found</TableCell>
              </TableRow>
            ) : (
              filteredMeetings.map((meeting: MarketingMeeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{getStatusBadge(meeting.status)}</TableCell>
                  <TableCell>{meeting.leadName}</TableCell>
                  <TableCell>{meeting.leadCompany}</TableCell>
                  <TableCell>{format(new Date(meeting.scheduledTime), 'MMM dd, yyyy h:mm a')}</TableCell>
                  <TableCell>{meeting.duration} min</TableCell>
                  <TableCell className="flex items-center">
                    {getPlatformIcon(meeting.platform)}
                    <span className="ml-2 capitalize">{meeting.platform.replace('_', ' ')}</span>
                  </TableCell>
                  <TableCell>
                    {meeting.status === 'completed' ? (
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <FileText className="h-3 w-3 mr-1" /> Transcript
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <BarChart className="h-3 w-3 mr-1" /> Insights
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        {meeting.status === 'scheduled' ? 'Pending' : 'N/A'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-7">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MarketingMeetings;
