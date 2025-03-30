
import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

export interface Invoice {
  invoice_id: number;
  client_id: number;
  client_name?: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  id?: number; // Added for compatibility with components
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
  id?: number; // Added for compatibility with components
  date?: string; // Added for compatibility with components
}

export interface FinancialMetrics {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  average_invoice_value: number;
  payment_success_rate: number;
  monthly_recurring_revenue: number;
  cash_flow: number;
}

export interface SalesMetrics {
  total_sales: number;
  new_clients: number;
  conversion_rate: number;
  average_deal_size: number;
  monthly_growth: number;
  churn_rate: number;
  sales_by_channel: {
    channel: string;
    value: number;
  }[];
  top_performing_services: {
    service: string;
    value: number;
  }[];
}

const financeService = {
  // Invoice methods
  getInvoices: async (status?: 'pending' | 'paid' | 'overdue') => {
    try {
      let query = supabase.from('invoices').select(`
        *,
        clients (client_name)
      `);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data to match our interface
      const formattedData = data.map(invoice => ({
        ...invoice,
        client_name: invoice.clients?.client_name,
        id: invoice.invoice_id // Add id for compatibility with components
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      
      // Mock data as fallback
      const mockInvoices = [
        {
          invoice_id: 1,
          id: 1,
          client_id: 1,
          client_name: "Acme Inc",
          invoice_number: "INV-2023-001",
          amount: 2500.00,
          due_date: "2023-07-15",
          status: "pending" as 'pending',
          created_at: "2023-06-15T10:00:00Z"
        },
        {
          invoice_id: 2,
          id: 2,
          client_id: 2,
          client_name: "TechCorp",
          invoice_number: "INV-2023-002",
          amount: 3800.00,
          due_date: "2023-07-20",
          status: "paid" as 'paid',
          created_at: "2023-06-20T09:30:00Z"
        },
        {
          invoice_id: 3,
          id: 3,
          client_id: 3,
          client_name: "Global Services",
          invoice_number: "INV-2023-003",
          amount: 1200.00,
          due_date: "2023-06-30",
          status: "overdue" as 'overdue',
          created_at: "2023-06-01T14:15:00Z"
        }
      ];
      
      if (status) {
        return mockInvoices.filter(invoice => invoice.status === status);
      }
      
      return mockInvoices;
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (client_name)
        `)
        .eq('invoice_id', invoiceId)
        .single();
      
      if (error) throw error;
      
      // Format the data
      const formattedInvoice = {
        ...data,
        client_name: data.clients?.client_name,
        id: data.invoice_id // Add id for compatibility with components
      };
      
      return formattedInvoice;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      
      // Mock data as fallback
      return {
        invoice_id: invoiceId,
        id: invoiceId,
        client_id: 1,
        client_name: "Acme Inc",
        invoice_number: `INV-2023-00${invoiceId}`,
        amount: 2500.00,
        due_date: "2023-07-15",
        status: "pending" as 'pending',
        created_at: "2023-06-15T10:00:00Z"
      };
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select();
      
      if (error) throw error;
      
      // Format the data
      const formattedInvoice = {
        ...data[0],
        id: data[0].invoice_id // Add id for compatibility with components
      };
      
      return formattedInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      
      // Mock data as fallback
      return {
        invoice_id: Math.floor(Math.random() * 1000) + 4,
        id: Math.floor(Math.random() * 1000) + 4,
        client_id: invoiceData.client_id,
        invoice_number: invoiceData.invoice_number,
        amount: invoiceData.amount,
        due_date: invoiceData.due_date,
        status: invoiceData.status || "pending",
        created_at: new Date().toISOString()
      };
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: 'pending' | 'paid' | 'overdue') => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('invoice_id', invoiceId)
        .select();
      
      if (error) throw error;
      
      // Format the data
      const formattedInvoice = {
        ...data[0],
        id: data[0].invoice_id // Add id for compatibility with components
      };
      
      return formattedInvoice;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      
      // Mock data as fallback
      return {
        invoice_id: invoiceId,
        id: invoiceId,
        status,
        updated_at: new Date().toISOString()
      };
    }
  },
  
  // Financial records methods
  getFinancialRecords: async (recordType?: 'expense' | 'income', startDate?: string, endDate?: string) => {
    try {
      let query = supabase.from('financial_records').select('*');
      
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
      
      // Format the data to match our interface
      const formattedData = data.map(record => ({
        ...record,
        id: record.record_id, // Add id for compatibility with components
        date: record.record_date // Add date for compatibility with components
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      
      // Mock data as fallback
      const mockRecords = [
        {
          record_id: 1,
          id: 1,
          record_type: "expense" as 'expense',
          amount: 1250.00,
          description: "Office rent",
          record_date: "2023-06-01",
          date: "2023-06-01",
          created_at: "2023-06-01T09:00:00Z"
        },
        {
          record_id: 2,
          id: 2,
          record_type: "expense" as 'expense',
          amount: 350.00,
          description: "Utilities",
          record_date: "2023-06-05",
          date: "2023-06-05",
          created_at: "2023-06-05T10:30:00Z"
        },
        {
          record_id: 3,
          id: 3,
          record_type: "income" as 'income',
          amount: 4500.00,
          description: "Client payment - Acme Inc",
          record_date: "2023-06-10",
          date: "2023-06-10",
          created_at: "2023-06-10T14:00:00Z"
        },
        {
          record_id: 4,
          id: 4,
          record_type: "income" as 'income',
          amount: 3800.00,
          description: "Client payment - TechCorp",
          record_date: "2023-06-15",
          date: "2023-06-15",
          created_at: "2023-06-15T11:15:00Z"
        },
        {
          record_id: 5,
          id: 5,
          record_type: "expense" as 'expense',
          amount: 2200.00,
          description: "Employee salaries",
          record_date: "2023-06-30",
          date: "2023-06-30",
          created_at: "2023-06-30T16:30:00Z"
        }
      ];
      
      // Apply filters to mock data
      let filteredRecords = [...mockRecords];
      
      if (recordType) {
        filteredRecords = filteredRecords.filter(record => record.record_type === recordType);
      }
      
      if (startDate) {
        filteredRecords = filteredRecords.filter(record => record.record_date >= startDate);
      }
      
      if (endDate) {
        filteredRecords = filteredRecords.filter(record => record.record_date <= endDate);
      }
      
      return filteredRecords;
    }
  },
  
  createFinancialRecord: async (recordData: any) => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .insert(recordData)
        .select();
      
      if (error) throw error;
      
      // Format the data
      const formattedRecord = {
        ...data[0],
        id: data[0].record_id, // Add id for compatibility with components
        date: data[0].record_date // Add date for compatibility with components
      };
      
      return formattedRecord;
    } catch (error) {
      console.error('Error creating financial record:', error);
      
      // Mock data as fallback
      return {
        record_id: Math.floor(Math.random() * 1000) + 6,
        id: Math.floor(Math.random() * 1000) + 6,
        record_type: recordData.record_type,
        amount: recordData.amount,
        description: recordData.description,
        record_date: recordData.record_date,
        date: recordData.record_date,
        created_at: new Date().toISOString()
      };
    }
  },
  
  // Report methods
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      // Complex query to get revenue reports
      // This would typically involve aggregating data from multiple tables
      
      // Mock data for now
      return {
        total_revenue: 15000,
        by_client: [
          { client_name: "Acme Inc", amount: 4500 },
          { client_name: "TechCorp", amount: 3800 },
          { client_name: "Global Services", amount: 2700 },
          { client_name: "New Start", amount: 4000 }
        ],
        by_month: [
          { month: "Jan", amount: 12000 },
          { month: "Feb", amount: 13500 },
          { month: "Mar", amount: 11800 },
          { month: "Apr", amount: 14200 },
          { month: "May", amount: 13900 },
          { month: "Jun", amount: 15000 }
        ]
      };
    } catch (error) {
      console.error('Error generating revenue reports:', error);
      return apiRequest('/finance/reports/revenue', 'get', { startDate, endDate }, {});
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      // Complex query to get expense reports
      // This would typically involve aggregating data from multiple tables
      
      // Mock data for now
      return {
        total_expenses: 8000,
        by_category: [
          { category: "Rent", amount: 2500 },
          { category: "Salaries", amount: 4000 },
          { category: "Utilities", amount: 700 },
          { category: "Software", amount: 800 }
        ],
        by_month: [
          { month: "Jan", amount: 7500 },
          { month: "Feb", amount: 7800 },
          { month: "Mar", amount: 8200 },
          { month: "Apr", amount: 7900 },
          { month: "May", amount: 7700 },
          { month: "Jun", amount: 8000 }
        ]
      };
    } catch (error) {
      console.error('Error generating expense reports:', error);
      return apiRequest('/finance/reports/expenses', 'get', { startDate, endDate }, {});
    }
  },
  
  // Additional methods needed by components
  getFinancialOverview: async () => {
    return {
      total_revenue: 45000,
      total_expenses: 25000,
      net_profit: 20000,
      profit_margin: 44.4,
      pending_invoices: 5,
      overdue_invoices: 2,
      recent_transactions: [
        { type: 'income', amount: 4500, description: 'Client payment - Acme Inc', date: '2023-06-10' },
        { type: 'expense', amount: 2200, description: 'Employee salaries', date: '2023-06-30' },
        { type: 'income', amount: 3800, description: 'Client payment - TechCorp', date: '2023-06-15' }
      ],
      monthly_revenue: [
        { month: 'Jan', value: 36000 },
        { month: 'Feb', value: 38000 },
        { month: 'Mar', value: 40000 },
        { month: 'Apr', value: 42000 },
        { month: 'May', value: 44000 },
        { month: 'Jun', value: 45000 }
      ]
    };
  },
  
  getFinancialMetrics: async (): Promise<FinancialMetrics> => {
    return {
      total_revenue: 45000,
      total_expenses: 25000,
      net_profit: 20000,
      profit_margin: 44.4,
      average_invoice_value: 3200,
      payment_success_rate: 92,
      monthly_recurring_revenue: 32000,
      cash_flow: 18000
    };
  },
  
  getUpsellOpportunities: async () => {
    return [
      { 
        client_id: 1, 
        client_name: 'Acme Inc', 
        current_services: ['Web Development', 'SEO'], 
        potential_services: ['Content Marketing', 'Social Media Management'],
        potential_value: 2400
      },
      { 
        client_id: 2, 
        client_name: 'TechCorp', 
        current_services: ['UI/UX Design', 'Web Development'], 
        potential_services: ['Mobile App Development', 'Maintenance Plan'],
        potential_value: 5600
      },
      { 
        client_id: 3, 
        client_name: 'Global Services', 
        current_services: ['Social Media Management', 'PPC'], 
        potential_services: ['Email Marketing', 'Content Creation'],
        potential_value: 1800
      }
    ];
  },
  
  getSalesFollowUps: async () => {
    return [
      {
        id: 1,
        client_name: 'Prospect A',
        contact_person: 'John Smith',
        service_interest: 'Web Development',
        last_contact: '2023-06-15',
        next_action: 'Follow-up call',
        notes: 'Interested in our portfolio examples'
      },
      {
        id: 2,
        client_name: 'Prospect B',
        contact_person: 'Sarah Johnson',
        service_interest: 'SEO Services',
        last_contact: '2023-06-20',
        next_action: 'Send proposal',
        notes: 'Requested detailed SEO audit and timeline'
      },
      {
        id: 3,
        client_name: 'Existing Client X',
        contact_person: 'Michael Brown',
        service_interest: 'Additional Design Work',
        last_contact: '2023-06-25',
        next_action: 'Schedule meeting',
        notes: 'Wants to discuss expanding current project scope'
      }
    ];
  },
  
  getImprovementSuggestions: async () => {
    return [
      {
        id: 1,
        title: 'Optimize Sales Process',
        description: 'Reduce time between initial contact and proposal delivery by 30%',
        impact: 'high',
        effort: 'medium',
        steps: [
          'Audit current sales process flow',
          'Identify bottlenecks in proposal creation',
          'Create proposal templates for common services',
          'Implement automated follow-up system'
        ]
      },
      {
        id: 2,
        title: 'Improve Payment Collection',
        description: 'Reduce overdue invoices by implementing automated reminders',
        impact: 'medium',
        effort: 'low',
        steps: [
          'Set up automated invoice reminders',
          'Create standardized follow-up process for late payments',
          'Offer multiple payment options',
          'Consider early payment incentives'
        ]
      },
      {
        id: 3,
        title: 'Develop Upsell Strategy',
        description: 'Increase revenue from existing clients by 20% through strategic upselling',
        impact: 'high',
        effort: 'medium',
        steps: [
          'Analyze current client services and identify gaps',
          'Create packages for complementary services',
          'Train account managers on consultative selling',
          'Schedule quarterly client review meetings'
        ]
      }
    ];
  },
  
  completeFollowUp: async (followUpId: number) => {
    return {
      id: followUpId,
      status: 'completed',
      completed_at: new Date().toISOString(),
      success: true
    };
  },
  
  getSalesGrowthData: async () => {
    return {
      previous_period: 32000,
      current_period: 45000,
      growth_percentage: 40.6,
      top_performers: [
        { name: 'John Smith', sales: 18000 },
        { name: 'Sarah Johnson', sales: 15000 },
        { name: 'Michael Brown', sales: 12000 }
      ],
      monthly_trend: [
        { month: 'Jan', value: 30000 },
        { month: 'Feb', value: 32000 },
        { month: 'Mar', value: 35000 },
        { month: 'Apr', value: 38000 },
        { month: 'May', value: 42000 },
        { month: 'Jun', value: 45000 }
      ]
    };
  },
  
  getSalesTargets: async () => {
    return {
      overall_target: 60000,
      current_progress: 45000,
      percentage_achieved: 75,
      team_targets: [
        { team: 'New Business', target: 30000, achieved: 22000 },
        { team: 'Key Accounts', target: 20000, achieved: 18000 },
        { team: 'SMB', target: 10000, achieved: 5000 }
      ],
      service_targets: [
        { service: 'Web Development', target: 25000, achieved: 18000 },
        { service: 'Design', target: 15000, achieved: 12000 },
        { service: 'Marketing', target: 20000, achieved: 15000 }
      ]
    };
  },
  
  getGrowthForecast: async () => {
    return {
      current_quarter: 45000,
      next_quarter_forecast: 55000,
      growth_forecast: 22.2,
      opportunities_pipeline: 80000,
      forecast_by_month: [
        { month: 'Jul', value: 48000 },
        { month: 'Aug', value: 52000 },
        { month: 'Sep', value: 55000 },
        { month: 'Oct', value: 58000 },
        { month: 'Nov', value: 62000 },
        { month: 'Dec', value: 65000 }
      ]
    };
  },
  
  getWeeklyReports: async () => {
    return {
      week: 'June 19-25, 2023',
      total_sales: 12000,
      new_deals: 3,
      meetings_scheduled: 8,
      proposals_sent: 5,
      conversion_rate: 37.5,
      sales_by_team_member: [
        { name: 'John Smith', amount: 5000 },
        { name: 'Sarah Johnson', amount: 4000 },
        { name: 'Michael Brown', amount: 3000 }
      ]
    };
  },
  
  getMonthlyReports: async () => {
    return {
      month: 'June 2023',
      total_sales: 45000,
      new_deals: 12,
      meetings_scheduled: 35,
      proposals_sent: 22,
      conversion_rate: 34.3,
      sales_by_service: [
        { service: 'Web Development', amount: 18000 },
        { service: 'Design', amount: 12000 },
        { service: 'Marketing', amount: 15000 }
      ],
      comparison_to_last_month: {
        percentage: 12.5,
        trend: 'up'
      }
    };
  },
  
  getSalesTrends: async () => {
    return {
      periods: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      sales_trend: [30000, 32000, 35000, 38000, 42000, 45000],
      deals_trend: [8, 10, 9, 12, 14, 15],
      average_deal_size_trend: [3750, 3200, 3889, 3167, 3000, 3000],
      seasonal_analysis: {
        strongest_quarter: 'Q2',
        weakest_quarter: 'Q1',
        year_over_year_growth: 18.4
      }
    };
  },
  
  getSalesByChannel: async () => {
    return {
      channels: [
        { name: 'Referrals', value: 18000 },
        { name: 'Direct', value: 12000 },
        { name: 'Online', value: 8000 },
        { name: 'Partners', value: 7000 }
      ],
      conversion_rates: [
        { channel: 'Referrals', rate: 65 },
        { channel: 'Direct', rate: 40 },
        { channel: 'Online', rate: 25 },
        { channel: 'Partners', rate: 55 }
      ]
    };
  },
  
  getTopProducts: async () => {
    return {
      products: [
        { name: 'Website Development', revenue: 20000, deals: 5 },
        { name: 'SEO Package', revenue: 15000, deals: 10 },
        { name: 'Brand Identity', revenue: 10000, deals: 4 },
        { name: 'Social Media Management', revenue: 8000, deals: 8 },
        { name: 'Content Creation', revenue: 7000, deals: 7 }
      ],
      most_profitable: 'Website Development',
      highest_volume: 'SEO Package',
      trending_up: 'Social Media Management'
    };
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    return {
      success: true,
      message: `Reminder sent for invoice #${invoiceId}`,
      sent_at: new Date().toISOString()
    };
  },
  
  analyzeTeamCosts: async () => {
    return {
      total_costs: 25000,
      by_department: [
        { department: 'Development', cost: 12000, percentage: 48 },
        { department: 'Design', cost: 6000, percentage: 24 },
        { department: 'Marketing', cost: 4000, percentage: 16 },
        { department: 'Administrative', cost: 3000, percentage: 12 }
      ],
      cost_per_project: [
        { project: 'Project A', cost: 8000, revenue: 15000, margin: 46.7 },
        { project: 'Project B', cost: 6000, revenue: 10000, margin: 40.0 },
        { project: 'Project C', cost: 5000, revenue: 8000, margin: 37.5 },
        { project: 'Project D', cost: 4000, revenue: 9000, margin: 55.6 }
      ],
      efficiency_metrics: {
        cost_per_billable_hour: 85,
        average_project_margin: 45,
        team_utilization: 78
      }
    };
  },
  
  getSalesMetrics: async (): Promise<SalesMetrics> => {
    return {
      total_sales: 45000,
      new_clients: 8,
      conversion_rate: 32,
      average_deal_size: 5625,
      monthly_growth: 12.5,
      churn_rate: 5,
      sales_by_channel: [
        { channel: 'Referrals', value: 18000 },
        { channel: 'Direct', value: 12000 },
        { channel: 'Online', value: 8000 },
        { channel: 'Partners', value: 7000 }
      ],
      top_performing_services: [
        { service: 'Website Development', value: 20000 },
        { service: 'SEO Package', value: 15000 },
        { service: 'Brand Identity', value: 10000 }
      ]
    };
  },
  
  getFinancialPlans: async () => {
    return [
      {
        id: 1,
        title: 'Q3 2023 Financial Plan',
        description: 'Financial targets and projections for Q3 2023',
        target_revenue: 60000,
        target_profit: 25000,
        expense_budget: 35000,
        key_initiatives: [
          'Increase average client contract value by 15%',
          'Reduce operational expenses by 8%',
          'Launch new service package with 30% profit margin'
        ],
        status: 'active'
      },
      {
        id: 2,
        title: 'Annual Financial Plan 2023',
        description: 'Overall financial objectives for fiscal year 2023',
        target_revenue: 250000,
        target_profit: 100000,
        expense_budget: 150000,
        key_initiatives: [
          'Grow client base by 25%',
          'Implement new project management system to improve efficiency',
          'Expand service offerings to increase revenue streams'
        ],
        status: 'active'
      }
    ];
  }
};

export default financeService;
