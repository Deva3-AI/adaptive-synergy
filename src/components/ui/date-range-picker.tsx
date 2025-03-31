
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  return (
    <Calendar
      mode="range"
      selected={value}
      onSelect={onChange as any}
      numberOfMonths={2}
      className="rounded-md border"
    />
  );
};
