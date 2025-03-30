
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  invoice_id: number;
  client_id: number;
  client_name: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  id: number; // Adding id property to fix TypeScript errors
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
  id: number; // Adding id property to fix TypeScript errors
  date: string; // Adding date property to fix TypeScript errors
}

const financeService = {
  getInvoices: async (status?: string) => {
    try {
      let url = '/finance/invoices';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },

  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await apiClient.get(`/finance/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${invoiceId}:`, error);
      return null;
    }
  },

  createInvoice: async (invoiceData: any) => {
    try {
      const response = await apiClient.post('/finance/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await apiClient.put(`/finance/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ${invoiceId} status:`, error);
      throw error;
    }
  },

  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/revenue';
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      return null;
    }
  },

  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/expenses';
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      return null;
    }
  },

  // Add missing methods
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      // Return mock data for development
      return {
        total_revenue: 120000,
        total_expenses: 85000,
        profit: 35000,
        outstanding_invoices: 18000,
        recent_transactions: []
      };
    }
  },

  getFinancialMetrics: async (period: string = 'monthly') => {
    try {
      const response = await apiClient.get(`/finance/metrics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      // Return mock data for development
      return {
        revenue: {
          value: 45000,
          growth_rate: 12.5,
          formatted_value: '$45,000',
          label: 'Total Revenue'
        },
        expenses: {
          value: 28000,
          growth_rate: 5.2,
          formatted_value: '$28,000',
          label: 'Total Expenses'
        },
        profit: {
          value: 17000,
          growth_rate: 18.3,
          formatted_value: '$17,000',
          label: 'Net Profit'
        },
        profit_margin: {
          value: 37.8,
          growth_rate: 5.5,
          formatted_value: '37.8%',
          label: 'Profit Margin'
        }
      };
    }
  },

  getFinancialRecords: async (type?: string, startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/records';
      const params = [];
      if (type) params.push(`type=${type}`);
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      // Return mock data for development
      return [
        {
          id: 1,
          record_id: 1,
          description: 'Client payment - Acme Inc',
          amount: 5000,
          date: '2023-09-15',
          record_date: '2023-09-15',
          type: 'income',
          record_type: 'income',
          created_at: '2023-09-15T00:00:00Z'
        },
        {
          id: 2,
          record_id: 2,
          description: 'Office supplies',
          amount: 350,
          date: '2023-09-12',
          record_date: '2023-09-12',
          type: 'expense',
          record_type: 'expense',
          created_at: '2023-09-12T00:00:00Z'
        }
      ];
    }
  },

  getUpsellOpportunities: async () => {
    try {
      const response = await apiClient.get('/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      // Return mock data for development
      return [
        {
          id: 1,
          description: 'Additional social media management for Acme Inc',
          potentialRevenue: 2500,
          client: 'Acme Inc'
        },
        {
          id: 2,
          description: 'Website maintenance package for TechCorp',
          potentialRevenue: 1800,
          client: 'TechCorp'
        }
      ];
    }
  },

  // Add sales-related methods
  getSalesMetrics: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales-metrics?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      // Return mock data for development
      return {
        totalSales: 125000,
        salesGrowth: 15.2,
        newCustomers: 24,
        customerGrowth: 8.5,
        conversionRate: 28.4,
        conversionGrowth: 3.7,
        averageSale: 5208,
        averageSaleGrowth: 4.2
      };
    }
  },

  getSalesTrends: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales-trends?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return [];
    }
  },

  getSalesByChannel: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales-by-channel?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return [];
    }
  },

  getTopProducts: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/top-products?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  },

  getSalesGrowthData: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales-growth?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return null;
    }
  },

  getSalesTargets: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales-targets?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return null;
    }
  },

  getGrowthForecast: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/growth-forecast?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      return null;
    }
  },

  getWeeklyReports: async (dateRange?: string) => {
    try {
      let url = '/finance/weekly-reports';
      if (dateRange) {
        url += `?range=${dateRange}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      return null;
    }
  },

  getMonthlyReports: async (dateRange?: string) => {
    try {
      let url = '/finance/monthly-reports';
      if (dateRange) {
        url += `?range=${dateRange}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      return null;
    }
  },

  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/finance/sales-follow-ups');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      return [];
    }
  },

  getImprovementSuggestions: async () => {
    try {
      const response = await apiClient.get('/finance/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      return [];
    }
  },

  completeFollowUp: async (followUpId: number, feedback?: string) => {
    try {
      const response = await apiClient.put(`/finance/sales-follow-ups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error(`Error completing follow-up ${followUpId}:`, error);
      throw error;
    }
  },

  getFinancialPlans: async () => {
    try {
      const response = await apiClient.get('/finance/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      return [];
    }
  },

  analyzeTeamCosts: async (period: string) => {
    try {
      const response = await apiClient.get(`/finance/team-costs?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      // Return mock data
      return {
        totalCost: 45000,
        costByDepartment: [
          { department: 'Development', cost: 18000 },
          { department: 'Design', cost: 12000 },
          { department: 'Marketing', cost: 8000 },
          { department: 'Management', cost: 7000 }
        ],
        costByProject: [
          { project: 'Website Redesign', cost: 15000 },
          { project: 'Mobile App', cost: 12000 },
          { project: 'SEO Campaign', cost: 8000 },
          { project: 'Branding', cost: 10000 }
        ],
        costTrend: [
          { month: 'Jan', cost: 40000 },
          { month: 'Feb', cost: 42000 },
          { month: 'Mar', cost: 43000 },
          { month: 'Apr', cost: 45000 },
          { month: 'May', cost: 44000 }
        ]
      };
    }
  },

  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/send-reminder`);
      return response.data;
    } catch (error) {
      console.error(`Error sending reminder for invoice ${invoiceId}:`, error);
      throw error;
    }
  }
};

export default financeService;
