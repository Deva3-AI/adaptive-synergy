
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
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'income' | 'expense';
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
  category?: string;
}

export interface FinancialMetrics {
  total_revenue: number;
  total_expenses: number;
  profit: number;
  profit_margin: number;
  monthly_revenue: { month: string; amount: number }[];
  monthly_expenses: { month: string; amount: number }[];
  top_expense_categories: { category: string; amount: number }[];
  upcoming_invoices: number;
  overdue_invoices: number;
}

export interface SalesMetrics {
  total_sales: number;
  sales_growth: number;
  average_deal_size: number;
  conversion_rate: number;
  sales_by_channel: { channel: string; amount: number }[];
  sales_by_client: { client: string; amount: number }[];
  monthly_sales: { month: string; amount: number }[];
  projected_sales: number;
  deals_in_pipeline: number;
}

const mockFinancialMetrics: FinancialMetrics = {
  total_revenue: 125000,
  total_expenses: 85000,
  profit: 40000,
  profit_margin: 32,
  monthly_revenue: [
    { month: 'Jan', amount: 18000 },
    { month: 'Feb', amount: 22000 },
    { month: 'Mar', amount: 20000 },
    { month: 'Apr', amount: 24000 },
    { month: 'May', amount: 25000 },
    { month: 'Jun', amount: 16000 }
  ],
  monthly_expenses: [
    { month: 'Jan', amount: 14000 },
    { month: 'Feb', amount: 13500 },
    { month: 'Mar', amount: 15000 },
    { month: 'Apr', amount: 14500 },
    { month: 'May', amount: 16000 },
    { month: 'Jun', amount: 12000 }
  ],
  top_expense_categories: [
    { category: 'Salaries', amount: 45000 },
    { category: 'Software', amount: 12000 },
    { category: 'Office Rent', amount: 10000 },
    { category: 'Marketing', amount: 8000 },
    { category: 'Equipment', amount: 6000 },
    { category: 'Others', amount: 4000 }
  ],
  upcoming_invoices: 12,
  overdue_invoices: 3
};

const mockSalesMetrics: SalesMetrics = {
  total_sales: 125000,
  sales_growth: 15,
  average_deal_size: 8500,
  conversion_rate: 28,
  sales_by_channel: [
    { channel: 'Direct', amount: 65000 },
    { channel: 'Referral', amount: 35000 },
    { channel: 'Online', amount: 15000 },
    { channel: 'Partnership', amount: 10000 }
  ],
  sales_by_client: [
    { client: 'Acme Corp', amount: 25000 },
    { client: 'TechGiant', amount: 22000 },
    { client: 'StartupHub', amount: 18000 },
    { client: 'MediaGroup', amount: 15000 },
    { client: 'Others', amount: 45000 }
  ],
  monthly_sales: [
    { month: 'Jan', amount: 18000 },
    { month: 'Feb', amount: 22000 },
    { month: 'Mar', amount: 20000 },
    { month: 'Apr', amount: 24000 },
    { month: 'May', amount: 25000 },
    { month: 'Jun', amount: 16000 }
  ],
  projected_sales: 145000,
  deals_in_pipeline: 15
};

const financeService = {
  // Get all invoices with optional status filter
  getInvoices: async (status?: string) => {
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
        client_name: invoice.clients?.client_name
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return apiRequest('/invoices', 'get', undefined, []);
    }
  },
  
  // Get invoice details by ID
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (*)
        `)
        .eq('invoice_id', invoiceId)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        client_name: data.clients?.client_name
      };
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      return apiRequest(`/invoices/${invoiceId}`, 'get', undefined, {});
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
      return apiRequest('/invoices', 'post', invoiceData, {});
    }
  },
  
  // Update invoice status
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
      return apiRequest(`/invoices/${invoiceId}/status`, 'put', { status }, {});
    }
  },
  
  // Send invoice reminder (mock for now)
  sendInvoiceReminder: async (invoiceId: number) => {
    // This would integrate with an email service in a real app
    console.log(`Sending reminder for invoice ${invoiceId}`);
    return { success: true, message: 'Reminder sent successfully' };
  },
  
  // Get revenue reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      // Build query to get income records
      let query = supabase
        .from('financial_records')
        .select('*')
        .eq('record_type', 'income');
      
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
      console.error('Error fetching revenue reports:', error);
      return apiRequest('/finance/revenue', 'get', { startDate, endDate }, []);
    }
  },
  
  // Get expense reports
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      // Build query to get expense records
      let query = supabase
        .from('financial_records')
        .select('*')
        .eq('record_type', 'expense');
      
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
      console.error('Error fetching expense reports:', error);
      return apiRequest('/finance/expenses', 'get', { startDate, endDate }, []);
    }
  },
  
  // Get financial overview and metrics
  getFinancialOverview: async () => {
    // In a real app, this would calculate metrics from actual data
    return mockFinancialMetrics;
  },
  
  // Get financial metrics for dashboards
  getFinancialMetrics: async () => {
    // In a real app, this would calculate metrics from actual data
    return mockFinancialMetrics;
  },
  
  // Get financial records (income and expenses)
  getFinancialRecords: async (recordType?: 'income' | 'expense', startDate?: string, endDate?: string) => {
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
      
      return data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return apiRequest('/finance/records', 'get', { recordType, startDate, endDate }, []);
    }
  },
  
  // Create a financial record
  createFinancialRecord: async (recordData: Omit<FinancialRecord, 'record_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .insert(recordData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating financial record:', error);
      return apiRequest('/finance/records', 'post', recordData, {});
    }
  },
  
  // Get upsell opportunities
  getUpsellOpportunities: async () => {
    // This would be a complex query in a real app
    // For now, return mock data
    return [
      {
        client_id: 1,
        client_name: "Social Land",
        current_services: ["Website Hosting", "SEO"],
        potential_services: ["Content Creation", "Social Media Management"],
        estimated_value: 4500,
        last_purchase: "2023-05-10"
      },
      {
        client_id: 2,
        client_name: "Koala Digital",
        current_services: ["Web Development", "Maintenance"],
        potential_services: ["Mobile App Development"],
        estimated_value: 12000,
        last_purchase: "2023-04-22"
      }
    ];
  },
  
  // Get sales metrics
  getSalesMetrics: async () => {
    return mockSalesMetrics;
  },
  
  // Team costs analysis
  analyzeTeamCosts: async () => {
    return {
      total_team_cost: 45000,
      cost_per_department: [
        { department: "Design", cost: 15000, employee_count: 3 },
        { department: "Development", cost: 20000, employee_count: 4 },
        { department: "Marketing", cost: 10000, employee_count: 2 }
      ],
      cost_per_project: [
        { project: "Website Redesign", cost: 12000, hours: 160 },
        { project: "Mobile App", cost: 18000, hours: 240 },
        { project: "Marketing Campaign", cost: 8000, hours: 120 }
      ],
      efficiency_metrics: {
        average_hourly_rate: 75,
        billable_hours_percentage: 85,
        cost_per_billable_hour: 65
      }
    };
  },
  
  // Sales follow-ups
  getSalesFollowUps: async () => {
    return [
      {
        id: 1,
        client_name: "Prospective Inc.",
        contact_name: "John Smith",
        contact_email: "john@prospective.com",
        last_contact: "2023-06-05",
        notes: "Interested in web development services",
        status: "pending",
        priority: "high"
      },
      {
        id: 2,
        client_name: "Growth Solutions",
        contact_name: "Sarah Johnson",
        contact_email: "sarah@growthsolutions.com",
        last_contact: "2023-06-01",
        notes: "Requested proposal for SEO services",
        status: "pending",
        priority: "medium"
      }
    ];
  },
  
  // Get improvement suggestions
  getImprovementSuggestions: async () => {
    return [
      {
        id: 1,
        category: "Process",
        title: "Streamline Invoicing",
        description: "Implement automatic invoice generation and reminders",
        estimated_impact: "high",
        effort: "medium"
      },
      {
        id: 2,
        category: "Sales",
        title: "Upsell Strategy",
        description: "Develop targeted upsell campaigns for existing clients",
        estimated_impact: "high",
        effort: "low"
      }
    ];
  },
  
  // Complete a follow-up
  completeFollowUp: async (followUpId: number, result: string) => {
    console.log(`Completing follow-up ${followUpId} with result: ${result}`);
    return { success: true };
  },
  
  // Sales growth data
  getSalesGrowthData: async () => {
    return {
      year_over_year: 15.4,
      quarter_over_quarter: 5.2,
      monthly_growth: [
        { month: "Jan", growth: 2.1 },
        { month: "Feb", growth: 3.5 },
        { month: "Mar", growth: 1.2 },
        { month: "Apr", growth: 4.3 },
        { month: "May", growth: 2.8 },
        { month: "Jun", growth: 3.1 }
      ]
    };
  },
  
  // Sales targets
  getSalesTargets: async () => {
    return {
      annual_target: 500000,
      quarterly_targets: [
        { quarter: "Q1", target: 125000, actual: 130000 },
        { quarter: "Q2", target: 125000, actual: 115000 },
        { quarter: "Q3", target: 125000, actual: null },
        { quarter: "Q4", target: 125000, actual: null }
      ],
      monthly_targets: [
        { month: "Jan", target: 40000, actual: 42000 },
        { month: "Feb", target: 42000, actual: 45000 },
        { month: "Mar", target: 43000, actual: 43000 },
        { month: "Apr", target: 41000, actual: 38000 },
        { month: "May", target: 42000, actual: 40000 },
        { month: "Jun", target: 42000, actual: 37000 }
      ]
    };
  },
  
  // Growth forecast
  getGrowthForecast: async () => {
    return {
      current_year_forecast: 500000,
      next_year_forecast: 600000,
      growth_rate: 20,
      contributing_factors: [
        { factor: "New Products", impact: 40 },
        { factor: "Market Expansion", impact: 30 },
        { factor: "Increased Marketing", impact: 20 },
        { factor: "Other", impact: 10 }
      ]
    };
  },
  
  // Sales trends
  getSalesTrends: async () => {
    return {
      trends_by_month: [
        { month: "Jan", value: 42000 },
        { month: "Feb", value: 45000 },
        { month: "Mar", value: 43000 },
        { month: "Apr", value: 38000 },
        { month: "May", value: 40000 },
        { month: "Jun", value: 37000 }
      ],
      seasonal_trends: [
        { season: "Winter", performance: "Strong" },
        { season: "Spring", performance: "Moderate" },
        { season: "Summer", performance: "Weak" },
        { season: "Fall", performance: "Strong" }
      ]
    };
  },
  
  // Sales by channel
  getSalesByChannel: async () => {
    return [
      { channel: "Direct", value: 65000 },
      { channel: "Referral", value: 35000 },
      { channel: "Online", value: 15000 },
      { channel: "Partnership", value: 10000 }
    ];
  },
  
  // Top products/services
  getTopProducts: async () => {
    return [
      { product: "Web Development", value: 120000, growth: 15 },
      { product: "SEO Services", value: 85000, growth: 10 },
      { product: "Content Creation", value: 65000, growth: 25 },
      { product: "App Development", value: 55000, growth: 20 },
      { product: "Maintenance", value: 45000, growth: 5 }
    ];
  },
  
  // Weekly reports
  getWeeklyReports: async () => {
    return [
      {
        week: "Week 22",
        period: "May 29 - Jun 4",
        new_clients: 2,
        new_invoices: 5,
        revenue: 12500,
        key_wins: ["New major client signed", "Upsold existing client"]
      },
      {
        week: "Week 21",
        period: "May 22 - May 28",
        new_clients: 1,
        new_invoices: 4,
        revenue: 9800,
        key_wins: ["Closed long-term maintenance contract"]
      }
    ];
  },
  
  // Monthly reports
  getMonthlyReports: async () => {
    return [
      {
        month: "May 2023",
        new_clients: 5,
        total_invoices: 18,
        revenue: 48200,
        expenses: 32500,
        profit: 15700,
        key_metrics: {
          growth: "+5% MoM",
          top_client: "Acme Corp",
          conversion_rate: "32%"
        }
      },
      {
        month: "April 2023",
        new_clients: 3,
        total_invoices: 15,
        revenue: 45900,
        expenses: 30200,
        profit: 15700,
        key_metrics: {
          growth: "+3% MoM",
          top_client: "TechGiant",
          conversion_rate: "28%"
        }
      }
    ];
  },
  
  // Financial plans
  getFinancialPlans: async () => {
    return [
      {
        id: 1,
        title: "Q3 Growth Strategy",
        period: "Q3 2023",
        revenue_targets: {
          goal: 150000,
          strategies: ["Focus on upselling", "Launch new service package", "Expand client base"]
        },
        expense_planning: {
          budget: 95000,
          allocation: [
            { category: "Salaries", amount: 55000 },
            { category: "Marketing", amount: 15000 },
            { category: "Operations", amount: 25000 }
          ]
        },
        investment_areas: ["Marketing Automation", "Team Development", "Process Optimization"]
      }
    ];
  }
};

export default financeService;
