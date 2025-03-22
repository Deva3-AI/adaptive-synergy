
import axios from 'axios';
import { toast } from 'sonner';

// Platform integration types
export type PlatformType = 'slack' | 'discord' | 'trello' | 'asana' | 'gmail' | 'zoho' | 'whatsapp';

export interface PlatformConfig {
  type: PlatformType;
  name: string;
  isConnected: boolean;
  lastSynced?: Date;
  credentials?: any;
}

export interface PlatformMessage {
  id: string;
  platform: PlatformType;
  sender: string;
  content: string;
  timestamp: Date;
  clientId?: number;
  projectId?: string;
  metadata?: any;
}

class PlatformIntegrationService {
  private platforms: Map<PlatformType, PlatformConfig> = new Map();
  private API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  constructor() {
    // Load saved platform configurations from localStorage
    this.loadSavedConfigurations();
  }

  private loadSavedConfigurations() {
    try {
      const savedConfigs = localStorage.getItem('platform_configs');
      if (savedConfigs) {
        const configs = JSON.parse(savedConfigs) as PlatformConfig[];
        configs.forEach(config => {
          this.platforms.set(config.type, config);
        });
      }
    } catch (error) {
      console.error('Error loading platform configurations:', error);
    }
  }

  private saveConfigurations() {
    try {
      const configs = Array.from(this.platforms.values());
      localStorage.setItem('platform_configs', JSON.stringify(configs));
    } catch (error) {
      console.error('Error saving platform configurations:', error);
    }
  }

  /**
   * Gets all configured platforms
   */
  getPlatforms(): PlatformConfig[] {
    return Array.from(this.platforms.values());
  }

  /**
   * Checks if a platform is connected
   */
  isPlatformConnected(platform: PlatformType): boolean {
    return this.platforms.get(platform)?.isConnected || false;
  }

  /**
   * Configures a platform integration
   */
  async configurePlatform(config: PlatformConfig): Promise<boolean> {
    try {
      // In a real implementation, we would validate the credentials here
      // by attempting to connect to the platform API
      
      // For now, we'll just store the configuration
      this.platforms.set(config.type, {
        ...config,
        isConnected: true,
        lastSynced: new Date()
      });
      
      this.saveConfigurations();
      toast.success(`${config.name} connected successfully`);
      return true;
    } catch (error) {
      console.error(`Error configuring ${config.type}:`, error);
      toast.error(`Failed to connect to ${config.name}`);
      return false;
    }
  }

  /**
   * Disconnects a platform
   */
  disconnectPlatform(platform: PlatformType): boolean {
    try {
      const config = this.platforms.get(platform);
      if (config) {
        config.isConnected = false;
        config.credentials = undefined;
        this.platforms.set(platform, config);
        this.saveConfigurations();
        toast.success(`${config.name} disconnected`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      return false;
    }
  }

  /**
   * Fetches recent messages from a connected platform
   */
  async fetchMessages(platform: PlatformType, clientId?: number): Promise<PlatformMessage[]> {
    try {
      if (!this.isPlatformConnected(platform)) {
        throw new Error(`${platform} is not connected`);
      }

      // In a real implementation, we would call the platform's API here
      // For now, we'll simulate an API call to our backend
      const token = localStorage.getItem('token');
      const response = await axios.get(`${this.API_URL}/integrations/${platform}/messages`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        params: { clientId }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages from ${platform}:`, error);
      
      // Return mock data for demo purposes
      return this.getMockMessages(platform, clientId);
    }
  }

  /**
   * Fetches messages from all connected platforms for a client
   */
  async fetchAllClientMessages(clientId: number): Promise<PlatformMessage[]> {
    try {
      const connectedPlatforms = Array.from(this.platforms.values())
        .filter(config => config.isConnected)
        .map(config => config.type);
      
      if (connectedPlatforms.length === 0) {
        return [];
      }
      
      const messagesPromises = connectedPlatforms.map(platform => 
        this.fetchMessages(platform, clientId)
      );
      
      const results = await Promise.allSettled(messagesPromises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<PlatformMessage[]> => 
          result.status === 'fulfilled'
        )
        .flatMap(result => result.value);
    } catch (error) {
      console.error('Error fetching client messages:', error);
      return [];
    }
  }

  /**
   * Provides mock messages for demo purposes
   */
  private getMockMessages(platform: PlatformType, clientId?: number): PlatformMessage[] {
    // Client-specific mock data
    const clientSpecificData: Record<number, PlatformMessage[]> = {
      1: [
        {
          id: '1',
          platform,
          sender: 'John Smith (Social Land)',
          content: 'We need to redesign our landing page to increase conversions. The current design is outdated and not mobile-friendly.',
          timestamp: new Date(Date.now() - 86400000),
          clientId: 1,
          projectId: 'proj-123'
        },
        {
          id: '2',
          platform,
          sender: 'Sarah Johnson (Social Land)',
          content: 'Could we add some testimonials and case studies to the homepage? Our clients have been asking for more social proof.',
          timestamp: new Date(Date.now() - 43200000),
          clientId: 1,
          projectId: 'proj-123'
        }
      ],
      2: [
        {
          id: '3',
          platform,
          sender: 'Mike Brown (Koala Digital)',
          content: 'We need to implement a new checkout flow for our e-commerce platform. The current one has a high abandonment rate.',
          timestamp: new Date(Date.now() - 172800000),
          clientId: 2,
          projectId: 'proj-456'
        },
        {
          id: '4',
          platform,
          sender: 'Lisa Chen (Koala Digital)',
          content: 'Can we integrate PayPal and Apple Pay as payment options? Many customers have requested these methods.',
          timestamp: new Date(Date.now() - 64800000),
          clientId: 2,
          projectId: 'proj-456'
        }
      ],
      3: [
        {
          id: '5',
          platform,
          sender: 'David Wilson (AC Digital)',
          content: 'We need to optimize our product pages for better SEO. Our competitors are outranking us for important keywords.',
          timestamp: new Date(Date.now() - 259200000),
          clientId: 3,
          projectId: 'proj-789'
        },
        {
          id: '6',
          platform,
          sender: 'Emily Taylor (AC Digital)',
          content: 'Let\'s add more detailed product descriptions and high-quality images. Customers have been asking for more information before purchasing.',
          timestamp: new Date(Date.now() - 129600000),
          clientId: 3,
          projectId: 'proj-789'
        }
      ],
      4: [
        {
          id: '7',
          platform,
          sender: 'James Anderson (Muse Digital)',
          content: 'We need to create a content calendar for our blog. We want to publish at least 2 articles per week.',
          timestamp: new Date(Date.now() - 345600000),
          clientId: 4,
          projectId: 'proj-101'
        },
        {
          id: '8',
          platform,
          sender: 'Olivia Martinez (Muse Digital)',
          content: 'Can we focus on topics related to digital marketing and social media strategy? Our audience is mostly small business owners.',
          timestamp: new Date(Date.now() - 172800000),
          clientId: 4,
          projectId: 'proj-101'
        }
      ]
    };
    
    // Default mock data if no client is specified
    const defaultMockData: PlatformMessage[] = [
      {
        id: '9',
        platform,
        sender: 'Alex Johnson',
        content: 'Can we schedule a meeting to discuss the project timeline?',
        timestamp: new Date(Date.now() - 432000000)
      },
      {
        id: '10',
        platform,
        sender: 'Sam Wilson',
        content: 'I\'ve shared the design mockups with you. Let me know what you think!',
        timestamp: new Date(Date.now() - 259200000)
      }
    ];
    
    return clientId && clientSpecificData[clientId] 
      ? clientSpecificData[clientId] 
      : defaultMockData;
  }

  /**
   * Sends a message to a platform
   */
  async sendMessage(platform: PlatformType, message: string, recipient: string): Promise<boolean> {
    try {
      if (!this.isPlatformConnected(platform)) {
        throw new Error(`${platform} is not connected`);
      }
      
      // In a real implementation, we would call the platform's API here
      console.log(`Sending message to ${recipient} via ${platform}: ${message}`);
      
      // Simulate sending a message
      toast.success(`Message sent to ${recipient} via ${platform}`);
      return true;
    } catch (error) {
      console.error(`Error sending message to ${platform}:`, error);
      toast.error(`Failed to send message via ${platform}`);
      return false;
    }
  }
}

// Create singleton instance
export const platformService = new PlatformIntegrationService();

// Export a function to fetch messages from all platforms
export const fetchPlatformMessages = async (): Promise<PlatformMessage[]> => {
  try {
    // Get all connected platforms
    const platforms = platformService.getPlatforms()
      .filter(platform => platform.isConnected)
      .map(platform => platform.type);
    
    if (platforms.length === 0) {
      return [];
    }
    
    // Fetch messages from all platforms
    const messagesPromises = platforms.map(platform => 
      platformService.fetchMessages(platform)
    );
    
    const results = await Promise.allSettled(messagesPromises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<PlatformMessage[]> => 
        result.status === 'fulfilled'
      )
      .flatMap(result => result.value);
  } catch (error) {
    console.error('Error fetching platform messages:', error);
    return [];
  }
};

export default platformService;
