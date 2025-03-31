
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
  // Additional props to match used props in components
  date?: DateRange;
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  value, 
  onChange,
  date,
  setDate
}) => {
  // Handle both property patterns
  const selectedValue = value || date;
  const handleChange = (newDate: DateRange | undefined) => {
    if (onChange) onChange(newDate);
    if (setDate) setDate(newDate);
  };

  return (
    <Calendar
      mode="range"
      selected={selectedValue}
      onSelect={handleChange as any}
      numberOfMonths={2}
      className="rounded-md border"
    />
  );
};
