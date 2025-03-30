
import axios from 'axios';
import config from '@/config/config';
import { supabase } from '@/integrations/supabase/client';

export interface SalesMetrics {
  monthly_revenue: number;
  annual_target: number;
  growth_rate: number;
  conversion_rate: number;
  client_acquisition: number;
  avg_deal_size: number;
  top_performing_services: Array<{
    service: string;
    revenue: number;
    growth: number;
  }>;
  monthly_trend: Array<{
    month: string;
    revenue: number;
    target: number;
  }>;
  customer_retention_rate: number;
}

const api = axios.create({
  baseURL: config.apiUrl,
});

// Mock data for finance services until backend is connected
const mockInvoices = [
  {
    invoice_id: 1,
    client_id: 1,
    client_name: 'Acme Corp',
    invoice_number: 'INV-2023-001',
    amount: 2500.00,
    due_date: '2023-04-15',
    status: 'paid',
    created_at: '2023-03-15',
  },
  {
    invoice_id: 2,
    client_id: 2,
    client_name: 'Beta Industries',
    invoice_number: 'INV-2023-002',
    amount: 1800.00,
    due_date: '2023-04-20',
    status: 'pending',
    created_at: '2023-03-20',
  },
  {
    invoice_id: 3,
    client_id: 3,
    client_name: 'Gamma Solutions',
    invoice_number: 'INV-2023-003',
    amount: 3200.00,
    due_date: '2023-04-30',
    status: 'overdue',
    created_at: '2023-03-25',
  }
];

const mockFinancialRecords = [
  {
    record_id: 1,
    record_type: 'income',
    amount: 5000.00,
    description: 'Client payment - Acme Corp',
    record_date: '2023-03-15',
    created_at: '2023-03-15',
  },
  {
    record_id: 2,
    record_type: 'expense',
    amount: 1200.00,
    description: 'Office rent',
    record_date: '2023-03-01',
    created_at: '2023-03-01',
  },
  {
    record_id: 3,
    record_type: 'expense',
    amount: 350.00,
    description: 'Utilities',
    record_date: '2023-03-05',
    created_at: '2023-03-05',
  }
];

// Mock analytics data
const mockSalesMetrics = {
  monthly_revenue: 15000,
  annual_target: 200000,
  growth_rate: 12.5,
  conversion_rate: 28.3,
  client_acquisition: 5,
  avg_deal_size: 3000,
  top_performing_services: [
    { service: 'Web Design', revenue: 5000, growth: 15 },
    { service: 'Digital Marketing', revenue: 4000, growth: 10 },
    { service: 'SEO', revenue: 3000, growth: 8 }
  ],
  monthly_trend: [
    { month: 'Jan', revenue: 12000, target: 13000 },
    { month: 'Feb', revenue: 13500, target: 13500 },
    { month: 'Mar', revenue: 15000, target: 14000 },
  ],
  customer_retention_rate: 85
};

// Finance Service API
const financeService = {
  // Invoice Management
  getInvoices: async (status?: string) => {
    try {
      if (config.useRealApi) {
        const response = await api.get(`/finance/invoices${status ? `?status=${status}` : ''}`);
        return response.data;
      }

      // Mock response
      if (status) {
        return mockInvoices.filter(invoice => invoice.status === status);
      }
      return mockInvoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return mockInvoices; // Fallback to mock data
    }
  },

  getInvoiceDetails: async (invoiceId: number) => {
    try {
      if (config.useRealApi) {
        const response = await api.get(`/finance/invoices/${invoiceId}`);
        return response.data;
      }

      // Mock response
      return mockInvoices.find(invoice => invoice.invoice_id === invoiceId);
    } catch (error) {
      console.error(`Error fetching invoice ${invoiceId}:`, error);
      // Fallback to mock data
      return mockInvoices.find(invoice => invoice.invoice_id === invoiceId);
    }
  },

  createInvoice: async (invoiceData: any) => {
    try {
      if (config.useRealApi) {
        const response = await api.post('/finance/invoices', invoiceData);
        return response.data;
      }

      // Mock response
      const newInvoice = {
        invoice_id: mockInvoices.length + 1,
        ...invoiceData,
        created_at: new Date().toISOString()
      };
      mockInvoices.push(newInvoice);
      return newInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      if (config.useRealApi) {
        const response = await api.patch(`/finance/invoices/${invoiceId}`, { status });
        return response.data;
      }

      // Mock response
      const invoice = mockInvoices.find(inv => inv.invoice_id === invoiceId);
      if (invoice) {
        invoice.status = status;
        return invoice;
      }
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    } catch (error) {
      console.error(`Error updating invoice ${invoiceId}:`, error);
      throw error;
    }
  },

  // Send invoice reminder
  sendInvoiceReminder: async (invoiceId: number, message?: string) => {
    try {
      if (config.useRealApi) {
        const response = await api.post(`/finance/invoices/${invoiceId}/remind`, { message });
        return response.data;
      }

      // Mock response
      return { success: true, message: 'Reminder sent successfully' };
    } catch (error) {
      console.error(`Error sending reminder for invoice ${invoiceId}:`, error);
      throw error;
    }
  },

  // Financial Records Management
  getFinancialRecords: async (type?: string, startDate?: string, endDate?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/records';
        const params = [];
        if (type) params.push(`type=${type}`);
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        const response = await api.get(url);
        return response.data;
      }

      // Mock response
      let records = [...mockFinancialRecords];
      if (type) {
        records = records.filter(record => record.record_type === type);
      }
      if (startDate) {
        records = records.filter(record => record.record_date >= startDate);
      }
      if (endDate) {
        records = records.filter(record => record.record_date <= endDate);
      }
      return records;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return mockFinancialRecords; // Fallback to mock data
    }
  },

  createFinancialRecord: async (recordData: any) => {
    try {
      if (config.useRealApi) {
        const response = await api.post('/finance/records', recordData);
        return response.data;
      }

      // Mock response
      const newRecord = {
        record_id: mockFinancialRecords.length + 1,
        ...recordData,
        created_at: new Date().toISOString()
      };
      mockFinancialRecords.push(newRecord);
      return newRecord;
    } catch (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }
  },

  // Reports and Analytics
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/reports/revenue';
        if (startDate && endDate) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        const response = await api.get(url);
        return response.data;
      }

      // Mock response
      return {
        total_revenue: 45000,
        by_month: [
          { month: 'January', revenue: 12000 },
          { month: 'February', revenue: 15000 },
          { month: 'March', revenue: 18000 }
        ],
        by_client: [
          { client_name: 'Acme Corp', revenue: 20000 },
          { client_name: 'Beta Industries', revenue: 15000 },
          { client_name: 'Gamma Solutions', revenue: 10000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      return null;
    }
  },

  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/reports/expenses';
        if (startDate && endDate) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        const response = await api.get(url);
        return response.data;
      }

      // Mock response
      return {
        total_expenses: 25000,
        by_month: [
          { month: 'January', expenses: 7000 },
          { month: 'February', expenses: 8000 },
          { month: 'March', expenses: 10000 }
        ],
        by_category: [
          { category: 'Rent', expenses: 9000 },
          { category: 'Salaries', expenses: 12000 },
          { category: 'Utilities', expenses: 4000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      return null;
    }
  },

  // Team costs and analysis
  analyzeTeamCosts: async (departmentId?: number, period?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/analysis/team-costs';
        const params = [];
        if (departmentId) params.push(`departmentId=${departmentId}`);
        if (period) params.push(`period=${period}`);
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        const response = await api.get(url);
        return response.data;
      }

      // Mock response
      return {
        total_cost: 125000,
        by_department: [
          { department: 'Engineering', cost: 60000 },
          { department: 'Marketing', cost: 35000 },
          { department: 'Design', cost: 30000 }
        ],
        by_employee_type: [
          { type: 'Full-time', cost: 100000 },
          { type: 'Contract', cost: 25000 }
        ],
        by_month: [
          { month: 'January', cost: 40000 },
          { month: 'February', cost: 42000 },
          { month: 'March', cost: 43000 }
        ]
      };
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      return null;
    }
  },

  // Financial metrics and KPIs
  getFinancialMetrics: async () => {
    try {
      if (config.useRealApi) {
        const response = await api.get('/finance/metrics');
        return response.data;
      }

      // Mock response
      return {
        profitability: {
          gross_profit_margin: 60,
          net_profit_margin: 25,
          operating_margin: 35
        },
        liquidity: {
          current_ratio: 2.5,
          quick_ratio: 2.0,
          cash_ratio: 0.8
        },
        efficiency: {
          asset_turnover: 1.2,
          inventory_turnover: 6.5,
          days_sales_outstanding: 45
        },
        growth: {
          revenue_growth: 15,
          profit_growth: 12,
          asset_growth: 8
        }
      };
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      return null;
    }
  },

  // Financial overview
  getFinancialOverview: async (period?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/overview';
        if (period) {
          url += `?period=${period}`;
        }
        const response = await api.get(url);
        return response.data;
      }

      // Mock response
      return {
        revenue: 150000,
        expenses: 90000,
        profit: 60000,
        cash_flow: 45000,
        outstanding_invoices: 35000,
        upcoming_expenses: 25000,
        key_metrics: {
          profit_margin: 40,
          burn_rate: 30000,
          runway_months: 18
        }
      };
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      return null;
    }
  },

  // Upsell Opportunities
  getUpsellOpportunities: async () => {
    try {
      if (config.useRealApi) {
        const response = await api.get('/finance/upsell-opportunities');
        return response.data;
      }

      // Mock response
      return [
        {
          client_id: 1,
          client_name: 'Acme Corp',
          current_services: ['Web Design', 'SEO'],
          suggested_services: ['Digital Marketing', 'Content Creation'],
          potential_revenue: 5000,
          success_probability: 75
        },
        {
          client_id: 2,
          client_name: 'Beta Industries',
          current_services: ['Digital Marketing'],
          suggested_services: ['SEO', 'Web Maintenance'],
          potential_revenue: 3500,
          success_probability: 60
        }
      ];
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      return [];
    }
  },

  // Financial plans
  getFinancialPlans: async () => {
    try {
      if (config.useRealApi) {
        const response = await api.get('/finance/plans');
        return response.data;
      }

      // Mock response
      return [
        {
          plan_id: 1,
          title: 'Q2 2023 Financial Plan',
          description: 'Financial planning for Q2 2023',
          goals: [
            { title: 'Increase revenue by 15%', status: 'in_progress' },
            { title: 'Reduce operational costs by 10%', status: 'pending' }
          ],
          created_at: '2023-03-15'
        },
        {
          plan_id: 2,
          title: 'Annual Budget 2023',
          description: 'Annual budget planning for 2023',
          goals: [
            { title: 'Achieve $1M in annual revenue', status: 'in_progress' },
            { title: 'Maintain 35% profit margin', status: 'in_progress' }
          ],
          created_at: '2023-01-05'
        }
      ];
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      return [];
    }
  },
  
  // Sales metrics
  getSalesMetrics: async (period?: string): Promise<SalesMetrics> => {
    try {
      if (config.useRealApi) {
        let url = '/finance/sales/metrics';
        if (period) {
          url += `?period=${period}`;
        }
        const response = await api.get(url);
        return response.data;
      }
      
      // Return mock data
      return mockSalesMetrics;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      return mockSalesMetrics; // Fallback to mock data
    }
  },
  
  // Sales follow-ups
  getSalesFollowUps: async () => {
    try {
      if (config.useRealApi) {
        const response = await api.get('/finance/sales/follow-ups');
        return response.data;
      }
      
      // Mock response
      return [
        {
          id: 1,
          client_name: 'Acme Corp',
          contact_person: 'John Smith',
          follow_up_date: '2023-04-05',
          status: 'pending',
          notes: 'Discuss new website project',
          potential_value: 15000
        },
        {
          id: 2,
          client_name: 'Beta Industries',
          contact_person: 'Sarah Johnson',
          follow_up_date: '2023-04-07',
          status: 'pending',
          notes: 'Present marketing proposal',
          potential_value: 8000
        }
      ];
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      return [];
    }
  },
  
  completeFollowUp: async (followUpId: number, notes: string) => {
    try {
      if (config.useRealApi) {
        const response = await api.post(`/finance/sales/follow-ups/${followUpId}/complete`, { notes });
        return response.data;
      }
      
      // Mock response
      return { success: true, message: 'Follow-up marked as completed' };
    } catch (error) {
      console.error(`Error completing follow-up ${followUpId}:`, error);
      throw error;
    }
  },
  
  getImprovementSuggestions: async () => {
    try {
      if (config.useRealApi) {
        const response = await api.get('/finance/sales/improvement-suggestions');
        return response.data;
      }
      
      // Mock response
      return [
        {
          id: 1,
          title: 'Implement email follow-up sequence',
          description: 'Create an automated email sequence for following up with leads at 2, 7, and 14 days.',
          estimated_impact: 'Could increase conversion rate by 15%',
          difficulty: 'medium',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Adjust pricing strategy',
          description: 'Consider offering tiered pricing options to capture more budget-conscious clients.',
          estimated_impact: 'Potential 10% increase in client acquisition',
          difficulty: 'high',
          priority: 'medium'
        }
      ];
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      return [];
    }
  },
  
  // Sales growth tracking
  getSalesGrowthData: async (period?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/sales/growth';
        if (period) {
          url += `?period=${period}`;
        }
        const response = await api.get(url);
        return response.data;
      }
      
      // Mock response
      return {
        year_over_year_growth: 22.5,
        quarter_over_quarter_growth: 7.8,
        monthly_data: [
          { month: 'January', revenue: 120000, growth_rate: 5.2 },
          { month: 'February', revenue: 135000, growth_rate: 12.5 },
          { month: 'March', revenue: 150000, growth_rate: 11.1 }
        ],
        by_service: [
          { service: 'Web Design', growth_rate: 25 },
          { service: 'Digital Marketing', growth_rate: 18 },
          { service: 'SEO', growth_rate: 15 }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return null;
    }
  },
  
  getSalesTargets: async (period?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/sales/targets';
        if (period) {
          url += `?period=${period}`;
        }
        const response = await api.get(url);
        return response.data;
      }
      
      // Mock response
      return {
        current_month: { target: 160000, actual: 150000, progress: 93.75 },
        current_quarter: { target: 450000, actual: 405000, progress: 90 },
        current_year: { target: 1800000, actual: 1050000, progress: 58.3 },
        by_service: [
          { service: 'Web Design', target: 60000, actual: 55000, progress: 91.7 },
          { service: 'Digital Marketing', target: 50000, actual: 48000, progress: 96 },
          { service: 'SEO', target: 40000, actual: 35000, progress: 87.5 }
        ],
        by_team_member: [
          { name: 'John Smith', target: 40000, actual: 38000, progress: 95 },
          { name: 'Sarah Johnson', target: 35000, actual: 32000, progress: 91.4 },
          { name: 'Michael Brown', target: 30000, actual: 25000, progress: 83.3 }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return null;
    }
  },
  
  getGrowthForecast: async (months: number = 12) => {
    try {
      if (config.useRealApi) {
        const response = await api.get(`/finance/sales/forecast?months=${months}`);
        return response.data;
      }
      
      // Mock response
      const forecast = [];
      let currentRevenue = 150000;
      const growthRate = 0.05; // 5% monthly growth
      
      for (let i = 0; i < months; i++) {
        const month = new Date();
        month.setMonth(month.getMonth() + i + 1);
        currentRevenue = currentRevenue * (1 + growthRate);
        
        forecast.push({
          month: month.toLocaleString('default', { month: 'long', year: 'numeric' }),
          projected_revenue: Math.round(currentRevenue),
          best_case: Math.round(currentRevenue * 1.1),
          worst_case: Math.round(currentRevenue * 0.9)
        });
      }
      
      return {
        forecast,
        average_monthly_growth: 5,
        confidence_score: 85
      };
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      return null;
    }
  },
  
  // Sales reporting
  getWeeklyReports: async (startDate?: string, endDate?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/sales/reports/weekly';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        const response = await api.get(url);
        return response.data;
      }
      
      // Mock response
      return [
        {
          week: 'Mar 20-26, 2023',
          revenue: 35000,
          new_clients: 2,
          deals_closed: 3,
          average_deal_size: 11666.67,
          conversion_rate: 30,
          top_performer: 'John Smith'
        },
        {
          week: 'Mar 27-Apr 2, 2023',
          revenue: 42000,
          new_clients: 3,
          deals_closed: 4,
          average_deal_size: 10500,
          conversion_rate: 35,
          top_performer: 'Sarah Johnson'
        }
      ];
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      return [];
    }
  },
  
  getMonthlyReports: async (year?: number) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/sales/reports/monthly';
        if (year) {
          url += `?year=${year}`;
        }
        const response = await api.get(url);
        return response.data;
      }
      
      // Mock response
      return [
        {
          month: 'January 2023',
          revenue: 120000,
          new_clients: 8,
          deals_closed: 12,
          average_deal_size: 10000,
          conversion_rate: 28,
          top_performer: 'John Smith'
        },
        {
          month: 'February 2023',
          revenue: 135000,
          new_clients: 9,
          deals_closed: 14,
          average_deal_size: 9643,
          conversion_rate: 32,
          top_performer: 'Sarah Johnson'
        },
        {
          month: 'March 2023',
          revenue: 150000,
          new_clients: 10,
          deals_closed: 15,
          average_deal_size: 10000,
          conversion_rate: 35,
          top_performer: 'John Smith'
        }
      ];
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      return [];
    }
  },
  
  // Sales analysis
  getSalesTrends: async (period?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/sales/trends';
        if (period) {
          url += `?period=${period}`;
        }
        const response = await api.get(url);
        return response.data;
      }
      
      // Mock response
      return {
        revenue_trend: [
          { month: 'January', value: 120000 },
          { month: 'February', value: 135000 },
          { month: 'March', value: 150000 }
        ],
        conversion_trend: [
          { month: 'January', value: 28 },
          { month: 'February', value: 32 },
          { month: 'March', value: 35 }
        ],
        average_deal_size_trend: [
          { month: 'January', value: 10000 },
          { month: 'February', value: 9643 },
          { month: 'March', value: 10000 }
        ],
        seasonal_patterns: {
          strong_months: ['March', 'June', 'October'],
          weak_months: ['January', 'August', 'December']
        }
      };
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return null;
    }
  },
  
  getSalesByChannel: async (period?: string) => {
    try {
      if (config.useRealApi) {
        let url = '/finance/sales/by-channel';
        if (period) {
          url += `?period=${period}`;
        }
        const response = await api.get(url);
        return response.data;
      }
      
      // Mock response
      return [
        { channel: 'Website', revenue: 60000, deals: 6, conversion_rate: 30 },
        { channel: 'Referrals', revenue: 45000, deals: 4, conversion_rate: 40 },
        { channel: 'Direct', revenue: 30000, deals: 3, conversion_rate: 35 },
        { channel: 'Social Media', revenue: 15000, deals: 2, conversion_rate: 25 }
      ];
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return [];
    }
  },
  
  getTopProducts: async (limit: number = 5) => {
    try {
      if (config.useRealApi) {
        const response = await api.get(`/finance/sales/top-products?limit=${limit}`);
        return response.data;
      }
      
      // Mock response
      return [
        { product: 'Website Design', revenue: 60000, count: 6, growth: 15 },
        { product: 'SEO Package', revenue: 45000, count: 9, growth: 12 },
        { product: 'Social Media Management', revenue: 30000, count: 5, growth: 10 },
        { product: 'Content Creation', revenue: 15000, count: 3, growth: 8 },
        { product: 'Email Marketing', revenue: 10000, count: 2, growth: 5 }
      ];
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  }
};

export default financeService;
