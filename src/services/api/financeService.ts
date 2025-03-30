
import { supabase } from '@/integrations/supabase/client';

// Define interfaces
export interface Invoice {
  invoice_id: number;
  client_id: number;
  invoice_number: string;
  amount: number;
  due_date?: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  client_name?: string;
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description?: string;
  record_date: string;
  created_at: string;
  category?: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  monthlyGrowth: number;
  averageInvoiceValue: number;
  outstandingInvoices: number;
  cashFlow: {
    month: string;
    income: number;
    expense: number;
    net: number;
  }[];
}

export interface SalesMetrics {
  totalSales: number;
  salesGrowth: number;
  conversionRate: number;
  customerAcquisitionCost: number;
  averageSaleValue: number;
  salesByChannel: {
    channel: string;
    amount: number;
    percentage: number;
  }[];
  topProducts: {
    name: string;
    sales: number;
    revenue: number;
  }[];
}

// Mock data generators
const generateMockFinancialOverview = () => ({
  totalRevenue: 125000,
  totalExpenses: 75000,
  netProfit: 50000,
  profitMargin: 40,
  revenueGrowth: 12.5,
  expenseGrowth: 5.2,
  topExpenseCategories: [
    { category: 'Salaries', amount: 45000, percentage: 60 },
    { category: 'Software', amount: 12000, percentage: 16 },
    { category: 'Marketing', amount: 10000, percentage: 13.3 },
    { category: 'Office', amount: 8000, percentage: 10.7 }
  ],
  revenueByClient: [
    { client: 'Acme Corp', amount: 35000, percentage: 28 },
    { client: 'Globex', amount: 30000, percentage: 24 },
    { client: 'Initech', amount: 25000, percentage: 20 },
    { client: 'Massive Dynamic', amount: 20000, percentage: 16 },
    { client: 'Others', amount: 15000, percentage: 12 }
  ],
  cashflow: [
    { month: 'Jan', income: 30000, expense: 25000, net: 5000 },
    { month: 'Feb', income: 32000, expense: 26000, net: 6000 },
    { month: 'Mar', income: 31000, expense: 24000, net: 7000 },
    { month: 'Apr', income: 35000, expense: 28000, net: 7000 },
    { month: 'May', income: 38000, expense: 30000, net: 8000 },
    { month: 'Jun', income: 40000, expense: 30000, net: 10000 }
  ]
});

const generateMockSalesFollowUps = () => [
  {
    id: 1,
    clientName: 'Acme Corp',
    contactPerson: 'John Smith',
    email: 'john@acmecorp.com',
    phone: '555-123-4567',
    type: 'call',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    notes: 'Follow up regarding the latest invoice payment and discuss upcoming projects.',
    status: 'pending'
  },
  {
    id: 2,
    clientName: 'Globex',
    contactPerson: 'Jane Doe',
    email: 'jane@globex.com',
    phone: '555-987-6543',
    type: 'email',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    notes: 'Send proposal for the new marketing campaign.',
    status: 'pending'
  },
  {
    id: 3,
    clientName: 'Initech',
    contactPerson: 'Mike Johnson',
    email: 'mike@initech.com',
    phone: '555-456-7890',
    type: 'meeting',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    notes: 'Quarterly review meeting to discuss ongoing projects and address any concerns.',
    status: 'pending'
  }
];

const financeService = {
  // Original methods
  getInvoices: async (status?: string) => {
    try {
      let query = supabase.from('invoices').select(`
        invoice_id,
        client_id, 
        invoice_number,
        amount,
        due_date,
        status,
        created_at,
        clients (client_name)
      `);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((invoice: any) => ({
        ...invoice,
        client_name: invoice.clients?.client_name
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },
  
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
      return data;
    } catch (error) {
      console.error(`Error fetching invoice ${invoiceId}:`, error);
      return null;
    }
  },
  
  createInvoice: async (invoiceData: Partial<Invoice>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select();
        
      if (error) throw error;
      return data[0];
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
      return data[0];
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },
  
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    // Implementation for revenue reports
    return [];
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    // Implementation for expense reports
    return [];
  },
  
  // New methods needed by components
  getFinancialOverview: async () => {
    // Mock data for financial overview
    return generateMockFinancialOverview();
  },
  
  getFinancialMetrics: async () => {
    // Mock financial metrics
    const metrics: FinancialMetrics = {
      totalRevenue: 520000,
      totalExpenses: 320000,
      netProfit: 200000,
      profitMargin: 38.5,
      monthlyGrowth: 5.2,
      averageInvoiceValue: 4500,
      outstandingInvoices: 12,
      cashFlow: [
        { month: 'Jan', income: 75000, expense: 50000, net: 25000 },
        { month: 'Feb', income: 78000, expense: 52000, net: 26000 },
        { month: 'Mar', income: 80000, expense: 53000, net: 27000 },
        { month: 'Apr', income: 82000, expense: 54000, net: 28000 },
        { month: 'May', income: 85000, expense: 55000, net: 30000 },
        { month: 'Jun', income: 90000, expense: 56000, net: 34000 }
      ]
    };
    return metrics;
  },
  
  getFinancialRecords: async () => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .order('record_date', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return [];
    }
  },
  
  createFinancialRecord: async (recordData: Partial<FinancialRecord>) => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .insert(recordData)
        .select();
        
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }
  },
  
  getUpsellOpportunities: async () => {
    // Return mock upsell opportunities
    return [
      {
        clientId: 1,
        clientName: 'Acme Corp',
        currentServices: ['Web Design', 'SEO'],
        recommendedServices: ['Content Marketing', 'Social Media Management'],
        potentialRevenue: 4500,
        probability: 0.7
      },
      {
        clientId: 2,
        clientName: 'Globex',
        currentServices: ['Logo Design', 'Branding'],
        recommendedServices: ['Web Design', 'Email Marketing'],
        potentialRevenue: 6000,
        probability: 0.8
      },
      {
        clientId: 3,
        clientName: 'Initech',
        currentServices: ['Social Media Management'],
        recommendedServices: ['Content Marketing', 'SEO'],
        potentialRevenue: 3500,
        probability: 0.6
      }
    ];
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    // Implementation for sending invoice reminders
    return { success: true, message: 'Reminder sent successfully' };
  },
  
  analyzeTeamCosts: async () => {
    // Implementation for team cost analysis
    return {
      totalCost: 125000,
      breakdown: [
        { department: 'Design', cost: 45000, percentage: 36 },
        { department: 'Development', cost: 55000, percentage: 44 },
        { department: 'Marketing', cost: 15000, percentage: 12 },
        { department: 'Admin', cost: 10000, percentage: 8 }
      ],
      trends: [
        { month: 'Jan', cost: 120000 },
        { month: 'Feb', cost: 122000 },
        { month: 'Mar', cost: 123000 },
        { month: 'Apr', cost: 124000 },
        { month: 'May', cost: 125000 }
      ]
    };
  },
  
  getSalesFollowUps: async () => {
    return generateMockSalesFollowUps();
  },
  
  getImprovementSuggestions: async () => {
    return [
      {
        id: 1,
        title: 'Introduce Early Payment Discounts',
        description: 'Offer a 2-3% discount for clients who pay invoices within 10 days to improve cash flow.',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Implement Automated Payment Reminders',
        description: 'Set up an automated system to send payment reminders 7 days before due date and follow-ups for late payments.',
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Review Service Pricing Structure',
        description: 'Current pricing is below market average. Consider a 5-10% increase for new clients.',
        priority: 'high'
      }
    ];
  },
  
  completeFollowUp: async (followUpId: number, feedback: string) => {
    // Implementation for completing follow-ups
    return { success: true };
  },
  
  getSalesGrowthData: async (dateRange: string) => {
    return {
      trends: [
        { date: '2023-01', revenue: 42000, target: 40000 },
        { date: '2023-02', revenue: 45000, target: 42000 },
        { date: '2023-03', revenue: 48000, target: 45000 },
        { date: '2023-04', revenue: 52000, target: 48000 },
        { date: '2023-05', revenue: 56000, target: 52000 },
        { date: '2023-06', revenue: 60000, target: 56000 }
      ],
      currentPeriod: {
        revenueGrowth: 8.2,
        customerGrowth: 12.5
      },
      growthDrivers: [
        { factor: 'Existing Client Expansion', impact: 45, performance: 'positive' },
        { factor: 'New Client Acquisition', impact: 30, performance: 'positive' },
        { factor: 'Price Increases', impact: 15, performance: 'neutral' },
        { factor: 'Service Additions', impact: 10, performance: 'positive' }
      ]
    };
  },
  
  getSalesTargets: async (dateRange: string) => {
    return [
      { id: 1, category: 'New Clients', current: 42000, target: 50000, percentage: 84 },
      { id: 2, category: 'Recurring Revenue', current: 85000, target: 80000, percentage: 106 },
      { id: 3, category: 'Upsells', current: 28000, target: 35000, percentage: 80 },
      { id: 4, category: 'Total Revenue', current: 155000, target: 165000, percentage: 94 }
    ];
  },
  
  getGrowthForecast: async (dateRange: string) => {
    return {
      chart: [
        { month: 'Jul', projected: 62000, target: 60000 },
        { month: 'Aug', projected: 65000, target: 62000 },
        { month: 'Sep', projected: 68000, target: 65000 },
        { month: 'Oct', projected: 72000, target: 68000 },
        { month: 'Nov', projected: 76000, target: 72000 },
        { month: 'Dec', projected: 80000, target: 76000 }
      ],
      insights: [
        { type: 'trend', text: 'Projected 8.2% growth in Q3 based on current trajectory and seasonal patterns.' },
        { type: 'trend', text: 'Service expansion opportunities could add an additional 5-7% growth in Q4.' },
        { type: 'warning', text: 'Client attrition rate slightly higher than previous year. Monitor closely.' }
      ]
    };
  },
  
  getWeeklyReports: async () => {
    return [
      {
        id: 1,
        title: 'Weekly Sales Report',
        period: 'Jun 10-16, 2023',
        sales: 18500,
        target: 18000,
        progress: 103,
        performanceData: [
          { day: 'Mon', sales: 3200 },
          { day: 'Tue', sales: 3600 },
          { day: 'Wed', sales: 3400 },
          { day: 'Thu', sales: 3100 },
          { day: 'Fri', sales: 3800 },
          { day: 'Sat', sales: 1200 },
          { day: 'Sun', sales: 200 }
        ],
        metrics: {
          conversionRate: 3.2,
          prevConversionRate: 2.9,
          avgSaleValue: 1250,
          prevAvgSaleValue: 1180,
          newLeads: 42,
          prevNewLeads: 38,
          closedDeals: 15,
          prevClosedDeals: 13
        }
      },
      {
        id: 2,
        title: 'Weekly Sales Report',
        period: 'Jun 3-9, 2023',
        sales: 17800,
        target: 17500,
        progress: 102,
        performanceData: [
          { day: 'Mon', sales: 3100 },
          { day: 'Tue', sales: 3400 },
          { day: 'Wed', sales: 3300 },
          { day: 'Thu', sales: 3200 },
          { day: 'Fri', sales: 3500 },
          { day: 'Sat', sales: 1100 },
          { day: 'Sun', sales: 200 }
        ],
        metrics: {
          conversionRate: 2.9,
          prevConversionRate: 2.7,
          avgSaleValue: 1180,
          prevAvgSaleValue: 1150,
          newLeads: 38,
          prevNewLeads: 35,
          closedDeals: 13,
          prevClosedDeals: 12
        }
      }
    ];
  },
  
  getMonthlyReports: async () => {
    return [
      {
        id: 1,
        title: 'Monthly Sales Report',
        period: 'June 2023',
        sales: 78500,
        target: 75000,
        progress: 105,
        yearlyTrend: [
          { month: 'Jan', sales: 65000 },
          { month: 'Feb', sales: 68000 },
          { month: 'Mar', sales: 70000 },
          { month: 'Apr', sales: 72000 },
          { month: 'May', sales: 75000 },
          { month: 'Jun', sales: 78500 }
        ]
      },
      {
        id: 2,
        title: 'Monthly Sales Report',
        period: 'May 2023',
        sales: 75000,
        target: 72000,
        progress: 104,
        yearlyTrend: [
          { month: 'Dec', sales: 62000 },
          { month: 'Jan', sales: 65000 },
          { month: 'Feb', sales: 68000 },
          { month: 'Mar', sales: 70000 },
          { month: 'Apr', sales: 72000 },
          { month: 'May', sales: 75000 }
        ]
      }
    ];
  },
  
  getSalesTrends: async (dateRange: string) => {
    return {
      trends: [
        { date: '2023-01', sales: 65000 },
        { date: '2023-02', sales: 68000 },
        { date: '2023-03', sales: 70000 },
        { date: '2023-04', sales: 72000 },
        { date: '2023-05', sales: 75000 },
        { date: '2023-06', sales: 78500 }
      ],
      insights: [
        'Sales have consistently grown by 3-4% month-over-month throughout Q2',
        'June exceeded targets by 5%, marking the best month of the year',
        'The new service package introduced in April has contributed to 15% of Q2 growth',
        'Recurring client revenue has increased 8% since January'
      ],
      activities: [
        {
          id: 1,
          title: 'Quarterly Client Review',
          date: 'July 5, 2023',
          time: '10:00 AM'
        },
        {
          id: 2,
          title: 'New Service Package Launch',
          date: 'July 12, 2023',
          time: '2:00 PM'
        },
        {
          id: 3,
          title: 'Sales Team Training',
          date: 'July 15, 2023',
          time: '9:00 AM'
        }
      ]
    };
  },
  
  getSalesByChannel: async (dateRange: string) => {
    return [
      { name: 'Direct Sales', value: 43 },
      { name: 'Referrals', value: 27 },
      { name: 'Website', value: 15 },
      { name: 'Social Media', value: 10 },
      { name: 'Partners', value: 5 }
    ];
  },
  
  getTopProducts: async (dateRange: string) => {
    return [
      {
        id: 1,
        name: 'Web Design Package',
        sales: 25,
        units: 25,
        revenue: 37500,
        growth: 12
      },
      {
        id: 2,
        name: 'SEO Services',
        sales: 18,
        units: 18,
        revenue: 27000,
        growth: 8
      },
      {
        id: 3,
        name: 'Content Marketing',
        sales: 15,
        units: 15,
        revenue: 22500,
        growth: 15
      },
      {
        id: 4,
        name: 'Social Media Management',
        sales: 12,
        units: 12,
        revenue: 18000,
        growth: 6
      },
      {
        id: 5,
        name: 'Logo & Branding',
        sales: 10,
        units: 10,
        revenue: 15000,
        growth: -3
      }
    ];
  },
  
  getSalesMetrics: async () => {
    const metrics: SalesMetrics = {
      totalSales: 580000,
      salesGrowth: 15.2,
      conversionRate: 3.8,
      customerAcquisitionCost: 350,
      averageSaleValue: 4800,
      salesByChannel: [
        { channel: 'Direct Sales', amount: 260000, percentage: 45 },
        { channel: 'Referrals', amount: 145000, percentage: 25 },
        { channel: 'Website', amount: 87000, percentage: 15 },
        { channel: 'Social Media', amount: 58000, percentage: 10 },
        { channel: 'Partners', amount: 30000, percentage: 5 }
      ],
      topProducts: [
        { name: 'Web Design Package', sales: 45, revenue: 112500 },
        { name: 'SEO Services', sales: 38, revenue: 95000 },
        { name: 'Content Marketing', sales: 32, revenue: 80000 }
      ]
    };
    return metrics;
  }
};

export default financeService;
