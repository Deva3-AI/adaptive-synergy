
import React from 'react';
import { LineChart, BarChart, PieChart, DonutChart } from '@/components/ui/charts';

export interface AnalyticsChartProps {
  data?: any[];
  defaultType?: 'line' | 'bar' | 'pie' | 'donut';
  xAxisKey?: string;
  height?: number;
  series?: { name: string; color: string }[];
  className?: string;
  valueFormatter?: (value: any) => string;
  options?: Record<string, any>;
}

const AnalyticsChart = ({ 
  data = getMockData(), 
  defaultType = 'line',
  xAxisKey = 'month',
  height = 350,
  series,
  className,
  valueFormatter = (value) => value.toString(),
  options = {}
}: AnalyticsChartProps) => {
  const renderChart = () => {
    switch (defaultType) {
      case 'bar':
        return (
          <BarChart
            data={data}
            xAxisKey={xAxisKey}
            series={series || [
              { name: 'revenue', color: 'var(--chart-primary)' },
              { name: 'expenses', color: 'var(--chart-secondary)' }
            ]}
            className={className}
            height={height}
            valueFormatter={valueFormatter}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={data.map(item => ({
              name: item.name || item.label,
              value: item.value,
              color: item.color || '#' + Math.floor(Math.random()*16777215).toString(16)
            }))}
            className={className}
            height={height}
            valueFormatter={valueFormatter}
          />
        );
      case 'donut':
        return (
          <DonutChart
            data={data.map(item => ({
              name: item.name || item.label,
              value: item.value,
              color: item.color || '#' + Math.floor(Math.random()*16777215).toString(16)
            }))}
            className={className}
            height={height}
            valueFormatter={valueFormatter}
          />
        );
      case 'line':
      default:
        return (
          <LineChart
            data={data}
            xAxisKey={xAxisKey}
            series={series || [
              { name: 'revenue', color: 'var(--chart-primary)' },
              { name: 'expenses', color: 'var(--chart-secondary)' }
            ]}
            className={className}
            height={height}
            valueFormatter={valueFormatter}
          />
        );
    }
  };

  return renderChart();
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
