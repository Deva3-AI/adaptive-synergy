
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AnalyticsChartProps {
  data: any[];
  height?: number;
  defaultType?: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  colors?: string[];
  options?: {
    lineKeys?: string[];
    lineColors?: string[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  data, 
  height = 300, 
  defaultType = 'line',
  colors = COLORS,
  options
}) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-muted/20" 
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Extract all possible keys except 'name' for lines/bars
  const keys = Object.keys(data[0]).filter(key => key !== 'name');
  const lineKeys = options?.lineKeys || keys;
  const lineColors = options?.lineColors || colors;

  // Render appropriate chart based on type
  switch (defaultType) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => {
              if (typeof value === 'number') {
                return [value.toLocaleString(), ''];
              }
              return [value, ''];
            }} />
            <Legend />
            {lineKeys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={lineColors[index % lineColors.length]} 
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => {
              if (typeof value === 'number') {
                return [value.toLocaleString(), ''];
              }
              return [value, ''];
            }} />
            <Legend />
            {keys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'pie':
    case 'donut':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => {
                if (typeof percent === 'number') {
                  return `${name}: ${(percent * 100).toFixed(0)}%`;
                }
                return `${name}: ${percent}%`;
              }}
              outerRadius={height * 0.4}
              innerRadius={defaultType === 'donut' ? height * 0.2 : 0}
              fill="#8884d8"
              dataKey={keys[0]}
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => {
              if (typeof value === 'number') {
                return [value.toLocaleString(), ''];
              }
              return [value, ''];
            }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
      
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => {
              if (typeof value === 'number') {
                return [value.toLocaleString(), ''];
              }
              return [value, ''];
            }} />
            <Legend />
            {lineKeys.map((key, index) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={lineColors[index % lineColors.length]}
                fill={`${lineColors[index % lineColors.length]}20`}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <div className="flex items-center justify-center" style={{ height }}>
          <p className="text-sm text-muted-foreground">Chart type not supported</p>
        </div>
      );
  }
};

export default AnalyticsChart;
