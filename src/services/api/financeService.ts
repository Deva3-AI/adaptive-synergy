
import { supabase } from '@/integrations/supabase/client';
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  invoice_id: number;
  client_id: number;
  client_name?: string;
  invoice_number: string;
  amount: number;
  due_date: Date | string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: Date | string;
  items?: Array<{
    id: number;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  record_date: Date | string;
  created_at?: Date | string;
  category?: string;
  payment_method?: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  accountsReceivable: number;
  accountsPayable: number;
  cashFlow: number;
  revenueGrowth: number;
  expenseGrowth: number;
  outstandingInvoices: number;
}

export interface SalesMetrics {
  totalSales: number;
  salesGrowth: number;
  averageDealSize: number;
  conversionRate: number;
  leadToSaleTime: number;
  topCustomers: Array<{
    id: number;
    name: string;
    revenue: number;
  }>;
  salesByChannel: Array<{
    channel: string;
    value: number;
  }>;
  salesByProduct: Array<{
    product: string;
    value: number;
  }>;
}

const financeService = {
  getInvoices: async (status?: string) => {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          invoice_id,
          invoice_number,
          amount,
          due_date,
          status,
          created_at,
          client_id,
          clients (client_name)
        `);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((invoice: any) => ({
        invoice_id: invoice.invoice_id,
        invoice_number: invoice.invoice_number,
        amount: invoice.amount,
        due_date: invoice.due_date,
        status: invoice.status,
        created_at: invoice.created_at,
        client_id: invoice.client_id,
        client_name: invoice.clients?.client_name
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return apiClient.get('/invoices', { params: { status } }).then(res => res.data);
    }
  },

  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          invoice_id,
          invoice_number,
          amount,
          due_date,
          status,
          created_at,
          client_id,
          clients (client_name)
        `)
        .eq('invoice_id', invoiceId)
        .single();

      if (error) throw error;

      // Mock invoice items as they might not exist in the database
      const items = [
        {
          id: 1,
          description: 'Web Design Service',
          quantity: 1,
          rate: data.amount * 0.7,
          amount: data.amount * 0.7
        },
        {
          id: 2,
          description: 'SEO Optimization',
          quantity: 1,
          rate: data.amount * 0.3,
          amount: data.amount * 0.3
        }
      ];

      return {
        ...data,
        client_name: data.clients?.client_name,
        items
      };
    } catch (error) {
      console.error(`Error fetching invoice ${invoiceId}:`, error);
      return apiClient.get(`/invoices/${invoiceId}`).then(res => res.data);
    }
  },

  createInvoice: async (invoiceData: Omit<Invoice, 'invoice_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating invoice:', error);
      return apiClient.post('/invoices', invoiceData).then(res => res.data);
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
      console.error(`Error updating invoice ${invoiceId} status:`, error);
      return apiClient.put(`/invoices/${invoiceId}/status`, { status }).then(res => res.data);
    }
  },

  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      // This would typically call an API to send an email or notification
      // For now, let's just simulate a successful reminder send
      console.log(`Sending reminder for invoice ${invoiceId}`);
      return { success: true, message: 'Reminder sent successfully' };
    } catch (error) {
      console.error(`Error sending reminder for invoice ${invoiceId}:`, error);
      return apiClient.post(`/invoices/${invoiceId}/send-reminder`).then(res => res.data);
    }
  },

  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/reports/revenue';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      // Simulate revenue data
      const data = {
        totalRevenue: 125000,
        revenueByMonth: [
          { month: 'Jan', amount: 8000 },
          { month: 'Feb', amount: 9500 },
          { month: 'Mar', amount: 11000 },
          { month: 'Apr', amount: 10500 },
          { month: 'May', amount: 12500 },
          { month: 'Jun', amount: 14000 },
        ],
        revenueByClient: [
          { client: 'Client A', amount: 45000 },
          { client: 'Client B', amount: 35000 },
          { client: 'Client C', amount: 25000 },
          { client: 'Client D', amount: 20000 },
        ],
        revenueByService: [
          { service: 'Web Design', amount: 55000 },
          { service: 'Development', amount: 45000 },
          { service: 'SEO', amount: 25000 },
        ],
        growthRate: 15.2
      };
      
      return data;
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      return apiClient.get('/reports/revenue', {
        params: { startDate, endDate }
      }).then(res => res.data);
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/reports/expenses';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      // Simulate expense data
      const data = {
        totalExpenses: 85000,
        expensesByMonth: [
          { month: 'Jan', amount: 6000 },
          { month: 'Feb', amount: 6500 },
          { month: 'Mar', amount: 7000 },
          { month: 'Apr', amount: 7500 },
          { month: 'May', amount: 8000 },
          { month: 'Jun', amount: 8500 },
        ],
        expensesByCategory: [
          { category: 'Salaries', amount: 45000 },
          { category: 'Office', amount: 15000 },
          { category: 'Marketing', amount: 12000 },
          { category: 'Software', amount: 8000 },
          { category: 'Other', amount: 5000 },
        ],
        largestExpenses: [
          { description: 'Quarterly Bonuses', amount: 12000, date: '2023-03-15' },
          { description: 'Office Rent', amount: 4500, date: '2023-06-01' },
          { description: 'Software Licenses', amount: 3500, date: '2023-05-10' },
        ]
      };
      
      return data;
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      return apiClient.get('/reports/expenses', {
        params: { startDate, endDate }
      }).then(res => res.data);
    }
  },

  getFinancialRecords: async (type?: 'expense' | 'income', startDate?: string, endDate?: string) => {
    try {
      let query = supabase
        .from('financial_records')
        .select('*');

      if (type) {
        query = query.eq('record_type', type);
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
      // Return mock data for now
      return [
        {
          record_id: 1,
          record_type: 'income',
          amount: 5000,
          description: 'Client payment - Project A',
          record_date: '2023-07-15',
          created_at: '2023-07-15T10:30:00Z',
          category: 'Services',
          payment_method: 'Bank Transfer'
        },
        {
          record_id: 2,
          record_type: 'expense',
          amount: 500,
          description: 'Office supplies',
          record_date: '2023-07-10',
          created_at: '2023-07-10T14:15:00Z',
          category: 'Office',
          payment_method: 'Credit Card'
        }
      ];
    }
  },

  createFinancialRecord: async (recordData: Omit<FinancialRecord, 'record_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .insert({
          ...recordData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating financial record:', error);
      // Return mock data
      return {
        ...recordData,
        record_id: Math.floor(Math.random() * 1000),
        created_at: new Date().toISOString()
      };
    }
  },

  getFinancialOverview: async (period: 'month' | 'quarter' | 'year' = 'month') => {
    try {
      // This would normally fetch aggregated financial data
      // For now, return mock data
      return {
        revenue: 125000,
        expenses: 85000,
        profit: 40000,
        profitMargin: 32,
        outstandingInvoices: {
          count: 12,
          value: 35500
        },
        compareToLast: {
          revenue: 15.5,
          expenses: 8.2,
          profit: 23.1
        },
        recentTransactions: [
          {
            id: 1,
            type: 'income',
            description: 'Client payment - Project X',
            amount: 8500,
            date: '2023-07-20'
          },
          {
            id: 2,
            type: 'expense',
            description: 'Software subscription',
            amount: 1200,
            date: '2023-07-18'
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      return apiClient.get('/finance/overview', { params: { period } }).then(res => res.data);
    }
  },

  getFinancialMetrics: async (period: 'month' | 'quarter' | 'year' = 'month') => {
    try {
      // This would normally calculate metrics from financial records
      // For now, return mock data
      const metrics: FinancialMetrics = {
        totalRevenue: 125000,
        totalExpenses: 85000,
        netProfit: 40000,
        profitMargin: 32,
        accountsReceivable: 35500,
        accountsPayable: 12500,
        cashFlow: 28000,
        revenueGrowth: 15.5,
        expenseGrowth: 8.2,
        outstandingInvoices: 12
      };
      
      return metrics;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      return apiClient.get('/finance/metrics', { params: { period } }).then(res => res.data);
    }
  },

  getUpsellOpportunities: async () => {
    try {
      // This would normally analyze client data to find upsell opportunities
      // For now, return mock data
      return [
        {
          client_id: 1,
          client_name: 'ABC Corp',
          current_services: ['Web Design', 'SEO'],
          potential_services: ['Content Marketing', 'Social Media Management'],
          estimated_value: 2500,
          last_purchase: '2023-06-15'
        },
        {
          client_id: 2,
          client_name: 'XYZ Ltd',
          current_services: ['Web Development'],
          potential_services: ['Maintenance Plan', 'SEO'],
          estimated_value: 1800,
          last_purchase: '2023-07-01'
        }
      ];
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      return apiClient.get('/finance/upsell-opportunities').then(res => res.data);
    }
  },

  analyzeTeamCosts: async (startDate?: string, endDate?: string) => {
    try {
      // This would normally calculate team costs from employee data and tasks
      // For now, return mock data
      return {
        totalCost: 65000,
        costByTeam: [
          { team: 'Development', cost: 25000 },
          { team: 'Design', cost: 18000 },
          { team: 'Marketing', cost: 12000 },
          { team: 'Management', cost: 10000 }
        ],
        costByProject: [
          { project: 'Project A', cost: 22000 },
          { project: 'Project B', cost: 18000 },
          { project: 'Project C', cost: 15000 },
          { project: 'Other', cost: 10000 }
        ],
        employeeCosts: [
          { employee: 'John Doe', cost: 8500, billableHours: 160 },
          { employee: 'Jane Smith', cost: 7800, billableHours: 150 },
          { employee: 'Bob Johnson', cost: 6500, billableHours: 130 }
        ],
        utilization: 85
      };
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      return apiClient.get('/finance/team-costs', {
        params: { startDate, endDate }
      }).then(res => res.data);
    }
  },

  getFinancialPlans: async () => {
    try {
      // This would normally get stored financial plans
      // For now, return mock data
      return [
        {
          id: 1,
          title: 'Q3 Growth Plan',
          description: 'Strategic focus on increasing revenue through upselling and new client acquisition',
          targets: {
            revenue: 150000,
            newClients: 5,
            profitMargin: 35
          },
          actions: [
            'Launch referral program',
            'Implement new service packages',
            'Optimize expense categories'
          ],
          created_at: '2023-06-30T00:00:00Z'
        },
        {
          id: 2,
          title: 'Cost Optimization Initiative',
          description: 'Focus on improving profitability through strategic cost reductions',
          targets: {
            expenseReduction: 10000,
            profitMargin: 38,
            efficiencyGain: 15
          },
          actions: [
            'Review and optimize software subscriptions',
            'Negotiate with vendors',
            'Improve team utilization'
          ],
          created_at: '2023-07-15T00:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      return apiClient.get('/finance/plans').then(res => res.data);
    }
  },

  // Sales-related functions
  getSalesMetrics: async (period: 'month' | 'quarter' | 'year' = 'month') => {
    try {
      // This would normally calculate metrics from sales data
      // For now, return mock data
      const metrics: SalesMetrics = {
        totalSales: 125000,
        salesGrowth: 15.5,
        averageDealSize: 8500,
        conversionRate: 22,
        leadToSaleTime: 21, // days
        topCustomers: [
          { id: 1, name: 'ABC Corp', revenue: 25000 },
          { id: 2, name: 'XYZ Ltd', revenue: 18500 },
          { id: 3, name: 'Acme Inc', revenue: 15000 }
        ],
        salesByChannel: [
          { channel: 'Direct', value: 65000 },
          { channel: 'Referral', value: 35000 },
          { channel: 'Online', value: 25000 }
        ],
        salesByProduct: [
          { product: 'Web Development', value: 55000 },
          { product: 'Design Services', value: 38000 },
          { product: 'Maintenance', value: 32000 }
        ]
      };
      
      return metrics;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      return apiClient.get('/sales/metrics', { params: { period } }).then(res => res.data);
    }
  },

  getSalesFollowUps: async () => {
    try {
      // This would normally get pending sales follow-ups
      // For now, return mock data
      return [
        {
          id: 1,
          client: 'ABC Corp',
          contact: 'John Smith',
          email: 'john@abccorp.com',
          phone: '555-1234',
          last_contact: '2023-07-10',
          notes: 'Discussed package upgrades, follow up with proposal',
          priority: 'high'
        },
        {
          id: 2,
          client: 'XYZ Ltd',
          contact: 'Jane Doe',
          email: 'jane@xyzltd.com',
          phone: '555-5678',
          last_contact: '2023-07-15',
          notes: 'Sent initial proposal, follow up to address questions',
          priority: 'medium'
        }
      ];
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      return apiClient.get('/sales/follow-ups').then(res => res.data);
    }
  },

  getImprovementSuggestions: async () => {
    try {
      // This would normally analyze sales data to generate suggestions
      // For now, return mock data
      return [
        {
          id: 1,
          area: 'Lead Response Time',
          current: '24 hours',
          target: '4 hours',
          impact: 'high',
          suggestion: 'Implement automated initial response system'
        },
        {
          id: 2,
          area: 'Proposal Conversion Rate',
          current: '22%',
          target: '30%',
          impact: 'high',
          suggestion: 'Add case studies and social proof to proposals'
        },
        {
          id: 3,
          area: 'Follow-up Frequency',
          current: '2 per month',
          target: '4 per month',
          impact: 'medium',
          suggestion: 'Create follow-up templates and scheduled reminders'
        }
      ];
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      return apiClient.get('/sales/improvement-suggestions').then(res => res.data);
    }
  },

  completeFollowUp: async (followUpId: number, outcome: string, notes: string) => {
    try {
      // This would normally update a follow-up status
      // For now, simulate success
      console.log(`Completing follow-up ${followUpId} with outcome: ${outcome}`);
      return {
        id: followUpId,
        completed: true,
        completed_at: new Date().toISOString(),
        outcome,
        notes
      };
    } catch (error) {
      console.error(`Error completing follow-up ${followUpId}:`, error);
      return apiClient.put(`/sales/follow-ups/${followUpId}/complete`, {
        outcome,
        notes
      }).then(res => res.data);
    }
  },

  getSalesGrowthData: async (period: 'month' | 'quarter' | 'year' = 'month') => {
    try {
      // This would normally get historical sales growth data
      // For now, return mock data
      return {
        overall: {
          current: 125000,
          previous: 108000,
          growth: 15.7,
          target: 135000
        },
        byMonth: [
          { month: 'Jan', value: 18000, growth: 12.5 },
          { month: 'Feb', value: 19500, growth: 8.3 },
          { month: 'Mar', value: 21000, growth: 7.7 },
          { month: 'Apr', value: 20500, growth: -2.4 },
          { month: 'May', value: 22500, growth: 9.8 },
          { month: 'Jun', value: 23500, growth: 4.4 }
        ],
        byService: [
          { service: 'Web Development', current: 55000, previous: 48000, growth: 14.6 },
          { service: 'Design', current: 38000, previous: 32000, growth: 18.8 },
          { service: 'Maintenance', current: 32000, previous: 28000, growth: 14.3 }
        ],
        byClient: [
          { client: 'ABC Corp', current: 25000, previous: 20000, growth: 25.0 },
          { client: 'XYZ Ltd', current: 18500, previous: 16000, growth: 15.6 },
          { client: 'Acme Inc', current: 15000, previous: 14000, growth: 7.1 }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return apiClient.get('/sales/growth', { params: { period } }).then(res => res.data);
    }
  },

  getSalesTargets: async (period: 'month' | 'quarter' | 'year' = 'month') => {
    try {
      // This would normally get sales targets from a database
      // For now, return mock data
      return {
        overall: {
          target: 135000,
          actual: 125000,
          progress: 92.6
        },
        byTeamMember: [
          { name: 'John Doe', target: 45000, actual: 42000, progress: 93.3 },
          { name: 'Jane Smith', target: 40000, actual: 38000, progress: 95.0 },
          { name: 'Bob Johnson', target: 35000, actual: 30000, progress: 85.7 },
          { name: 'Alice Williams', target: 15000, actual: 15000, progress: 100.0 }
        ],
        byService: [
          { service: 'Web Development', target: 60000, actual: 55000, progress: 91.7 },
          { service: 'Design', target: 40000, actual: 38000, progress: 95.0 },
          { service: 'Maintenance', target: 35000, actual: 32000, progress: 91.4 }
        ],
        newBusinessTarget: {
          target: 50000,
          actual: 42000,
          progress: 84.0
        }
      };
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return apiClient.get('/sales/targets', { params: { period } }).then(res => res.data);
    }
  },

  getGrowthForecast: async (months: number = 12) => {
    try {
      // This would normally use historical data to generate forecasts
      // For now, return mock data
      return {
        forecastPeriod: `${months} months`,
        baselineRevenue: 125000,
        forecastedRevenue: 180000,
        growthRate: 44.0,
        monthlyForecast: [
          { month: 'Jul', value: 24500 },
          { month: 'Aug', value: 25000 },
          { month: 'Sep', value: 25500 },
          { month: 'Oct', value: 26000 },
          { month: 'Nov', value: 26500 },
          { month: 'Dec', value: 27000 },
          { month: 'Jan', value: 27500 }
        ],
        growthFactors: [
          { factor: 'New clients', impact: 40 },
          { factor: 'Upselling', impact: 35 },
          { factor: 'Recurring revenue', impact: 25 }
        ],
        recommendations: [
          'Focus on high-value client acquisition',
          'Develop structured upselling program',
          'Create more recurring revenue services'
        ]
      };
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      return apiClient.get('/sales/forecast', { params: { months } }).then(res => res.data);
    }
  },

  getWeeklyReports: async () => {
    try {
      // This would normally generate reports from weekly data
      // For now, return mock data
      return [
        {
          id: 1,
          week: 'Jul 1 - Jul 7, 2023',
          revenue: 24500,
          new_clients: 1,
          deals_closed: 3,
          key_activities: [
            'Closed deal with ABC Corp',
            'Sent 5 new proposals',
            'Conducted 8 discovery calls'
          ],
          performance: {
            vs_target: 105,
            vs_last_week: 108
          }
        },
        {
          id: 2,
          week: 'Jul 8 - Jul 14, 2023',
          revenue: 26000,
          new_clients: 2,
          deals_closed: 4,
          key_activities: [
            'Closed deals with XYZ Ltd and Acme Inc',
            'Sent 7 new proposals',
            'Conducted 10 discovery calls'
          ],
          performance: {
            vs_target: 112,
            vs_last_week: 106
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      return apiClient.get('/sales/reports/weekly').then(res => res.data);
    }
  },

  getMonthlyReports: async () => {
    try {
      // This would normally generate reports from monthly data
      // For now, return mock data
      return [
        {
          id: 1,
          month: 'June 2023',
          revenue: 105000,
          expenses: 72000,
          profit: 33000,
          new_clients: 4,
          deals_closed: 12,
          key_metrics: {
            revenue_growth: 8.2,
            profit_margin: 31.4,
            avg_deal_size: 8750
          },
          top_performers: [
            { name: 'John Doe', revenue: 35000 },
            { name: 'Jane Smith', revenue: 32000 }
          ]
        },
        {
          id: 2,
          month: 'May 2023',
          revenue: 97000,
          expenses: 68000,
          profit: 29000,
          new_clients: 3,
          deals_closed: 10,
          key_metrics: {
            revenue_growth: 5.4,
            profit_margin: 29.9,
            avg_deal_size: 9700
          },
          top_performers: [
            { name: 'Jane Smith', revenue: 33000 },
            { name: 'John Doe', revenue: 30000 }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      return apiClient.get('/sales/reports/monthly').then(res => res.data);
    }
  },

  getSalesTrends: async () => {
    try {
      // This would normally analyze sales data for trends
      // For now, return mock data
      return {
        revenue_trend: [
          { month: 'Jan', value: 85000 },
          { month: 'Feb', value: 88000 },
          { month: 'Mar', value: 92000 },
          { month: 'Apr', value: 90000 },
          { month: 'May', value: 95000 },
          { month: 'Jun', value: 105000 }
        ],
        deal_size_trend: [
          { month: 'Jan', value: 7800 },
          { month: 'Feb', value: 8000 },
          { month: 'Mar', value: 8200 },
          { month: 'Apr', value: 8100 },
          { month: 'May', value: 8500 },
          { month: 'Jun', value: 8750 }
        ],
        conversion_rate_trend: [
          { month: 'Jan', value: 18 },
          { month: 'Feb', value: 19 },
          { month: 'Mar', value: 20 },
          { month: 'Apr', value: 19 },
          { month: 'May', value: 21 },
          { month: 'Jun', value: 22 }
        ],
        insights: [
          'Consistent revenue growth over the past 6 months',
          'Average deal size has increased by 12%',
          'Conversion rate shows positive trend'
        ]
      };
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return apiClient.get('/sales/trends').then(res => res.data);
    }
  },

  getSalesByChannel: async () => {
    try {
      // This would normally analyze sales data by channel
      // For now, return mock data
      return {
        channels: [
          { channel: 'Direct', revenue: 65000, deals: 8, conversion_rate: 25 },
          { channel: 'Referral', revenue: 35000, deals: 4, conversion_rate: 33 },
          { channel: 'Website', revenue: 25000, deals: 3, conversion_rate: 15 }
        ],
        channel_trend: [
          { month: 'Jan', Direct: 30000, Referral: 15000, Website: 10000 },
          { month: 'Feb', Direct: 32000, Referral: 16000, Website: 11000 },
          { month: 'Mar', Direct: 34000, Referral: 17000, Website: 11500 },
          { month: 'Apr', Direct: 33000, Referral: 16500, Website: 11000 },
          { month: 'May', Direct: 35000, Referral: 17500, Website: 12000 },
          { month: 'Jun', Direct: 36000, Referral: 18000, Website: 13000 }
        ],
        recommendations: [
          'Increase investment in referral program',
          'Optimize website conversion funnel',
          'Develop channel-specific messaging'
        ]
      };
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return apiClient.get('/sales/by-channel').then(res => res.data);
    }
  },

  getTopProducts: async () => {
    try {
      // This would normally analyze sales data by product/service
      // For now, return mock data
      return {
        top_products: [
          { product: 'Web Development', revenue: 55000, deals: 6, avg_deal_size: 9167 },
          { product: 'Design Services', revenue: 38000, deals: 5, avg_deal_size: 7600 },
          { product: 'Maintenance', revenue: 32000, deals: 4, avg_deal_size: 8000 }
        ],
        product_growth: [
          { product: 'Web Development', growth: 15 },
          { product: 'Design Services', growth: 18 },
          { product: 'Maintenance', growth: 12 }
        ],
        bundle_performance: [
          { bundle: 'Web + Design', revenue: 22000, deals: 2, avg_deal_size: 11000 },
          { bundle: 'Design + Maintenance', revenue: 18000, deals: 2, avg_deal_size: 9000 }
        ],
        recommendations: [
          'Develop more service bundles',
          'Focus marketing on high-growth services',
          'Create upsell paths between services'
        ]
      };
    } catch (error) {
      console.error('Error fetching top products:', error);
      return apiClient.get('/sales/top-products').then(res => res.data);
    }
  }
};

export default financeService;
