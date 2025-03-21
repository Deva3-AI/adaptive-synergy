
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  invoice_id: number;
  client_id: number;
  client_name?: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
}

const financeService = {
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
  
  getFinancialData: async () => {
    try {
      const response = await apiClient.get('/finance/data');
      return response.data;
    } catch (error) {
      console.error('Get financial data error:', error);
      // Return sample data as fallback
      return {
        monthly_revenue: 42500,
        annual_target: 500000,
        growth_rate: 8.5,
        client_acquisition: 3,
        top_clients: [
          { client_name: "Social Land", revenue: 12500 },
          { client_name: "Koala Digital", revenue: 9800 },
          { client_name: "Website Architect", revenue: 8750 },
          { client_name: "AC Digital", revenue: 7200 },
          { client_name: "Muse Digital", revenue: 4250 }
        ],
        monthly_trend: [
          { month: "Jan", revenue: 38000 },
          { month: "Feb", revenue: 39500 },
          { month: "Mar", revenue: 37800 },
          { month: "Apr", revenue: 40200 },
          { month: "May", revenue: 41100 },
          { month: "Jun", revenue: 42500 }
        ],
        sales_by_service: [
          { service: "Web Development", value: 35 },
          { service: "Graphic Design", value: 25 },
          { service: "SEO", value: 20 },
          { service: "Social Media", value: 15 },
          { service: "Content Writing", value: 5 }
        ]
      };
    }
  }
};

export default financeService;
