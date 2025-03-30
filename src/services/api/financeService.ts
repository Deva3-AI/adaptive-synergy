
import { apiRequest } from "@/utils/apiUtils";
import { supabase } from '@/integrations/supabase/client';

// Types
export interface Invoice {
  invoice_id: number;
  client_id: number;
  client_name?: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description?: string;
  record_date: string;
  created_at: string;
}

// Financial dashboard overview
export interface FinancialOverview {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  pending_invoices: number;
  pending_amount: number;
  recent_transactions: Array<{
    id: number;
    type: 'expense' | 'income';
    amount: number;
    description: string;
    date: string;
  }>;
}

// Financial metrics
export interface FinancialMetrics {
  revenue_growth: number;
  expense_growth: number;
  profit_margin: number;
  average_invoice_value: number;
  days_sales_outstanding: number;
  monthly_revenue: Array<{
    month: string;
    revenue: number;
  }>;
  monthly_expenses: Array<{
    month: string;
    expenses: number;
  }>;
}

// Sales metrics
export interface SalesMetrics {
  total_sales: number;
  growth_rate: number;
  conversion_rate: number;
  average_deal_size: number;
  sales_by_channel: Array<{
    channel: string;
    amount: number;
  }>;
  sales_by_product: Array<{
    product: string;
    amount: number;
  }>;
  monthly_sales: Array<{
    month: string;
    amount: number;
  }>;
}

const financeService = {
  // Get invoices with optional status filter
  getInvoices: async (status?: string) => {
    try {
      let query = supabase
        .from('invoices')
        .select('*, clients(client_name)')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },

  // Get details of a specific invoice
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, clients(client_name)')
        .eq('invoice_id', invoiceId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      return null;
    }
  },

  // Create a new invoice
  createInvoice: async (invoiceData: any) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  },

  // Update an invoice status
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('invoice_id', invoiceId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return null;
    }
  },

  // Send invoice reminder
  sendInvoiceReminder: async (invoiceId: number) => {
    // This would typically call an API endpoint that sends emails
    // For now, we'll return a mock success response
    return { success: true, message: 'Reminder sent successfully' };
  },

  // Get revenue reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      // In a real implementation, this would be a complex query with date ranges
      // For now, we'll return mock data
      return {
        total: 150000,
        byMonth: [
          { month: 'Jan', amount: 12500 },
          { month: 'Feb', amount: 11000 },
          { month: 'Mar', amount: 13500 },
          { month: 'Apr', amount: 12000 },
          { month: 'May', amount: 14500 },
          { month: 'Jun', amount: 16000 },
        ],
        byClient: [
          { client: 'Client A', amount: 50000 },
          { client: 'Client B', amount: 35000 },
          { client: 'Client C', amount: 28000 },
          { client: 'Client D', amount: 22000 },
          { client: 'Others', amount: 15000 },
        ]
      };
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      return null;
    }
  },

  // Get expense reports
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      // In a real implementation, this would be a complex query with date ranges
      // For now, we'll return mock data
      return {
        total: 90000,
        byMonth: [
          { month: 'Jan', amount: 7500 },
          { month: 'Feb', amount: 8000 },
          { month: 'Mar', amount: 7000 },
          { month: 'Apr', amount: 8500 },
          { month: 'May', amount: 9000 },
          { month: 'Jun', amount: 8500 },
        ],
        byCategory: [
          { category: 'Payroll', amount: 55000 },
          { category: 'Office', amount: 12000 },
          { category: 'Software', amount: 8000 },
          { category: 'Marketing', amount: 10000 },
          { category: 'Others', amount: 5000 },
        ]
      };
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      return null;
    }
  },

  // Get financial records
  getFinancialRecords: async (recordType?: 'expense' | 'income') => {
    try {
      let query = supabase
        .from('financial_records')
        .select('*')
        .order('record_date', { ascending: false });

      if (recordType) {
        query = query.eq('record_type', recordType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return [];
    }
  },

  // Analyze team costs
  analyzeTeamCosts: async () => {
    // This would typically be a complex analysis of employee costs
    // For now, we'll return mock data
    return {
      total_cost: 55000,
      by_department: [
        { department: 'Development', cost: 25000 },
        { department: 'Design', cost: 15000 },
        { department: 'Marketing', cost: 10000 },
        { department: 'Management', cost: 5000 },
      ],
      cost_per_hour: 35,
      monthly_trend: [
        { month: 'Jan', cost: 51000 },
        { month: 'Feb', cost: 52000 },
        { month: 'Mar', cost: 53000 },
        { month: 'Apr', cost: 54000 },
        { month: 'May', cost: 55000 },
      ]
    };
  },

  // Get financial overview for dashboard
  getFinancialOverview: async () => {
    // This would typically aggregate data from multiple tables
    // For now, we'll return mock data
    return {
      total_revenue: 150000,
      total_expenses: 90000,
      net_profit: 60000,
      pending_invoices: 5,
      pending_amount: 25000,
      recent_transactions: [
        { id: 1, type: 'income', amount: 5000, description: 'Invoice payment', date: '2023-06-15' },
        { id: 2, type: 'expense', amount: 1200, description: 'Office supplies', date: '2023-06-14' },
        { id: 3, type: 'income', amount: 8000, description: 'Invoice payment', date: '2023-06-10' },
        { id: 4, type: 'expense', amount: 2500, description: 'Software licenses', date: '2023-06-08' },
      ]
    } as FinancialOverview;
  },
  
  // Get financial metrics
  getFinancialMetrics: async () => {
    // This would typically be complex calculations based on financial data
    // For now, we'll return mock data
    return {
      revenue_growth: 12.5,
      expense_growth: 8.2,
      profit_margin: 40,
      average_invoice_value: 4500,
      days_sales_outstanding: 45,
      monthly_revenue: [
        { month: 'Jan', revenue: 12500 },
        { month: 'Feb', revenue: 11000 },
        { month: 'Mar', revenue: 13500 },
        { month: 'Apr', revenue: 12000 },
        { month: 'May', revenue: 14500 },
        { month: 'Jun', revenue: 16000 },
      ],
      monthly_expenses: [
        { month: 'Jan', expenses: 7500 },
        { month: 'Feb', expenses: 8000 },
        { month: 'Mar', expenses: 7000 },
        { month: 'Apr', expenses: 8500 },
        { month: 'May', expenses: 9000 },
        { month: 'Jun', expenses: 8500 },
      ]
    } as FinancialMetrics;
  },
  
  // Get upsell opportunities
  getUpsellOpportunities: async () => {
    // This would typically analyze client data to find upsell opportunities
    // For now, we'll return mock data
    return [
      { 
        client_id: 1, 
        client_name: 'Client A', 
        current_spend: 5000, 
        potential_upsell: 2000,
        suggested_services: ['Service X', 'Service Y'],
        last_purchase: '2023-05-15'
      },
      { 
        client_id: 2, 
        client_name: 'Client B', 
        current_spend: 3500, 
        potential_upsell: 1500,
        suggested_services: ['Service Z'],
        last_purchase: '2023-06-01'
      },
      { 
        client_id: 3, 
        client_name: 'Client C', 
        current_spend: 4200, 
        potential_upsell: 1800,
        suggested_services: ['Service X', 'Service Z'],
        last_purchase: '2023-05-22'
      }
    ];
  },
  
  // Get sales metrics
  getSalesMetrics: async () => {
    // This would typically be complex calculations based on sales data
    // For now, we'll return mock data
    return {
      total_sales: 150000,
      growth_rate: 12.5,
      conversion_rate: 25,
      average_deal_size: 4500,
      sales_by_channel: [
        { channel: 'Direct', amount: 80000 },
        { channel: 'Referral', amount: 40000 },
        { channel: 'Online', amount: 30000 },
      ],
      sales_by_product: [
        { product: 'Service A', amount: 70000 },
        { product: 'Service B', amount: 50000 },
        { product: 'Service C', amount: 30000 },
      ],
      monthly_sales: [
        { month: 'Jan', amount: 12500 },
        { month: 'Feb', amount: 11000 },
        { month: 'Mar', amount: 13500 },
        { month: 'Apr', amount: 12000 },
        { month: 'May', amount: 14500 },
        { month: 'Jun', amount: 16000 },
      ]
    } as SalesMetrics;
  },
  
  // Get financial plans
  getFinancialPlans: async () => {
    // This would typically be saved financial plans
    // For now, we'll return mock data
    return [
      {
        id: 1,
        title: 'Q3 Financial Strategy',
        description: 'Financial plan for Q3 2023',
        created_at: '2023-06-01',
        status: 'active',
        targets: {
          revenue: 180000,
          expenses: 100000,
          profit_margin: 45
        }
      },
      {
        id: 2,
        title: 'Annual Budget 2023',
        description: 'Budget planning for the fiscal year 2023',
        created_at: '2023-01-15',
        status: 'active',
        targets: {
          revenue: 650000,
          expenses: 400000,
          profit_margin: 38
        }
      }
    ];
  },

  // Get sales follow-ups
  getSalesFollowUps: async () => {
    // This would typically be from a follow-ups table
    // For now, we'll return mock data
    return [
      {
        id: 1,
        client_id: 1,
        client_name: 'Client A',
        follow_up_date: '2023-06-25',
        description: 'Follow up on proposal',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 2,
        client_id: 2,
        client_name: 'Client B',
        follow_up_date: '2023-06-28',
        description: 'Discuss contract renewal',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 3,
        client_id: 3,
        client_name: 'Client C',
        follow_up_date: '2023-07-05',
        description: 'Present new services',
        status: 'pending',
        priority: 'low'
      }
    ];
  },
  
  // Get improvement suggestions
  getImprovementSuggestions: async () => {
    // This would typically be from an AI-generated analysis
    // For now, we'll return mock data
    return [
      {
        id: 1,
        category: 'pricing',
        suggestion: 'Consider increasing prices for Service A by 5-10% based on market analysis',
        impact: 'high',
        implementation_difficulty: 'medium'
      },
      {
        id: 2,
        category: 'client_retention',
        suggestion: 'Implement quarterly review meetings with top clients to improve retention',
        impact: 'medium',
        implementation_difficulty: 'low'
      },
      {
        id: 3,
        category: 'expense_management',
        suggestion: 'Review software subscriptions to identify potential consolidation opportunities',
        impact: 'medium',
        implementation_difficulty: 'low'
      }
    ];
  },
  
  // Complete a follow-up
  completeFollowUp: async (followUpId: number, notes: string) => {
    // This would typically update a follow-up status in the database
    // For now, we'll return mock data
    return {
      success: true,
      follow_up: {
        id: followUpId,
        status: 'completed',
        completion_date: new Date().toISOString(),
        notes: notes
      }
    };
  },

  // Get sales growth data
  getSalesGrowthData: async () => {
    // This would typically be aggregated from sales data
    // For now, we'll return mock data
    return {
      year_over_year_growth: 15.5,
      quarter_over_quarter_growth: 4.2,
      monthly_data: [
        { month: 'Jan', current_year: 12500, previous_year: 10500 },
        { month: 'Feb', current_year: 11000, previous_year: 9800 },
        { month: 'Mar', current_year: 13500, previous_year: 11200 },
        { month: 'Apr', current_year: 12000, previous_year: 10800 },
        { month: 'May', current_year: 14500, previous_year: 12300 },
        { month: 'Jun', current_year: 16000, previous_year: 13500 },
      ]
    };
  },
  
  // Get sales targets
  getSalesTargets: async () => {
    // This would typically be from a targets table
    // For now, we'll return mock data
    return {
      annual_target: 650000,
      quarterly_targets: [
        { quarter: 'Q1', target: 150000, achieved: 148000 },
        { quarter: 'Q2', target: 160000, achieved: 165000 },
        { quarter: 'Q3', target: 170000, achieved: 0 },
        { quarter: 'Q4', target: 180000, achieved: 0 },
      ],
      monthly_targets: [
        { month: 'Jan', target: 50000, achieved: 48000 },
        { month: 'Feb', target: 50000, achieved: 49000 },
        { month: 'Mar', target: 50000, achieved: 51000 },
        { month: 'Apr', target: 53000, achieved: 52000 },
        { month: 'May', target: 53000, achieved: 55000 },
        { month: 'Jun', target: 53000, achieved: 58000 },
      ]
    };
  },
  
  // Get growth forecast
  getGrowthForecast: async () => {
    // This would typically be from an AI-generated forecast
    // For now, we'll return mock data
    return {
      annual_forecast: {
        revenue: 680000,
        growth_rate: 16.2,
        confidence: 0.85
      },
      quarterly_forecast: [
        { quarter: 'Q1', forecasted: 150000, actual: 148000 },
        { quarter: 'Q2', forecasted: 165000, actual: 165000 },
        { quarter: 'Q3', forecasted: 175000, actual: null },
        { quarter: 'Q4', forecasted: 190000, actual: null },
      ],
      growth_drivers: [
        { driver: 'New client acquisition', impact: 'high' },
        { driver: 'Service expansion with existing clients', impact: 'medium' },
        { driver: 'Price adjustments', impact: 'low' },
      ]
    };
  },

  // Get weekly reports
  getWeeklyReports: async () => {
    // This would typically be aggregated weekly data
    // For now, we'll return mock data
    return [
      {
        week: 'Jun 5-11',
        new_clients: 2,
        revenue: 15000,
        outstanding_invoices: 8,
        top_performer: 'John Doe'
      },
      {
        week: 'Jun 12-18',
        new_clients: 1,
        revenue: 12000,
        outstanding_invoices: 6,
        top_performer: 'Jane Smith'
      },
      {
        week: 'Jun 19-25',
        new_clients: 3,
        revenue: 18000,
        outstanding_invoices: 7,
        top_performer: 'John Doe'
      }
    ];
  },
  
  // Get monthly reports
  getMonthlyReports: async () => {
    // This would typically be aggregated monthly data
    // For now, we'll return mock data
    return [
      {
        month: 'Jan 2023',
        new_clients: 8,
        revenue: 50000,
        expenses: 30000,
        profit: 20000
      },
      {
        month: 'Feb 2023',
        new_clients: 6,
        revenue: 52000,
        expenses: 31000,
        profit: 21000
      },
      {
        month: 'Mar 2023',
        new_clients: 9,
        revenue: 55000,
        expenses: 32000,
        profit: 23000
      },
      {
        month: 'Apr 2023',
        new_clients: 7,
        revenue: 53000,
        expenses: 33000,
        profit: 20000
      },
      {
        month: 'May 2023',
        new_clients: 10,
        revenue: 58000,
        expenses: 35000,
        profit: 23000
      },
      {
        month: 'Jun 2023',
        new_clients: 11,
        revenue: 62000,
        expenses: 36000,
        profit: 26000
      }
    ];
  },

  // Get sales trends
  getSalesTrends: async () => {
    // This would typically be from an analysis of sales data
    // For now, we'll return mock data
    return {
      overall_trend: 'upward',
      monthly_trend: [
        { month: 'Jan', sales: 50000 },
        { month: 'Feb', sales: 52000 },
        { month: 'Mar', sales: 55000 },
        { month: 'Apr', sales: 53000 },
        { month: 'May', sales: 58000 },
        { month: 'Jun', sales: 62000 },
      ],
      seasonal_analysis: {
        strongest_quarter: 'Q4',
        weakest_quarter: 'Q1',
        year_end_projection: 'strong'
      }
    };
  },
  
  // Get sales by channel
  getSalesByChannel: async () => {
    // This would typically be aggregated from sales data
    // For now, we'll return mock data
    return [
      { channel: 'Direct', amount: 200000, percentage: 50 },
      { channel: 'Referral', amount: 120000, percentage: 30 },
      { channel: 'Online', amount: 80000, percentage: 20 },
    ];
  },
  
  // Get top products/services
  getTopProducts: async () => {
    // This would typically be aggregated from sales data
    // For now, we'll return mock data
    return [
      { 
        product: 'Service A', 
        revenue: 150000, 
        growth: 12.5,
        clients: 25
      },
      { 
        product: 'Service B', 
        revenue: 120000, 
        growth: 8.2,
        clients: 18
      },
      { 
        product: 'Service C', 
        revenue: 90000, 
        growth: 15.8,
        clients: 15
      },
      { 
        product: 'Service D', 
        revenue: 60000, 
        growth: 6.5,
        clients: 10
      },
      { 
        product: 'Service E', 
        revenue: 40000, 
        growth: 20.5,
        clients: 8
      }
    ];
  }
};

export default financeService;
