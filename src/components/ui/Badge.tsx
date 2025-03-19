
import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "accent" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Badge = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "border border-border bg-transparent hover:bg-muted/50": variant === "outline",
          "bg-accent text-accent-foreground hover:bg-accent/90": variant === "accent",
          "bg-green-500/15 text-green-600 dark:bg-green-500/25 dark:text-green-400": variant === "success",
          "bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/25 dark:text-yellow-400": variant === "warning",
          "bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400": variant === "danger",
          "px-2 py-0.5 text-xs": size === "sm",
          "px-2.5 py-0.5 text-sm": size === "md",
          "px-3 py-1 text-base": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };
