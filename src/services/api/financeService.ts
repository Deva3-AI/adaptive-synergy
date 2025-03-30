
import { supabase } from '@/integrations/supabase/client';

export interface FinancialMetrics {
  income: number;
  expenses: number;
  profit_margin: number;
  outstanding_invoices: number;
  monthly_revenue: {
    month: string;
    revenue: number;
  }[];
  revenue_by_client: {
    client_id: number;
    client_name: string;
    revenue: number;
  }[];
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description?: string;
  record_date: string;
  created_at: string;
}

export interface SalesMetrics {
  monthly_revenue: number;
  annual_target: number;
  growth_rate: number;
  client_acquisition: number;
  conversion_rate: number;
  avg_deal_size: number;
  top_clients: {
    client_id: number;
    client_name: string;
    revenue: number;
    growth: number;
  }[];
  monthly_trend: {
    month: string;
    revenue: number;
    target: number;
  }[];
  sales_by_service: {
    service: string;
    value: number;
  }[];
}

const financeService = {
  getInvoices: async (status?: string) => {
    try {
      let query = supabase.from('invoices').select(`
        invoice_id,
        client_id,
        clients (client_name),
        invoice_number,
        amount,
        due_date,
        status,
        created_at
      `);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          invoice_id,
          client_id,
          clients (client_name),
          invoice_number,
          amount,
          due_date,
          status,
          created_at
        `)
        .eq('invoice_id', invoiceId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching invoice ${invoiceId}:`, error);
      throw error;
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('invoice_id', invoiceId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating invoice ${invoiceId} status:`, error);
      throw error;
    }
  },
  
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    // Mock implementation
    return [];
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    // Mock implementation
    return [];
  },
  
  // Add missing methods
  
  getFinancialRecords: async () => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .order('record_date', { ascending: false });
      
      if (error) throw error;
      return data as FinancialRecord[];
    } catch (error) {
      console.error('Error fetching financial records:', error);
      throw error;
    }
  },
  
  createFinancialRecord: async (recordData: Omit<FinancialRecord, 'record_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .insert(recordData)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    // Mock implementation for sending reminders
    console.log(`Reminder sent for invoice ${invoiceId}`);
    return { success: true, message: 'Reminder sent successfully' };
  },
  
  getFinancialOverview: async (startDate?: string, endDate?: string) => {
    // Mock implementation
    return {
      totalRevenue: 257800,
      totalExpenses: 189400,
      netProfit: 68400,
      profitMargin: 26.5,
      outstandingInvoices: 48200,
      cashFlow: {
        inflow: 233000,
        outflow: 176500,
        net: 56500
      }
    };
  },
  
  getFinancialMetrics: async (): Promise<FinancialMetrics> => {
    // Mock implementation
    return {
      income: 286000,
      expenses: 189000,
      profit_margin: 33.9,
      outstanding_invoices: 52400,
      monthly_revenue: [
        { month: 'Jan', revenue: 42000 },
        { month: 'Feb', revenue: 38000 },
        { month: 'Mar', revenue: 44000 },
        { month: 'Apr', revenue: 52000 },
        { month: 'May', revenue: 47000 },
        { month: 'Jun', revenue: 63000 }
      ],
      revenue_by_client: [
        { client_id: 1, client_name: 'Acme Corp', revenue: 78000 },
        { client_id: 2, client_name: 'Globex', revenue: 63000 },
        { client_id: 3, client_name: 'Stark Industries', revenue: 52000 },
        { client_id: 4, client_name: 'Wayne Enterprises', revenue: 48000 },
        { client_id: 5, client_name: 'Cyberdyne Systems', revenue: 45000 }
      ]
    };
  },
  
  getUpsellOpportunities: async () => {
    // Mock implementation
    return [
      {
        client_id: 1,
        client_name: 'Acme Corp',
        current_services: ['Web Design', 'SEO'],
        recommended_services: ['Email Marketing', 'Social Media Management'],
        potential_revenue: 18000,
        confidence_score: 0.87,
        reason: 'Client has shown interest in expanding their digital presence'
      },
      {
        client_id: 3,
        client_name: 'Stark Industries',
        current_services: ['UI/UX Design', 'Web Development'],
        recommended_services: ['Mobile App Development', 'Maintenance Package'],
        potential_revenue: 25000,
        confidence_score: 0.91,
        reason: 'Client needs a mobile app based on their website success'
      }
    ];
  },
  
  getSalesMetrics: async (): Promise<SalesMetrics> => {
    // Mock implementation
    return {
      monthly_revenue: 63000,
      annual_target: 750000,
      growth_rate: 18.5,
      client_acquisition: 4,
      conversion_rate: 24,
      avg_deal_size: 15750,
      top_clients: [
        { client_id: 1, client_name: 'Acme Corp', revenue: 78000, growth: 12.5 },
        { client_id: 2, client_name: 'Globex', revenue: 63000, growth: 8.2 },
        { client_id: 3, client_name: 'Stark Industries', revenue: 52000, growth: 15.6 }
      ],
      monthly_trend: [
        { month: 'Jan', revenue: 42000, target: 58000 },
        { month: 'Feb', revenue: 38000, target: 58000 },
        { month: 'Mar', revenue: 44000, target: 60000 },
        { month: 'Apr', revenue: 52000, target: 60000 },
        { month: 'May', revenue: 47000, target: 62000 },
        { month: 'Jun', revenue: 63000, target: 62000 }
      ],
      sales_by_service: [
        { service: 'Web Design', value: 128000 },
        { service: 'Development', value: 95000 },
        { service: 'Marketing', value: 86000 },
        { service: 'Maintenance', value: 38000 },
        { service: 'Consulting', value: 43000 }
      ]
    };
  },
  
  analyzeTeamCosts: async (period: string = 'month') => {
    // Mock implementation
    return {
      totalCost: 125000,
      departmentBreakdown: [
        { name: 'Design', value: 45000 },
        { name: 'Development', value: 35000 },
        { name: 'Marketing', value: 25000 },
        { name: 'Management', value: 20000 }
      ],
      roleBreakdown: [
        { name: 'Junior', value: 30000 },
        { name: 'Mid-level', value: 45000 },
        { name: 'Senior', value: 35000 },
        { name: 'Lead', value: 15000 }
      ],
      monthlyTrend: [
        { name: 'Jan', cost: 110000 },
        { name: 'Feb', cost: 115000 },
        { name: 'Mar', cost: 120000 },
        { name: 'Apr', cost: 125000 },
        { name: 'May', cost: 122000 },
        { name: 'Jun', cost: 126000 }
      ],
      efficiencyMetrics: {
        costPerTask: 450,
        costPerTaskByDepartment: [
          { name: 'Design', value: 500 },
          { name: 'Development', value: 600 },
          { name: 'Marketing', value: 350 },
          { name: 'Management', value: 250 }
        ]
      }
    };
  },
  
  // Sales-related methods
  getSalesFollowUps: async () => {
    // Mock implementation
    return [
      {
        id: 1,
        client_id: 1,
        client_name: 'Acme Corp',
        contact_name: 'John Doe',
        contact_email: 'john@acme.com',
        due_date: '2023-07-15',
        status: 'pending',
        notes: 'Follow up on proposal feedback'
      },
      {
        id: 2,
        client_id: 3,
        client_name: 'Stark Industries',
        contact_name: 'Tony Stark',
        contact_email: 'tony@stark.com',
        due_date: '2023-07-18',
        status: 'pending',
        notes: 'Send revised quote'
      }
    ];
  },
  
  getImprovementSuggestions: async () => {
    // Mock implementation
    return [
      {
        id: 1,
        category: 'Process',
        suggestion: 'Streamline the proposal approval process',
        impact: 'high',
        implementation_difficulty: 'medium',
        expected_benefit: 'Reduce sales cycle by 20%'
      },
      {
        id: 2,
        category: 'Pricing',
        suggestion: 'Introduce tiered pricing options',
        impact: 'medium',
        implementation_difficulty: 'low',
        expected_benefit: 'Increase average deal size by 15%'
      }
    ];
  },
  
  completeFollowUp: async (followUpId: number) => {
    // Mock implementation
    return { success: true, message: `Follow-up #${followUpId} marked as completed` };
  },
  
  getSalesGrowthData: async () => {
    // Mock implementation
    return {
      current_quarter: {
        revenue: 235000,
        growth: 18.5,
        new_clients: 6
      },
      historical: [
        { quarter: 'Q1 2023', revenue: 198000, growth: 12.1, new_clients: 4 },
        { quarter: 'Q2 2023', revenue: 215000, growth: 8.5, new_clients: 3 },
        { quarter: 'Q3 2023', revenue: 235000, growth: 9.3, new_clients: 5 }
      ]
    };
  },
  
  getSalesTargets: async () => {
    // Mock implementation
    return {
      annual: 950000,
      quarterly: 250000,
      monthly: 83333,
      progress: {
        annual: { target: 950000, actual: 648000, percent: 68.2 },
        quarterly: { target: 250000, actual: 235000, percent: 94.0 },
        monthly: { target: 83333, actual: 78000, percent: 93.6 }
      }
    };
  },
  
  getGrowthForecast: async () => {
    // Mock implementation
    return {
      next_quarter: {
        predicted_revenue: 258000,
        growth_rate: 9.8,
        probability: 0.85,
        factors: ['Seasonal increase', 'New product launches', 'Marketing campaign']
      },
      next_year: {
        predicted_revenue: 1120000,
        growth_rate: 17.9,
        probability: 0.72,
        scenarios: {
          optimistic: { revenue: 1250000, growth: 31.6 },
          realistic: { revenue: 1120000, growth: 17.9 },
          conservative: { revenue: 1050000, growth: 10.5 }
        }
      }
    };
  },
  
  getWeeklyReports: async () => {
    // Mock implementation
    return [
      {
        week: 'Jul 3-9, 2023',
        new_leads: 18,
        meetings_scheduled: 8,
        proposals_sent: 5,
        deals_closed: 3,
        revenue: 42000,
        highlights: [
          'Closed major deal with XYZ Corp',
          'Increased email campaign open rate by 15%'
        ]
      },
      {
        week: 'Jul 10-16, 2023',
        new_leads: 14,
        meetings_scheduled: 6,
        proposals_sent: 4,
        deals_closed: 2,
        revenue: 35000,
        highlights: [
          'New partnership with ABC Marketing',
          'Reduced proposal turnaround time by 30%'
        ]
      }
    ];
  },
  
  getMonthlyReports: async () => {
    // Mock implementation
    return [
      {
        month: 'June 2023',
        new_leads: 64,
        meetings_scheduled: 32,
        proposals_sent: 18,
        deals_closed: 12,
        revenue: 175000,
        highlights: [
          'Exceeded monthly target by 5%',
          'Successfully launched new service package'
        ],
        challenges: [
          'Increasing competition in enterprise sector',
          'Longer decision cycles with government clients'
        ]
      },
      {
        month: 'May 2023',
        new_leads: 58,
        meetings_scheduled: 28,
        proposals_sent: 15,
        deals_closed: 9,
        revenue: 152000,
        highlights: [
          'Implemented new CRM automation',
          'Highest client satisfaction score to date'
        ],
        challenges: [
          'Team capacity constraints',
          'Delayed product feature release'
        ]
      }
    ];
  },
  
  getSalesTrends: async () => {
    // Mock implementation
    return {
      conversion_rates: [
        { stage: 'Lead to Meeting', rate: 42, change: 3.5 },
        { stage: 'Meeting to Proposal', rate: 65, change: -2.1 },
        { stage: 'Proposal to Deal', rate: 38, change: 4.8 }
      ],
      sales_cycle: {
        average_days: 48,
        by_size: [
          { deal_size: 'Small (<$10k)', days: 32 },
          { deal_size: 'Medium ($10k-$50k)', days: 46 },
          { deal_size: 'Large (>$50k)', days: 78 }
        ]
      },
      seasonal_patterns: [
        { quarter: 'Q1', strength: 'moderate', trending: 'stable' },
        { quarter: 'Q2', strength: 'strong', trending: 'up' },
        { quarter: 'Q3', strength: 'weak', trending: 'down' },
        { quarter: 'Q4', strength: 'very strong', trending: 'up' }
      ]
    };
  },
  
  getSalesByChannel: async () => {
    // Mock implementation
    return {
      channels: [
        { name: 'Direct Sales', revenue: 420000, deals: 28, avg_deal: 15000 },
        { name: 'Partner Referrals', revenue: 285000, deals: 15, avg_deal: 19000 },
        { name: 'Inbound Marketing', revenue: 195000, deals: 22, avg_deal: 8864 },
        { name: 'Events', revenue: 120000, deals: 8, avg_deal: 15000 }
      ],
      growth_by_channel: [
        { name: 'Direct Sales', growth: 12.5 },
        { name: 'Partner Referrals', growth: 24.8 },
        { name: 'Inbound Marketing', growth: 18.3 },
        { name: 'Events', growth: 6.2 }
      ]
    };
  },
  
  getTopProducts: async () => {
    // Mock implementation
    return {
      services: [
        { name: 'Web App Development', revenue: 320000, deals: 18, growth: 15.2 },
        { name: 'UX/UI Design', revenue: 280000, deals: 24, growth: 12.8 },
        { name: 'Digital Marketing', revenue: 220000, deals: 19, growth: 18.5 },
        { name: 'Maintenance Plans', revenue: 150000, deals: 25, growth: 5.3 }
      ],
      bundles: [
        { name: 'Complete Digital Presence', revenue: 180000, deals: 6, growth: 28.5 },
        { name: 'E-commerce Starter', revenue: 135000, deals: 9, growth: 22.7 },
        { name: 'Enterprise Solution', revenue: 210000, deals: 3, growth: 15.0 }
      ]
    };
  },
  
  getFinancialPlans: async () => {
    // Mock implementation
    return [
      {
        id: 1,
        title: 'Q3 2023 Cost Optimization',
        description: 'Strategic plan to reduce operational costs while maintaining service quality',
        goals: [
          'Reduce non-essential expenditure by 15%',
          'Optimize resource allocation across departments',
          'Improve cash flow management'
        ],
        status: 'active',
        progress: 45,
        owner: 'Jane Smith',
        due_date: '2023-09-30'
      },
      {
        id: 2,
        title: 'Revenue Growth Strategy 2023-2024',
        description: 'Comprehensive plan to increase revenue through multiple channels',
        goals: [
          'Increase monthly recurring revenue by 25%',
          'Expand client base in enterprise sector',
          'Launch 2 new service offerings'
        ],
        status: 'planning',
        progress: 15,
        owner: 'Michael Johnson',
        due_date: '2024-06-30'
      }
    ];
  }
};

export default financeService;
