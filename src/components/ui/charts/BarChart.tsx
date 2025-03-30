
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

export interface BarChartProps {
  data: any[];
  xAxisKey: string;
  series: { key: string; label?: string; color: string }[];
  height?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

const BarChart = ({
  data,
  xAxisKey,
  series,
  height = 300,
  className,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
}: BarChartProps) => {
  if (!data || data.length === 0) {
    return <div className={cn("flex items-center justify-center h-64", className)}>No data available</div>;
  }

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          {showTooltip && <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              padding: '0.5rem'
            }} 
          />}
          {showLegend && <Legend wrapperStyle={{ paddingTop: 10 }} />}
          {series.map((item, index) => (
            <Bar 
              key={item.key}
              dataKey={item.key}
              name={item.label || item.key}
              fill={item.color || `var(--chart-${index})`}
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
