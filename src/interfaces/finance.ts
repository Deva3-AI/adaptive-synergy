
export interface SalesData {
  monthly_revenue: number;
  annual_target: number;
  growth_rate: number;
  client_acquisition: number;
  conversion_rate: number;
  avg_deal_size: number;
  top_clients: {
    client_id: number;
    client_name: string;
    revenue: number;
    growth: number;
  }[];
  monthly_trend: {
    month: string;
    revenue: number;
    target: number;
  }[];
  sales_by_service: {
    service: string;
    value: number;
  }[];
}

export interface GrowthForecast {
  chart: any[];
  predictions: {
    period: string;
    expected_growth: number;
    confidence: number;
  }[];
  recommendations: string[];
}

export interface FinancialRecord {
  id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
  category?: string;
  payment_method?: string;
  status?: 'pending' | 'completed';
  related_invoice_id?: number;
  related_project_id?: number;
}

export interface FinancialOverview {
  current_month_revenue: number;
  previous_month_revenue: number;
  revenue_growth: number;
  current_month_expenses: number;
  previous_month_expenses: number;
  expenses_growth: number;
  current_month_profit: number;
  previous_month_profit: number;
  profit_growth: number;
  cash_flow: number;
  accounts_receivable: number;
  accounts_payable: number;
}

export interface FinancialMetrics {
  revenue_per_employee: number;
  profit_margin: number;
  average_project_value: number;
  client_acquisition_cost: number;
  client_lifetime_value: number;
  burn_rate: number;
  runway_months: number;
  roi: number;
}

export interface TeamCostAnalysis {
  total_cost: number;
  cost_by_department: {
    department: string;
    cost: number;
    percentage: number;
  }[];
  cost_by_project: {
    project_id: number;
    project_name: string;
    cost: number;
    budget: number;
    variance: number;
  }[];
  cost_trends: {
    month: string;
    cost: number;
  }[];
  efficiency_metrics: {
    metric: string;
    value: number;
    change: number;
  }[];
}

export interface UpsellOpportunity {
  client_id: number;
  client_name: string;
  current_services: string[];
  potential_services: string[];
  estimated_value: number;
  probability: number;
  reasoning: string;
}

export interface SalesFollowUp {
  id: number;
  client_id: number;
  client_name: string;
  contact_name: string;
  contact_email: string;
  follow_up_date: string;
  status: 'pending' | 'completed' | 'delayed';
  type: 'proposal' | 'meeting' | 'demo' | 'contract' | 'other';
  notes: string;
  assigned_to: number;
  assigned_to_name: string;
  importance: 'high' | 'medium' | 'low';
  previous_interaction: string;
  created_at: string;
}

export interface SalesGrowthData {
  overall_growth_rate: number;
  growth_by_period: {
    period: string;
    growth: number;
    revenue: number;
  }[];
  growth_by_service: {
    service: string;
    growth: number;
    current_value: number;
    previous_value: number;
  }[];
  growth_by_client_segment: {
    segment: string;
    growth: number;
    current_value: number;
    previous_value: number;
  }[];
}

export interface SalesTarget {
  id: number;
  period: string;
  target_amount: number;
  current_amount: number;
  progress_percentage: number;
  days_remaining: number;
  average_daily_required: number;
  probability: number;
  strategies: string[];
}

export interface SalesReport {
  id: number;
  period: string;
  start_date: string;
  end_date: string;
  total_revenue: number;
  comparison_to_target: number;
  comparison_to_previous: number;
  top_performing_services: {
    service: string;
    revenue: number;
    growth: number;
  }[];
  top_performing_sales_people: {
    id: number;
    name: string;
    revenue: number;
    deals_closed: number;
  }[];
  conversion_metrics: {
    leads: number;
    opportunities: number;
    proposals: number;
    closed_deals: number;
    conversion_rate: number;
  };
  key_insights: string[];
}

export interface SalesTrend {
  period: string;
  revenue: number;
  deals_count: number;
  average_deal_size: number;
  forecast: number;
}

export interface SalesChannel {
  channel: string;
  revenue: number;
  percentage: number;
  growth: number;
  deals_count: number;
  conversion_rate: number;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  revenue: number;
  units_sold: number;
  growth: number;
  profit_margin: number;
}

export interface ImprovementSuggestion {
  id: number;
  category: string;
  title: string;
  description: string;
  potential_impact: number;
  effort_required: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
  implementation_steps: string[];
  metrics_to_track: string[];
}
