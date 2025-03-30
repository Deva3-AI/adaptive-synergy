
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

export interface DonutChartProps {
  data: any[];
  nameKey: string;
  dataKey: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  nameKey,
  dataKey,
  colors = DEFAULT_COLORS,
  innerRadius = 60,
  outerRadius = 80,
  height = 300,
  className,
  showLegend = true,
}) => {
  // Check if required props are provided
  if (!data || !nameKey || !dataKey) {
    console.error('DonutChart requires data, nameKey, and dataKey props');
    return <div className="bg-muted p-4 rounded-md">Chart configuration error: Missing required properties</div>;
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value}`, dataKey]} />
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
