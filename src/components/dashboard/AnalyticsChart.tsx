import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AnalyticsChartProps {
  data: any[];
  height?: number;
  defaultType?: 'line' | 'bar' | 'pie';
  title?: string;
  options?: {
    lineKeys?: string[];
    lineColors?: string[];
    barKeys?: string[];
    barColors?: string[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  height = 350,
  defaultType = 'line',
  title,
  options
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>(defaultType);

  // Extract keys for visualization
  const getDataKeys = () => {
    if (!data || data.length === 0) return [];
    
    // Use options.lineKeys or options.barKeys if provided
    if (options?.lineKeys && chartType === 'line') {
      return options.lineKeys;
    }
    
    if (options?.barKeys && chartType === 'bar') {
      return options.barKeys;
    }
    
    // Otherwise extract from first data item
    const firstItem = data[0];
    return Object.keys(firstItem).filter(key => 
      typeof firstItem[key] === 'number' && key !== 'value' && key !== 'id' && key !== 'key'
    );
  };

  const getColorForKey = (key: string, index: number) => {
    if (chartType === 'line' && options?.lineColors && options.lineColors[index]) {
      return options.lineColors[index];
    }
    
    if (chartType === 'bar' && options?.barColors && options.barColors[index]) {
      return options.barColors[index];
    }
    
    return COLORS[index % COLORS.length];
  };

  const renderChart = () => {
    const keys = getDataKeys();

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={getColorForKey(key, index)}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={getColorForKey(key, index)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              nameKey="name"
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={height / 3}
              fill="#8884d8"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      
      <div className="flex justify-end mb-4">
        <div className="flex space-x-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            <LineChartIcon className="h-4 w-4 mr-2" />
            Line
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Bar
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
          >
            <PieChartIcon className="h-4 w-4 mr-2" />
            Pie
          </Button>
        </div>
      </div>
      
      {renderChart()}
    </div>
  );
};

export default AnalyticsChart;
