
import apiClient from '@/utils/apiUtils';
import { Announcement } from '@/interfaces/announcement';

// Mock data for development
const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Company Holiday Schedule Update',
    content: 'Please note that the office will be closed on December 24th and 25th for the Christmas holiday.',
    author: 'HR Department',
    date: '2023-12-01',
    category: 'hr',
    isPinned: true
  },
  {
    id: 2,
    title: 'New Health Insurance Provider',
    content: 'We are switching to a new health insurance provider starting January 1st. More details to follow in the coming weeks.',
    author: 'Benefits Team',
    date: '2023-11-28',
    category: 'hr'
  },
  {
    id: 3,
    title: 'Quarterly Town Hall Meeting',
    content: 'Our Q4 town hall meeting will be held on December 15th at 3:00 PM in the main conference room.',
    author: 'Executive Office',
    date: '2023-11-25',
    category: 'company',
    isPinned: true
  },
  {
    id: 4,
    title: 'Annual Performance Reviews',
    content: 'Annual performance reviews will begin next week. Please complete your self-assessment by Friday.',
    author: 'HR Department',
    date: '2023-11-20',
    category: 'hr'
  },
  {
    id: 5,
    title: 'Office Renovation Update',
    content: 'The 3rd floor renovation is now complete. Teams can move back starting next Monday.',
    author: 'Facilities Management',
    date: '2023-11-15',
    category: 'general'
  }
];

const announcementService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      // In a real app, this would be an API call
      return mockAnnouncements;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  },

  getAnnouncementById: async (id: number): Promise<Announcement | null> => {
    try {
      const announcement = mockAnnouncements.find(a => a.id === id);
      return announcement || null;
    } catch (error) {
      console.error(`Error fetching announcement ${id}:`, error);
      return null;
    }
  },

  createAnnouncement: async (announcement: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> => {
    try {
      // In a real app, this would be an API call
      const newAnnouncement: Announcement = {
        ...announcement,
        id: Math.max(...mockAnnouncements.map(a => a.id)) + 1,
        date: new Date().toISOString().split('T')[0]
      };
      
      // This would be handled by the backend
      mockAnnouncements.unshift(newAnnouncement);
      
      return newAnnouncement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  updateAnnouncement: async (id: number, announcement: Partial<Announcement>): Promise<Announcement | null> => {
    try {
      const index = mockAnnouncements.findIndex(a => a.id === id);
      if (index === -1) return null;
      
      mockAnnouncements[index] = {
        ...mockAnnouncements[index],
        ...announcement
      };
      
      return mockAnnouncements[index];
    } catch (error) {
      console.error(`Error updating announcement ${id}:`, error);
      throw error;
    }
  },

  deleteAnnouncement: async (id: number): Promise<boolean> => {
    try {
      const index = mockAnnouncements.findIndex(a => a.id === id);
      if (index === -1) return false;
      
      mockAnnouncements.splice(index, 1);
      return true;
    } catch (error) {
      console.error(`Error deleting announcement ${id}:`, error);
      throw error;
    }
  }
};

export default announcementService;
