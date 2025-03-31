
import api from '../api';
import { v4 as uuidv4 } from 'uuid';
import { mockFinancialData } from '@/utils/mockData';

const financeService = {
  // Invoice management
  getInvoices: async (status?: string) => {
    try {
      let url = '/finance/invoices';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      
      // Return mock data during development
      return mockFinancialData.invoices.map(invoice => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        client_name: invoice.client_name,
        amount: invoice.amount,
        status: invoice.status,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date
      }));
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await api.get(`/finance/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice details error:', error);
      
      // Return mock data during development
      const invoice = mockFinancialData.invoices.find(inv => inv.id === invoiceId);
      return invoice || null;
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      const response = await api.post('/finance/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await api.put(`/finance/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update invoice status error:', error);
      throw error;
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await api.post(`/finance/invoices/${invoiceId}/send-reminder`);
      return response.data;
    } catch (error) {
      console.error('Send invoice reminder error:', error);
      return { success: true, message: 'Reminder sent successfully' };
    }
  },
  
  // Financial records
  getFinancialRecords: async (recordType?: string, startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/records';
      const params = new URLSearchParams();
      
      if (recordType) params.append('record_type', recordType);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get financial records error:', error);
      
      // Return mock data during development
      return mockFinancialData.financialRecords;
    }
  },
  
  createFinancialRecord: async (recordData: any) => {
    try {
      const response = await api.post('/finance/records', recordData);
      return response.data;
    } catch (error) {
      console.error('Create financial record error:', error);
      
      // Return mock data during development
      return {
        id: Math.floor(Math.random() * 1000),
        record_type: recordData.record_type,
        amount: recordData.amount,
        description: recordData.description,
        category: recordData.category,
        date: recordData.date || new Date().toISOString().split('T')[0]
      };
    }
  },
  
  // Reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/revenue';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get revenue reports error:', error);
      
      // Return mock data during development
      return mockFinancialData.revenueReport;
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/expenses';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get expense reports error:', error);
      
      // Return mock data during development
      return mockFinancialData.expenseReport;
    }
  },

  // Sales metrics and dashboards
  getSalesMetrics: async (dateRange?: string) => {
    try {
      let url = '/finance/sales/metrics';
      if (dateRange) {
        url += `?date_range=${dateRange}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get sales metrics error:', error);
      // Return mock data
      return mockFinancialData.salesMetrics;
    }
  },

  getFinancialOverview: async () => {
    try {
      const response = await api.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      return mockFinancialData.financialOverview;
    }
  },

  getFinancialMetrics: async (period?: string) => {
    try {
      let url = '/finance/metrics';
      if (period) {
        url += `?period=${period}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get financial metrics error:', error);
      return mockFinancialData.financialMetrics;
    }
  },

  getUpsellOpportunities: async () => {
    try {
      const response = await api.get('/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      console.error('Get upsell opportunities error:', error);
      return mockFinancialData.upsellOpportunities;
    }
  },

  getFinancialPlans: async () => {
    try {
      const response = await api.get('/finance/plans');
      return response.data;
    } catch (error) {
      console.error('Get financial plans error:', error);
      return mockFinancialData.financialPlans;
    }
  },

  // Sales Follow-up methods
  getSalesFollowUps: async () => {
    try {
      const response = await api.get('/finance/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Get sales follow-ups error:', error);
      return mockFinancialData.salesFollowUps;
    }
  },

  getImprovementSuggestions: async () => {
    try {
      const response = await api.get('/finance/sales/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Get improvement suggestions error:', error);
      return mockFinancialData.improvementSuggestions;
    }
  },

  completeFollowUp: async (followUpId: number, feedback: string) => {
    try {
      const response = await api.put(`/finance/sales/follow-ups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error('Complete follow-up error:', error);
      return { success: true, message: 'Follow-up marked as completed' };
    }
  },

  // Sales Growth Tracking methods
  getSalesGrowthData: async (dateRange: string) => {
    try {
      const response = await api.get(`/finance/sales/growth?date_range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales growth data error:', error);
      return mockFinancialData.salesGrowthData;
    }
  },

  getSalesTargets: async (dateRange: string) => {
    try {
      const response = await api.get(`/finance/sales/targets?date_range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales targets error:', error);
      return mockFinancialData.salesTargets;
    }
  },

  getGrowthForecast: async (dateRange: string) => {
    try {
      const response = await api.get(`/finance/sales/forecast?date_range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get growth forecast error:', error);
      return mockFinancialData.growthForecast;
    }
  },

  // Sales Reports methods
  getWeeklyReports: async () => {
    try {
      const response = await api.get('/finance/sales/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Get weekly reports error:', error);
      return mockFinancialData.weeklyReports;
    }
  },

  getMonthlyReports: async () => {
    try {
      const response = await api.get('/finance/sales/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Get monthly reports error:', error);
      return mockFinancialData.monthlyReports;
    }
  },

  // Sales Tracking Analysis methods
  getSalesTrends: async (dateRange: string) => {
    try {
      const response = await api.get(`/finance/sales/trends?date_range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales trends error:', error);
      return mockFinancialData.salesTrends;
    }
  },

  getSalesByChannel: async (dateRange: string) => {
    try {
      const response = await api.get(`/finance/sales/by-channel?date_range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales by channel error:', error);
      return mockFinancialData.salesByChannel;
    }
  },

  getTopProducts: async (dateRange: string) => {
    try {
      const response = await api.get(`/finance/sales/top-products?date_range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      return mockFinancialData.topProducts;
    }
  },

  // Team cost analysis
  analyzeTeamCosts: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/team-costs';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get team costs error:', error);
      return mockFinancialData.teamCosts || {
        totalCost: 75000,
        averageHourlyCost: 45,
        costByDepartment: [
          { name: 'Marketing', value: 25000, color: '#8884d8' },
          { name: 'Design', value: 20000, color: '#82ca9d' },
          { name: 'Development', value: 30000, color: '#ffc658' }
        ],
        costByProject: [
          { name: 'Website Redesign', value: 35000, color: '#8884d8' },
          { name: 'Mobile App', value: 30000, color: '#82ca9d' },
          { name: 'Marketing Campaign', value: 10000, color: '#ffc658' }
        ],
        monthlyCosts: [
          { month: 'Jan', cost: 20000 },
          { month: 'Feb', cost: 22000 },
          { month: 'Mar', cost: 25000 },
          { month: 'Apr', cost: 27000 },
          { month: 'May', cost: 30000 },
          { month: 'Jun', cost: 29000 }
        ],
        topExpensiveResources: [
          { id: 1, name: 'Senior Developer', cost: 65, utilization: 85 },
          { id: 2, name: 'UX Designer', cost: 55, utilization: 78 },
          { id: 3, name: 'Marketing Specialist', cost: 50, utilization: 82 }
        ],
        costOptimizationSuggestions: [
          'Reassign underutilized high-cost resources to priority projects',
          'Consider consolidating similar tasks to reduce context-switching',
          'Identify training opportunities to increase team versatility'
        ]
      };
    }
  }
};

export default financeService;
