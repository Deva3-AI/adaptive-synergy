
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Calendar, MessageSquare, Bell } from "lucide-react";
import { Announcement } from '@/interfaces/announcement';
import { format } from 'date-fns';

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'hr':
      return <Bell className="h-4 w-4" />;
    case 'event':
      return <Calendar className="h-4 w-4" />;
    case 'company':
      return <Megaphone className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'hr':
      return 'bg-blue-100 text-blue-800';
    case 'event':
      return 'bg-green-100 text-green-800';
    case 'company':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ 
  announcement, 
  onEdit, 
  onDelete,
  showActions = false
}) => {
  const formattedDate = new Date(announcement.date).toLocaleDateString();
  
  return (
    <Card className={`${announcement.isPinned ? 'border-primary border-2' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={getCategoryColor(announcement.category)}>
                <span className="flex items-center gap-1">
                  {getCategoryIcon(announcement.category)}
                  {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                </span>
              </Badge>
              {announcement.isPinned && (
                <Badge variant="secondary">Pinned</Badge>
              )}
            </div>
            <CardTitle className="text-xl">{announcement.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" /> {formattedDate} • {announcement.author}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{announcement.content}</p>
        {announcement.attachmentUrl && (
          <a 
            href={announcement.attachmentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline mt-2 inline-block"
          >
            View Attachment
          </a>
        )}
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit && onEdit(announcement)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete && onDelete(announcement.id)}
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
