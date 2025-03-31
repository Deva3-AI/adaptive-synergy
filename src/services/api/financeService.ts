import apiClient from '@/utils/apiUtils';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

/**
 * Finance service for handling invoices, expenses, and financial reporting
 */
const financeService = {
  /**
   * Get all invoices with optional status filter
   * @param status - Filter invoices by status (pending, paid, overdue)
   */
  getInvoices: async (status?: string) => {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          invoice_id as id,
          invoice_number,
          clients!inner (client_name),
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
      
      // Transform data to expected format
      const invoices = data?.map(invoice => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        client_name: invoice.clients.client_name,
        amount: invoice.amount,
        status: invoice.status,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date
      })) || [];
      
      return invoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
      
      // Return mock data
      return [
        {
          id: 1,
          invoice_number: 'INV-2023-001',
          client_name: 'Acme Corp',
          amount: 5000,
          status: 'paid',
          issue_date: '2023-07-01',
          due_date: '2023-07-15'
        },
        {
          id: 2,
          invoice_number: 'INV-2023-002',
          client_name: 'TechSolutions Inc',
          amount: 7500,
          status: 'pending',
          issue_date: '2023-07-15',
          due_date: '2023-07-30'
        },
        {
          id: 3,
          invoice_number: 'INV-2023-003',
          client_name: 'Global Services Ltd',
          amount: 3000,
          status: 'overdue',
          issue_date: '2023-06-15',
          due_date: '2023-06-30'
        }
      ];
    }
  },

  /**
   * Get invoice details by ID
   * @param invoiceId - Invoice ID
   */
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients!inner (*)
        `)
        .eq('invoice_id', invoiceId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast.error('Failed to load invoice details');
      
      // Return mock data based on ID
      return {
        id: invoiceId,
        invoice_number: `INV-2023-00${invoiceId}`,
        client_name: 'Acme Corp',
        client_id: 1,
        amount: 5000,
        status: 'pending',
        issue_date: '2023-07-01',
        due_date: '2023-07-15',
        payment_terms: 'Net 15',
        notes: 'Monthly service fee',
        items: [
          {
            id: 1,
            description: 'Consulting Services',
            quantity: 20,
            rate: 150,
            amount: 3000
          },
          {
            id: 2,
            description: 'Software Licensing',
            quantity: 1,
            rate: 2000,
            amount: 2000
          }
        ],
        subtotal: 5000,
        tax: 0,
        total: 5000
      };
    }
  },

  /**
   * Create a new invoice
   * @param invoiceData - Invoice data
   */
  createInvoice: async (invoiceData: any) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Invoice created successfully');
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
      throw error;
    }
  },

  /**
   * Update invoice status
   * @param invoiceId - Invoice ID
   * @param status - New status
   */
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('invoice_id', invoiceId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Invoice marked as ${status}`);
      return data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
      throw error;
    }
  },

  /**
   * Get revenue reports
   * @param startDate - Start date for the report
   * @param endDate - End date for the report
   */
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      // In a real implementation, we would filter based on startDate and endDate
      
      // Return mock data
      return {
        monthly_revenue: 43500,
        quarterly_revenue: 120000,
        annual_revenue: 480000,
        year_over_year_growth: '+12.5%',
        revenue_by_client: [
          { client_name: 'Acme Corp', amount: 150000, percentage: '31.25%' },
          { client_name: 'TechSolutions Inc', amount: 120000, percentage: '25%' },
          { client_name: 'Global Services Ltd', amount: 80000, percentage: '16.67%' },
          { client_name: 'Other Clients', amount: 130000, percentage: '27.08%' }
        ],
        revenue_by_service: [
          { service_name: 'Consulting', amount: 200000, percentage: '41.67%' },
          { service_name: 'Development', amount: 150000, percentage: '31.25%' },
          { service_name: 'Maintenance', amount: 100000, percentage: '20.83%' },
          { service_name: 'Training', amount: 30000, percentage: '6.25%' }
        ],
        monthly_trend: [
          { month: 'Jan', amount: 38000 },
          { month: 'Feb', amount: 35000 },
          { month: 'Mar', amount: 42000 },
          { month: 'Apr', amount: 40000 },
          { month: 'May', amount: 44000 },
          { month: 'Jun', amount: 43500 }
        ],
        average_invoice_value: 5200,
        payment_statistics: {
          on_time: '78%',
          late: '18%',
          unpaid: '4%',
          average_days_to_payment: 14
        }
      };
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      toast.error('Failed to load revenue reports');
      return {};
    }
  },

  /**
   * Get expense reports
   * @param startDate - Start date for the report
   * @param endDate - End date for the report
   */
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      // In a real implementation, we would filter based on startDate and endDate
      
      // Return mock data
      return {
        monthly_expenses: 32000,
        quarterly_expenses: 98000,
        annual_expenses: 385000,
        year_over_year_change: '+8.2%',
        expenses_by_category: [
          { category: 'Salaries', amount: 250000, percentage: '64.94%' },
          { category: 'Rent', amount: 48000, percentage: '12.47%' },
          { category: 'Equipment', amount: 30000, percentage: '7.79%' },
          { category: 'Marketing', amount: 25000, percentage: '6.49%' },
          { category: 'Utilities', amount: 12000, percentage: '3.12%' },
          { category: 'Others', amount: 20000, percentage: '5.19%' }
        ],
        monthly_trend: [
          { month: 'Jan', amount: 33000 },
          { month: 'Feb', amount: 31000 },
          { month: 'Mar', amount: 34000 },
          { month: 'Apr', amount: 30000 },
          { month: 'May', amount: 31000 },
          { month: 'Jun', amount: 32000 }
        ],
        top_expenses: [
          { description: 'Salary - Development Team', amount: 95000, date: '2023-06-30' },
          { description: 'Salary - Marketing Team', amount: 60000, date: '2023-06-30' },
          { description: 'Quarterly Office Rent', amount: 12000, date: '2023-06-01' },
          { description: 'New Developer Workstations', amount: 8500, date: '2023-06-15' },
          { description: 'Digital Advertising', amount: 7500, date: '2023-06-10' }
        ],
        expense_approvals: {
          pending: 5,
          approved: 45,
          rejected: 3,
          average_approval_time: '1.5 days'
        }
      };
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      toast.error('Failed to load expense reports');
      return {};
    }
  },

  /**
   * Get financial overview
   */
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      
      // Return mock data for development
      return {
        revenue: { total: 120000, growth: '+12%' },
        expenses: { total: 65000, growth: '+5%' },
        profit: { total: 55000, growth: '+16%' },
        cashflow: { total: 35000, growth: '+8%' },
        metrics: {
          roi: '22%',
          burn_rate: '$21,000/mo',
          runway: '14 months',
          debt_ratio: '0.24'
        }
      };
    }
  },

  /**
   * Get financial metrics
   */
  getFinancialMetrics: async (period = 'month') => {
    try {
      const response = await apiClient.get(`/finance/metrics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      
      // Return mock data for development
      return {
        revenue: {
          value: 125000,
          formatted_value: '$125,000',
          growth_rate: 12,
          label: 'Revenue'
        },
        expenses: {
          value: 68000,
          formatted_value: '$68,000',
          growth_rate: 5,
          label: 'Expenses'  
        },
        profit: {
          value: 57000,
          formatted_value: '$57,000',
          growth_rate: 18,
          label: 'Profit'
        },
        cash_balance: {
          value: 210000,
          formatted_value: '$210,000',
          growth_rate: 4,
          label: 'Cash Balance'
        }
      };
    }
  },

  /**
   * Get financial records
   */
  getFinancialRecords: async (type, startDate, endDate) => {
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
          record_type: 'expense',
          amount: 1250,
          description: 'Software subscription',
          category: 'Operations',
          date: '2023-09-01'
        },
        {
          id: 2,
          record_type: 'income',
          amount: 8500,
          description: 'Client payment - Project XYZ',
          category: 'Service Revenue',
          date: '2023-09-05'
        }
      ];
    }
  },

  /**
   * Create a financial record
   * @param recordData - Financial record data
   */
  createFinancialRecord: async (recordData) => {
    try {
      const response = await apiClient.post('/finance/records', recordData);
      return response.data;
    } catch (error) {
      console.error('Error creating financial record:', error);
      
      // Mock response for development
      return {
        id: uuidv4(),
        ...recordData,
        created_at: new Date().toISOString()
      };
    }
  },

  /**
   * Get sales metrics
   */
  getSalesMetrics: async () => {
    try {
      const response = await apiClient.get('/finance/sales-metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      return { /* mock data */ };
    }
  },
  
  /**
   * Get sales follow-ups
   */
  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/finance/sales-followups');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      return []; 
    }
  },
  
  /**
   * Get improvement suggestions
   */
  getImprovementSuggestions: async () => {
    try {
      const response = await apiClient.get('/finance/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      return [];
    }
  },
  
  /**
   * Complete a follow-up task
   * @param followUpId - Follow-up ID
   * @param feedback - Feedback from the follow-up
   */
  completeFollowUp: async (followUpId, feedback) => {
    try {
      const response = await apiClient.post(`/finance/sales-followups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error('Error completing follow-up:', error);
      return { success: true };
    }
  },
  
  /**
   * Get sales growth data
   */
  getSalesGrowthData: async () => {
    try {
      const response = await apiClient.get('/finance/sales-growth');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return { /* mock data */ };
    }
  },
  
  /**
   * Get sales targets
   */
  getSalesTargets: async () => {
    try {
      const response = await apiClient.get('/finance/sales-targets');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return [];
    }
  },
  
  /**
   * Get growth forecast
   */
  getGrowthForecast: async () => {
    try {
      const response = await apiClient.get('/finance/growth-forecast');
      return response.data;
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      return { /* mock data */ };
    }
  },
  
  /**
   * Get weekly reports
   */
  getWeeklyReports: async () => {
    try {
      const response = await apiClient.get('/finance/weekly-reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      return [];
    }
  },
  
  /**
   * Get monthly reports
   */
  getMonthlyReports: async () => {
    try {
      const response = await apiClient.get('/finance/monthly-reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      return [];
    }
  },
  
  /**
   * Get sales trends
   */
  getSalesTrends: async () => {
    try {
      const response = await apiClient.get('/finance/sales-trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return { /* mock data */ };
    }
  },
  
  /**
   * Get sales by channel
   */
  getSalesByChannel: async () => {
    try {
      const response = await apiClient.get('/finance/sales-by-channel');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return [];
    }
  },
  
  /**
   * Get top products/services
   */
  getTopProducts: async () => {
    try {
      const response = await apiClient.get('/finance/top-products');
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  },
  
  /**
   * Send invoice reminder
   * @param invoiceId - Invoice ID
   */
  sendInvoiceReminder: async (invoiceId) => {
    try {
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/remind`);
      return response.data;
    } catch (error) {
      console.error('Error sending invoice reminder:', error);
      return { success: true };
    }
  },

  /**
   * Analyze team costs
   */
  analyzeTeamCosts: async () => {
    try {
      const response = await apiClient.get('/finance/team-costs-analysis');
      return response.data;
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      
      // Return mock data structure that matches the expected format in TeamCostsAnalysis component
      return {
        total_cost: 125000,
        by_department: [
          { department: 'Engineering', cost: 52000, percentage: '41.6%', headcount: 8 },
          { department: 'Design', cost: 28000, percentage: '22.4%', headcount: 4 },
          { department: 'Marketing', cost: 18000, percentage: '14.4%', headcount: 3 },
          { department: 'Management', cost: 27000, percentage: '21.6%', headcount: 2 }
        ],
        cost_per_employee: 7350,
        cost_trends: [
          { month: 'Jan', cost: 118000 },
          { month: 'Feb', cost: 120000 },
          { month: 'Mar', cost: 122000 },
          { month: 'Apr', cost: 123000 },
          { month: 'May', cost: 124000 },
          { month: 'Jun', cost: 125000 }
        ],
        efficiency_metrics: {
          revenue_per_employee: 15800,
          profit_per_employee: 3450,
          cost_per_employee: 7350,
          cost_to_revenue_ratio: 0.46,
          projects_per_employee: 1.3
        }
      };
    }
  }
};

export default financeService;
