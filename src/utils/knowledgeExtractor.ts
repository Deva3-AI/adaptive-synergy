
import { toast } from 'sonner';
import { clientService } from '@/services/api';
import platformAnalysisService from '@/services/api/platformAnalysisService';

export interface ClientKnowledge {
  preferences: {
    likes: string[];
    dislikes: string[];
    requirements: string[];
  };
  platforms: string[];
  contacts: string[];
  history: any[];
}

export const extractClientKnowledge = async (clientId: number): Promise<ClientKnowledge> => {
  try {
    // Get client preferences and history
    const preferences = await clientService.getClientPreferences(clientId);
    const history = await clientService.getClientHistory(clientId);
    
    // Organize preferences
    const likes = preferences.filter(p => p.type === 'like').map(p => p.description);
    const dislikes = preferences.filter(p => p.type === 'dislike').map(p => p.description);
    const requirements = preferences.filter(p => p.type === 'requirement').map(p => p.description);
    
    // Extract platforms and contacts from history
    const platforms = new Set<string>();
    const contacts = new Set<string>();
    
    history.forEach(item => {
      if (item.platform) platforms.add(item.platform);
      if (item.contact_name) contacts.add(item.contact_name);
    });
    
    return {
      preferences: {
        likes,
        dislikes,
        requirements
      },
      platforms: Array.from(platforms),
      contacts: Array.from(contacts),
      history
    };
  } catch (error) {
    console.error('Error extracting client knowledge:', error);
    toast.error('Failed to extract client knowledge');
    
    // Return empty knowledge object as fallback
    return {
      preferences: {
        likes: [],
        dislikes: [],
        requirements: []
      },
      platforms: [],
      contacts: [],
      history: []
    };
  }
};

export default {
  extractClientKnowledge
};
