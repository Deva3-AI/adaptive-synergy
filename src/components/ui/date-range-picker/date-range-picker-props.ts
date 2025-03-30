
import { Dispatch, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';

export interface DateRangePickerProps {
  value: DateRange;
  onChange: Dispatch<SetStateAction<DateRange>>;
  align?: 'start' | 'center' | 'end';
  locale?: string;
  showCompare?: boolean;
}
