
import apiClient from '@/utils/apiUtils';

// Define the interfaces for finance-related data
export interface Invoice {
  id: number;
  clientId: number;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

export interface FinancialRecord {
  id: number;
  recordType: 'expense' | 'income';
  amount: number;
  description: string;
  recordDate: string;
  createdAt: string;
}

export const financeService = {
  // Invoice methods
  getInvoices: async (status?: string) => {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get('/invoices', { params });
      return response.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      return [];
    }
  },

  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice details error:', error);
      return null;
    }
  },

  createInvoice: async (invoiceData: any) => {
    try {
      const response = await apiClient.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await apiClient.patch(`/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update invoice status error:', error);
      throw error;
    }
  },

  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await apiClient.post(`/invoices/${invoiceId}/remind`);
      return response.data;
    } catch (error) {
      console.error('Send invoice reminder error:', error);
      throw error;
    }
  },

  // Financial reporting methods
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      const params = { start_date: startDate, end_date: endDate };
      const response = await apiClient.get('/financial-summary', { params });
      return response.data;
    } catch (error) {
      console.error('Get revenue reports error:', error);
      return null;
    }
  },

  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      const params = { start_date: startDate, end_date: endDate, type: 'expense' };
      const response = await apiClient.get('/financial-records', { params });
      return response.data;
    } catch (error) {
      console.error('Get expense reports error:', error);
      return [];
    }
  },

  // Financial records methods
  getFinancialRecords: async (recordType?: string, startDate?: string, endDate?: string) => {
    try {
      const params = { 
        record_type: recordType, 
        start_date: startDate, 
        end_date: endDate 
      };
      const response = await apiClient.get('/financial-records', { params });
      return response.data;
    } catch (error) {
      console.error('Get financial records error:', error);
      // Return mock data for development
      return [
        { id: 1, recordType: 'income', amount: 12500, description: 'Client payment - Project A', recordDate: '2023-09-15', createdAt: '2023-09-15T12:00:00Z' },
        { id: 2, recordType: 'expense', amount: 4300, description: 'Software licenses', recordDate: '2023-09-10', createdAt: '2023-09-10T15:30:00Z' },
        { id: 3, recordType: 'income', amount: 8750, description: 'Client payment - Project B', recordDate: '2023-09-05', createdAt: '2023-09-05T09:45:00Z' },
      ];
    }
  },

  // Financial analysis methods
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/financial-summary');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      // Return mock data for development
      return {
        total_revenue: 145000,
        total_expenses: 98000,
        profit: 47000,
        profit_margin: 32.4,
        monthly_growth: 8.2,
        outstanding_invoices: 28000,
        balance: 76500
      };
    }
  },

  getFinancialMetrics: async (period: string) => {
    try {
      const response = await apiClient.get('/financial-summary', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get financial metrics error:', error);
      // Return mock data for development
      return {
        revenue: { 
          label: 'Revenue', 
          value: 145000, 
          formatted_value: '$145,000', 
          growth_rate: 8.2 
        },
        expenses: { 
          label: 'Expenses', 
          value: 98000, 
          formatted_value: '$98,000', 
          growth_rate: 5.7 
        },
        profit: { 
          label: 'Profit', 
          value: 47000, 
          formatted_value: '$47,000', 
          growth_rate: 12.4 
        },
        cash_flow: { 
          label: 'Cash Flow', 
          value: 38500, 
          formatted_value: '$38,500', 
          growth_rate: -2.3 
        }
      };
    }
  },

  getUpsellOpportunities: async () => {
    try {
      // In a production environment, this would be a real API endpoint
      // Mocking data for development purposes
      return [
        { id: 1, clientId: 1, description: 'Add Premium Support Package', potentialRevenue: 1200 },
        { id: 2, clientId: 2, description: 'Upgrade to Advanced Analytics', potentialRevenue: 2400 },
        { id: 3, clientId: 3, description: 'Add Additional User Licenses', potentialRevenue: 800 }
      ];
    } catch (error) {
      console.error('Get upsell opportunities error:', error);
      return [];
    }
  },

  analyzeTeamCosts: async (period: string) => {
    try {
      const response = await apiClient.post('/analyze-cost', { period });
      return response.data;
    } catch (error) {
      console.error('Analyze team costs error:', error);
      // Return mock data for development
      return {
        total_cost: 125000,
        avg_cost_per_employee: 6250,
        total_employees: 20,
        trend_percentage: 5.2,
        departments: [
          { name: 'Development', headcount: 8, cost: 56000, percentage: 44.8, yoy_change: 3.2 },
          { name: 'Design', headcount: 4, cost: 28000, percentage: 22.4, yoy_change: -1.5 },
          { name: 'Marketing', headcount: 3, cost: 18000, percentage: 14.4, yoy_change: 8.7 },
          { name: 'Management', headcount: 2, cost: 16000, percentage: 12.8, yoy_change: 0 },
          { name: 'HR', headcount: 1, cost: 7000, percentage: 5.6, yoy_change: 0 }
        ],
        trend: [
          { period: 'Jan', total_cost: 120000, avg_cost: 6000 },
          { period: 'Feb', total_cost: 122000, avg_cost: 6100 },
          { period: 'Mar', total_cost: 121500, avg_cost: 6075 },
          { period: 'Apr', total_cost: 123000, avg_cost: 6150 },
          { period: 'May', total_cost: 124000, avg_cost: 6200 },
          { period: 'Jun', total_cost: 125000, avg_cost: 6250 }
        ],
        efficiency: [
          { name: 'Development', efficiency: 93.2 },
          { name: 'Design', efficiency: 88.7 },
          { name: 'Marketing', efficiency: 79.5 },
          { name: 'Management', efficiency: 95.0 },
          { name: 'HR', efficiency: 82.3 }
        ],
        optimization_opportunities: [
          { department: 'Marketing', description: 'Consolidate marketing tools and subscriptions', potential_savings: 2500 },
          { department: 'Design', description: 'Transition to more cost-effective design software', potential_savings: 1800 }
        ],
        insights: [
          'Development team has the highest efficiency score and represents the largest share of team costs',
          'Marketing costs have increased 8.7% compared to last year',
          'Design team costs have decreased by 1.5% while maintaining high efficiency',
          'Implementing the identified optimization opportunities could save $4,300 annually'
        ]
      };
    }
  },

  // Sales finance methods
  getSalesMetrics: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/metrics', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales metrics error:', error);
      return null;
    }
  },

  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Get sales follow-ups error:', error);
      return [];
    }
  },

  getImprovementSuggestions: async () => {
    try {
      const response = await apiClient.get('/sales/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Get improvement suggestions error:', error);
      return [];
    }
  },

  completeFollowUp: async (followUpId: number) => {
    try {
      const response = await apiClient.post(`/sales/follow-ups/${followUpId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Complete follow-up error:', error);
      throw error;
    }
  },

  getSalesGrowthData: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/growth', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales growth data error:', error);
      return null;
    }
  },

  getSalesTargets: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/targets', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales targets error:', error);
      return null;
    }
  },

  getGrowthForecast: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/forecast', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get growth forecast error:', error);
      return null;
    }
  },

  getWeeklyReports: async () => {
    try {
      const response = await apiClient.get('/sales/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Get weekly reports error:', error);
      return [];
    }
  },

  getMonthlyReports: async () => {
    try {
      const response = await apiClient.get('/sales/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Get monthly reports error:', error);
      return [];
    }
  },

  getSalesTrends: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/trends', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales trends error:', error);
      return null;
    }
  },

  getSalesByChannel: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/channels', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales by channel error:', error);
      return null;
    }
  },

  getTopProducts: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/top-products', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      return null;
    }
  },

  getFinancialPlans: async () => {
    try {
      const response = await apiClient.get('/financial-plans');
      return response.data;
    } catch (error) {
      console.error('Get financial plans error:', error);
      return [];
    }
  }
};
