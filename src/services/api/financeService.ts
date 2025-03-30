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
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
}

export interface FinancialMetrics {
  total_revenue: number;
  total_expenses: number;
  profit_margin: number;
  outstanding_invoices: number;
  upcoming_payments: number;
  monthly_revenue: { month: string; amount: number }[];
  monthly_expenses: { month: string; amount: number }[];
}

export interface SalesMetrics {
  total_sales: number;
  sales_growth: number;
  conversion_rate: number;
  average_deal_size: number;
  sales_by_channel: { channel: string; amount: number }[];
  top_performers: { name: string; sales: number }[];
}

export interface SalesFollowUp {
  id: number;
  clientName: string;
  contactPerson: string;
  type: 'call' | 'email' | 'meeting';
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  notes: string;
  phone?: string;
  email?: string;
}

export interface SalesImprovementSuggestion {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SalesGrowthData {
  trends: any[];
  currentPeriod: {
    revenueGrowth: number;
    customerGrowth: number;
  };
  growthDrivers: Array<{
    factor: string;
    impact: number;
    performance: 'positive' | 'neutral' | 'negative';
  }>;
}

export interface SalesTarget {
  id: number;
  category: string;
  current: number;
  target: number;
  percentage: number;
}

export interface GrowthForecast {
  chart: any[];
  insights: Array<{
    text: string;
    type: 'positive' | 'warning';
  }>;
}

export interface WeeklyReport {
  id: number;
  title: string;
  period: string;
  sales: number;
  target: number;
  progress: number;
  performanceData: any[];
  metrics: {
    conversionRate: number;
    prevConversionRate: number;
    avgSaleValue: number;
    prevAvgSaleValue: number;
    newLeads: number;
    prevNewLeads: number;
    closedDeals: number;
    prevClosedDeals: number;
  };
}

export interface MonthlyReport {
  id: number;
  title: string;
  period: string;
  sales: number;
  target: number;
  progress: number;
  yearlyTrend: any[];
}

export interface SalesTrends {
  data: any[];
  insights: string[];
  activities: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
  }>;
}

export interface TopProduct {
  id: number;
  name: string;
  sales: number;
  units: number;
  revenue: number;
  growth: number;
}

const sampleInvoices: Invoice[] = [
  {
    invoice_id: 1,
    client_id: 1,
    client_name: "Social Land",
    invoice_number: "INV-2023-001",
    amount: 2500,
    due_date: "2023-09-30",
    status: "pending",
    created_at: "2023-09-15"
  },
  {
    invoice_id: 2,
    client_id: 2,
    client_name: "Koala Digital",
    invoice_number: "INV-2023-002",
    amount: 1800,
    due_date: "2023-09-15",
    status: "paid",
    created_at: "2023-09-01"
  },
  {
    invoice_id: 3,
    client_id: 3,
    client_name: "AC Digital",
    invoice_number: "INV-2023-003",
    amount: 3200,
    due_date: "2023-08-30",
    status: "overdue",
    created_at: "2023-08-15"
  }
];

const sampleFinancialRecords: FinancialRecord[] = [
  {
    record_id: 1,
    record_type: "expense",
    amount: 650,
    description: "Office rent",
    record_date: "2023-09-01",
    created_at: "2023-09-01"
  },
  {
    record_id: 2,
    record_type: "expense",
    amount: 120,
    description: "Utilities",
    record_date: "2023-09-05",
    created_at: "2023-09-05"
  },
  {
    record_id: 3,
    record_type: "income",
    amount: 2500,
    description: "Client payment - Social Land",
    record_date: "2023-09-10",
    created_at: "2023-09-10"
  }
];

const financeService = {
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
      
      const formattedData = data.map(invoice => ({
        ...invoice,
        client_name: invoice.clients?.client_name
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return status 
        ? sampleInvoices.filter(inv => inv.status === status)
        : sampleInvoices;
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
      
      const formattedInvoice = {
        ...data,
        client_name: data.clients?.client_name
      };
      
      return formattedInvoice;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      return sampleInvoices.find(inv => inv.invoice_id === invoiceId) || null;
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
      return { ...invoiceData, invoice_id: Date.now(), created_at: new Date().toISOString() };
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
      const invoice = sampleInvoices.find(inv => inv.invoice_id === invoiceId);
      if (invoice) {
        invoice.status = status;
      }
      return invoice;
    }
  },
  
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    return {
      total_revenue: 12500,
      monthly_breakdown: [
        { month: "Jan", amount: 1200 },
        { month: "Feb", amount: 980 },
        { month: "Mar", amount: 1450 },
        { month: "Apr", amount: 1300 },
        { month: "May", amount: 2100 },
        { month: "Jun", amount: 1890 }
      ],
      top_clients: [
        { client_id: 1, client_name: "Social Land", total: 4500 },
        { client_id: 3, client_name: "AC Digital", total: 3200 },
        { client_id: 2, client_name: "Koala Digital", total: 2800 }
      ]
    };
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    return {
      total_expenses: 5830,
      monthly_breakdown: [
        { month: "Jan", amount: 780 },
        { month: "Feb", amount: 920 },
        { month: "Mar", amount: 850 },
        { month: "Apr", amount: 1100 },
        { month: "May", amount: 1080 },
        { month: "Jun", amount: 1100 }
      ],
      categories: [
        { category: "Rent", amount: 3900 },
        { category: "Utilities", amount: 720 },
        { category: "Supplies", amount: 450 },
        { category: "Subscriptions", amount: 760 }
      ]
    };
  },
  
  getFinancialRecords: async (recordType?: 'expense' | 'income') => {
    try {
      let query = supabase.from('financial_records').select('*');
      
      if (recordType) {
        query = query.eq('record_type', recordType);
      }
      
      const { data, error } = await query.order('record_date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return apiRequest('/finance/records', 'get', undefined, []);
    }
  },
  
  createFinancialRecord: async (recordData: any) => {
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
  
  getFinancialOverview: async () => {
    return apiRequest('/finance/overview', 'get', undefined, {
      total_revenue: 120000,
      total_expenses: 85000,
      profit_margin: 29.17,
      revenue_growth: 12.5,
      expense_growth: 8.2,
      profit_growth: 15.3,
      monthly_data: [
        // Mock monthly data
      ]
    });
  },
  
  getFinancialMetrics: async () => {
    return apiRequest('/finance/metrics', 'get', undefined, {
      revenue: 120000,
      expenses: 85000,
      profit: 35000,
      profit_margin: 29.17,
      revenue_growth: 12.5,
      expense_growth: 8.2,
      cash_flow: 42000,
      accounts_receivable: 28000,
      accounts_payable: 15000
    });
  },
  
  getUpsellOpportunities: async () => {
    return apiRequest('/finance/upsell', 'get', undefined, [
      {
        id: 1,
        client_name: 'Social Land',
        current_services: ['Website Design', 'SEO'],
        potential_services: ['Content Marketing', 'Social Media Management'],
        estimated_value: 6000
      },
      // More mock data
    ]);
  },
  
  analyzeTeamCosts: async (period: string) => {
    return apiRequest('/finance/team-costs', 'get', { period }, {
      total_cost: 85000,
      by_department: [
        { name: 'Design', value: 28000 },
        { name: 'Development', value: 35000 },
        { name: 'Marketing', value: 12000 },
        { name: 'Management', value: 10000 }
      ],
      by_project_type: [
        { name: 'Website', value: 40000 },
        { name: 'Mobile App', value: 20000 },
        { name: 'Branding', value: 15000 },
        { name: 'Maintenance', value: 10000 }
      ],
      cost_per_client: [
        { client: 'Social Land', cost: 25000, revenue: 35000, profit: 10000 },
        { client: 'Koala Digital', cost: 18000, revenue: 30000, profit: 12000 },
        { client: 'AC Digital', cost: 22000, revenue: 28000, profit: 6000 },
        { client: 'Muse Digital', cost: 20000, revenue: 27000, profit: 7000 }
      ]
    });
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    return apiRequest(`/invoices/${invoiceId}/send-reminder`, 'post', undefined, {
      success: true,
      message: 'Reminder sent successfully'
    });
  },
  
  getSalesMetrics: async () => {
    return apiRequest('/sales/metrics', 'get', undefined, {
      total_sales: 120000,
      sales_growth: 15.2,
      new_clients: 12,
      retention_rate: 85,
      conversion_rate: 28,
      average_deal_size: 8500,
      sales_cycle_length: 45
    });
  },
  
  getSalesTrends: async (period: string) => {
    return apiRequest('/sales/trends', 'get', { period }, {
      data: [
        { name: 'Jan', value: 65000 },
        { name: 'Feb', value: 72000 },
        { name: 'Mar', value: 68000 },
        { name: 'Apr', value: 82000 },
        { name: 'May', value: 88000 },
        { name: 'Jun', value: 95000 }
      ],
      insights: [
        'Sales are trending upward with a 15.2% increase YoY',
        'Q2 performance exceeded targets by 8%',
        'New client acquisition is the primary growth driver',
        'Recurring revenue accounts for 65% of total sales'
      ],
      activities: [
        { id: 1, title: 'Client Call - Koala Digital', date: 'June 25, 2023', time: '10:00 AM' },
        { id: 2, title: 'Proposal Review - AC Digital', date: 'June 26, 2023', time: '2:30 PM' },
        { id: 3, title: 'Contract Renewal - Social Land', date: 'June 28, 2023', time: '11:00 AM' }
      ]
    });
  },
  
  getSalesByChannel: async (period: string) => {
    return apiRequest('/sales/by-channel', 'get', { period }, [
      { name: 'Direct Sales', value: 45 },
      { name: 'Referrals', value: 25 },
      { name: 'Website', value: 15 },
      { name: 'Partners', value: 10 },
      { name: 'Social Media', value: 5 }
    ]);
  },
  
  getTopProducts: async (period: string) => {
    return apiRequest('/sales/top-products', 'get', { period }, [
      { id: 1, name: 'Website Design', sales: 32, units: 32, revenue: 320000, growth: 12 },
      { id: 2, name: 'SEO Services', sales: 28, units: 28, revenue: 168000, growth: 18 },
      { id: 3, name: 'Mobile App Development', sales: 15, units: 15, revenue: 225000, growth: 25 },
      { id: 4, name: 'Content Marketing', sales: 24, units: 24, revenue: 96000, growth: 8 },
      { id: 5, name: 'Branding Package', sales: 18, units: 18, revenue: 108000, growth: -5 }
    ]);
  },
  
  getSalesGrowthData: async (period: string) => {
    return apiRequest('/sales/growth-data', 'get', { period }, {
      trends: [
        { name: 'Jan', growth: 5 },
        { name: 'Feb', growth: 8 },
        { name: 'Mar', growth: 6 },
        { name: 'Apr', growth: 12 },
        { name: 'May', growth: 15 },
        { name: 'Jun', growth: 18 }
      ],
      currentPeriod: {
        revenueGrowth: 15.2,
        customerGrowth: 12.5
      },
      growthDrivers: [
        { factor: 'New Clients', impact: 45, performance: 'positive' },
        { factor: 'Upselling', impact: 30, performance: 'positive' },
        { factor: 'Retention', impact: 20, performance: 'neutral' },
        { factor: 'Pricing Strategy', impact: 5, performance: 'negative' }
      ]
    });
  },
  
  getSalesTargets: async (period: string) => {
    return apiRequest('/sales/targets', 'get', { period }, [
      { id: 1, category: 'Total Revenue', current: 950000, target: 1000000, percentage: 95 },
      { id: 2, category: 'New Clients', current: 12, target: 15, percentage: 80 },
      { id: 3, category: 'Recurring Revenue', current: 650000, target: 700000, percentage: 93 },
      { id: 4, category: 'Deal Conversion', current: 32, target: 40, percentage: 80 }
    ]);
  },
  
  getGrowthForecast: async (period: string) => {
    return apiRequest('/sales/growth-forecast', 'get', { period }, {
      chart: [
        { name: 'Jul', forecast: 100000, actual: 0 },
        { name: 'Aug', forecast: 110000, actual: 0 },
        { name: 'Sep', forecast: 115000, actual: 0 }
      ],
      insights: [
        { text: 'Projected 15% growth for Q3 based on current pipeline', type: 'positive' },
        { text: 'Potential market slowdown in September may impact targets', type: 'warning' },
        { text: 'New product launch expected to drive 8% additional growth', type: 'positive' }
      ]
    });
  },
  
  getWeeklyReports: async () => {
    return apiRequest('/sales/reports/weekly', 'get', undefined, [
      {
        id: 1,
        title: 'Weekly Sales Report',
        period: 'June 19-25, 2023',
        sales: 85000,
        target: 90000,
        progress: 94,
        performanceData: [
          { name: 'Mon', sales: 15000 },
          { name: 'Tue', sales: 18000 },
          { name: 'Wed', sales: 12000 },
          { name: 'Thu', sales: 16000 },
          { name: 'Fri', sales: 24000 }
        ],
        metrics: {
          conversionRate: 28,
          prevConversionRate: 25,
          avgSaleValue: 8500,
          prevAvgSaleValue: 8200,
          newLeads: 18,
          prevNewLeads: 15,
          closedDeals: 10,
          prevClosedDeals: 8
        }
      },
      // More mock data
    ]);
  },
  
  getMonthlyReports: async () => {
    return apiRequest('/sales/reports/monthly', 'get', undefined, [
      {
        id: 1,
        title: 'Monthly Sales Report',
        period: 'June 2023',
        sales: 380000,
        target: 400000,
        progress: 95,
        yearlyTrend: [
          { name: 'Jan', sales: 320000 },
          { name: 'Feb', sales: 340000 },
          { name: 'Mar', sales: 330000 },
          { name: 'Apr', sales: 350000 },
          { name: 'May', sales: 360000 },
          { name: 'Jun', sales: 380000 }
        ]
      },
      // More mock data
    ]);
  },
  
  getSalesFollowUps: async () => {
    return apiRequest('/sales/follow-ups', 'get', undefined, [
      {
        id: 1,
        clientName: 'Social Land',
        contactPerson: 'John Smith',
        type: 'call',
        dueDate: '2023-06-25',
        status: 'pending',
        notes: 'Follow up on proposal sent last week. Client expressed interest in website redesign package.',
        phone: '(555) 123-4567',
        email: 'john.smith@socialland.com'
      },
      // More mock data
    ]);
  },
  
  getImprovementSuggestions: async () => {
    return apiRequest('/sales/improvement-suggestions', 'get', undefined, [
      {
        id: 1,
        title: 'Optimize Follow-up Schedule',
        description: 'Current data shows a 35% higher conversion rate when following up within 48 hours of initial contact.',
        priority: 'high'
      },
      // More mock data
    ]);
  },
  
  completeFollowUp: async (followUpId: number, feedback: string) => {
    return apiRequest(`/sales/follow-ups/${followUpId}/complete`, 'post', { feedback }, {
      success: true,
      message: 'Follow-up marked as completed'
    });
  }
};

export default financeService;
