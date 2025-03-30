
import { apiRequest } from "@/utils/apiUtils";
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/utils/formatters';

// Define types
export interface Invoice {
  invoice_id: number;
  client_id: number;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  client_name?: string;
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
}

export interface FinancialMetrics {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  monthly_growth: number;
  cash_flow: number;
  outstanding_invoices: number;
  revenue_by_month: { month: string; value: number }[];
  expenses_by_month: { month: string; value: number }[];
}

export interface FinancialOverview {
  current_month_revenue: number;
  previous_month_revenue: number;
  revenue_change: number;
  current_month_expenses: number;
  previous_month_expenses: number;
  expenses_change: number;
  overdue_invoices: number;
  pending_invoices: number;
  paid_invoices_month: number;
}

export interface TeamCostAnalysis {
  department: string;
  employee_count: number;
  total_cost: number;
  average_cost_per_employee: number;
  productivity_score: number;
  cost_vs_revenue_ratio: number;
}

export interface SalesMetric {
  total_sales: number;
  open_deals: number;
  closed_deals: number;
  average_deal_size: number;
  conversion_rate: number;
  sales_cycle_length: number;
  monthly_targets: { month: string; target: number; actual: number }[];
}

export interface UpsellOpportunity {
  client_id: number;
  client_name: string;
  current_services: string[];
  recommended_services: string[];
  potential_value: number;
  probability: number;
  last_purchase: string;
}

export interface SalesFollowUp {
  id: number;
  client_name: string;
  follow_up_date: string;
  status: 'pending' | 'completed' | 'missed';
  notes: string;
  assigned_to: string;
  action_items: string[];
}

export interface ImprovementSuggestion {
  id: number;
  area: string;
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  implementation_steps: string[];
}

// Main finance service
const financeService = {
  // Invoice methods
  getInvoices: async (status?: string): Promise<Invoice[]> => {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          invoice_id,
          client_id,
          invoice_number,
          amount,
          due_date,
          status,
          created_at,
          clients(client_name)
        `);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(invoice => ({
        ...invoice,
        client_name: invoice.clients?.client_name,
        clients: undefined
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return apiRequest(`/finance/invoices${status ? `?status=${status}` : ''}`, 'get', undefined, []);
    }
  },
  
  getInvoiceDetails: async (invoiceId: number): Promise<Invoice> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          invoice_id,
          client_id,
          invoice_number,
          amount,
          due_date,
          status,
          created_at,
          clients(client_name)
        `)
        .eq('invoice_id', invoiceId)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        client_name: data.clients?.client_name,
        clients: undefined
      };
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      return apiRequest(`/finance/invoices/${invoiceId}`, 'get', undefined, {});
    }
  },
  
  createInvoice: async (invoiceData: Partial<Invoice>): Promise<Invoice> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          client_id: invoiceData.client_id,
          invoice_number: invoiceData.invoice_number,
          amount: invoiceData.amount,
          due_date: invoiceData.due_date,
          status: invoiceData.status || 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return apiRequest('/finance/invoices', 'post', invoiceData, {});
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: 'pending' | 'paid' | 'overdue'): Promise<Invoice> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('invoice_id', invoiceId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return apiRequest(`/finance/invoices/${invoiceId}/status`, 'put', { status }, {});
    }
  },
  
  // Reporting methods
  getRevenueReports: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      // This would involve more complex queries in a real implementation
      // For now, returning mock data
      return {
        total: 125000,
        byMonth: [
          { month: 'Jan', value: 8500 },
          { month: 'Feb', value: 9200 },
          { month: 'Mar', value: 10500 },
          { month: 'Apr', value: 9800 },
          { month: 'May', value: 11500 },
          { month: 'Jun', value: 12000 }
        ],
        byClient: [
          { name: 'Acme Inc', value: 45000 },
          { name: 'TechCorp', value: 35000 },
          { name: 'GlobalServices', value: 25000 },
          { name: 'StartupXYZ', value: 20000 }
        ]
      };
    } catch (error) {
      console.error('Error getting revenue reports:', error);
      return apiRequest('/finance/reports/revenue', 'get', { startDate, endDate }, {});
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      // This would involve more complex queries in a real implementation
      // For now, returning mock data
      return {
        total: 85000,
        byMonth: [
          { month: 'Jan', value: 6200 },
          { month: 'Feb', value: 6500 },
          { month: 'Mar', value: 7100 },
          { month: 'Apr', value: 7500 },
          { month: 'May', value: 7800 },
          { month: 'Jun', value: 8200 }
        ],
        byCategory: [
          { name: 'Salaries', value: 50000 },
          { name: 'Rent', value: 12000 },
          { name: 'Software', value: 8000 },
          { name: 'Marketing', value: 10000 },
          { name: 'Miscellaneous', value: 5000 }
        ]
      };
    } catch (error) {
      console.error('Error getting expense reports:', error);
      return apiRequest('/finance/reports/expenses', 'get', { startDate, endDate }, {});
    }
  },
  
  // Additional methods to handle the missing functions
  getFinancialRecords: async (recordType?: 'expense' | 'income', startDate?: string, endDate?: string): Promise<FinancialRecord[]> => {
    try {
      let query = supabase
        .from('financial_records')
        .select('*');
      
      if (recordType) {
        query = query.eq('record_type', recordType);
      }
      
      if (startDate) {
        query = query.gte('record_date', startDate);
      }
      
      if (endDate) {
        query = query.lte('record_date', endDate);
      }
      
      const { data, error } = await query.order('record_date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return apiRequest('/finance/records', 'get', { recordType, startDate, endDate }, []);
    }
  },
  
  getFinancialOverview: async (): Promise<FinancialOverview> => {
    // Mock data
    return {
      current_month_revenue: 45000,
      previous_month_revenue: 41000,
      revenue_change: 9.8,
      current_month_expenses: 32000,
      previous_month_expenses: 30000,
      expenses_change: 6.7,
      overdue_invoices: 3,
      pending_invoices: 5,
      paid_invoices_month: 12
    };
  },
  
  getFinancialMetrics: async (): Promise<FinancialMetrics> => {
    // Mock data
    return {
      total_revenue: 245000,
      total_expenses: 185000,
      net_profit: 60000,
      profit_margin: 24.5,
      monthly_growth: 4.2,
      cash_flow: 15000,
      outstanding_invoices: 35000,
      revenue_by_month: [
        { month: 'Jan', value: 35000 },
        { month: 'Feb', value: 38000 },
        { month: 'Mar', value: 40000 },
        { month: 'Apr', value: 42000 },
        { month: 'May', value: 44000 },
        { month: 'Jun', value: 46000 }
      ],
      expenses_by_month: [
        { month: 'Jan', value: 28000 },
        { month: 'Feb', value: 29000 },
        { month: 'Mar', value: 30000 },
        { month: 'Apr', value: 31000 },
        { month: 'May', value: 32000 },
        { month: 'Jun', value: 35000 }
      ]
    };
  },
  
  analyzeTeamCosts: async (): Promise<TeamCostAnalysis[]> => {
    // Mock data
    return [
      {
        department: 'Development',
        employee_count: 8,
        total_cost: 48000,
        average_cost_per_employee: 6000,
        productivity_score: 0.85,
        cost_vs_revenue_ratio: 0.35
      },
      {
        department: 'Design',
        employee_count: 5,
        total_cost: 27500,
        average_cost_per_employee: 5500,
        productivity_score: 0.9,
        cost_vs_revenue_ratio: 0.25
      },
      {
        department: 'Marketing',
        employee_count: 3,
        total_cost: 15000,
        average_cost_per_employee: 5000,
        productivity_score: 0.8,
        cost_vs_revenue_ratio: 0.2
      },
      {
        department: 'Management',
        employee_count: 2,
        total_cost: 16000,
        average_cost_per_employee: 8000,
        productivity_score: 0.75,
        cost_vs_revenue_ratio: 0.15
      }
    ];
  },
  
  getUpsellOpportunities: async (): Promise<UpsellOpportunity[]> => {
    // Mock data
    return [
      {
        client_id: 1,
        client_name: 'Acme Corp',
        current_services: ['Website Maintenance', 'SEO'],
        recommended_services: ['Social Media Management', 'Content Creation'],
        potential_value: 2500,
        probability: 0.7,
        last_purchase: '2023-03-15'
      },
      {
        client_id: 2,
        client_name: 'TechSolutions',
        current_services: ['Web Development'],
        recommended_services: ['SEO', 'PPC Advertising'],
        potential_value: 3500,
        probability: 0.6,
        last_purchase: '2023-02-20'
      },
      {
        client_id: 3,
        client_name: 'Global Industries',
        current_services: ['Logo Design', 'Branding'],
        recommended_services: ['Website Redesign', 'Marketing Strategy'],
        potential_value: 5000,
        probability: 0.5,
        last_purchase: '2023-01-10'
      }
    ];
  },
  
  getFinancialPlans: async (): Promise<any[]> => {
    // Mock data
    return [
      {
        id: 1,
        title: 'Q3 Financial Strategy',
        description: 'Financial plan for Q3 focusing on revenue growth and expense reduction',
        created_at: '2023-06-01',
        status: 'active',
        targets: {
          revenue_growth: 15,
          expense_reduction: 8,
          profitability_increase: 10
        }
      },
      {
        id: 2,
        title: 'Annual Budget 2023',
        description: 'Comprehensive annual budget for fiscal year 2023',
        created_at: '2023-01-05',
        status: 'active',
        targets: {
          revenue_growth: 25,
          expense_reduction: 12,
          profitability_increase: 18
        }
      }
    ];
  },
  
  getSalesMetrics: async (): Promise<SalesMetric> => {
    // Mock data
    return {
      total_sales: 185000,
      open_deals: 12,
      closed_deals: 24,
      average_deal_size: 7700,
      conversion_rate: 0.65,
      sales_cycle_length: 28,
      monthly_targets: [
        { month: 'Jan', target: 25000, actual: 28000 },
        { month: 'Feb', target: 26000, actual: 25000 },
        { month: 'Mar', target: 27000, actual: 29000 },
        { month: 'Apr', target: 28000, actual: 30000 },
        { month: 'May', target: 29000, actual: 31000 },
        { month: 'Jun', target: 30000, actual: 32000 }
      ]
    };
  },
  
  getSalesFollowUps: async (): Promise<SalesFollowUp[]> => {
    // Mock data
    return [
      {
        id: 1,
        client_name: 'Acme Corp',
        follow_up_date: '2023-07-15',
        status: 'pending',
        notes: 'Discuss proposal for additional services',
        assigned_to: 'Sarah Johnson',
        action_items: ['Send updated proposal', 'Schedule follow-up call']
      },
      {
        id: 2,
        client_name: 'TechSolutions',
        follow_up_date: '2023-07-12',
        status: 'completed',
        notes: 'Reviewed current contract and discussed renewal options',
        assigned_to: 'Mike Chen',
        action_items: ['Send contract renewal', 'Prepare service upgrade options']
      }
    ];
  },
  
  getImprovementSuggestions: async (): Promise<ImprovementSuggestion[]> => {
    // Mock data
    return [
      {
        id: 1,
        area: 'Sales Process',
        suggestion: 'Implement automated follow-up emails',
        impact: 'high',
        effort: 'medium',
        implementation_steps: [
          'Select email automation tool',
          'Create email templates',
          'Set up automation triggers',
          'Test and refine'
        ]
      },
      {
        id: 2,
        area: 'Invoice Management',
        suggestion: 'Reduce invoice payment terms from 30 to 15 days',
        impact: 'medium',
        effort: 'low',
        implementation_steps: [
          'Update invoice templates',
          'Communicate changes to clients',
          'Monitor payment patterns'
        ]
      }
    ];
  },
  
  completeFollowUp: async (followUpId: number, notes: string): Promise<boolean> => {
    // Mock implementation
    console.log(`Follow-up ${followUpId} completed with notes: ${notes}`);
    return true;
  },
  
  getSalesGrowthData: async (): Promise<any> => {
    // Mock data
    return {
      year_over_year_growth: 18.5,
      quarter_over_quarter_growth: 5.2,
      growth_by_period: [
        { period: 'Q1 2022', growth: 15.2 },
        { period: 'Q2 2022', growth: 16.8 },
        { period: 'Q3 2022', growth: 14.5 },
        { period: 'Q4 2022', growth: 17.9 },
        { period: 'Q1 2023', growth: 19.2 },
        { period: 'Q2 2023', growth: 20.1 }
      ]
    };
  },
  
  getSalesTargets: async (): Promise<any> => {
    // Mock data
    return {
      current_month_target: 35000,
      current_month_achieved: 28000,
      current_month_progress: 80,
      yearly_target: 400000,
      yearly_achieved: 185000,
      yearly_progress: 46.25,
      targets_by_sales_rep: [
        { name: 'Sarah Johnson', target: 80000, achieved: 72000 },
        { name: 'Mike Chen', target: 75000, achieved: 65000 },
        { name: 'Alex Rodriguez', target: 70000, achieved: 48000 }
      ]
    };
  },
  
  getGrowthForecast: async (): Promise<any> => {
    // Mock data
    return {
      next_quarter_forecast: 8.5,
      next_year_forecast: 22.0,
      forecast_by_service: [
        { service: 'Web Development', growth: 15.5 },
        { service: 'Design Services', growth: 12.0 },
        { service: 'SEO & Marketing', growth: 25.0 },
        { service: 'Maintenance & Support', growth: 8.0 }
      ]
    };
  },
  
  getWeeklyReports: async (): Promise<any[]> => {
    // Mock data
    return [
      {
        week: 'Jul 3 - Jul 9, 2023',
        revenue: 12500,
        new_clients: 2,
        meetings: 14,
        proposals_sent: 5,
        deals_closed: 3
      },
      {
        week: 'Jun 26 - Jul 2, 2023',
        revenue: 9800,
        new_clients: 1,
        meetings: 12,
        proposals_sent: 4,
        deals_closed: 2
      },
      {
        week: 'Jun 19 - Jun 25, 2023',
        revenue: 11200,
        new_clients: 2,
        meetings: 15,
        proposals_sent: 6,
        deals_closed: 3
      }
    ];
  },
  
  getMonthlyReports: async (): Promise<any[]> => {
    // Mock data
    return [
      {
        month: 'June 2023',
        revenue: 45000,
        expenses: 32000,
        profit: 13000,
        new_clients: 5,
        client_retention: 95,
        avg_deal_size: 9000
      },
      {
        month: 'May 2023',
        revenue: 42000,
        expenses: 30000,
        profit: 12000,
        new_clients: 4,
        client_retention: 97,
        avg_deal_size: 8500
      },
      {
        month: 'April 2023',
        revenue: 40000,
        expenses: 29000,
        profit: 11000,
        new_clients: 3,
        client_retention: 94,
        avg_deal_size: 8000
      }
    ];
  },
  
  getSalesTrends: async (): Promise<any> => {
    // Mock data
    return {
      trends_by_month: [
        { month: 'Jan', value: 30000 },
        { month: 'Feb', value: 32000 },
        { month: 'Mar', value: 35000 },
        { month: 'Apr', value: 38000 },
        { month: 'May', value: 42000 },
        { month: 'Jun', value: 45000 }
      ],
      top_growing_services: [
        { service: 'SEO', growth: 28 },
        { service: 'Web Development', growth: 22 },
        { service: 'Social Media', growth: 18 }
      ]
    };
  },
  
  getSalesByChannel: async (): Promise<any> => {
    // Mock data
    return {
      channels: [
        { channel: 'Direct Sales', amount: 85000, percentage: 45 },
        { channel: 'Referrals', amount: 55000, percentage: 30 },
        { channel: 'Online Marketing', amount: 30000, percentage: 16 },
        { channel: 'Partnerships', amount: 15000, percentage: 9 }
      ]
    };
  },
  
  getTopProducts: async (): Promise<any> => {
    // Mock data
    return {
      services: [
        { service: 'Web Development', revenue: 65000, clients: 12 },
        { service: 'SEO Services', revenue: 45000, clients: 15 },
        { service: 'Graphic Design', revenue: 35000, clients: 14 },
        { service: 'Social Media', revenue: 25000, clients: 10 },
        { service: 'Content Writing', revenue: 15000, clients: 8 }
      ]
    };
  },
  
  sendInvoiceReminder: async (invoiceId: number): Promise<boolean> => {
    // Mock implementation
    console.log(`Sending reminder for invoice ${invoiceId}`);
    return true;
  }
};

export default financeService;
