
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  className,
}: DashboardCardProps) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
