import { apiRequest } from "@/utils/apiUtils";
import { supabase } from '@/integrations/supabase/client';

// Define types
export interface Invoice {
  invoice_id: number;
  invoice_number: string;
  client_id: number;
  client_name?: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
}

// Mock data for financial metrics by period
const mockFinancialMetrics = {
  monthly: {
    revenue: {
      value: 45000,
      formatted_value: "$45,000",
      label: "Revenue",
      growth_rate: 5.2
    },
    profit: {
      value: 15000,
      formatted_value: "$15,000",
      label: "Profit",
      growth_rate: 3.8
    },
    expenses: {
      value: 30000,
      formatted_value: "$30,000",
      label: "Expenses",
      growth_rate: -2.1
    },
    margin: {
      value: 33.3,
      formatted_value: "33.3%",
      label: "Profit Margin",
      growth_rate: 1.5
    }
  },
  quarterly: {
    revenue: {
      value: 135000,
      formatted_value: "$135,000",
      label: "Revenue",
      growth_rate: 7.5
    },
    profit: {
      value: 47000,
      formatted_value: "$47,000",
      label: "Profit",
      growth_rate: 8.2
    },
    expenses: {
      value: 88000,
      formatted_value: "$88,000",
      label: "Expenses",
      growth_rate: -1.3
    },
    margin: {
      value: 34.8,
      formatted_value: "34.8%",
      label: "Profit Margin",
      growth_rate: 2.1
    }
  },
  yearly: {
    revenue: {
      value: 520000,
      formatted_value: "$520,000",
      label: "Revenue",
      growth_rate: 12.4
    },
    profit: {
      value: 180000,
      formatted_value: "$180,000",
      label: "Profit",
      growth_rate: 15.2
    },
    expenses: {
      value: 340000,
      formatted_value: "$340,000",
      label: "Expenses",
      growth_rate: 3.6
    },
    margin: {
      value: 34.6,
      formatted_value: "34.6%",
      label: "Profit Margin",
      growth_rate: 4.8
    }
  }
};

// Mock data for financial overview
const mockFinancialOverview = {
  current_month_revenue: 45000,
  previous_month_revenue: 42500,
  current_month_profit: 15000,
  previous_month_profit: 14100,
  current_month_expenses: 30000,
  previous_month_expenses: 28400,
  cash_flow: {
    current: 22000,
    previous: 20500
  },
  outstanding_invoices: 38500,
  accounts_receivable: 65000
};

// Mock data for financial records
const mockFinancialRecords = [
  {
    record_id: 1,
    record_type: 'expense',
    amount: 2500,
    description: 'Software: Monthly SaaS subscriptions',
    record_date: '2023-06-01',
    created_at: '2023-06-01T15:30:00Z'
  },
  {
    record_id: 2,
    record_type: 'expense',
    amount: 3800,
    description: 'Marketing: Ad campaigns',
    record_date: '2023-06-05',
    created_at: '2023-06-05T09:45:00Z'
  },
  {
    record_id: 3,
    record_type: 'income',
    amount: 12000,
    description: 'Client payment: Project A completion',
    record_date: '2023-06-10',
    created_at: '2023-06-10T14:20:00Z'
  },
  {
    record_id: 4,
    record_type: 'expense',
    amount: 1200,
    description: 'Utilities: Office expenses',
    record_date: '2023-06-15',
    created_at: '2023-06-15T11:30:00Z'
  },
  {
    record_id: 5,
    record_type: 'income',
    amount: 8500,
    description: 'Client payment: Monthly retainer',
    record_date: '2023-06-20',
    created_at: '2023-06-20T16:15:00Z'
  }
] as FinancialRecord[];

// Mock data for upsell opportunities
const mockUpsellOpportunities = [
  {
    id: 1,
    client_id: 5,
    client_name: 'Acme Inc.',
    description: 'Premium support package upgrade',
    potentialRevenue: 1200,
    probability: 0.8,
    nextAction: 'Send proposal'
  },
  {
    id: 2,
    client_id: 2,
    client_name: 'TechCorp',
    description: 'Additional storage capacity',
    potentialRevenue: 800,
    probability: 0.6,
    nextAction: 'Schedule meeting'
  },
  {
    id: 3,
    client_id: 8,
    client_name: 'Global Services',
    description: 'Advanced analytics package',
    potentialRevenue: 2400,
    probability: 0.4,
    nextAction: 'Demo requested'
  }
];

// Mock data for team costs analysis
const mockTeamCostsAnalysis = {
  total_cost: 125000,
  avg_cost_per_employee: 6250,
  total_employees: 20,
  trend_percentage: 5.2,
  departments: [
    { name: 'Engineering', headcount: 8, cost: 56000, percentage: 44.8, yoy_change: 3.5 },
    { name: 'Marketing', headcount: 4, cost: 28000, percentage: 22.4, yoy_change: 7.2 },
    { name: 'Design', headcount: 3, cost: 18000, percentage: 14.4, yoy_change: 2.1 },
    { name: 'Sales', headcount: 3, cost: 15000, percentage: 12.0, yoy_change: 10.5 },
    { name: 'Admin', headcount: 2, cost: 8000, percentage: 6.4, yoy_change: -1.2 }
  ],
  trend: [
    { period: 'Jan', total_cost: 118000, avg_cost: 6200 },
    { period: 'Feb', total_cost: 119500, avg_cost: 6150 },
    { period: 'Mar', total_cost: 120800, avg_cost: 6040 },
    { period: 'Apr', total_cost: 122500, avg_cost: 6125 },
    { period: 'May', total_cost: 124000, avg_cost: 6200 },
    { period: 'Jun', total_cost: 125000, avg_cost: 6250 }
  ],
  efficiency: [
    { name: 'Engineering', efficiency: 85 },
    { name: 'Marketing', efficiency: 78 },
    { name: 'Design', efficiency: 90 },
    { name: 'Sales', efficiency: 82 },
    { name: 'Admin', efficiency: 75 }
  ],
  optimization_opportunities: [
    { department: 'Engineering', potential_savings: 8000, description: 'Consolidate software licenses' },
    { department: 'Marketing', potential_savings: 5000, description: 'Optimize ad spend allocation' },
    { department: 'Admin', potential_savings: 2500, description: 'Reduce external consulting expenses' }
  ],
  insights: [
    'Design department has the highest efficiency score at 90%',
    'Marketing costs increased 7.2% year-over-year, evaluate ROI',
    'Total cost per employee increased 2.1% in the last quarter',
    'Admin cost per employee decreased slightly, good trend',
    'Sales department showing highest YoY growth, aligns with company goals'
  ]
};

// Mock data for sales metrics
const mockSalesMetrics = {
  total_sales: {
    value: 85000,
    previous: 78000,
    change_percentage: 8.97,
    trend: [65000, 72000, 69000, 78000, 85000]
  },
  conversion_rate: {
    value: 18.5,
    previous: 16.2,
    change_percentage: 14.2,
    trend: [14.5, 15.8, 16.2, 17.1, 18.5]
  },
  average_deal_size: {
    value: 7500,
    previous: 6800,
    change_percentage: 10.3,
    trend: [6200, 6500, 6800, 7200, 7500]
  },
  sales_cycle_length: {
    value: 28,
    previous: 32,
    change_percentage: -12.5,
    trend: [35, 33, 32, 30, 28]
  }
};

// Mock data for sales follow-ups
const mockSalesFollowUps = [
  {
    id: 1,
    client_name: 'Acme Corp',
    contact_name: 'John Smith',
    contact_email: 'john@acmecorp.com',
    last_contact_date: '2023-06-10',
    next_follow_up: '2023-06-20',
    status: 'pending',
    notes: 'Discussed premium package, seemed interested',
    priority: 'high'
  },
  {
    id: 2,
    client_name: 'TechSolutions',
    contact_name: 'Sarah Jones',
    contact_email: 'sarah@techsolutions.com',
    last_contact_date: '2023-06-05',
    next_follow_up: '2023-06-15',
    status: 'pending',
    notes: 'Needs additional information on implementation timeline',
    priority: 'medium'
  },
  {
    id: 3,
    client_name: 'Global Industries',
    contact_name: 'Mike Wilson',
    contact_email: 'mike@globalind.com',
    last_contact_date: '2023-06-12',
    next_follow_up: '2023-06-22',
    status: 'pending',
    notes: 'Requested a demo for the new features',
    priority: 'high'
  }
];

// Mock data for sales growth
const mockSalesGrowthData = {
  monthly: [
    { month: 'Jan', value: 42000 },
    { month: 'Feb', value: 45000 },
    { month: 'Mar', value: 48000 },
    { month: 'Apr', value: 52000 },
    { month: 'May', value: 58000 },
    { month: 'Jun', value: 62000 }
  ],
  quarterly: [
    { quarter: 'Q1', value: 135000 },
    { quarter: 'Q2', value: 172000 },
    { quarter: 'Q3', value: 188000 },
    { quarter: 'Q4', value: 210000 }
  ],
  yearly: [
    { year: '2020', value: 520000 },
    { year: '2021', value: 620000 },
    { year: '2022', value: 705000 },
    { year: '2023', value: 785000 }
  ]
};

// Mock data for sales targets
const mockSalesTargets = {
  monthly: [
    { month: 'Jan', target: 45000, actual: 42000 },
    { month: 'Feb', target: 48000, actual: 45000 },
    { month: 'Mar', target: 50000, actual: 48000 },
    { month: 'Apr', target: 55000, actual: 52000 },
    { month: 'May', target: 60000, actual: 58000 },
    { month: 'Jun', target: 65000, actual: 62000 }
  ],
  quarterly: [
    { quarter: 'Q1', target: 145000, actual: 135000 },
    { quarter: 'Q2', target: 180000, actual: 172000 },
    { quarter: 'Q3', target: 195000, actual: 188000 },
    { quarter: 'Q4', target: 220000, actual: 210000 }
  ],
  yearly: {
    target: 740000,
    projected: 705000,
    progress: 95.3
  }
};

// Mock data for sales forecasts
const mockSalesForecasts = {
  next_quarter: {
    optimistic: 230000,
    realistic: 215000,
    pessimistic: 195000
  },
  next_year: {
    optimistic: 880000,
    realistic: 820000,
    pessimistic: 760000
  },
  growth_factors: [
    { factor: 'Market expansion', impact: 'high', contribution: 35 },
    { factor: 'New product launches', impact: 'medium', contribution: 25 },
    { factor: 'Customer retention', impact: 'high', contribution: 30 },
    { factor: 'Competitive pressures', impact: 'low', contribution: 10 }
  ]
};

// Mock data for sales reports
const mockWeeklyReports = [
  {
    id: 1,
    week: 'Jun 5-11',
    new_leads: 15,
    meetings: 8,
    proposals: 4,
    closed_deals: 2,
    revenue: 18500,
    notes: 'Strong week for new leads, follow-up planned'
  },
  {
    id: 2,
    week: 'Jun 12-18',
    new_leads: 12,
    meetings: 10,
    proposals: 6,
    closed_deals: 3,
    revenue: 24500,
    notes: 'High conversion from meetings to proposals'
  },
  {
    id: 3,
    week: 'Jun 19-25',
    new_leads: 18,
    meetings: 7,
    proposals: 5,
    closed_deals: 2,
    revenue: 21000,
    notes: 'New marketing campaign boosted leads'
  }
];

const mockMonthlyReports = [
  {
    id: 1,
    month: 'April 2023',
    new_leads: 58,
    meetings: 32,
    proposals: 18,
    closed_deals: 9,
    revenue: 72500,
    top_performers: ['John Smith', 'Sarah Jones'],
    key_accounts: ['Acme Corp', 'TechSolutions'],
    challenges: 'Long sales cycles for enterprise clients',
    opportunities: 'Increased interest in premium packages'
  },
  {
    id: 2,
    month: 'May 2023',
    new_leads: 64,
    meetings: 38,
    proposals: 22,
    closed_deals: 11,
    revenue: 85000,
    top_performers: ['Mike Wilson', 'Sarah Jones'],
    key_accounts: ['Global Industries', 'Acme Corp'],
    challenges: 'Price sensitivity in SMB segment',
    opportunities: 'Referral program showing promising results'
  }
];

// Mock data for sales trends analysis
const mockSalesTrends = {
  monthly_sales: [
    { month: 'Jan', value: 42000 },
    { month: 'Feb', value: 45000 },
    { month: 'Mar', value: 48000 },
    { month: 'Apr', value: 52000 },
    { month: 'May', value: 58000 },
    { month: 'Jun', value: 62000 }
  ],
  quarterly_growth: [
    { quarter: 'Q1 2022', growth_rate: 8.5 },
    { quarter: 'Q2 2022', growth_rate: 10.2 },
    { quarter: 'Q3 2022', growth_rate: 7.8 },
    { quarter: 'Q4 2022', growth_rate: 9.4 },
    { quarter: 'Q1 2023', growth_rate: 12.5 },
    { quarter: 'Q2 2023', growth_rate: 11.8 }
  ],
  seasonality: [
    { month: 'Jan', index: 0.85 },
    { month: 'Feb', index: 0.92 },
    { month: 'Mar', index: 0.98 },
    { month: 'Apr', index: 1.05 },
    { month: 'May', index: 1.18 },
    { month: 'Jun', index: 1.25 },
    { month: 'Jul', index: 0.95 },
    { month: 'Aug', index: 0.90 },
    { month: 'Sep', index: 1.10 },
    { month: 'Oct', index: 1.15 },
    { month: 'Nov', index: 1.20 },
    { month: 'Dec', index: 0.95 }
  ]
};

// Mock data for sales by channel
const mockSalesByChannel = [
  { channel: 'Direct', amount: 320000, percentage: 45 },
  { channel: 'Partners', amount: 180000, percentage: 25 },
  { channel: 'Website', amount: 110000, percentage: 15 },
  { channel: 'Referrals', amount: 85000, percentage: 12 },
  { channel: 'Other', amount: 20000, percentage: 3 }
];

// Mock data for top products
const mockTopProducts = [
  { product: 'Enterprise Suite', revenue: 185000, growth: 12.5, margin: 38 },
  { product: 'Professional Package', revenue: 145000, growth: 8.2, margin: 35 },
  { product: 'Basic Solution', revenue: 110000, growth: 5.5, margin: 30 },
  { product: 'Support & Maintenance', revenue: 98000, growth: 15.8, margin: 45 },
  { product: 'Custom Development', revenue: 75000, growth: 10.2, margin: 40 }
];

const financeService = {
  // Invoices
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
      
      // Format the data to match our Invoice type
      const formattedData = data.map(invoice => ({
        invoice_id: invoice.invoice_id,
        invoice_number: invoice.invoice_number,
        client_id: invoice.client_id,
        client_name: invoice.clients?.client_name,
        amount: Number(invoice.amount),
        status: invoice.status as 'pending' | 'paid' | 'overdue',
        due_date: invoice.due_date,
        created_at: invoice.created_at
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Fall back to mock data
      return apiRequest('/finance/invoices', 'get', undefined, []);
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
      
      return {
        invoice_id: data.invoice_id,
        invoice_number: data.invoice_number,
        client_id: data.client_id,
        client_name: data.clients?.client_name,
        amount: Number(data.amount),
        status: data.status as 'pending' | 'paid' | 'overdue',
        due_date: data.due_date,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      return apiRequest(`/finance/invoices/${invoiceId}`, 'get', undefined, {});
    }
  },
  
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
      return apiRequest('/finance/invoices', 'post', invoiceData, {});
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
      return data[0];
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return apiRequest(`/finance/invoices/${invoiceId}/status`, 'put', { status }, {});
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      // In a real implementation, this would send an email reminder
      // For now, we'll simulate a success response
      return { success: true, message: 'Reminder sent successfully' };
    } catch (error) {
      console.error('Error sending invoice reminder:', error);
      return apiRequest(`/finance/invoices/${invoiceId}/reminder`, 'post', undefined, { success: true });
    }
  },
  
  // Financial records
  getFinancialRecords: async (recordType?: string, startDate?: string, endDate?: string) => {
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
      return data as FinancialRecord[];
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return mockFinancialRecords;
    }
  },
  
  // Reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      // In a real implementation, this would query aggregated data
      // For now, we'll simulate with mock data
      return {
        total_revenue: 325000,
        month_over_month_growth: 8.5,
        year_over_year_growth: 15.2,
        by_client: [
          { client_name: 'Acme Inc.', amount: 85000, percentage: 26.2 },
          { client_name: 'TechCorp', amount: 65000, percentage: 20.0 },
          { client_name: 'Global Services', amount: 55000, percentage: 16.9 },
          { client_name: 'Digital Solutions', amount: 45000, percentage: 13.8 },
          { client_name: 'Others', amount: 75000, percentage: 23.1 }
        ],
        trends: [
          { month: 'Jan', amount: 42000 },
          { month: 'Feb', amount: 45000 },
          { month: 'Mar', amount: 48000 },
          { month: 'Apr', amount: 52000 },
          { month: 'May', amount: 58000 },
          { month: 'Jun', amount: 62000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      return apiRequest('/finance/reports/revenue', 'get', { startDate, endDate }, {});
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      // In a real implementation, this would query aggregated data
      // For now, we'll simulate with mock data
      return {
        total_expenses: 220000,
        month_over_month_change: 3.2,
        year_over_year_change: 7.5,
        by_category: [
          { category: 'Payroll', amount: 125000, percentage: 56.8 },
          { category: 'Software', amount: 35000, percentage: 15.9 },
          { category: 'Marketing', amount: 28000, percentage: 12.7 },
          { category: 'Office', amount: 18000, percentage: 8.2 },
          { category: 'Others', amount: 14000, percentage: 6.4 }
        ],
        trends: [
          { month: 'Jan', amount: 32000 },
          { month: 'Feb', amount: 34000 },
          { month: 'Mar', amount: 33500 },
          { month: 'Apr', amount: 35000 },
          { month: 'May', amount: 36500 },
          { month: 'Jun', amount: 38000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      return apiRequest('/finance/reports/expenses', 'get', { startDate, endDate }, {});
    }
  },
  
  // Additional financial methods
  getFinancialOverview: async () => {
    try {
      // This would be a complex query with aggregations in a real implementation
      return mockFinancialOverview;
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      return apiRequest('/finance/overview', 'get', undefined, mockFinancialOverview);
    }
  },
  
  getFinancialMetrics: async (period: string = 'monthly') => {
    try {
      // This would query aggregated metrics for the specified period
      return mockFinancialMetrics[period as keyof typeof mockFinancialMetrics] || mockFinancialMetrics.monthly;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      return apiRequest(`/finance/metrics?period=${period}`, 'get', undefined, {});
    }
  },
  
  getUpsellOpportunities: async () => {
    try {
      // This would analyze client data to find upsell opportunities
      return mockUpsellOpportunities;
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      return apiRequest('/finance/upsell-opportunities', 'get', undefined, []);
    }
  },
  
  analyzeTeamCosts: async (period: string = 'monthly') => {
    try {
      // This would analyze team costs and provide insights
      return mockTeamCostsAnalysis;
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      return apiRequest(`/finance/team-costs?period=${period}`, 'get', undefined, {});
    }
  },
  
  // Sales-related methods
  getSalesMetrics: async () => {
    try {
      return mockSalesMetrics;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      return apiRequest('/finance/sales/metrics', 'get', undefined, {});
    }
  },
  
  getSalesFollowUps: async () => {
    try {
      return mockSalesFollowUps;
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      return apiRequest('/finance/sales/follow-ups', 'get', undefined, []);
    }
  },
  
  getImprovementSuggestions: async () => {
    try {
      return [
        { id: 1, area: 'Follow-up Timing', description: 'Reduce time between initial contact and first follow-up', impact: 'high' },
        { id: 2, area: 'Proposal Content', description: 'Include more case studies in proposals', impact: 'medium' },
        { id: 3, area: 'Lead Qualification', description: 'Implement more stringent qualification criteria', impact: 'high' }
      ];
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      return apiRequest('/finance/sales/improvement-suggestions', 'get', undefined, []);
    }
  },
  
  completeFollowUp: async (followUpId: number, outcome: string, notes: string) => {
    try {
      return { success: true, message: 'Follow-up marked as completed' };
    } catch (error) {
      console.error('Error completing follow-up:', error);
      return apiRequest(`/finance/sales/follow-ups/${followUpId}/complete`, 'post', { outcome, notes }, {});
    }
  },
  
  getSalesGrowthData: async (period: string = 'monthly') => {
    try {
      if (period === 'monthly') return mockSalesGrowthData.monthly;
      if (period === 'quarterly') return mockSalesGrowthData.quarterly;
      return mockSalesGrowthData.yearly;
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return apiRequest(`/finance/sales/growth?period=${period}`, 'get', undefined, []);
    }
  },
  
  getSalesTargets: async (period: string = 'monthly') => {
    try {
      if (period === 'monthly') return mockSalesTargets.monthly;
      if (period === 'quarterly') return mockSalesTargets.quarterly;
      return mockSalesTargets.yearly;
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return apiRequest(`/finance/sales/targets?period=${period}`, 'get', undefined, {});
    }
  },
  
  getGrowthForecast: async () => {
    try {
      return mockSalesForecasts;
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      return apiRequest('/finance/sales/forecast', 'get', undefined, {});
    }
  },
  
  getWeeklyReports: async () => {
    try {
      return mockWeeklyReports;
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      return apiRequest('/finance/sales/reports/weekly', 'get', undefined, []);
    }
  },
  
  getMonthlyReports: async () => {
    try {
      return mockMonthlyReports;
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      return apiRequest('/finance/sales/reports/monthly', 'get', undefined, []);
    }
  },
  
  getSalesTrends: async () => {
    try {
      return mockSalesTrends;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return apiRequest('/finance/sales/trends', 'get', undefined, {});
    }
  },
  
  getSalesByChannel: async () => {
    try {
      return mockSalesByChannel;
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return apiRequest('/finance/sales/by-channel', 'get', undefined, []);
    }
  },
  
  getTopProducts: async () => {
    try {
      return mockTopProducts;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return apiRequest('/finance/sales/top-products', 'get', undefined, []);
    }
  },
  
  getFinancialPlans: async () => {
    try {
      return {
        budget_allocation: [
          { category: 'Marketing', allocation: 25, change: 5 },
          { category: 'R&D', allocation: 30, change: 2 },
          { category: 'Operations', allocation: 35, change: -3 },
          { category: 'Admin', allocation: 10, change: 0 }
        ],
        investment_plans: [
          { area: 'New product development', amount: 120000, return_estimate: 15 },
          { area: 'Market expansion', amount: 85000, return_estimate: 12 },
          { area: 'Technology upgrades', amount: 65000, return_estimate: 10 }
        ],
        financial_goals: {
          revenue_growth: 15,
          profit_margin: 35,
          cost_reduction: 8,
          timeline: '12 months'
        }
      };
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      return apiRequest('/finance/plans', 'get', undefined, {});
    }
  }
};

export default financeService;
