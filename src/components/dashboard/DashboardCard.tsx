
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "accent" | "success" | "warning" | "danger";
  className?: string;
  isGlass?: boolean;
}

const DashboardCard = ({
  title,
  icon,
  children,
  footer,
  badgeText,
  badgeVariant,
  className,
  isGlass = false,
}: DashboardCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover-scale shadow-subtle border overflow-hidden",
        isGlass && "glass-card",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight">
          <div className="flex items-center space-x-2">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <span>{title}</span>
          </div>
        </CardTitle>
        {badgeText && (
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        )}
      </CardHeader>
      <CardContent className="py-4">{children}</CardContent>
      {footer && <CardFooter className="pt-0">{footer}</CardFooter>}
    </Card>
  );
};

export default DashboardCard;
