
import { Announcement } from '@/interfaces/announcement';

const announcements: Announcement[] = [
  {
    id: 1,
    title: 'Company Picnic',
    content: 'Join us for our annual company picnic this Saturday at Central Park. Food and drinks will be provided.',
    author: 'HR Team',
    date: '2023-07-15',
    category: 'event',
    isPinned: true
  },
  {
    id: 2,
    title: 'New Health Insurance Plan',
    content: 'We are switching to a new health insurance provider starting next month. Please check your email for details.',
    author: 'Benefits Department',
    date: '2023-07-10',
    category: 'hr',
    isPinned: false
  },
  {
    id: 3,
    title: 'Quarterly Results',
    content: 'Our Q2 results exceeded expectations. Thank you all for your hard work and dedication.',
    author: 'CEO',
    date: '2023-07-05',
    category: 'company',
    isPinned: true
  }
];

const announcementService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...announcements];
  },

  getAnnouncementById: async (id: number): Promise<Announcement | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return announcements.find(a => a.id === id);
  },

  createAnnouncement: async (announcement: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAnnouncement: Announcement = {
      id: Math.max(...announcements.map(a => a.id)) + 1,
      date: new Date().toISOString().split('T')[0],
      ...announcement
    };
    announcements.push(newAnnouncement);
    return newAnnouncement;
  },

  updateAnnouncement: async (id: number, announcement: Partial<Announcement>): Promise<Announcement | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    const updatedAnnouncement = {
      ...announcements[index],
      ...announcement
    };
    announcements[index] = updatedAnnouncement;
    return updatedAnnouncement;
  },

  deleteAnnouncement: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    announcements.splice(index, 1);
    return true;
  }
};

export default announcementService;
