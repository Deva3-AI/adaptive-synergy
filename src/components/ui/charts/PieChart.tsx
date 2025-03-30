
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

export interface PieChartProps {
  data: any[];
  nameKey: string;
  dataKey: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
}

const COLORS = [
  'var(--chart-0)',
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
];

const PieChart = ({
  data,
  nameKey,
  dataKey,
  height = 300,
  className,
  showLegend = true,
  showTooltip = true,
  colors = COLORS,
  innerRadius = 0,
  outerRadius = 80,
}: PieChartProps) => {
  if (!data || data.length === 0) {
    return <div className={cn("flex items-center justify-center h-64", className)}>No data available</div>;
  }

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          {showTooltip && <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              padding: '0.5rem'
            }} 
            formatter={(value: any) => [`${value} (${Math.round(value / data.reduce((sum, entry) => sum + entry[dataKey], 0) * 100)}%)`, null]}
          />}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
