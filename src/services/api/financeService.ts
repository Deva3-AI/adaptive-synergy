
import { supabase } from '@/integrations/supabase/client';
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
      // Return mock data
      return {
        total_revenue: 480000,
        total_expenses: 385000,
        profit: 95000,
        profit_margin: '19.79%',
        cash_balance: 120000,
        accounts_receivable: 65000,
        accounts_payable: 35000,
        quick_ratio: 1.86,
        current_ratio: 2.3,
        debt_to_equity: 0.45,
        revenue_growth: '+12.5%',
        expense_growth: '+8.2%',
        profit_growth: '+25.6%',
        year_to_date: {
          revenue: 250000,
          expenses: 195000,
          profit: 55000
        },
        quarterly_comparison: [
          { quarter: 'Q1', revenue: 115000, expenses: 95000, profit: 20000 },
          { quarter: 'Q2', revenue: 135000, expenses: 100000, profit: 35000 }
        ],
        financial_health_score: 85,
        key_metrics: [
          { name: 'Cash Conversion Cycle', value: '45 days' },
          { name: 'Burn Rate', value: '$32,000/month' },
          { name: 'Runway', value: '3.75 months' }
        ]
      };
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      toast.error('Failed to load financial overview');
      return {};
    }
  },

  /**
   * Get financial metrics
   */
  getFinancialMetrics: async () => {
    try {
      // Return mock data
      return {
        profitability: {
          grossProfitMargin: '35%',
          operatingProfitMargin: '22%',
          netProfitMargin: '18%',
          returnOnAssets: '14%',
          returnOnEquity: '21%',
          returnOnInvestment: '19%'
        },
        liquidity: {
          currentRatio: 2.3,
          quickRatio: 1.86,
          cashRatio: 0.75,
          operatingCashFlow: 115000,
          workingCapital: 95000
        },
        efficiency: {
          assetTurnover: 1.2,
          inventoryTurnover: 8.5,
          receivablesTurnover: 12.3,
          payablesTurnover: 9.8,
          cashConversionCycle: 45
        },
        growth: {
          revenueGrowth: '12.5%',
          expenseGrowth: '8.2%',
          profitGrowth: '25.6%',
          assetGrowth: '10.2%',
          equityGrowth: '15.8%'
        },
        solvency: {
          debtToEquity: 0.45,
          debtToAssets: 0.28,
          interestCoverageRatio: 8.5,
          debtServiceCoverageRatio: 3.2
        },
        valuation: {
          earningsPerShare: 2.85,
          priceToEarnings: 18.5,
          marketCapitalization: 12500000,
          enterpriseValue: 13200000,
          bookValue: 5500000
        }
      };
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      toast.error('Failed to load financial metrics');
      return {};
    }
  },

  /**
   * Get financial records
   */
  getFinancialRecords: async () => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*');
      
      if (error) throw error;
      
      // Transform data
      const records = data?.map(record => ({
        id: record.record_id,
        record_type: record.record_type,
        amount: record.amount,
        description: record.description,
        category: record.record_type === 'expense' ? 'Operating Expense' : 'Service Revenue',
        date: record.record_date
      })) || [];
      
      return records.length > 0 ? records : [
        {
          id: 1,
          record_type: 'expense',
          amount: 5000,
          description: 'Office rent',
          category: 'Operating Expense',
          date: '2023-07-01'
        },
        {
          id: 2,
          record_type: 'expense',
          amount: 2500,
          description: 'Utilities',
          category: 'Operating Expense',
          date: '2023-07-05'
        },
        {
          id: 3,
          record_type: 'income',
          amount: 15000,
          description: 'Consulting services',
          category: 'Service Revenue',
          date: '2023-07-10'
        }
      ];
    } catch (error) {
      console.error('Error fetching financial records:', error);
      toast.error('Failed to load financial records');
      return [];
    }
  },

  /**
   * Create a financial record
   * @param recordData - Financial record data
   */
  createFinancialRecord: async (recordData: any) => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .insert(recordData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Financial record created successfully');
      return data;
    } catch (error) {
      console.error('Error creating financial record:', error);
      toast.error('Failed to create financial record');
      throw error;
    }
  },

  /**
   * Get sales metrics
   */
  getSalesMetrics: async () => {
    try {
      // Return mock data
      return {
        monthly_revenue: 43500,
        annual_target: 600000,
        growth_rate: '12.5%',
        client_acquisition: 8,
        conversion_rate: '18%',
        avg_deal_size: 5200,
        top_clients: [
          { client_id: 1, client_name: 'Acme Corp', revenue: 150000, growth: 15 },
          { client_id: 2, client_name: 'TechSolutions Inc', revenue: 120000, growth: 8 },
          { client_id: 3, client_name: 'Global Services Ltd', revenue: 80000, growth: 20 }
        ],
        monthly_trend: [
          { month: 'Jan', revenue: 38000, target: 40000 },
          { month: 'Feb', revenue: 35000, target: 40000 },
          { month: 'Mar', revenue: 42000, target: 45000 },
          { month: 'Apr', revenue: 40000, target: 45000 },
          { month: 'May', revenue: 44000, target: 50000 },
          { month: 'Jun', revenue: 43500, target: 50000 }
        ],
        sales_by_service: [
          { service: 'Consulting', value: 42 },
          { service: 'Development', value: 31 },
          { service: 'Maintenance', value: 21 },
          { service: 'Training', value: 6 }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      toast.error('Failed to load sales metrics');
      return {};
    }
  },

  /**
   * Get upsell opportunities
   */
  getUpsellOpportunities: async () => {
    try {
      // Return mock data
      return [
        {
          id: 1,
          client_id: 1,
          client_name: 'Acme Corp',
          current_services: ['Consulting', 'Development'],
          potential_services: ['Maintenance', 'Training'],
          estimated_value: 15000,
          probability: 70,
          last_purchase: '2023-06-15',
          notes: 'Client expressed interest in maintenance services during last meeting'
        },
        {
          id: 2,
          client_id: 2,
          client_name: 'TechSolutions Inc',
          current_services: ['Development'],
          potential_services: ['Consulting', 'Training'],
          estimated_value: 25000,
          probability: 50,
          last_purchase: '2023-05-20',
          notes: 'Expanding team, may need additional training services'
        }
      ];
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      toast.error('Failed to load upsell opportunities');
      return [];
    }
  },

  /**
   * Get financial plans
   */
  getFinancialPlans: async () => {
    try {
      // Return mock data
      return [
        {
          id: 1,
          title: 'Q3 2023 Financial Plan',
          status: 'Active',
          revenue_target: 150000,
          expense_budget: 120000,
          profit_target: 30000,
          key_initiatives: [
            'Increase client acquisition by 15%',
            'Reduce operational expenses by 5%',
            'Launch new service offering'
          ],
          milestones: [
            { title: 'Mid-quarter review', date: '2023-08-15', status: 'Pending' },
            { title: 'End-quarter review', date: '2023-09-30', status: 'Pending' }
          ],
          start_date: '2023-07-01',
          end_date: '2023-09-30'
        },
        {
          id: 2,
          title: 'Annual Financial Plan 2023',
          status: 'Active',
          revenue_target: 600000,
          expense_budget: 480000,
          profit_target: 120000,
          key_initiatives: [
            'Expand client base in the technology sector',
            'Invest in employee training and development',
            'Improve operational efficiency'
          ],
          milestones: [
            { title: 'Q1 Review', date: '2023-03-31', status: 'Completed' },
            { title: 'Q2 Review', date: '2023-06-30', status: 'Completed' },
            { title: 'Q3 Review', date: '2023-09-30', status: 'Pending' },
            { title: 'Q4 Review', date: '2023-12-31', status: 'Pending' }
          ],
          start_date: '2023-01-01',
          end_date: '2023-12-31'
        }
      ];
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      toast.error('Failed to load financial plans');
      return [];
    }
  },

  /**
   * Analyze team costs
   */
  analyzeTeamCosts: async () => {
    try {
      // Return mock data
      return {
        total_cost: 58000,
        by_department: [
          { department: 'Development', cost: 25000, percentage: '43.10%' },
          { department: 'Design', cost: 12000, percentage: '20.69%' },
          { department: 'Marketing', cost: 10000, percentage: '17.24%' },
          { department: 'Management', cost: 8000, percentage: '13.79%' },
          { department: 'Support', cost: 3000, percentage: '5.17%' }
        ],
        by_role: [
          { role: 'Developers', cost: 25000, headcount: 5 },
          { role: 'Designers', cost: 12000, headcount: 3 },
          { role: 'Marketing Specialists', cost: 10000, headcount: 2 },
          { role: 'Managers', cost: 8000, headcount: 2 },
          { role: 'Support Staff', cost: 3000, headcount: 1 }
        ],
        cost_per_billable_hour: 85,
        utilization_rate: '78%',
        cost_trends: [
          { month: 'Jan', cost: 54000 },
          { month: 'Feb', cost: 55000 },
          { month: 'Mar', cost: 56000 },
          { month: 'Apr', cost: 57000 },
          { month: 'May', cost: 57500 },
          { month: 'Jun', cost: 58000 }
        ],
        efficiency_metrics: {
          revenue_per_employee: 8750,
          profit_per_employee: 1750,
          cost_per_employee: 7000,
          projects_per_employee: 2.3
        },
        optimization_opportunities: [
          'Increase developer utilization rate by 5%',
          'Streamline design review process',
          'Cross-train support staff for marketing tasks'
        ]
      };
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      toast.error('Failed to analyze team costs');
      return {};
    }
  },

  /**
   * Get sales follow-ups
   */
  getSalesFollowUps: async () => {
    try {
      // Return mock data for demonstration
      return [
        {
          id: 1,
          client_name: 'Acme Corp',
          contact_name: 'John Smith',
          contact_email: 'john.smith@acmecorp.com',
          follow_up_date: '2023-08-15',
          follow_up_type: 'Call',
          priority: 'High',
          notes: 'Discuss proposal revisions',
          status: 'Pending',
          opportunity_value: 25000
        },
        {
          id: 2,
          client_name: 'TechSolutions Inc',
          contact_name: 'Sarah Johnson',
          contact_email: 'sarah.j@techsolutions.com',
          follow_up_date: '2023-08-12',
          follow_up_type: 'Email',
          priority: 'Medium',
          notes: 'Send additional case studies',
          status: 'Pending',
          opportunity_value: 15000
        }
      ];
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      toast.error('Failed to load sales follow-ups');
      return [];
    }
  },

  /**
   * Get improvement suggestions
   */
  getImprovementSuggestions: async () => {
    try {
      // Return mock data for demonstration
      return [
        {
          id: 1,
          category: 'Cash Flow',
          suggestion: 'Implement early payment incentives to reduce accounts receivable',
          impact: 'Medium',
          difficulty: 'Low',
          estimated_benefit: 'Reduce average payment time by 5 days',
          implementation_steps: [
            'Update invoice templates with early payment terms',
            'Communicate changes to clients',
            'Monitor payment pattern changes'
          ]
        },
        {
          id: 2,
          category: 'Expense Management',
          suggestion: 'Consolidate software subscriptions to reduce redundancy',
          impact: 'Medium',
          difficulty: 'Medium',
          estimated_benefit: 'Save $1,200 annually',
          implementation_steps: [
            'Audit current software subscriptions',
            'Identify overlapping functionalities',
            'Research multi-purpose alternatives',
            'Implement migration plan'
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      toast.error('Failed to load improvement suggestions');
      return [];
    }
  },

  /**
   * Complete a follow-up task
   * @param followUpId - Follow-up ID
   * @param feedback - Feedback from the follow-up
   */
  completeFollowUp: async (followUpId: number, feedback: string) => {
    try {
      // In a real implementation, we would update the database
      
      toast.success('Follow-up marked as completed');
      return { id: followUpId, status: 'Completed', feedback };
    } catch (error) {
      console.error('Error completing follow-up:', error);
      toast.error('Failed to complete follow-up');
      throw error;
    }
  },

  /**
   * Get sales growth data
   */
  getSalesGrowthData: async () => {
    try {
      // Return mock data
      return {
        annual_growth_rate: '12.5%',
        quarterly_comparison: [
          { quarter: 'Q1 2022', revenue: 98000 },
          { quarter: 'Q2 2022', revenue: 105000 },
          { quarter: 'Q3 2022', revenue: 110000 },
          { quarter: 'Q4 2022', revenue: 125000 },
          { quarter: 'Q1 2023', revenue: 115000 },
          { quarter: 'Q2 2023', revenue: 135000 }
        ],
        monthly_growth: [
          { month: 'Jan', growth: '5.2%' },
          { month: 'Feb', growth: '-2.8%' },
          { month: 'Mar', growth: '8.5%' },
          { month: 'Apr', growth: '1.2%' },
          { month: 'May', growth: '4.5%' },
          { month: 'Jun', growth: '3.2%' }
        ],
        by_service_line: [
          { service: 'Consulting', growth: '15.8%' },
          { service: 'Development', growth: '9.2%' },
          { service: 'Maintenance', growth: '18.5%' },
          { service: 'Training', growth: '5.1%' }
        ],
        by_client_segment: [
          { segment: 'Enterprise', growth: '8.5%' },
          { segment: 'Mid-Market', growth: '15.2%' },
          { segment: 'SMB', growth: '5.8%' }
        ],
        new_vs_existing: {
          new_clients_revenue: 95000,
          existing_clients_revenue: 230000,
          new_clients_growth: '25.8%',
          existing_clients_growth: '10.2%'
        }
      };
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      toast.error('Failed to load sales growth data');
      return {};
    }
  },

  /**
   * Get sales targets
   */
  getSalesTargets: async () => {
    try {
      // Return mock data
      return {
        annual_target: 600000,
        progress: 325000,
        progress_percentage: '54.2%',
        remaining: 275000,
        quarterly_targets: [
          { quarter: 'Q1', target: 130000, actual: 115000, variance: -15000 },
          { quarter: 'Q2', target: 150000, actual: 135000, variance: -15000 },
          { quarter: 'Q3', target: 160000, target_to_date: 75000, actual_to_date: 75000 },
          { quarter: 'Q4', target: 160000 }
        ],
        monthly_targets: [
          { month: 'Jan', target: 40000, actual: 38000 },
          { month: 'Feb', target: 40000, actual: 35000 },
          { month: 'Mar', target: 50000, actual: 42000 },
          { month: 'Apr', target: 45000, actual: 40000 },
          { month: 'May', target: 50000, actual: 44000 },
          { month: 'Jun', target: 55000, actual: 51000 },
          { month: 'Jul', target: 50000, actual: 35000 },
          { month: 'Aug', target: 55000 },
          { month: 'Sep', target: 55000 },
          { month: 'Oct', target: 50000 },
          { month: 'Nov', target: 50000 },
          { month: 'Dec', target: 60000 }
        ],
        by_representative: [
          { name: 'Alice Johnson', target: 150000, actual: 95000, percentage: '63.3%' },
          { name: 'Bob Smith', target: 140000, actual: 82000, percentage: '58.6%' },
          { name: 'Carol Williams', target: 160000, actual: 93000, percentage: '58.1%' },
          { name: 'David Brown', target: 150000, actual: 55000, percentage: '36.7%' }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      toast.error('Failed to load sales targets');
      return {};
    }
  },

  /**
   * Get growth forecast
   */
  getGrowthForecast: async () => {
    try {
      // Return mock data
      return {
        annual_forecast: {
          revenue: 650000,
          growth_rate: '15.2%',
          confidence: 'Medium'
        },
        quarterly_forecast: [
          { quarter: 'Q3 2023', revenue: 170000, growth: '13.3%' },
          { quarter: 'Q4 2023', revenue: 180000, growth: '12.5%' },
          { quarter: 'Q1 2024', revenue: 160000, growth: '8.5%' },
          { quarter: 'Q2 2024', revenue: 185000, growth: '10.2%' }
        ],
        by_service_line: [
          { service: 'Consulting', forecast: 280000, growth: '16.7%' },
          { service: 'Development', forecast: 210000, growth: '13.5%' },
          { service: 'Maintenance', forecast: 130000, growth: '18.2%' },
          { service: 'Training', forecast: 30000, growth: '7.1%' }
        ],
        market_factors: [
          { factor: 'Industry growth', impact: 'Positive', description: 'Overall market expected to grow by 10%' },
          { factor: 'Competition', impact: 'Neutral', description: 'New entrants balanced by market expansion' },
          { factor: 'Economic conditions', impact: 'Slightly negative', description: 'Economic uncertainty may delay some projects' }
        ],
        scenario_analysis: {
          optimistic: { revenue: 700000, growth: '20.3%', probability: '25%' },
          baseline: { revenue: 650000, growth: '15.2%', probability: '60%' },
          pessimistic: { revenue: 600000, growth: '9.1%', probability: '15%' }
        },
        growth_drivers: [
          'Expansion of consulting services',
          'New product launch in Q4',
          'Increasing client retention rate'
        ]
      };
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      toast.error('Failed to load growth forecast');
      return {};
    }
  },

  /**
   * Get weekly reports
   */
  getWeeklyReports: async () => {
    try {
      // Get the dates for the current week
      const today = new Date();
      const startOfWeek = new Date(today);
      const daysSinceMonday = (today.getDay() + 6) % 7; // Adjust for Monday as first day
      startOfWeek.setDate(today.getDate() - daysSinceMonday);
      
      // Return mock data for the current week
      return {
        week: `${startOfWeek.toLocaleDateString()} - ${today.toLocaleDateString()}`,
        revenue: 12500,
        expenses: 9500,
        profit: 3000,
        profit_margin: '24%',
        new_clients: 2,
        deals_closed: 3,
        deals_value: 18000,
        deals_in_pipeline: 12,
        pipeline_value: 85000,
        activities: [
          { day: 'Monday', meetings: 5, calls: 8, emails: 25 },
          { day: 'Tuesday', meetings: 3, calls: 12, emails: 30 },
          { day: 'Wednesday', meetings: 4, calls: 10, emails: 28 },
          { day: 'Thursday', meetings: 6, calls: 7, emails: 32 },
          { day: 'Friday', meetings: 2, calls: 5, emails: 20 }
        ],
        top_performers: [
          { name: 'Alice Johnson', deals_closed: 1, value: 8000 },
          { name: 'Bob Smith', deals_closed: 2, value: 10000 }
        ],
        key_events: [
          { description: 'Closed deal with ABC Corp', date: '2023-08-08', value: 8000 },
          { description: 'New lead from referral', date: '2023-08-09', potential_value: 12000 },
          { description: 'Product demo for XYZ Inc', date: '2023-08-10', potential_value: 15000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      toast.error('Failed to load weekly reports');
      return {};
    }
  },

  /**
   * Get monthly reports
   */
  getMonthlyReports: async () => {
    try {
      // Get the current month name
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const currentMonth = monthNames[new Date().getMonth()];
      
      // Return mock data for the current month
      return {
        month: currentMonth,
        revenue: 43500,
        expenses: 32000,
        profit: 11500,
        profit_margin: '26.4%',
        target_achievement: '87%',
        new_clients: 8,
        churned_clients: 1,
        retention_rate: '95%',
        deals_closed: 12,
        deals_value: 65000,
        average_deal_size: 5417,
        sales_by_representative: [
          { name: 'Alice Johnson', deals: 4, value: 22000 },
          { name: 'Bob Smith', deals: 3, value: 18000 },
          { name: 'Carol Williams', deals: 3, value: 15000 },
          { name: 'David Brown', deals: 2, value: 10000 }
        ],
        sales_by_service: [
          { service: 'Consulting', value: 25000, percentage: '38.5%' },
          { service: 'Development', value: 20000, percentage: '30.8%' },
          { service: 'Maintenance', value: 15000, percentage: '23.1%' },
          { service: 'Training', value: 5000, percentage: '7.7%' }
        ],
        leads_and_conversions: {
          new_leads: 35,
          qualified_leads: 18,
          proposals_sent: 15,
          deals_closed: 12,
          conversion_rate: '34.3%'
        },
        key_insights: [
          'Consulting services showing strongest growth',
          'Average deal size increased by 8% from previous month',
          'Lead-to-deal conversion rate improved by 3%'
        ]
      };
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      toast.error('Failed to load monthly reports');
      return {};
    }
  },

  /**
   * Get sales trends
   */
  getSalesTrends: async () => {
    try {
      // Return mock data
      return {
        revenue_trends: {
          monthly: [
            { month: 'Jan', value: 38000 },
            { month: 'Feb', value: 35000 },
            { month: 'Mar', value: 42000 },
            { month: 'Apr', value: 40000 },
            { month: 'May', value: 44000 },
            { month: 'Jun', value: 43500 }
          ],
          quarterly: [
            { quarter: 'Q1', value: 115000 },
            { quarter: 'Q2', value: 127500 }
          ],
          year_over_year: [
            { year: 2021, value: 380000 },
            { year: 2022, value: 425000 },
            { year: 2023, value: 480000, projected: true }
          ]
        },
        conversion_trends: {
          monthly_rates: [
            { month: 'Jan', value: '15.2%' },
            { month: 'Feb', value: '16.5%' },
            { month: 'Mar', value: '17.8%' },
            { month: 'Apr', value: '16.2%' },
            { month: 'May', value: '17.5%' },
            { month: 'Jun', value: '18.0%' }
          ],
          by_lead_source: [
            { source: 'Website', value: '12.5%' },
            { source: 'Referral', value: '25.3%' },
            { source: 'Social Media', value: '8.2%' },
            { source: 'Email Campaign', value: '15.8%' }
          ]
        },
        customer_acquisition_cost: {
          overall: 1250,
          trend: [
            { month: 'Jan', value: 1350 },
            { month: 'Feb', value: 1320 },
            { month: 'Mar', value: 1290 },
            { month: 'Apr', value: 1270 },
            { month: 'May', value: 1260 },
            { month: 'Jun', value: 1250 }
          ],
          by_channel: [
            { channel: 'Organic Search', value: 850 },
            { channel: 'Paid Advertising', value: 1500 },
            { channel: 'Social Media', value: 1200 },
            { channel: 'Email Marketing', value: 950 }
          ]
        },
        sales_cycle_length: {
          overall: '45 days',
          trend: [
            { month: 'Jan', value: 48 },
            { month: 'Feb', value: 47 },
            { month: 'Mar', value: 46 },
            { month: 'Apr', value: 45 },
            { month: 'May', value: 45 },
            { month: 'Jun', value: 45 }
          ],
          by_deal_size: [
            { size: 'Small (<$5K)', value: 30 },
            { size: 'Medium ($5K-$20K)', value: 45 },
            { size: 'Large (>$20K)', value: 75 }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      toast.error('Failed to load sales trends');
      return {};
    }
  },

  /**
   * Get sales by channel
   */
  getSalesByChannel: async () => {
    try {
      // Return mock data
      return {
        by_channel: [
          { channel: 'Direct Sales', value: 250000, percentage: '52.1%' },
          { channel: 'Partner Referrals', value: 120000, percentage: '25.0%' },
          { channel: 'Website Inbound', value: 80000, percentage: '16.7%' },
          { channel: 'Email Campaigns', value: 30000, percentage: '6.3%' }
        ],
        channel_performance: {
          conversion_rates: [
            { channel: 'Direct Sales', value: '25.3%' },
            { channel: 'Partner Referrals', value: '32.5%' },
            { channel: 'Website Inbound', value: '12.8%' },
            { channel: 'Email Campaigns', value: '15.2%' }
          ],
          acquisition_costs: [
            { channel: 'Direct Sales', value: 1500 },
            { channel: 'Partner Referrals', value: 950 },
            { channel: 'Website Inbound', value: 850 },
            { channel: 'Email Campaigns', value: 650 }
          ],
          roi: [
            { channel: 'Direct Sales', value: '350%' },
            { channel: 'Partner Referrals', value: '450%' },
            { channel: 'Website Inbound', value: '380%' },
            { channel: 'Email Campaigns', value: '420%' }
          ]
        },
        growth_by_channel: [
          { channel: 'Direct Sales', growth: '10.2%' },
          { channel: 'Partner Referrals', growth: '18.5%' },
          { channel: 'Website Inbound', growth: '15.8%' },
          { channel: 'Email Campaigns', growth: '8.5%' }
        ],
        customer_quality_by_channel: {
          average_deal_size: [
            { channel: 'Direct Sales', value: 12500 },
            { channel: 'Partner Referrals', value: 8500 },
            { channel: 'Website Inbound', value: 5500 },
            { channel: 'Email Campaigns', value: 4500 }
          ],
          customer_lifetime_value: [
            { channel: 'Direct Sales', value: 75000 },
            { channel: 'Partner Referrals', value: 65000 },
            { channel: 'Website Inbound', value: 45000 },
            { channel: 'Email Campaigns', value: 35000 }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      toast.error('Failed to load sales channel data');
      return {};
    }
  },

  /**
   * Get top products/services
   */
  getTopProducts: async () => {
    try {
      // Return mock data
      return {
        by_revenue: [
          { product: 'Enterprise Consulting', revenue: 150000, percentage: '31.3%' },
          { product: 'Custom Development', revenue: 120000, percentage: '25.0%' },
          { product: 'Maintenance Contracts', revenue: 100000, percentage: '20.8%' },
          { product: 'Training Services', revenue: 80000, percentage: '16.7%' },
          { product: 'Support Packages', revenue: 30000, percentage: '6.3%' }
        ],
        by_growth: [
          { product: 'Maintenance Contracts', growth: '25.3%' },
          { product: 'Custom Development', growth: '18.5%' },
          { product: 'Enterprise Consulting', growth: '12.8%' },
          { product: 'Training Services', growth: '8.5%' },
          { product: 'Support Packages', growth: '5.2%' }
        ],
        by_profit_margin: [
          { product: 'Maintenance Contracts', margin: '45%' },
          { product: 'Enterprise Consulting', margin: '40%' },
          { product: 'Training Services', margin: '35%' },
          { product: 'Support Packages', margin: '30%' },
          { product: 'Custom Development', margin: '25%' }
        ],
        by_customer_satisfaction: [
          { product: 'Enterprise Consulting', satisfaction: 4.8 },
          { product: 'Training Services', satisfaction: 4.7 },
          { product: 'Support Packages', satisfaction: 4.5 },
          { product: 'Maintenance Contracts', satisfaction: 4.3 },
          { product: 'Custom Development', satisfaction: 4.2 }
        ],
        performance_trends: {
          monthly_sales: [
            { month: 'Jan', enterprise: 22000, development: 18000, maintenance: 15000, training: 12000, support: 5000 },
            { month: 'Feb', enterprise: 21000, development: 17000, maintenance: 16000, training: 11000, support: 4500 },
            { month: 'Mar', enterprise: 25000, development: 20000, maintenance: 17000, training: 13000, support: 5500 },
            { month: 'Apr', enterprise: 24000, development: 19000, maintenance: 18000, training: 14000, support: 5000 },
            { month: 'May', enterprise: 28000, development: 22000, maintenance: 16000, training: 15000, support: 5500 },
            { month: 'Jun', enterprise: 30000, development: 24000, maintenance: 18000, training: 15000, support: 4500 }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching top products:', error);
      toast.error('Failed to load top products data');
      return {};
    }
  },

  /**
   * Send invoice reminder
   * @param invoiceId - Invoice ID
   */
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      // In a real application, this would call an API to send a reminder
      
      toast.success('Invoice reminder sent successfully');
      return { success: true, message: 'Reminder sent' };
    } catch (error) {
      console.error('Error sending invoice reminder:', error);
      toast.error('Failed to send invoice reminder');
      throw error;
    }
  }
};

export default financeService;
