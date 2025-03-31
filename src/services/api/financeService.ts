
import apiClient, { handleApiError } from '@/utils/apiUtils';
import { supabase } from '@/integrations/supabase/client';

// Mock data generator (for development until the API is ready)
const generateMockData = (type: string, params?: any) => {
  // This will be replaced with actual API calls in production
  switch (type) {
    case 'invoices':
      return Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        invoice_number: `INV-${2023}${i.toString().padStart(4, '0')}`,
        client_name: `Client ${i + 1}`,
        amount: Math.floor(Math.random() * 10000) + 500,
        status: ['pending', 'paid', 'overdue'][Math.floor(Math.random() * 3)],
        issue_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }));
    
    case 'financial-records':
      return Array(20).fill(null).map((_, i) => ({
        id: i + 1,
        record_type: Math.random() > 0.5 ? 'expense' : 'income',
        amount: Math.floor(Math.random() * 5000) + 100,
        description: `${Math.random() > 0.5 ? 'expense' : 'income'} record ${i + 1}`,
        category: ['salaries', 'rent', 'utilities', 'marketing', 'sales', 'services'][Math.floor(Math.random() * 6)],
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }));
    
    case 'sales-metrics':
      return {
        total_revenue: Math.floor(Math.random() * 1000000) + 100000,
        growth_rate: (Math.random() * 30).toFixed(1),
        average_deal_size: Math.floor(Math.random() * 10000) + 1000,
        conversion_rate: (Math.random() * 100).toFixed(1),
        monthly_trend: Array(12).fill(null).map((_, i) => ({
          month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
          revenue: Math.floor(Math.random() * 100000) + 10000,
          target: Math.floor(Math.random() * 120000) + 20000,
        })),
        by_service: [
          { name: 'Web Design', value: Math.floor(Math.random() * 50000) + 10000 },
          { name: 'SEO', value: Math.floor(Math.random() * 40000) + 5000 },
          { name: 'Social Media', value: Math.floor(Math.random() * 30000) + 5000 },
          { name: 'Content Creation', value: Math.floor(Math.random() * 20000) + 5000 },
        ],
      };

    case 'sales-trends':
      return {
        data: Array(12).fill(null).map((_, i) => ({
          name: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
          value: Math.floor(Math.random() * 100000) + 10000,
        })),
        insights: [
          'Revenue increased by 15% compared to previous quarter',
          'Highest growth seen in digital marketing services',
          'Client retention rate improved to 85%',
          'Average project value increased by $2,500',
        ],
        activities: Array(4).fill(null).map((_, i) => ({
          id: i + 1,
          title: ['Client Meeting', 'Sales Call', 'Proposal Review', 'Contract Signing'][i],
          date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: ['10:00 AM', '2:30 PM', '11:15 AM', '4:00 PM'][i],
        })),
      };
    
    case 'sales-by-channel':
      return [
        { name: 'Direct', value: Math.floor(Math.random() * 50000) + 10000 },
        { name: 'Referral', value: Math.floor(Math.random() * 40000) + 5000 },
        { name: 'Website', value: Math.floor(Math.random() * 30000) + 5000 },
        { name: 'Social Media', value: Math.floor(Math.random() * 20000) + 5000 },
        { name: 'Email', value: Math.floor(Math.random() * 10000) + 5000 },
      ];
    
    case 'top-products':
      return Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        name: ['Web Design Package', 'SEO Services', 'Social Media Management', 'Content Creation', 'Branding Package'][i],
        sales: Math.floor(Math.random() * 100) + 10,
        units: Math.floor(Math.random() * 50) + 5,
        revenue: Math.floor(Math.random() * 50000) + 5000,
        growth: Math.floor(Math.random() * 40) - 10,
      }));
    
    case 'sales-growth':
      return {
        trends: Array(12).fill(null).map((_, i) => ({
          name: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
          value: Math.floor(Math.random() * 100000) + 10000,
        })),
        currentPeriod: {
          revenueGrowth: (Math.random() * 30).toFixed(1),
          customerGrowth: (Math.random() * 25).toFixed(1),
        },
        growthDrivers: [
          { factor: 'New Clients', impact: 35, performance: 'positive' },
          { factor: 'Upselling', impact: 25, performance: 'positive' },
          { factor: 'Referrals', impact: 20, performance: 'neutral' },
          { factor: 'Renewals', impact: 15, performance: 'negative' },
        ],
      };
    
    case 'sales-targets':
      return Array(4).fill(null).map((_, i) => ({
        id: i + 1,
        category: ['Monthly Revenue', 'New Clients', 'Renewal Rate', 'Average Deal Size'][i],
        current: [85000, 12, 75, 7500][i],
        target: [100000, 15, 80, 10000][i],
        percentage: Math.floor([85, 80, 94, 75][i]),
      }));
    
    case 'growth-forecast':
      return {
        chart: Array(12).fill(null).map((_, i) => ({
          name: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
          value: Math.floor(Math.random() * 150000) + 50000,
        })),
        insights: [
          { type: 'growth', text: 'Projected 22% growth in Q3 based on new service offerings' },
          { type: 'growth', text: 'Client acquisition expected to increase by 15% next quarter' },
          { type: 'warning', text: 'Projected resource constraints in Q4 may impact delivery timelines' },
          { type: 'growth', text: 'Recurring revenue forecasted to grow by 30% year over year' },
        ],
      };
    
    case 'weekly-reports':
      return Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Weekly Sales Report ${i + 1}`,
        period: `Week ${i + 1}, ${new Date().getFullYear()}`,
        sales: Math.floor(Math.random() * 50000) + 10000,
        target: Math.floor(Math.random() * 60000) + 20000,
        progress: Math.floor(Math.random() * 100),
        performanceData: Array(7).fill(null).map((_, j) => ({
          name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][j],
          value: Math.floor(Math.random() * 10000) + 1000,
        })),
        metrics: {
          conversionRate: (Math.random() * 10 + 5).toFixed(1),
          prevConversionRate: (Math.random() * 10 + 5).toFixed(1),
          avgSaleValue: Math.floor(Math.random() * 5000) + 1000,
          prevAvgSaleValue: Math.floor(Math.random() * 5000) + 1000,
          newLeads: Math.floor(Math.random() * 50) + 10,
          prevNewLeads: Math.floor(Math.random() * 50) + 10,
          closedDeals: Math.floor(Math.random() * 20) + 5,
          prevClosedDeals: Math.floor(Math.random() * 20) + 5,
        },
      }));
    
    case 'monthly-reports':
      return Array(12).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Monthly Sales Report ${i + 1}`,
        period: new Date(2023, i, 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
        sales: Math.floor(Math.random() * 200000) + 50000,
        target: Math.floor(Math.random() * 250000) + 100000,
        progress: Math.floor(Math.random() * 100),
        yearlyTrend: Array(12).fill(null).map((_, j) => ({
          name: new Date(2023, j, 1).toLocaleString('default', { month: 'short' }),
          value: Math.floor(Math.random() * 200000) + 50000,
        })),
      }));
    
    case 'sales-followups':
      return Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        clientName: `Client ${i + 1}`,
        contactPerson: `Contact Person ${i + 1}`,
        type: ['call', 'email', 'meeting'][Math.floor(Math.random() * 3)],
        dueDate: new Date(Date.now() + (Math.random() * 10 - 3) * 24 * 60 * 60 * 1000).toISOString(),
        status: ['pending', 'completed'][Math.floor(Math.random() * 2)],
        notes: `Follow up about ${['proposal', 'contract', 'project update', 'invoice payment'][Math.floor(Math.random() * 4)]}`,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `contact${i + 1}@client${i + 1}.com`,
      }));
    
    case 'improvement-suggestions':
      return Array(4).fill(null).map((_, i) => ({
        id: i + 1,
        title: [
          'Enhance Client Onboarding Process',
          'Improve Follow-up Timeline',
          'Optimize Proposal Templates',
          'Develop Client Retention Strategy'
        ][i],
        description: [
          'Current onboarding takes 14 days on average. Streamlining documentation and approvals could reduce this to 7 days.',
          'Follow-ups are currently happening 5+ days after initial contact. Aim for 48-hour follow-up window to increase conversion.',
          'Current proposal acceptance rate is 65%. Analyzing successful proposals shows more detailed pricing breakdowns improve acceptance.',
          'Client renewal rate is 72%. Implementing quarterly review meetings could increase this to 85%.'
        ][i],
        priority: i < 2 ? 'high' : 'medium',
      }));
    
    case 'financial-overview':
      return {
        totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
        totalExpenses: Math.floor(Math.random() * 700000) + 300000,
        netProfit: Math.floor(Math.random() * 300000) + 200000,
        profitMargin: (Math.random() * 20 + 10).toFixed(1),
        cashFlow: Math.floor(Math.random() * 200000) + 100000,
        revenueGrowth: (Math.random() * 30).toFixed(1),
        expenseGrowth: (Math.random() * 20).toFixed(1),
        outstandingInvoices: Math.floor(Math.random() * 200000) + 50000,
        monthlySummary: Array(12).fill(null).map((_, i) => ({
          month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
          revenue: Math.floor(Math.random() * 100000) + 50000,
          expenses: Math.floor(Math.random() * 70000) + 30000,
          profit: Math.floor(Math.random() * 30000) + 20000,
        })),
      };
    
    case 'financial-metrics':
      return {
        currentRatio: (Math.random() * 2 + 1).toFixed(2),
        quickRatio: (Math.random() * 1 + 0.5).toFixed(2),
        debtToEquity: (Math.random() * 1).toFixed(2),
        grossMargin: (Math.random() * 30 + 40).toFixed(1),
        netMargin: (Math.random() * 15 + 10).toFixed(1),
        roi: (Math.random() * 20 + 15).toFixed(1),
        burnRate: Math.floor(Math.random() * 50000) + 20000,
        runwayMonths: Math.floor(Math.random() * 12) + 6,
        averageCollectionPeriod: Math.floor(Math.random() * 30) + 30,
        assetTurnover: (Math.random() * 1 + 0.5).toFixed(2),
      };
    
    case 'upsell-opportunities':
      return Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        clientName: `Client ${i + 1}`,
        currentServices: [
          'Web Design',
          'Content Creation',
          'SEO Services',
          'Social Media Management',
          'Email Marketing'
        ][i],
        potentialUpsell: [
          'Ongoing Maintenance Package',
          'Content Strategy Upgrade',
          'Local SEO Enhancement',
          'Paid Social Campaigns',
          'Marketing Automation'
        ][i],
        estimatedValue: Math.floor(Math.random() * 5000) + 1000,
        probability: Math.floor(Math.random() * 50) + 50,
        lastPurchase: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      }));
    
    case 'financial-plans':
      return Array(3).fill(null).map((_, i) => ({
        id: i + 1,
        title: [
          'Q3 Financial Stabilization Plan',
          'Annual Growth Strategy',
          'Cost Optimization Initiative'
        ][i],
        description: [
          'Plan to improve cash flow and reduce outstanding receivables',
          'Strategic financial planning for annual growth targets',
          'Initiative to optimize operational costs while maintaining quality'
        ][i],
        startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        endDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: ['in_progress', 'planned', 'completed'][i],
        goals: Array(3).fill(null).map(() => ({
          title: ['Reduce DSO', 'Increase Gross Margin', 'Optimize Pricing Strategy', 'Reduce Operational Costs', 'Improve Cash Reserves'][Math.floor(Math.random() * 5)],
          target: `${Math.floor(Math.random() * 30) + 10}%`,
          current: `${Math.floor(Math.random() * 20) + 5}%`,
        })),
        kpis: Array(4).fill(null).map(() => ({
          name: ['DSO', 'Gross Margin', 'Net Profit Margin', 'Operating Expenses', 'Cash Reserves'][Math.floor(Math.random() * 5)],
          target: Math.floor(Math.random() * 100),
          current: Math.floor(Math.random() * 80),
        })),
      }));
    
    default:
      return [];
  }
};

const financeService = {
  // Invoice-related methods
  getInvoices: async (status?: string) => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/invoices', { params: { status } });
      
      // Mock data for development
      const invoices = generateMockData('invoices');
      if (status) {
        return invoices.filter((invoice: any) => invoice.status === status);
      }
      return invoices;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      // In production, this would be an API call
      // return await apiClient.get(`/invoices/${invoiceId}`);
      
      // Mock data for development
      const invoices = generateMockData('invoices');
      return invoices.find((invoice: any) => invoice.id === invoiceId) || null;
    } catch (error) {
      return handleApiError(error, null);
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      // In production, this would be an API call
      // return await apiClient.post('/invoices', invoiceData);
      
      // Mock response for development
      return { 
        success: true, 
        message: 'Invoice created successfully', 
        invoice: { id: Date.now(), ...invoiceData } 
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to create invoice' });
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      // In production, this would be an API call
      // return await apiClient.patch(`/invoices/${invoiceId}`, { status });
      
      // Mock response for development
      return { 
        success: true, 
        message: `Invoice status updated to ${status}` 
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to update invoice status' });
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      // In production, this would be an API call
      // return await apiClient.post(`/invoices/${invoiceId}/reminder`);
      
      // Mock response for development
      return { 
        success: true, 
        message: 'Payment reminder sent successfully' 
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to send payment reminder' });
    }
  },
  
  // Reports-related methods
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/reports/revenue', { params: { startDate, endDate } });
      
      // Mock data for development
      return {
        totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
        comparisonPercentage: (Math.random() * 30 - 10).toFixed(1),
        monthlyData: Array(12).fill(null).map((_, i) => ({
          month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
          revenue: Math.floor(Math.random() * 100000) + 50000,
        })),
        byCategory: [
          { name: 'Web Development', value: Math.floor(Math.random() * 400000) + 200000 },
          { name: 'Design Services', value: Math.floor(Math.random() * 300000) + 150000 },
          { name: 'Marketing', value: Math.floor(Math.random() * 200000) + 100000 },
          { name: 'Consulting', value: Math.floor(Math.random() * 100000) + 50000 },
        ],
      };
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/reports/expenses', { params: { startDate, endDate } });
      
      // Mock data for development
      return {
        totalExpenses: Math.floor(Math.random() * 700000) + 300000,
        comparisonPercentage: (Math.random() * 20 - 5).toFixed(1),
        monthlyData: Array(12).fill(null).map((_, i) => ({
          month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
          expenses: Math.floor(Math.random() * 70000) + 30000,
        })),
        byCategory: [
          { name: 'Salaries', value: Math.floor(Math.random() * 400000) + 200000 },
          { name: 'Office Rent', value: Math.floor(Math.random() * 100000) + 50000 },
          { name: 'Marketing', value: Math.floor(Math.random() * 80000) + 40000 },
          { name: 'Software', value: Math.floor(Math.random() * 60000) + 30000 },
          { name: 'Utilities', value: Math.floor(Math.random() * 40000) + 20000 },
          { name: 'Other', value: Math.floor(Math.random() * 20000) + 10000 },
        ],
      };
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  getProfitLossReport: async (year: number) => {
    try {
      // In production, this would be an API call
      // return await apiClient.get(`/reports/profit-loss/${year}`);
      
      // Mock data for development
      return {
        year,
        netProfit: Math.floor(Math.random() * 300000) + 200000,
        comparisonPercentage: (Math.random() * 25 - 5).toFixed(1),
        quarterlyData: Array(4).fill(null).map((_, i) => ({
          quarter: `Q${i + 1}`,
          revenue: Math.floor(Math.random() * 250000) + 150000,
          expenses: Math.floor(Math.random() * 200000) + 100000,
          profit: Math.floor(Math.random() * 100000) + 50000,
        })),
        monthlyData: Array(12).fill(null).map((_, i) => ({
          month: new Date(year, i, 1).toLocaleString('default', { month: 'short' }),
          revenue: Math.floor(Math.random() * 100000) + 50000,
          expenses: Math.floor(Math.random() * 70000) + 30000,
          profit: Math.floor(Math.random() * 30000) + 20000,
        })),
      };
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  // Finance records methods
  getFinancialRecords: async (type?: string, startDate?: string, endDate?: string) => {
    try {
      // In production, this would be an API call
      // const url = '/financial-records';
      // return await apiClient.get(url, { params: { type, startDate, endDate } });
      
      // Mock data for development
      const records = generateMockData('financial-records');
      if (type) {
        return records.filter((record: any) => record.record_type === type);
      }
      return records;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  createFinancialRecord: async (recordData: any) => {
    try {
      // In production, this would be an API call
      // return await apiClient.post('/financial-records', recordData);
      
      // Mock response for development
      return { 
        success: true, 
        message: 'Financial record created successfully', 
        record: { id: Date.now(), ...recordData } 
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to create financial record' });
    }
  },
  
  // Financial metrics and overview
  getFinancialOverview: async (period: string = 'month') => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/financial-overview', { params: { period } });
      
      // Mock data for development
      return generateMockData('financial-overview');
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  getFinancialMetrics: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/financial-metrics');
      
      // Mock data for development
      return generateMockData('financial-metrics');
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  getUpsellOpportunities: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/upsell-opportunities');
      
      // Mock data for development
      return generateMockData('upsell-opportunities');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getFinancialPlans: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/financial-plans');
      
      // Mock data for development
      return generateMockData('financial-plans');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  // Sales data methods
  getSalesMetrics: async (period: string = 'month') => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/metrics', { params: { period } });
      
      // Mock data for development
      return generateMockData('sales-metrics');
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  getSalesTrends: async (dateRange: string = 'month') => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/trends', { params: { dateRange } });
      
      // Mock data for development
      return generateMockData('sales-trends');
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  getSalesByChannel: async (dateRange: string = 'month') => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/by-channel', { params: { dateRange } });
      
      // Mock data for development
      return generateMockData('sales-by-channel');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getTopProducts: async (dateRange: string = 'month') => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/top-products', { params: { dateRange } });
      
      // Mock data for development
      return generateMockData('top-products');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getSalesGrowthData: async (dateRange: string = 'month') => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/growth', { params: { dateRange } });
      
      // Mock data for development
      return generateMockData('sales-growth');
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  getSalesTargets: async (dateRange: string = 'month') => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/targets', { params: { dateRange } });
      
      // Mock data for development
      return generateMockData('sales-targets');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getGrowthForecast: async (dateRange: string = 'month') => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/forecast', { params: { dateRange } });
      
      // Mock data for development
      return generateMockData('growth-forecast');
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  getWeeklyReports: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/reports/weekly');
      
      // Mock data for development
      return generateMockData('weekly-reports');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getMonthlyReports: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/reports/monthly');
      
      // Mock data for development
      return generateMockData('monthly-reports');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getSalesFollowUps: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/followups');
      
      // Mock data for development
      return generateMockData('sales-followups');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getImprovementSuggestions: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/sales/improvement-suggestions');
      
      // Mock data for development
      return generateMockData('improvement-suggestions');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  completeFollowUp: async (followUpId: number, feedback: string) => {
    try {
      // In production, this would be an API call
      // return await apiClient.post(`/sales/followups/${followUpId}/complete`, { feedback });
      
      // Mock response for development
      return { 
        success: true, 
        message: 'Follow-up marked as completed',
        id: followUpId
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to complete follow-up' });
    }
  },
};

export default financeService;
