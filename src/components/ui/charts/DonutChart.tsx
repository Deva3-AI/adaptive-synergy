
import React from 'react';
import { PieChart as RechartsDonutChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export interface DonutChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  className?: string;
}

const DEFAULT_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--primary) / 0.8)',
  'hsl(var(--primary) / 0.6)',
  'hsl(var(--primary) / 0.4)',
  'hsl(var(--muted))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--accent))',
  'hsl(var(--secondary))'
];

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  colors = DEFAULT_COLORS,
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  className
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsDonutChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="hsl(var(--primary))"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value}`, '']}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
        {showLegend && (
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-xs">{value}</span>
            )}
          />
        )}
      </RechartsDonutChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
