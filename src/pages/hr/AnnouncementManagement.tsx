
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Plus, ArrowUpDown, CalendarDays } from "lucide-react";
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard';
import { AnnouncementForm } from '@/components/announcements/AnnouncementForm';
import { announcementService } from '@/services/api';
import { Announcement } from '@/interfaces/announcement';

const AnnouncementManagement = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: announcements = [], isLoading, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementService.getAnnouncements,
  });

  const handleCreateAnnouncement = async (data: Omit<Announcement, 'id' | 'date'>) => {
    setIsSubmitting(true);
    try {
      await announcementService.createAnnouncement(data);
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
      refetch();
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAnnouncement = async (data: Omit<Announcement, 'id' | 'date'>) => {
    if (!currentAnnouncement) return;
    
    setIsSubmitting(true);
    try {
      await announcementService.updateAnnouncement(currentAnnouncement.id, data);
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
      refetch();
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setCurrentAnnouncement(null);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!currentAnnouncement) return;
    
    setIsSubmitting(true);
    try {
      await announcementService.deleteAnnouncement(currentAnnouncement.id);
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setCurrentAnnouncement(null);
    }
  };

  const handleEditClick = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      setCurrentAnnouncement(announcement);
      setIsDeleteDialogOpen(true);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (activeTab === "all") return true;
    if (activeTab === "pinned") return announcement.isPinned;
    return announcement.category === activeTab;
  });

  // Sort by pinned status and date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Bell className="mr-2 h-8 w-8 text-primary" />
            Announcement Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage company announcements
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new announcement for the company.
              </DialogDescription>
            </DialogHeader>
            <AnnouncementForm 
              onSubmit={handleCreateAnnouncement}
              onCancel={() => setIsCreateDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pinned">Pinned</TabsTrigger>
          <TabsTrigger value="hr">HR</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <Card>
              <CardContent className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">Loading announcements...</p>
                </div>
              </CardContent>
            </Card>
          ) : sortedAnnouncements.length > 0 ? (
            <div className="grid gap-6">
              {sortedAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  showActions
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Bell className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-xl font-medium mb-1">No announcements found</p>
                <p className="text-muted-foreground mb-4">
                  {activeTab !== "all" 
                    ? `No ${activeTab === "pinned" ? "pinned" : activeTab} announcements yet` 
                    : "Start by creating your first announcement"}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Make changes to the announcement below.
            </DialogDescription>
          </DialogHeader>
          {currentAnnouncement && (
            <AnnouncementForm 
              announcement={currentAnnouncement}
              onSubmit={handleEditAnnouncement}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the announcement
              "{currentAnnouncement?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAnnouncement}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnnouncementManagement;
