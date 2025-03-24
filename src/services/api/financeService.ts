// Mock finance service
const financeService = {
  getFinancialOverview: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        monthly_revenue: 50000,
        growth_rate: 5.2,
        average_transaction: 250,
        new_customers: 50,
      };
    } catch (error) {
      console.error('Error getting financial overview:', error);
      throw error;
    }
  },

  getFinancialMetrics: async (timeframe: 'month' | 'quarter' | 'year' = 'month') => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        summary: {
          revenue: 150000,
          expenses: 100000,
          profit: 50000,
          profit_margin: 33.3,
        },
        sales: {
          new_deals: 20,
          average_deal_size: 2500,
          conversion_rate: 0.15,
        },
        invoices: {
          total_invoices: 100,
          paid_invoices: 80,
          pending_invoices: 20000,
          collection_rate: 80,
        },
        expenses: {
          marketing: 20000,
          salaries: 50000,
          operations: 30000,
        },
      };
    } catch (error) {
      console.error('Error getting financial metrics:', error);
      throw error;
    }
  },

  getFinancialRecords: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          date: '2023-01-05',
          description: 'Invoice payment from ACME Corp',
          type: 'income',
          amount: 5000,
        },
        {
          id: 2,
          date: '2023-01-10',
          description: 'Marketing expenses',
          type: 'expense',
          amount: 2000,
        },
        {
          id: 3,
          date: '2023-01-15',
          description: 'Salary payment to John Doe',
          type: 'expense',
          amount: 6000,
        },
        {
          id: 4,
          date: '2023-01-20',
          description: 'Office rent',
          type: 'expense',
          amount: 3000,
        },
        {
          id: 5,
          date: '2023-01-25',
          description: 'Invoice payment from Beta Co',
          type: 'income',
          amount: 7000,
        },
      ];
    } catch (error) {
      console.error('Error getting financial records:', error);
      throw error;
    }
  },

  getUpsellOpportunities: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          client_id: 1,
          client_name: 'ACME Corp',
          current_services: ['Web Design'],
          suggested_services: ['SEO', 'Content Marketing'],
          potential_value: 3000,
        },
        {
          client_id: 2,
          client_name: 'Beta Co',
          current_services: ['SEO'],
          suggested_services: ['Social Media Marketing'],
          potential_value: 2000,
        },
        {
          client_id: 3,
          client_name: 'Gamma Inc',
          current_services: ['Content Marketing'],
          suggested_services: ['Email Marketing', 'PPC Advertising'],
          potential_value: 4000,
        },
        {
          client_id: 4,
          client_name: 'Delta Ltd',
          current_services: ['Web Design', 'SEO'],
          suggested_services: ['PPC Advertising'],
          potential_value: 2500,
        },
      ];
    } catch (error) {
      console.error('Error getting upsell opportunities:', error);
      throw error;
    }
  },

  // Sales Dashboard methods
  getSalesMetrics: async (period: string = 'month') => {
    try {
      // In a real implementation, this would call your backend API
      // Return mock data for development
      return {
        totalSales: 45600,
        salesGrowth: 8.5,
        newCustomers: 12,
        customerGrowth: 15.3,
        conversionRate: 28,
        conversionGrowth: 3.2,
        averageSale: 3800,
        averageSaleGrowth: 5.1
      };
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      throw error;
    }
  },

  getSalesTrends: async (period: string = 'month') => {
    try {
      // In a real implementation, this would call your backend API
      // Return mock data for development
      return [
        { name: 'Jan', value: 30000 },
        { name: 'Feb', value: 28000 },
        { name: 'Mar', value: 35000 },
        { name: 'Apr', value: 32000 },
        { name: 'May', value: 38000 },
        { name: 'Jun', value: 42000 },
        { name: 'Jul', value: 38000 },
        { name: 'Aug', value: 45600 },
        { name: 'Sep', value: 0 },
        { name: 'Oct', value: 0 },
        { name: 'Nov', value: 0 },
        { name: 'Dec', value: 0 }
      ];
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      throw error;
    }
  },

  getSalesByChannel: async (period: string = 'month') => {
    try {
      // In a real implementation, this would call your backend API
      return [
        { name: 'Direct Sales', value: 40 },
        { name: 'Website', value: 30 },
        { name: 'Referrals', value: 20 },
        { name: 'Social Media', value: 10 }
      ];
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      throw error;
    }
  },

  getTopProducts: async (period: string = 'month') => {
    try {
      // In a real implementation, this would call your backend API
      return [
        { id: 1, name: 'Web Development', sales: 15, units: 15, revenue: 18000, growth: 12 },
        { id: 2, name: 'Design Services', sales: 12, units: 12, revenue: 9600, growth: 8 },
        { id: 3, name: 'SEO Services', sales: 10, units: 10, revenue: 7500, growth: 5 },
        { id: 4, name: 'Content Creation', sales: 8, units: 16, revenue: 6400, growth: -2 },
        { id: 5, name: 'Social Media Mgmt', sales: 6, units: 6, revenue: 4200, growth: 15 }
      ];
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  getSalesGrowthData: async (period: string = 'month') => {
    try {
      // In a real implementation, this would call your backend API
      return {
        trends: [
          { name: 'Jan', Current: 30000, Previous: 25000 },
          { name: 'Feb', Current: 28000, Previous: 26000 },
          { name: 'Mar', Current: 35000, Previous: 30000 },
          { name: 'Apr', Current: 32000, Previous: 29000 },
          { name: 'May', Current: 38000, Previous: 32000 },
          { name: 'Jun', Current: 42000, Previous: 34000 },
          { name: 'Jul', Current: 38000, Previous: 33000 },
          { name: 'Aug', Current: 45600, Previous: 36000 }
        ],
        currentPeriod: {
          revenueGrowth: 22.5,
          customerGrowth: 15.3
        },
        growthDrivers: [
          { factor: 'Web Development Services', impact: 35, performance: 'positive' },
          { factor: 'Referral Program', impact: 25, performance: 'positive' },
          { factor: 'New Client Acquisition', impact: 20, performance: 'neutral' },
          { factor: 'Content Services', impact: -5, performance: 'negative' }
        ],
        insights: [
          'Sales growth is primarily driven by web development services',
          'Referral program showing strong results with 25% contribution to growth',
          'Content services need attention with negative growth trend'
        ],
        activities: [
          { id: 1, title: 'Sales Team Meeting', date: 'Tomorrow', time: '10:00 AM' },
          { id: 2, title: 'Client Pitch: ABC Corp', date: 'Sep 15', time: '2:00 PM' },
          { id: 3, title: 'Quarterly Review', date: 'Sep 30', time: '11:00 AM' }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      throw error;
    }
  },

  getSalesTargets: async (period: string = 'month') => {
    try {
      // In a real implementation, this would call your backend API
      return [
        { id: 1, category: 'Total Revenue', current: 45600, target: 50000, percentage: 91 },
        { id: 2, category: 'New Clients', current: 12, target: 15, percentage: 80 },
        { id: 3, category: 'Web Development', current: 18000, target: 20000, percentage: 90 },
        { id: 4, category: 'Design Services', current: 9600, target: 12000, percentage: 80 }
      ];
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      throw error;
    }
  },

  getGrowthForecast: async (period: string = 'month') => {
    try {
      // In a real implementation, this would call your backend API
      return {
        chart: [
          { name: 'Sep', Forecast: 48000, Target: 52000 },
          { name: 'Oct', Forecast: 52000, Target: 55000 },
          { name: 'Nov', Forecast: 58000, Target: 60000 },
          { name: 'Dec', Forecast: 65000, Target: 65000 }
        ],
        insights: [
          { type: 'success', text: 'Forecasted to meet Q4 target of $230,000' },
          { type: 'success', text: 'Client acquisition trending upward with 15% growth rate' },
          { type: 'warning', text: 'September may fall short of target by ~$4,000' },
          { type: 'warning', text: 'Content services need attention to meet yearly goal' }
        ]
      };
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      throw error;
    }
  },

  getSalesFollowUps: async () => {
    try {
      // In a real implementation, this would call your backend API
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      return [
        { 
          id: 1, 
          clientName: 'ABC Corporation', 
          contactPerson: 'John Smith',
          phone: '(555) 123-4567',
          email: 'john@abccorp.com',
          type: 'call', 
          dueDate: lastWeek.toISOString(), 
          notes: 'Follow up on website proposal. Client was interested but needed time to review with team.',
          status: 'pending'
        },
        { 
          id: 2, 
          clientName: 'XYZ Industries', 
          contactPerson: 'Sarah Johnson',
          phone: '(555) 987-6543',
          email: 'sarah@xyzindustries.com',
          type: 'email', 
          dueDate: tomorrow.toISOString(), 
          notes: 'Send revised quote for SEO services based on last meeting discussion.',
          status: 'pending'
        },
        { 
          id: 3, 
          clientName: 'Tech Solutions Inc', 
          contactPerson: 'Michael Lee',
          phone: '(555) 456-7890',
          email: 'michael@techsolutions.com',
          type: 'meeting', 
          dueDate: nextWeek.toISOString(), 
          notes: 'Quarterly review meeting to discuss ongoing projects and potential new services.',
          status: 'pending'
        },
        { 
          id: 4, 
          clientName: 'Global Enterprises', 
          contactPerson: 'Emily Chen',
          phone: '(555) 789-0123',
          email: 'emily@globalent.com',
          type: 'call', 
          dueDate: today.toISOString(), 
          notes: 'Check on satisfaction with recent website launch and discuss maintenance package options.',
          status: 'pending'
        },
        { 
          id: 5, 
          clientName: 'Innovative Brands', 
          contactPerson: 'David Wilson',
          phone: '(555) 234-5678',
          email: 'david@innovativebrands.com',
          type: 'email', 
          dueDate: '2023-08-15T10:00:00', 
          notes: 'Follow up on social media campaign proposal. Client was very interested.',
          status: 'completed'
        }
      ];
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      throw error;
    }
  },

  completeFollowUp: async (id: number, feedback: string) => {
    try {
      // In a real implementation, this would call your backend API
      console.log(`Completing follow-up ${id} with feedback: ${feedback}`);
      return { success: true };
    } catch (error) {
      console.error('Error completing follow-up:', error);
      throw error;
    }
  },

  getImprovementSuggestions: async () => {
    try {
      // In a real implementation, this would call your backend API
      return [
        {
          id: 1,
          title: 'Increase Follow-up Frequency',
          description: 'Data shows 30% higher close rates when follow-ups happen within 48 hours.',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Focus on Web Development Upsells',
          description: 'Current clients have shown 45% conversion on web maintenance packages.',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Revise Content Service Offerings',
          description: 'Current packages underperforming by 15% compared to industry benchmarks.',
          priority: 'high'
        }
      ];
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      throw error;
    }
  },

  getWeeklyReports: async () => {
    try {
      // In a real implementation, this would call your backend API
      return [
        {
          id: 1,
          title: 'Weekly Sales Report - W35',
          period: 'Aug 28 - Sep 3, 2023',
          sales: 12500,
          target: 15000,
          progress: 83,
          performanceData: [
            { name: 'Mon', Sales: 2200 },
            { name: 'Tue', Sales: 2800 },
            { name: 'Wed', Sales: 1800 },
            { name: 'Thu', Sales: 2400 },
            { name: 'Fri', Sales: 3300 },
            { name: 'Sat', Sales: 0 },
            { name: 'Sun', Sales: 0 }
          ],
          metrics: {
            conversionRate: 22,
            prevConversionRate: 18,
            avgSaleValue: 3125,
            prevAvgSaleValue: 2950,
            newLeads: 12,
            prevNewLeads: 10,
            closedDeals: 4,
            prevClosedDeals: 3
          }
        },
        {
          id: 2,
          title: 'Weekly Sales Report - W34',
          period: 'Aug 21 - Aug 27, 2023',
          sales: 13200,
          target: 15000,
          progress: 88,
        },
        {
          id: 3,
          title: 'Weekly Sales Report - W33',
          period: 'Aug 14 - Aug 20, 2023',
          sales: 11800,
          target: 14000,
          progress: 84,
        }
      ];
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      throw error;
    }
  },

  getMonthlyReports: async () => {
    try {
      // In a real implementation, this would call your backend API
      return [
        {
          id: 1,
          title: 'Monthly Sales Report - August 2023',
          period: 'Aug 1 - Aug 31, 2023',
          sales: 45600,
          target: 50000,
          progress: 91,
          yearlyTrend: [
            { name: 'Jan', Sales: 30000, Target: 35000 },
            { name: 'Feb', Sales: 28000, Target: 35000 },
            { name: 'Mar', Sales: 35000, Target: 40000 },
            { name: 'Apr', Sales: 32000, Target: 40000 },
            { name: 'May', Sales: 38000, Target: 45000 },
            { name: 'Jun', Sales: 42000, Target: 45000 },
            { name: 'Jul', Sales: 38000, Target: 45000 },
            { name: 'Aug', Sales: 45600, Target: 50000 },
            { name: 'Sep', Sales: 0, Target: 50000 },
            { name: 'Oct', Sales: 0, Target: 55000 },
            { name: 'Nov', Sales: 0, Target: 55000 },
            { name: 'Dec', Sales: 0, Target: 60000 }
          ]
        },
        {
          id: 2,
          title: 'Monthly Sales Report - July 2023',
          period: 'Jul 1 - Jul 31, 2023',
          sales: 38000,
          target: 45000,
          progress: 84,
        },
        {
          id: 3,
          title: 'Monthly Sales Report - June 2023',
          period: 'Jun 1 - Jun 30, 2023',
          sales: 42000,
          target: 45000,
          progress: 93,
        }
      ];
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      throw error;
    }
  }
};

export { financeService };
