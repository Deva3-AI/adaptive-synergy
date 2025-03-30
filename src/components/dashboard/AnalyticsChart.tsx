
import React from 'react';
import { LineChart } from '@/components/ui/charts';

interface AnalyticsChartProps {
  data: any[];
  className?: string;
}

const AnalyticsChart = ({ data = getMockData(), className }: AnalyticsChartProps) => {
  return (
    <LineChart
      data={data}
      xAxisKey="month"
      series={[
        { key: 'revenue', label: 'Revenue', color: 'var(--chart-primary)' },
        { key: 'expenses', label: 'Expenses', color: 'var(--chart-secondary)' }
      ]}
      className={className}
      height={350}
    />
  );
};

// Mock data for the chart
function getMockData() {
  return [
    { month: 'Jan', revenue: 10000, expenses: 8000 },
    { month: 'Feb', revenue: 15000, expenses: 10000 },
    { month: 'Mar', revenue: 12000, expenses: 9000 },
    { month: 'Apr', revenue: 18000, expenses: 12000 },
    { month: 'May', revenue: 20000, expenses: 14000 },
    { month: 'Jun', revenue: 22000, expenses: 15000 },
    { month: 'Jul', revenue: 25000, expenses: 16000 },
    { month: 'Aug', revenue: 28000, expenses: 18000 },
    { month: 'Sep', revenue: 30000, expenses: 20000 },
    { month: 'Oct', revenue: 35000, expenses: 22000 },
    { month: 'Nov', revenue: 40000, expenses: 25000 },
    { month: 'Dec', revenue: 45000, expenses: 28000 },
  ];
}

export default AnalyticsChart;
