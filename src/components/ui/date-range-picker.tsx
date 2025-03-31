
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRangePickerProps } from "@/types"

export function DateRangePicker({
  className,
  value,
  onChange,
  date,
  setDate
}: DateRangePickerProps) {
  // Use either the controlled (value/onChange) or uncontrolled (date/setDate) props
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(value || date);

  React.useEffect(() => {
    if (value) {
      setInternalDate(value);
    } else if (date) {
      setInternalDate(date);
    }
  }, [value, date]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setInternalDate(newDate);
    
    if (onChange) {
      onChange(newDate);
    }
    
    if (setDate) {
      setDate(newDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !internalDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate?.from ? (
              internalDate.to ? (
                <>
                  {format(internalDate.from, "LLL dd, y")} -{" "}
                  {format(internalDate.to, "LLL dd, y")}
                </>
              ) : (
                format(internalDate.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={internalDate?.from}
            selected={internalDate}
            onSelect={(newDate) => handleDateChange(newDate)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
