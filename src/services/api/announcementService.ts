
import { Announcement } from '@/interfaces/announcements';

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Company Retreat Announcement",
    content: "We're excited to announce our annual company retreat will be held from July 15-17.",
    author: "HR Team",
    date: new Date(2023, 5, 1).toISOString(),
    category: "company",
    isPinned: true
  },
  {
    id: 2,
    title: "New Health Benefits",
    content: "Starting next month, we'll be offering enhanced health benefits to all employees.",
    author: "HR Team",
    date: new Date(2023, 4, 15).toISOString(),
    category: "hr",
    isPinned: false
  },
  {
    id: 3,
    title: "Office Closing Early",
    content: "The office will close at 3pm this Friday for building maintenance.",
    author: "Facilities Manager",
    date: new Date(2023, 5, 10).toISOString(),
    category: "general",
    isPinned: true
  }
];

export const announcementService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve([...announcements]), 500);
    });
  },
  
  getAnnouncement: async (id: number): Promise<Announcement | null> => {
    const announcement = announcements.find(a => a.id === id);
    return announcement || null;
  },
  
  createAnnouncement: async (announcement: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> => {
    const newAnnouncement: Announcement = {
      id: announcements.length + 1,
      date: new Date().toISOString(),
      ...announcement
    };
    
    announcements.push(newAnnouncement);
    return newAnnouncement;
  },
  
  updateAnnouncement: async (id: number, updates: Partial<Omit<Announcement, 'id' | 'date'>>): Promise<Announcement | null> => {
    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) {
      return null;
    }
    
    announcements[index] = {
      ...announcements[index],
      ...updates
    };
    
    return announcements[index];
  },
  
  deleteAnnouncement: async (id: number): Promise<boolean> => {
    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) {
      return false;
    }
    
    announcements.splice(index, 1);
    return true;
  }
};

export default announcementService;
