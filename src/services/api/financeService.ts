
import axios from 'axios';
import config from '@/config/config';
import { 
  Invoice, 
  FinancialRecord, 
  FinancialMetrics, 
  SalesMetrics, 
  SalesTarget,
  GrowthForecast,
  SalesTrend,
  UpsellOpportunity,
  FinancialOverview,
  TeamCostAnalysis
} from '@/interfaces/finance';

const api = axios.create({
  baseURL: config.apiUrl,
});

// Mock data fallbacks for development
const mockData = {
  salesTrends: [
    { date: '2023-01', sales: 12500 },
    { date: '2023-02', sales: 14000 },
    { date: '2023-03', sales: 13800 },
    { date: '2023-04', sales: 15200 },
    { date: '2023-05', sales: 16500 },
    { date: '2023-06', sales: 18000 },
  ],
  
  financialRecords: [
    { record_id: 1, record_type: 'income', amount: 5000, description: 'Client payment', record_date: '2023-05-15', created_at: '2023-05-15', category: 'Sales' },
    { record_id: 2, record_type: 'expense', amount: 1200, description: 'Office rent', record_date: '2023-05-01', created_at: '2023-05-01', category: 'Office' },
    { record_id: 3, record_type: 'expense', amount: 500, description: 'Software subscriptions', record_date: '2023-05-05', created_at: '2023-05-05', category: 'Software' },
  ]
};

const financeService = {
  // Invoice management
  getInvoices: async (status?: string): Promise<any> => {
    try {
      const response = await api.get(`/finance/invoices${status ? `?status=${status}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },

  getInvoiceDetails: async (invoiceId: number): Promise<any> => {
    try {
      const response = await api.get(`/finance/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${invoiceId}:`, error);
      return null;
    }
  },

  createInvoice: async (invoiceData: any): Promise<any> => {
    try {
      const response = await api.post('/finance/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId: number, status: string): Promise<any> => {
    try {
      const response = await api.patch(`/finance/invoices/${invoiceId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ${invoiceId}:`, error);
      throw error;
    }
  },

  sendInvoiceReminder: async (invoiceId: number): Promise<any> => {
    try {
      const response = await api.post(`/finance/invoices/${invoiceId}/reminder`);
      return response.data;
    } catch (error) {
      console.error(`Error sending reminder for invoice ${invoiceId}:`, error);
      throw error;
    }
  },

  // Financial records
  getFinancialRecords: async (type?: 'income' | 'expense', startDate?: string, endDate?: string): Promise<any> => {
    try {
      let url = '/finance/records';
      const params = new URLSearchParams();
      
      if (type) params.append('type', type);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return mockData.financialRecords;
    }
  },

  createFinancialRecord: async (recordData: Partial<FinancialRecord>): Promise<any> => {
    try {
      const response = await api.post('/finance/records', recordData);
      return response.data;
    } catch (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }
  },

  // Reports
  getRevenueReports: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      let url = '/finance/reports/revenue';
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      return {};
    }
  },

  getExpenseReports: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      let url = '/finance/reports/expenses';
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      return {};
    }
  },

  // Financial metrics and analytics
  getFinancialMetrics: async (period: string = 'monthly'): Promise<FinancialMetrics> => {
    try {
      const response = await api.get(`/finance/metrics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      return {
        totalRevenue: 85000,
        totalExpenses: 45000,
        netProfit: 40000,
        profitMargin: 47,
        monthlyGrowth: 5.2,
        averageInvoiceValue: 2500,
        outstandingInvoices: 15000,
        cashFlow: [
          { month: 'Jan', income: 12000, expense: 8000, net: 4000 },
          { month: 'Feb', income: 15000, expense: 9000, net: 6000 },
          { month: 'Mar', income: 18000, expense: 10000, net: 8000 },
          { month: 'Apr', income: 20000, expense: 11000, net: 9000 },
          { month: 'May', income: 22000, expense: 12000, net: 10000 },
          { month: 'Jun', income: 25000, expense: 13000, net: 12000 },
        ]
      };
    }
  },

  getFinancialOverview: async (): Promise<FinancialOverview> => {
    try {
      const response = await api.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      return {
        totalRevenue: 85000,
        totalExpenses: 45000,
        netProfit: 40000,
        profitMargin: 47,
        revenueGrowth: 5.2,
        expenseGrowth: 3.1,
        topExpenseCategories: [
          { category: 'Salaries', amount: 25000, percentage: 55 },
          { category: 'Office Space', amount: 10000, percentage: 22 },
          { category: 'Software', amount: 5000, percentage: 11 },
          { category: 'Marketing', amount: 3000, percentage: 7 },
          { category: 'Other', amount: 2000, percentage: 5 },
        ],
        revenueByClient: [
          { client: 'Acme Inc', amount: 25000, percentage: 29 },
          { client: 'Globex Corp', amount: 20000, percentage: 24 },
          { client: 'Initech', amount: 15000, percentage: 18 },
          { client: 'Umbrella Corp', amount: 10000, percentage: 12 },
          { client: 'Others', amount: 15000, percentage: 17 },
        ],
        cashflow: [
          { month: 'Jan', income: 12000, expense: 8000, net: 4000 },
          { month: 'Feb', income: 15000, expense: 9000, net: 6000 },
          { month: 'Mar', income: 18000, expense: 10000, net: 8000 },
          { month: 'Apr', income: 20000, expense: 11000, net: 9000 },
          { month: 'May', income: 22000, expense: 12000, net: 10000 },
          { month: 'Jun', income: 25000, expense: 13000, net: 12000 },
        ]
      };
    }
  },

  // Team cost analysis
  analyzeTeamCosts: async (period: string = 'monthly'): Promise<TeamCostAnalysis> => {
    try {
      const response = await api.get(`/finance/team-costs?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      return {
        totalCost: 45000,
        breakdown: [
          { department: 'Development', cost: 20000, percentage: 44 },
          { department: 'Design', cost: 8000, percentage: 18 },
          { department: 'Marketing', cost: 7000, percentage: 16 },
          { department: 'Management', cost: 6000, percentage: 13 },
          { department: 'Customer Support', cost: 4000, percentage: 9 },
        ],
        trends: [
          { month: 'Jan', cost: 40000 },
          { month: 'Feb', cost: 41000 },
          { month: 'Mar', cost: 42000 },
          { month: 'Apr', cost: 43000 },
          { month: 'May', cost: 44000 },
          { month: 'Jun', cost: 45000 },
        ]
      };
    }
  },

  // Upsell opportunities
  getUpsellOpportunities: async (): Promise<UpsellOpportunity[]> => {
    try {
      const response = await api.get('/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      return [
        {
          clientId: 1,
          clientName: 'Acme Inc',
          currentServices: ['Web Development', 'Design'],
          recommendedServices: ['SEO', 'Content Marketing'],
          potentialRevenue: 5000,
          probability: 75
        },
        {
          clientId: 2,
          clientName: 'Globex Corp',
          currentServices: ['Mobile App Development'],
          recommendedServices: ['Web Development', 'UI/UX Design'],
          potentialRevenue: 8000,
          probability: 60
        },
        {
          clientId: 3,
          clientName: 'Initech',
          currentServices: ['SEO', 'PPC'],
          recommendedServices: ['Social Media Marketing', 'Email Marketing'],
          potentialRevenue: 3500,
          probability: 80
        }
      ];
    }
  },

  // Sales metrics and analytics
  getSalesMetrics: async (dateRange: 'week' | 'month' | 'quarter' | 'year'): Promise<SalesMetrics> => {
    try {
      const response = await api.get(`/finance/sales/metrics?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      return {
        totalSales: 75000,
        salesGrowth: 12.5,
        conversionRate: 15,
        customerAcquisitionCost: 350,
        averageSaleValue: 2500,
        newCustomers: 12,
        customerGrowth: 7.5,
        conversionGrowth: 5,
        averageSaleGrowth: 8.5,
        salesByChannel: [
          { channel: 'Direct', amount: 30000, percentage: 40 },
          { channel: 'Referral', amount: 22500, percentage: 30 },
          { channel: 'Online', amount: 15000, percentage: 20 },
          { channel: 'Other', amount: 7500, percentage: 10 },
        ],
        topProducts: [
          { name: 'Web Development', sales: 15, revenue: 25000 },
          { name: 'Mobile Apps', sales: 8, revenue: 20000 },
          { name: 'UI/UX Design', sales: 12, revenue: 15000 },
          { name: 'SEO Services', sales: 10, revenue: 10000 },
          { name: 'Content Creation', sales: 5, revenue: 5000 },
        ]
      };
    }
  },

  getSalesTrends: async (dateRange: 'week' | 'month' | 'quarter' | 'year'): Promise<SalesTrend[]> => {
    try {
      const response = await api.get(`/finance/sales/trends?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return mockData.salesTrends;
    }
  },

  getSalesByChannel: async (dateRange: 'week' | 'month' | 'quarter' | 'year'): Promise<any> => {
    try {
      const response = await api.get(`/finance/sales/by-channel?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return [
        { name: 'Direct', value: 40 },
        { name: 'Referral', value: 30 },
        { name: 'Online', value: 20 },
        { name: 'Other', value: 10 },
      ];
    }
  },

  getTopProducts: async (dateRange: 'week' | 'month' | 'quarter' | 'year'): Promise<any> => {
    try {
      const response = await api.get(`/finance/sales/top-products?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [
        { name: 'Web Development', value: 35 },
        { name: 'Mobile Apps', value: 25 },
        { name: 'UI/UX Design', value: 20 },
        { name: 'SEO Services', value: 15 },
        { name: 'Content Creation', value: 5 },
      ];
    }
  },

  getSalesGrowthData: async (dateRange: 'week' | 'month' | 'quarter' | 'year'): Promise<any> => {
    try {
      const response = await api.get(`/finance/sales/growth?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return {
        trends: [
          { date: '2023-01', actual: 12000, target: 13000 },
          { date: '2023-02', actual: 14000, target: 14000 },
          { date: '2023-03', actual: 15500, target: 15000 },
          { date: '2023-04', actual: 16000, target: 16000 },
          { date: '2023-05', actual: 17500, target: 17000 },
          { date: '2023-06', actual: 19000, target: 18000 },
        ],
        currentPeriod: {
          revenueGrowth: 8.5,
          customerGrowth: 5.2
        },
        growthDrivers: [
          { factor: 'New Clients', impact: 35, performance: 'positive' },
          { factor: 'Upselling', impact: 25, performance: 'positive' },
          { factor: 'Pricing Strategy', impact: 20, performance: 'neutral' },
          { factor: 'Market Expansion', impact: 15, performance: 'positive' },
          { factor: 'Retention Rate', impact: 5, performance: 'negative' },
        ]
      };
    }
  },

  getSalesTargets: async (dateRange: 'week' | 'month' | 'quarter' | 'year'): Promise<SalesTarget[]> => {
    try {
      const response = await api.get(`/finance/sales/targets?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return [
        { id: 1, category: 'Total Revenue', current: 85000, target: 100000, percentage: 85 },
        { id: 2, category: 'New Clients', current: 12, target: 15, percentage: 80 },
        { id: 3, category: 'Client Retention', current: 95, target: 95, percentage: 100 },
        { id: 4, category: 'Average Deal Size', current: 2500, target: 3000, percentage: 83 },
      ];
    }
  },

  getGrowthForecast: async (dateRange: 'week' | 'month' | 'quarter' | 'year'): Promise<GrowthForecast> => {
    try {
      const response = await api.get(`/finance/sales/forecast?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      return {
        chart: [
          { month: 'Jul', projected: 20000, target: 19000 },
          { month: 'Aug', projected: 22000, target: 20000 },
          { month: 'Sep', projected: 24000, target: 21000 },
          { month: 'Oct', projected: 25000, target: 22000 },
          { month: 'Nov', projected: 27000, target: 23000 },
          { month: 'Dec', projected: 30000, target: 24000 },
        ],
        insights: [
          { type: 'trend', text: 'Projected 15% growth in Q3 based on current client acquisition rate.' },
          { type: 'trend', text: 'Upselling opportunities could increase revenue by additional 8% in Q4.' },
          { type: 'warning', text: 'Market volatility may impact projections if economic conditions change.' },
          { type: 'trend', text: 'Seasonal boost expected in November-December period.' },
        ]
      };
    }
  },

  // Sales follow-ups
  getSalesFollowUps: async (): Promise<any> => {
    try {
      const response = await api.get('/finance/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      return [
        { id: 1, clientName: 'Acme Inc', contactPerson: 'John Smith', email: 'john@acme.com', phone: '123-456-7890', type: 'call', dueDate: '2023-06-15', notes: 'Discuss new project proposal', status: 'pending' },
        { id: 2, clientName: 'Globex Corp', contactPerson: 'Jane Doe', email: 'jane@globex.com', phone: '123-456-7891', type: 'email', dueDate: '2023-06-14', notes: 'Send updated quote for website redesign', status: 'pending' },
        { id: 3, clientName: 'Initech', contactPerson: 'Mike Johnson', email: 'mike@initech.com', phone: '123-456-7892', type: 'meeting', dueDate: '2023-06-18', notes: 'Present marketing proposal', status: 'pending' },
        { id: 4, clientName: 'Umbrella Corp', contactPerson: 'Sarah Williams', email: 'sarah@umbrella.com', phone: '123-456-7893', type: 'call', dueDate: '2023-06-12', notes: 'Follow up on previous discussion', status: 'pending' },
      ];
    }
  },

  completeFollowUp: async (followUpId: number, feedback: string): Promise<any> => {
    try {
      const response = await api.patch(`/finance/sales/follow-ups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error(`Error completing follow-up ${followUpId}:`, error);
      throw error;
    }
  },

  getImprovementSuggestions: async (): Promise<any> => {
    try {
      const response = await api.get('/finance/sales/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      return [
        { id: 1, title: 'Optimize Follow-up Timing', description: 'Data shows 30% higher conversion when follow-ups occur within 48 hours of initial contact.', priority: 'high' },
        { id: 2, title: 'Segment Client Communications', description: 'Tailoring messages by industry has increased engagement by 25% for similar businesses.', priority: 'medium' },
        { id: 3, title: 'Implement Case Study Sharing', description: 'Sharing relevant case studies during pitches has shown 40% improvement in closing rates.', priority: 'medium' },
        { id: 4, title: 'Develop Value-Based Pricing', description: 'Shifting from hourly to value-based pricing could increase average deal size by 20%.', priority: 'high' },
      ];
    }
  },

  // Sales reports
  getWeeklyReports: async (): Promise<any> => {
    try {
      const response = await api.get('/finance/sales/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly sales reports:', error);
      return [
        { 
          id: 1, 
          title: 'Weekly Performance Report', 
          period: 'June 5-11, 2023', 
          sales: 18500, 
          target: 20000, 
          progress: 93,
          performanceData: [
            { day: 'Mon', sales: 3200 },
            { day: 'Tue', sales: 3800 },
            { day: 'Wed', sales: 3500 },
            { day: 'Thu', sales: 2900 },
            { day: 'Fri', sales: 5100 },
          ],
          metrics: {
            conversionRate: 18,
            prevConversionRate: 15,
            avgSaleValue: 2300,
            prevAvgSaleValue: 2100,
            newLeads: 25,
            prevNewLeads: 22,
            closedDeals: 8,
            prevClosedDeals: 7
          }
        },
        { 
          id: 2, 
          title: 'Previous Week', 
          period: 'May 29-June 4, 2023', 
          sales: 17200, 
          target: 19000, 
          progress: 91 
        },
        { 
          id: 3, 
          title: '2 Weeks Ago', 
          period: 'May 22-28, 2023', 
          sales: 16800, 
          target: 18000, 
          progress: 93 
        },
      ];
    }
  },

  getMonthlyReports: async (): Promise<any> => {
    try {
      const response = await api.get('/finance/sales/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly sales reports:', error);
      return [
        { 
          id: 1, 
          title: 'June 2023 Performance', 
          period: 'June 2023', 
          sales: 85000, 
          target: 90000, 
          progress: 94,
          yearlyTrend: [
            { month: 'Jul 22', sales: 65000 },
            { month: 'Aug 22', sales: 68000 },
            { month: 'Sep 22', sales: 70000 },
            { month: 'Oct 22', sales: 72000 },
            { month: 'Nov 22', sales: 75000 },
            { month: 'Dec 22', sales: 78000 },
            { month: 'Jan 23', sales: 72000 },
            { month: 'Feb 23', sales: 75000 },
            { month: 'Mar 23', sales: 78000 },
            { month: 'Apr 23', sales: 80000 },
            { month: 'May 23', sales: 82000 },
            { month: 'Jun 23', sales: 85000 },
          ]
        },
        { 
          id: 2, 
          title: 'May 2023 Performance', 
          period: 'May 2023', 
          sales: 82000, 
          target: 85000, 
          progress: 96 
        },
        { 
          id: 3, 
          title: 'April 2023 Performance', 
          period: 'April 2023', 
          sales: 80000, 
          target: 82000, 
          progress: 98 
        },
      ];
    }
  },

  // Financial plans & projections
  getFinancialPlans: async (): Promise<any> => {
    try {
      const response = await api.get('/finance/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      return [];
    }
  }
};

export default financeService;
