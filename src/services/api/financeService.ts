import axios from 'axios';
import apiClient from '@/utils/apiUtils';
import { SalesData, FinancialOverview, FinancialMetrics, TeamCostAnalysis, UpsellOpportunity, SalesFollowUp } from '@/interfaces/finance';

// Mock data
const mockSalesData: SalesData = {
  monthly_revenue: 125000,
  annual_target: 1500000,
  growth_rate: 12.5,
  client_acquisition: 15,
  conversion_rate: 32,
  avg_deal_size: 8500,
  top_clients: [
    { client_id: 1, client_name: 'Acme Corp', revenue: 42000, growth: 15 },
    { client_id: 2, client_name: 'TechGiant Inc', revenue: 38000, growth: 8 },
    { client_id: 3, client_name: 'Innovate LLC', revenue: 26000, growth: 22 },
    { client_id: 4, client_name: 'Global Solutions', revenue: 19000, growth: -3 }
  ],
  monthly_trend: [
    { month: 'Jan', revenue: 98000, target: 100000 },
    { month: 'Feb', revenue: 105000, target: 100000 },
    { month: 'Mar', revenue: 112000, target: 110000 },
    { month: 'Apr', revenue: 118000, target: 110000 },
    { month: 'May', revenue: 125000, target: 120000 },
    { month: 'Jun', revenue: 132000, target: 120000 }
  ],
  sales_by_service: [
    { service: 'Consulting', value: 45 },
    { service: 'Development', value: 30 },
    { service: 'Maintenance', value: 15 },
    { service: 'Training', value: 10 }
  ]
};

const mockFinancialOverview = {
  totalRevenue: 1250000,
  totalExpenses: 850000,
  netProfit: 400000,
  profitMargin: 32,
  revenueGrowth: 15,
  expenseGrowth: 10,
  topExpenseCategories: [
    { category: 'Salaries', amount: 450000, percentage: 53 },
    { category: 'Office', amount: 120000, percentage: 14 },
    { category: 'Marketing', amount: 85000, percentage: 10 },
    { category: 'Software', amount: 75000, percentage: 9 },
    { category: 'Travel', amount: 65000, percentage: 8 },
    { category: 'Other', amount: 55000, percentage: 6 }
  ],
  revenueByClient: [
    { client: 'Acme Corp', amount: 325000, percentage: 26 },
    { client: 'TechGiant', amount: 290000, percentage: 23 },
    { client: 'Innovate LLC', amount: 215000, percentage: 17 },
    { client: 'Global Solutions', amount: 185000, percentage: 15 },
    { client: 'Others', amount: 235000, percentage: 19 }
  ],
  cashflow: [
    { month: 'Jan', income: 95000, expense: 70000, net: 25000 },
    { month: 'Feb', income: 100000, expense: 72000, net: 28000 },
    { month: 'Mar', income: 105000, expense: 75000, net: 30000 },
    { month: 'Apr', income: 110000, expense: 78000, net: 32000 },
    { month: 'May', income: 112000, expense: 80000, net: 32000 },
    { month: 'Jun', income: 118000, expense: 82000, net: 36000 }
  ]
};

const financeService = {
  // Existing methods
  getInvoices: async (status?: string) => {
    try {
      let url = '/finance/invoices';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      throw error;
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await apiClient.get(`/finance/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice details error:', error);
      throw error;
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      const response = await apiClient.post('/finance/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await apiClient.put(`/finance/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update invoice status error:', error);
      throw error;
    }
  },
  
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/revenue';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get revenue reports error:', error);
      throw error;
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
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get expense reports error:', error);
      throw error;
    }
  },

  // New methods to fix errors
  getSalesMetrics: async (timeframe?: 'month' | 'quarter' | 'year', startDate?: string, endDate?: string): Promise<SalesData> => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSalesData);
      }, 500);
    });
  },

  getFinancialOverview: async (): Promise<FinancialOverview> => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinancialOverview as FinancialOverview);
      }, 500);
    });
  },

  getFinancialMetrics: async (): Promise<FinancialMetrics> => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalRevenue: 1250000,
          totalExpenses: 850000,
          netProfit: 400000,
          profitMargin: 32,
          monthlyGrowth: 5.2,
          averageInvoiceValue: 8500,
          outstandingInvoices: 12,
          cashFlow: mockFinancialOverview.cashflow
        });
      }, 500);
    });
  },

  getFinancialRecords: async () => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          records: [
            { record_id: 1, record_type: 'income', amount: 15000, description: 'Client payment', record_date: '2023-05-15', category: 'Sales' },
            { record_id: 2, record_type: 'expense', amount: 5000, description: 'Office rent', record_date: '2023-05-01', category: 'Office' },
            { record_id: 3, record_type: 'expense', amount: 2500, description: 'Software subscriptions', record_date: '2023-05-05', category: 'Software' },
            { record_id: 4, record_type: 'income', amount: 8500, description: 'Consulting services', record_date: '2023-05-20', category: 'Consulting' },
            { record_id: 5, record_type: 'expense', amount: 1200, description: 'Marketing campaign', record_date: '2023-05-12', category: 'Marketing' }
          ]
        });
      }, 500);
    });
  },

  createFinancialRecord: async (recordData: any) => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          record_id: Date.now(),
          ...recordData,
          created_at: new Date().toISOString()
        });
      }, 500);
    });
  },

  getUpsellOpportunities: async (): Promise<UpsellOpportunity[]> => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            clientId: 1,
            clientName: 'Acme Corp',
            currentServices: ['Web Development', 'SEO'],
            recommendedServices: ['Content Marketing', 'App Development'],
            potentialRevenue: 25000,
            probability: 80
          },
          {
            clientId: 2,
            clientName: 'TechGiant Inc',
            currentServices: ['App Development', 'Cloud Infrastructure'],
            recommendedServices: ['Managed Services', 'Security Audits'],
            potentialRevenue: 35000,
            probability: 65
          }
        ]);
      }, 500);
    });
  },

  analyzeTeamCosts: async (): Promise<TeamCostAnalysis> => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalCost: 450000,
          breakdown: [
            { department: 'Engineering', cost: 180000, percentage: 40 },
            { department: 'Design', cost: 90000, percentage: 20 },
            { department: 'Marketing', cost: 67500, percentage: 15 },
            { department: 'Sales', cost: 67500, percentage: 15 },
            { department: 'Admin', cost: 45000, percentage: 10 }
          ],
          trends: [
            { month: 'Jan', cost: 72000 },
            { month: 'Feb', cost: 73000 },
            { month: 'Mar', cost: 74000 },
            { month: 'Apr', cost: 75000 },
            { month: 'May', cost: 77000 },
            { month: 'Jun', cost: 79000 }
          ]
        });
      }, 500);
    });
  },

  getSalesFollowUps: async (): Promise<SalesFollowUp[]> => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            clientName: 'Acme Corp',
            contactPerson: 'John Smith',
            email: 'john.smith@acme.com',
            phone: '+1 212-555-1234',
            type: 'call',
            dueDate: '2023-06-15',
            notes: 'Follow up on proposal for new website development',
            status: 'pending'
          },
          {
            id: 2,
            clientName: 'TechGiant Inc',
            contactPerson: 'Jane Doe',
            email: 'jane.doe@techgiant.com',
            phone: '+1 312-555-6789',
            type: 'meeting',
            dueDate: '2023-06-20',
            notes: 'Discuss expansion of current app development project',
            status: 'pending'
          }
        ]);
      }, 500);
    });
  },

  getImprovementSuggestions: async () => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          suggestions: [
            {
              id: 1,
              title: 'Increase LinkedIn outreach frequency',
              description: 'LinkedIn outreach results in 50% higher conversion rates than other channels.',
              expectedImpact: 'Could increase sales by 15-20% in next quarter',
              difficulty: 'low'
            },
            {
              id: 2,
              title: 'Create product demo videos',
              description: 'Clients with product demos convert 35% faster than those without.',
              expectedImpact: 'Could reduce sales cycle by 2-3 weeks',
              difficulty: 'medium'
            }
          ]
        });
      }, 500);
    });
  },

  completeFollowUp: async (followUpId: number) => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: followUpId,
          status: 'completed',
          completedAt: new Date().toISOString()
        });
      }, 500);
    });
  },

  getSalesGrowthData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { date: '2023-01', sales: 100000 },
            { date: '2023-02', sales: 110000 },
            { date: '2023-03', sales: 115000 },
            { date: '2023-04', sales: 125000 },
            { date: '2023-05', sales: 135000 },
            { date: '2023-06', sales: 150000 }
          ]
        });
      }, 500);
    });
  },

  getSalesTargets: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          targets: [
            { id: 1, category: 'Monthly Revenue', current: 150000, target: 180000, percentage: 83 },
            { id: 2, category: 'New Clients', current: 8, target: 10, percentage: 80 },
            { id: 3, category: 'Upsells', current: 12, target: 20, percentage: 60 },
            { id: 4, category: 'Renewals', current: 25, target: 28, percentage: 89 }
          ]
        });
      }, 500);
    });
  },

  getGrowthForecast: async (): Promise<GrowthForecast> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          chart: [
            { month: 'Jul', projected: 160000, target: 165000 },
            { month: 'Aug', projected: 170000, target: 175000 },
            { month: 'Sep', projected: 180000, target: 185000 },
            { month: 'Oct', projected: 190000, target: 195000 },
            { month: 'Nov', projected: 200000, target: 205000 },
            { month: 'Dec', projected: 210000, target: 215000 }
          ],
          insights: [
            { type: 'trend', text: 'Growth is projected to continue at 6-7% monthly.' },
            { type: 'warning', text: 'Q4 traditionally shows a 5-10% slowdown in the industry.' },
            { type: 'trend', text: 'New product launches could accelerate growth by an additional 10-15%.' }
          ]
        });
      }, 500);
    });
  },

  getWeeklyReports: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          reports: [
            { id: 1, title: 'Week 22 Sales', period: 'May 29 - Jun 4, 2023', sales: 38500, target: 35000, progress: 110 },
            { id: 2, title: 'Week 21 Sales', period: 'May 22 - May 28, 2023', sales: 36200, target: 35000, progress: 103 },
            { id: 3, title: 'Week 20 Sales', period: 'May 15 - May 21, 2023', sales: 33800, target: 35000, progress: 97 }
          ]
        });
      }, 500);
    });
  },

  getMonthlyReports: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          reports: [
            { id: 1, title: 'May 2023 Sales', period: 'May 1-31, 2023', sales: 150000, target: 145000, progress: 103 },
            { id: 2, title: 'April 2023 Sales', period: 'Apr 1-30, 2023', sales: 135000, target: 135000, progress: 100 },
            { id: 3, title: 'March 2023 Sales', period: 'Mar 1-31, 2023', sales: 125000, target: 130000, progress: 96 }
          ]
        });
      }, 500);
    });
  },

  getSalesTrends: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          trends: [
            { date: '2023-01', sales: 100000, target: 95000 },
            { date: '2023-02', sales: 110000, target: 105000 },
            { date: '2023-03', sales: 115000, target: 115000 },
            { date: '2023-04', sales: 125000, target: 125000 },
            { date: '2023-05', sales: 135000, target: 135000 },
            { date: '2023-06', sales: 150000, target: 145000 }
          ]
        });
      }, 500);
    });
  },

  getSalesByChannel: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          channels: [
            { channel: 'Direct Sales', amount: 450000, percentage: 36 },
            { channel: 'Partner Referrals', amount: 325000, percentage: 26 },
            { channel: 'Website Leads', amount: 275000, percentage: 22 },
            { channel: 'LinkedIn Outreach', amount: 150000, percentage: 12 },
            { channel: 'Other Sources', amount: 50000, percentage: 4 }
          ]
        });
      }, 500);
    });
  },

  getTopProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          products: [
            { name: 'Web Development', sales: 15, revenue: 375000 },
            { name: 'App Development', sales: 10, revenue: 350000 },
            { name: 'SEO Services', sales: 18, revenue: 270000 },
            { name: 'Content Marketing', sales: 22, revenue: 220000 },
            { name: 'Cloud Infrastructure', sales: 8, revenue: 160000 }
          ]
        });
      }, 500);
    });
  },

  sendInvoiceReminder: async (invoiceId: number) => {
    // This would normally call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Reminder sent successfully',
          sentAt: new Date().toISOString()
        });
      }, 500);
    });
  },

  getFinancialPlans: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          plans: [
            {
              id: 1,
              title: 'Q3 2023 Growth Plan',
              description: 'Strategic plan to accelerate growth in Q3 2023',
              targets: [
                { name: 'Revenue', target: 500000, current: 450000 },
                { name: 'New Clients', target: 12, current: 8 },
                { name: 'Profit Margin', target: 35, current: 32 }
              ],
              strategies: [
                'Increase LinkedIn outreach by 50%',
                'Launch new service packages',
                'Implement referral program'
              ],
              createdAt: '2023-05-15'
            },
            {
              id: 2,
              title: 'Cost Optimization Plan',
              description: 'Strategy to optimize costs while maintaining quality',
              targets: [
                { name: 'Expense Reduction', target: 50000, current: 20000 },
                { name: 'Resource Utilization', target: 90, current: 82 },
                { name: 'Process Efficiency', target: 95, current: 88 }
              ],
              strategies: [
                'Renegotiate vendor contracts',
                'Implement new project management system',
                'Optimize team structure'
              ],
              createdAt: '2023-05-10'
            }
          ]
        });
      }, 500);
    });
  }
};

export default financeService;
