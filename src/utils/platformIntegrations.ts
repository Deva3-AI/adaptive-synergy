
// Mock platform integrations
export interface PlatformMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  platform: 'slack' | 'discord' | 'email' | 'trello';
  client_id: number;
}

export type PlatformType = 'slack' | 'discord' | 'email' | 'trello';

export interface PlatformConfig {
  platform: PlatformType;
  name: string;
  connected: boolean;
  lastSync?: string;
  icon: string;
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

const mockPlatforms: PlatformConfig[] = [
  {
    platform: 'slack',
    name: 'Slack',
    connected: true,
    lastSync: '2023-06-06T12:30:00',
    icon: 'slack-icon'
  },
  {
    platform: 'discord',
    name: 'Discord',
    connected: true,
    lastSync: '2023-06-06T10:15:00',
    icon: 'discord-icon'
  },
  {
    platform: 'email',
    name: 'Email',
    connected: true,
    lastSync: '2023-06-06T09:00:00',
    icon: 'mail-icon'
  },
  {
    platform: 'trello',
    name: 'Trello',
    connected: false,
    icon: 'trello-icon'
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
  },

  // Adding missing methods for platform integrations
  getPlatforms: async () => {
    return mockPlatforms;
  },
  
  configurePlatform: async (platform: PlatformType, config: any) => {
    const index = mockPlatforms.findIndex(p => p.platform === platform);
    if (index >= 0) {
      mockPlatforms[index] = { ...mockPlatforms[index], ...config, connected: true };
    }
    return mockPlatforms;
  },
  
  disconnectPlatform: async (platform: PlatformType) => {
    const index = mockPlatforms.findIndex(p => p.platform === platform);
    if (index >= 0) {
      mockPlatforms[index] = { ...mockPlatforms[index], connected: false };
    }
    return mockPlatforms;
  }
};
