
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export interface BarChartProps {
  data: any[];
  xAxisKey: string;
  series: { name: string; color: string }[];
  height?: number;
  title?: string;
  description?: string;
  yAxisWidth?: number;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const BarChart = ({
  data,
  xAxisKey,
  series,
  height = 350,
  title,
  description,
  yAxisWidth = 40,
  colors = ["#2563eb", "#16a34a", "#d97706", "#dc2626"],
  valueFormatter = (value) => `${value}`,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  className = ""
}: BarChartProps) => {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} margin={{ top: 15, right: 25, left: 5, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <XAxis 
              dataKey={xAxisKey} 
              fontSize={12} 
              tickLine={false}
              axisLine={true}
              tick={{ fill: '#888888' }}
            />
            <YAxis 
              width={yAxisWidth}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#888888' }}
              tickFormatter={valueFormatter}
            />
            {showTooltip && (
              <Tooltip
                formatter={(value) => [valueFormatter(value as number), '']}
                labelFormatter={(value) => `${value}`}
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: 6, 
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                }}
              />
            )}
            {showLegend && <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              iconSize={8}
              fontSize={12}
            />}
            {series.map((item, index) => (
              <Bar
                key={item.name}
                dataKey={item.name}
                fill={item.color || colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChart;
