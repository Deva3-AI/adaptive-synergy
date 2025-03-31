
import { mockFinancialData } from '@/utils/mockFinancialData';

class FinanceService {
  // General financial data
  async getFinancialMetrics() {
    try {
      // In a real app, this would fetch from an API
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockFinancialData.financialMetrics);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      throw error;
    }
  }

  // Invoice related methods
  async getInvoices(status?: string) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          const invoices = mockFinancialData.invoices;
          if (status) {
            resolve(invoices.filter(invoice => invoice.status === status));
          } else {
            resolve(invoices);
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  async getInvoiceDetails(invoiceId: number) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          const invoice = mockFinancialData.invoices.find(inv => inv.invoice_id === invoiceId);
          resolve(invoice || null);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      throw error;
    }
  }

  async createInvoice(invoiceData: any) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          // In a real app, this would add to the database
          resolve({ success: true, message: 'Invoice created successfully' });
        }, 500);
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async updateInvoice(invoiceId: number, invoiceData: any) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          // In a real app, this would update the database
          resolve({ success: true, message: 'Invoice updated successfully' });
        }, 500);
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  // Expense related methods
  async getFinancialRecords(type?: string) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          const records = mockFinancialData.financialRecords;
          if (type) {
            resolve(records.filter(record => record.record_type === type));
          } else {
            resolve(records);
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching financial records:', error);
      throw error;
    }
  }

  async createFinancialRecord(recordData: any) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          // In a real app, this would add to the database
          resolve({ success: true, message: 'Financial record created successfully' });
        }, 500);
      });
    } catch (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }
  }

  // Sales related methods
  async getSalesMetrics() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockFinancialData.salesMetrics);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      throw error;
    }
  }

  async getSalesData(period?: string) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockFinancialData.salesData);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
  }

  async getSalesGrowthData(period?: string) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockFinancialData.salesGrowth);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      throw error;
    }
  }

  async getWeeklyReports() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockFinancialData.weeklyReports);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      throw error;
    }
  }

  async getMonthlyReports() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockFinancialData.monthlyReports);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      throw error;
    }
  }

  // Team costs analysis
  async getTeamCosts(startDate?: string, endDate?: string) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockFinancialData.teamCosts);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching team costs:', error);
      throw error;
    }
  }

  // Financial planning
  async getFinancialPlans() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockFinancialData.financialPlans);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      throw error;
    }
  }

  // Upsell opportunities
  async getUpsellOpportunities() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockFinancialData.upsellOpportunities);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      throw error;
    }
  }
}

const financeService = new FinanceService();
export { financeService };
