
import React from 'react';
import { PieChart as RechartsPieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  data: any[];
  nameKey: string;
  dataKey: string;
  height?: number;
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  nameKey, 
  dataKey, 
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#3b82f6"
          label={(entry) => entry[nameKey]}
          labelLine={true}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
          }}
        />
        <Legend verticalAlign="bottom" height={36} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
