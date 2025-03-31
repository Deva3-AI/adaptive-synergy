
// Mock platform integrations
export interface PlatformMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  platform: 'slack' | 'discord' | 'email' | 'trello';
  client_id: number;
}

const mockMessages: PlatformMessage[] = [
  {
    id: '1',
    content: 'When will the homepage design be ready? We need it by next week.',
    sender: 'client@acme.com',
    timestamp: '2023-06-04T09:30:00',
    platform: 'email',
    client_id: 1
  },
  {
    id: '2',
    content: 'Could we add a testimonials section to the landing page?',
    sender: 'john@acme.com',
    timestamp: '2023-06-05T14:22:00',
    platform: 'slack',
    client_id: 1
  },
  {
    id: '3',
    content: 'Team meeting tomorrow to discuss project timeline.',
    sender: 'manager@techstart.com',
    timestamp: '2023-06-06T16:45:00',
    platform: 'discord',
    client_id: 2
  }
];

export const platformService = {
  fetchAllClientMessages: async (clientId: number): Promise<PlatformMessage[]> => {
    // Simulate API call
    return mockMessages.filter(msg => msg.client_id === clientId);
  },
  
  sendMessage: async (message: Omit<PlatformMessage, 'id' | 'timestamp'>): Promise<PlatformMessage> => {
    const newMessage: PlatformMessage = {
      ...message,
      id: (mockMessages.length + 1).toString(),
      timestamp: new Date().toISOString()
    };
    
    // In a real app, this would add to the database
    mockMessages.push(newMessage);
    
    return newMessage;
  }
};
