
import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';
import config from '@/config/config';

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
  open_rate?: number;
  click_rate?: number;
  conversion_rate?: number;
  status: 'active' | 'draft' | 'archived';
}

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  budget?: number;
  target_audience?: string;
  expected_reach?: number;
  actual_reach?: number;
  created_at: string;
  updated_at: string;
}

export interface MarketingMetrics {
  email_open_rate: number;
  email_click_rate: number;
  conversion_rate: number;
  cost_per_acquisition: number;
  return_on_ad_spend: number;
  social_engagement_rate: number;
  website_traffic: number;
  leads_generated: number;
  channel_performance: {
    channel: string;
    visits: number;
    conversions: number;
    revenue: number;
  }[];
}

// Service for handling marketing-related API calls
const marketingService = {
  // Email Templates
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as EmailTemplate[];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  },

  getEmailTemplateById: async (id: number): Promise<EmailTemplate> => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as EmailTemplate;
    } catch (error) {
      console.error(`Error fetching email template with ID ${id}:`, error);
      throw error;
    }
  },

  createEmailTemplate: async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .insert(template)
        .select()
        .single();
        
      if (error) throw error;
      return data as EmailTemplate;
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  },

  updateEmailTemplate: async (id: number, template: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .update(template)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data as EmailTemplate;
    } catch (error) {
      console.error(`Error updating email template with ID ${id}:`, error);
      throw error;
    }
  },

  deleteEmailTemplate: async (id: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting email template with ID ${id}:`, error);
      throw error;
    }
  },

  // Campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Campaign[];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  getCampaignById: async (id: number): Promise<Campaign> => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Campaign;
    } catch (error) {
      console.error(`Error fetching campaign with ID ${id}:`, error);
      throw error;
    }
  },

  createCampaign: async (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaign)
        .select()
        .single();
        
      if (error) throw error;
      return data as Campaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  updateCampaign: async (id: number, campaign: Partial<Campaign>): Promise<Campaign> => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update(campaign)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data as Campaign;
    } catch (error) {
      console.error(`Error updating campaign with ID ${id}:`, error);
      throw error;
    }
  },

  deleteCampaign: async (id: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting campaign with ID ${id}:`, error);
      throw error;
    }
  },

  // AI-powered marketing features (these would call your FastAPI backend)
  enhanceEmailTemplate: async (templateId: number, improvementFocus: string[]): Promise<any> => {
    try {
      const response = await axios.post(`${config.apiUrl}/marketing/ai/enhance-email-template`, {
        template_id: templateId,
        improvement_focus: improvementFocus
      });
      
      return response.data;
    } catch (error) {
      console.error('Error enhancing email template:', error);
      throw error;
    }
  },

  analyzeCampaignPerformance: async (campaignId: number): Promise<any> => {
    try {
      const response = await axios.post(`${config.apiUrl}/marketing/ai/analyze-campaign-performance`, {
        campaign_id: campaignId
      });
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing campaign performance:', error);
      throw error;
    }
  },

  generateEmailCopy: async (campaignType: string, targetAudience: string, keyPoints: string[], tone: string = 'professional'): Promise<any> => {
    try {
      const response = await axios.post(`${config.apiUrl}/marketing/generate-email-copy`, {
        campaign_type: campaignType,
        target_audience: targetAudience,
        key_points: keyPoints,
        tone: tone
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating email copy:', error);
      throw error;
    }
  },

  analyzeMarketTrends: async (industry: string, keywords: string[], timePeriod: string = 'last 3 months'): Promise<any> => {
    try {
      const response = await axios.post(`${config.apiUrl}/marketing/analyze-market-trends`, {
        industry,
        keywords,
        time_period: timePeriod
      });
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing market trends:', error);
      throw error;
    }
  },

  analyzeMeetingTranscript: async (transcript: string, meetingType: string): Promise<any> => {
    try {
      const response = await axios.post(`${config.apiUrl}/marketing/analyze-meeting`, {
        transcript,
        meeting_type: meetingType
      });
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  },

  // Analytics
  getMarketingMetrics: async (startDate?: string, endDate?: string): Promise<MarketingMetrics> => {
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, return mock data
      return {
        email_open_rate: 32.5,
        email_click_rate: 4.8,
        conversion_rate: 2.3,
        cost_per_acquisition: 45.67,
        return_on_ad_spend: 3.2,
        social_engagement_rate: 6.7,
        website_traffic: 15400,
        leads_generated: 542,
        channel_performance: [
          { channel: 'Email', visits: 4500, conversions: 120, revenue: 12000 },
          { channel: 'Social', visits: 6200, conversions: 85, revenue: 8500 },
          { channel: 'Search', visits: 3100, conversions: 95, revenue: 9500 },
          { channel: 'Direct', visits: 1600, conversions: 65, revenue: 6500 }
        ]
      };
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      throw error;
    }
  }
};

export default marketingService;
