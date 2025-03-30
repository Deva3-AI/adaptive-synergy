
import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  strokeWidth?: number;
  color?: string;
}

const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
  ({ className, value = 0, size = "md", showValue = true, strokeWidth = 4, color = "stroke-primary", ...props }, ref) => {
    // Ensure value is between 0 and 100
    const normalizedValue = Math.min(Math.max(value, 0), 100);
    
    // Convert to stroke-dashoffset value (circumference is 100)
    const circumference = 100;
    const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
    
    // Size mappings
    const sizeMap = {
      sm: "h-12 w-12",
      md: "h-20 w-20",
      lg: "h-32 w-32",
    };
    
    // Text size mappings
    const textSizeMap = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-lg",
    };

    return (
      <div
        className={cn("relative inline-flex items-center justify-center", sizeMap[size], className)}
        ref={ref}
        {...props}
      >
        <svg className="w-full h-full" viewBox="0 0 42 42">
          {/* Background circle */}
          <circle
            className="stroke-muted fill-none"
            cx="21"
            cy="21"
            r="15.91549430918954"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <circle
            className={`${color} fill-none transition-all duration-300 ease-in-out`}
            cx="21"
            cy="21"
            r="15.91549430918954"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 21 21)"
          />
        </svg>
        
        {showValue && (
          <div className={`absolute inset-0 flex items-center justify-center font-medium ${textSizeMap[size]}`}>
            {Math.round(normalizedValue)}%
          </div>
        )}
      </div>
    );
  }
);

ProgressCircle.displayName = "ProgressCircle";

export { ProgressCircle };
