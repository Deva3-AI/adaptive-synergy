
import React from 'react';
import { PieChart as ReChartsPie, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts';

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  height?: number;
  width?: number;
  valueFormatter?: (value: number) => string;
}

const PieChart = ({ 
  data, 
  height = 300, 
  width,
  valueFormatter = (value) => `${value}`
}: PieChartProps) => {
  const chartColors = data.map(item => item.color);
  
  return (
    <div style={{ width: width || '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || chartColors[index % chartColors.length]} 
              />
            ))}
          </Pie>
          <Tooltip formatter={valueFormatter} />
          <Legend verticalAlign="bottom" iconType="circle" />
        </ReChartsPie>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
