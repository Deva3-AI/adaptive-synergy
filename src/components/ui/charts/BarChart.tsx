
import React from 'react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartProps {
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  xAxisKey, 
  yAxisKey, 
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
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12 }} 
          tickLine={{ stroke: '#e5e7eb' }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={{ stroke: '#e5e7eb' }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
          }}
        />
        <Legend wrapperStyle={{ paddingTop: 10 }} />
        <Bar dataKey={yAxisKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
