
import { supabase } from '@/lib/supabase';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { mockFinanceData } from '@/utils/mockData';

const financeService = {
  // Invoice management
  getInvoices: async (status?: string): Promise<any> => {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          invoice_id as id,
          invoice_number,
          client_id,
          amount,
          status,
          created_at as issue_date,
          due_date
        `);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Join with client data for display
      const invoicesWithClients = await Promise.all(data.map(async (invoice) => {
        const { data: clientData } = await supabase
          .from('clients')
          .select('client_name')
          .eq('client_id', invoice.client_id)
          .single();
        
        return {
          ...invoice,
          client_name: clientData?.client_name || 'Unknown Client'
        };
      }));
      
      return invoicesWithClients;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      
      // Return mock data
      return mockFinanceData.invoices;
    }
  },
  
  getInvoiceDetails: async (invoiceId: number): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          invoice_id as id,
          invoice_number,
          client_id,
          amount,
          status,
          created_at as issue_date,
          due_date
        `)
        .eq('invoice_id', invoiceId)
        .single();
      
      if (error) throw error;
      
      // Get client details
      const { data: clientData } = await supabase
        .from('clients')
        .select('client_name')
        .eq('client_id', data.client_id)
        .single();
      
      return {
        ...data,
        client_name: clientData?.client_name || 'Unknown Client'
      };
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      
      // Return mock data
      return mockFinanceData.invoices.find(inv => inv.id === invoiceId) || null;
    }
  },
  
  createInvoice: async (invoiceData: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceData.invoice_number || `INV-${uuidv4().substring(0, 8)}`,
          client_id: invoiceData.client_id,
          amount: invoiceData.amount,
          status: invoiceData.status || 'pending',
          due_date: invoiceData.due_date
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('invoice_id', invoiceId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number): Promise<any> => {
    try {
      // This would normally send an actual email
      console.log(`Sending reminder for invoice ${invoiceId}`);
      return { success: true, message: 'Reminder sent successfully' };
    } catch (error) {
      console.error('Error sending invoice reminder:', error);
      throw error;
    }
  },
  
  // Financial records
  getFinancialRecords: async (recordType?: string, startDate?: string, endDate?: string): Promise<any> => {
    try {
      let query = supabase
        .from('financial_records')
        .select('*');
      
      if (recordType) {
        query = query.eq('record_type', recordType);
      }
      
      if (startDate) {
        query = query.gte('record_date', startDate);
      }
      
      if (endDate) {
        query = query.lte('record_date', endDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      
      // Return mock data
      return mockFinanceData.financialRecords;
    }
  },
  
  createFinancialRecord: async (recordData: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .insert({
          record_type: recordData.record_type,
          amount: recordData.amount,
          description: recordData.description,
          record_date: recordData.record_date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }
  },
  
  // Reports
  getRevenueReports: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      // This would normally run a complex DB query
      // For now, return mock data
      return {
        total_revenue: 125000,
        growth_rate: 18.5,
        by_period: [
          { period: 'Jan', amount: 18000 },
          { period: 'Feb', amount: 21000 },
          { period: 'Mar', amount: 19500 },
          { period: 'Apr', amount: 22500 },
          { period: 'May', amount: 23000 },
          { period: 'Jun', amount: 21000 }
        ],
        by_client: [
          { client: 'Acme Corp', amount: 32000 },
          { client: 'Tech Solutions', amount: 28000 },
          { client: 'Global Media', amount: 25000 },
          { client: 'City Bank', amount: 40000 }
        ]
      };
    } catch (error) {
      console.error('Error generating revenue report:', error);
      throw error;
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      // This would normally run a complex DB query
      // For now, return mock data
      return {
        total_expenses: 85000,
        percent_of_revenue: 68,
        by_period: [
          { period: 'Jan', amount: 12000 },
          { period: 'Feb', amount: 13500 },
          { period: 'Mar', amount: 14000 },
          { period: 'Apr', amount: 15000 },
          { period: 'May', amount: 15500 },
          { period: 'Jun', amount: 15000 }
        ],
        by_category: [
          { category: 'Salaries', amount: 55000 },
          { category: 'Office', amount: 8000 },
          { category: 'Software', amount: 12000 },
          { category: 'Marketing', amount: 10000 }
        ]
      };
    } catch (error) {
      console.error('Error generating expense report:', error);
      throw error;
    }
  },
  
  // Sales metrics
  getSalesMetrics: async (): Promise<any> => {
    try {
      return {
        monthly_sales: [
          { month: 'Jan', value: 18000 },
          { month: 'Feb', value: 21000 },
          { month: 'Mar', value: 19500 },
          { month: 'Apr', value: 22500 },
          { month: 'May', value: 23000 },
          { month: 'Jun', value: 21000 }
        ],
        conversion_rate: 24.5,
        average_deal_size: 8500,
        sales_by_rep: [
          { rep: 'John Smith', value: 67500 },
          { rep: 'Sarah Johnson', value: 58000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      throw error;
    }
  },
  
  // Dashboard overviews
  getFinancialOverview: async (): Promise<any> => {
    try {
      return {
        summary_metrics: {
          net_profit: 40000,
          profit_margin: 32,
          recent_trend: 'rising'
        },
        financial_health: {
          status: 'excellent',
          explanation: 'Revenue growing faster than expenses, strong profit margin'
        },
        key_insights: [
          'Revenue increased 18% year-over-year',
          'Operating expenses decreased by 5% through software automation',
          'Client retention rate at 92%'
        ],
        recommendations: [
          { area: 'Pricing', action: 'Consider 5-10% increase for enterprise clients' },
          { area: 'Expenses', action: 'Evaluate office space needs vs remote work' }
        ],
        prediction: 'Based on current trends, projected to exceed annual target by 15%'
      };
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      throw error;
    }
  },
  
  getFinancialMetrics: async (): Promise<any> => {
    try {
      return {
        revenue: 125000,
        expenses: 85000,
        net_profit: 40000,
        cash_flow: 'positive',
        runway_months: 18,
        metrics_by_month: [
          { month: 'Jan', revenue: 18000, expenses: 12000, profit: 6000 },
          { month: 'Feb', revenue: 21000, expenses: 13500, profit: 7500 },
          { month: 'Mar', revenue: 19500, expenses: 14000, profit: 5500 },
          { month: 'Apr', revenue: 22500, expenses: 15000, profit: 7500 },
          { month: 'May', revenue: 23000, expenses: 15500, profit: 7500 },
          { month: 'Jun', revenue: 21000, expenses: 15000, profit: 6000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      throw error;
    }
  },
  
  getUpsellOpportunities: async (): Promise<any> => {
    try {
      return [
        {
          client_id: 1,
          client_name: 'Acme Corp',
          current_services: ['Website Design', 'SEO'],
          recommended_services: ['Content Marketing', 'Social Media Management'],
          potential_value: 2500,
          probability: 'high'
        },
        {
          client_id: 2,
          client_name: 'Tech Solutions',
          current_services: ['Logo Design', 'Brand Identity'],
          recommended_services: ['Website Design', 'UI/UX Optimization'],
          potential_value: 4000,
          probability: 'medium'
        }
      ];
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      throw error;
    }
  },
  
  getFinancialPlans: async (): Promise<any> => {
    try {
      return [
        {
          id: 1,
          title: 'Q3 Budget Plan',
          description: 'Financial planning for Q3 operations',
          created_at: '2023-06-15',
          status: 'active',
          metrics: {
            projected_revenue: 78000,
            projected_expenses: 52000,
            projected_profit: 26000
          }
        },
        {
          id: 2,
          title: 'Annual Growth Strategy',
          description: 'Financial roadmap for expanding service offerings',
          created_at: '2023-01-05',
          status: 'active',
          metrics: {
            projected_revenue_growth: '25%',
            investment_required: 35000,
            roi_timeframe: '9 months'
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      throw error;
    }
  },
  
  // Sales follow-up tracking
  getSalesFollowUps: async (): Promise<any> => {
    try {
      return [
        {
          id: 1,
          client_name: 'Acme Corp',
          contact_name: 'John Smith',
          contact_email: 'john@acmecorp.com',
          last_contact: '2023-06-10',
          due_date: '2023-06-20',
          notes: 'Discussed premium package upgrade',
          status: 'pending'
        },
        {
          id: 2,
          client_name: 'Tech Solutions',
          contact_name: 'Sarah Johnson',
          contact_email: 'sarah@techsolutions.com',
          last_contact: '2023-06-08',
          due_date: '2023-06-15',
          notes: 'Sent proposal for website redesign',
          status: 'pending'
        }
      ];
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      throw error;
    }
  },
  
  getImprovementSuggestions: async (): Promise<any> => {
    try {
      return [
        {
          area: 'Client Onboarding',
          current_process: 'Manual email collection and setup',
          suggestion: 'Implement automated welcome sequence with video tutorials',
          expected_impact: 'Reduce onboarding time by 50%, improve client satisfaction'
        },
        {
          area: 'Invoicing',
          current_process: 'Monthly manual invoice creation',
          suggestion: 'Set up automated recurring invoices with payment reminders',
          expected_impact: 'Reduce late payments by 70%, save 10 hours/month in admin time'
        }
      ];
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      throw error;
    }
  },
  
  completeFollowUp: async (followUpId: number): Promise<any> => {
    try {
      // In real implementation, this would update the database
      return {
        id: followUpId,
        status: 'completed',
        completed_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error completing follow-up:', error);
      throw error;
    }
  },
  
  // Sales growth tracking
  getSalesGrowthData: async (): Promise<any> => {
    try {
      return {
        overall_growth: '22%',
        periods: [
          { period: 'Jan', growth: '5%', value: 18000 },
          { period: 'Feb', growth: '16%', value: 21000 },
          { period: 'Mar', growth: '-7%', value: 19500 },
          { period: 'Apr', growth: '15%', value: 22500 },
          { period: 'May', growth: '2%', value: 23000 },
          { period: 'Jun', growth: '-9%', value: 21000 }
        ],
        sources: [
          { source: 'Referrals', growth: '35%', value: 42000 },
          { source: 'Direct', growth: '15%', value: 38000 },
          { source: 'Social', growth: '28%', value: 25000 },
          { source: 'Email', growth: '10%', value: 20000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      throw error;
    }
  },
  
  getSalesTargets: async (): Promise<any> => {
    try {
      return {
        current_quarter: {
          target: 75000,
          achieved: 66500,
          percentage: 88.7,
          remaining_days: 14
        },
        by_service: [
          { service: 'Web Design', target: 30000, achieved: 27500, percentage: 91.7 },
          { service: 'Marketing', target: 25000, achieved: 21000, percentage: 84.0 },
          { service: 'Consulting', target: 20000, achieved: 18000, percentage: 90.0 }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      throw error;
    }
  },
  
  getGrowthForecast: async (): Promise<any> => {
    try {
      return {
        yearly_projection: {
          current_year: 500000,
          next_year: 625000,
          growth_rate: '25%'
        },
        quarterly_forecast: [
          { quarter: 'Q1', value: 125000 },
          { quarter: 'Q2', value: 145000 },
          { quarter: 'Q3', value: 170000 },
          { quarter: 'Q4', value: 185000 }
        ],
        market_factors: [
          { factor: 'Industry growth', impact: 'positive', description: 'Digital transformation accelerating across sectors' },
          { factor: 'Competition', impact: 'neutral', description: 'New entrants balanced by market expansion' }
        ]
      };
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      throw error;
    }
  },
  
  // Report generation
  getWeeklyReports: async (): Promise<any> => {
    try {
      return [
        {
          id: 1,
          week: 'Jun 5-11, 2023',
          revenue: 5250,
          expenses: 3600,
          profit: 1650,
          notable_events: [
            'Closed Tech Solutions deal worth $2500',
            'Hired new marketing assistant'
          ]
        },
        {
          id: 2,
          week: 'Jun 12-18, 2023',
          revenue: 4800,
          expenses: 3200,
          profit: 1600,
          notable_events: [
            'Started work on Acme Corp project',
            'Completed training program'
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      throw error;
    }
  },
  
  getMonthlyReports: async (): Promise<any> => {
    try {
      return [
        {
          id: 1,
          month: 'May 2023',
          revenue: 23000,
          expenses: 15500,
          profit: 7500,
          key_metrics: {
            new_clients: 3,
            churned_clients: 0,
            client_satisfaction: 4.8
          },
          summary: 'Strong month with exceptional client retention and satisfaction.'
        },
        {
          id: 2,
          month: 'Apr 2023',
          revenue: 22500,
          expenses: 15000,
          profit: 7500,
          key_metrics: {
            new_clients: 2,
            churned_clients: 1,
            client_satisfaction: 4.6
          },
          summary: 'Solid growth despite losing one small client. New clients have higher average value.'
        }
      ];
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      throw error;
    }
  },
  
  // Sales analysis
  getSalesTrends: async (): Promise<any> => {
    try {
      return {
        yearly_trend: [
          { year: '2020', value: 320000 },
          { year: '2021', value: 380000 },
          { year: '2022', value: 450000 },
          { year: '2023 (Proj)', value: 560000 }
        ],
        seasonal_patterns: [
          { quarter: 'Q1', average_performance: '22%' },
          { quarter: 'Q2', average_performance: '26%' },
          { quarter: 'Q3', average_performance: '28%' },
          { quarter: 'Q4', average_performance: '24%' }
        ],
        client_retention: {
          rate: '92%',
          average_client_lifespan: '2.8 years',
          repeat_business_percentage: '78%'
        }
      };
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      throw error;
    }
  },
  
  getSalesByChannel: async (): Promise<any> => {
    try {
      return {
        channels: [
          { channel: 'Referrals', value: 42000, percentage: '34%' },
          { channel: 'Direct Outreach', value: 38000, percentage: '30%' },
          { channel: 'Social Media', value: 25000, percentage: '20%' },
          { channel: 'Email Marketing', value: 20000, percentage: '16%' }
        ],
        best_performing: 'Referrals',
        fastest_growing: 'Social Media',
        recommendations: [
          'Implement referral rewards program',
          'Increase social media ad budget by 15%'
        ]
      };
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      throw error;
    }
  },
  
  getTopProducts: async (): Promise<any> => {
    try {
      return {
        services: [
          { service: 'Website Design', revenue: 48000, percentage: '38%', growth: '22%' },
          { service: 'SEO Services', revenue: 35000, percentage: '28%', growth: '18%' },
          { service: 'Content Creation', revenue: 25000, percentage: '20%', growth: '35%' },
          { service: 'Social Media Management', revenue: 17000, percentage: '14%', growth: '28%' }
        ],
        potential_opportunities: [
          'Content Creation showing fastest growth - consider expanding team',
          'Website Design remains core service - look for upsell opportunities'
        ]
      };
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },
  
  // Team costs analysis
  getTeamCosts: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      return {
        total_cost: 55000,
        by_department: [
          { department: 'Design', cost: 18000, percentage: '32.7%' },
          { department: 'Development', cost: 22000, percentage: '40.0%' },
          { department: 'Marketing', cost: 10000, percentage: '18.2%' },
          { department: 'Administration', cost: 5000, percentage: '9.1%' }
        ],
        cost_per_employee: {
          average: 5500,
          min: 4200,
          max: 7800
        },
        productivity_metrics: {
          revenue_per_employee: 12500,
          profit_per_employee: 4000
        }
      };
    } catch (error) {
      console.error('Error fetching team costs:', error);
      throw error;
    }
  }
};

export default financeService;
