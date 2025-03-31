
import { CalendarDate } from "@internationalized/date";

export interface DateRange {
  from: Date;
  to?: Date;
}

export interface DateRangePickerProps {
  /** The selected date range. */
  value?: DateRange;
  /** Sets the selected date range. */
  onChange?: (date: DateRange | undefined) => void;
  /** Whether the date range picker should be disabled. */
  disabled?: boolean;
  /** The placeholder to show when no date is selected. */
  placeholder?: string;
  /** Alignment of the popover. */
  align?: "start" | "center" | "end";
  /** The locale to use for formatting dates. */
  locale?: string;
  /** The number of months to show at once. */
  numberOfMonths?: number;
  /** Custom CSS class name. */
  className?: string;
  /** Additional props for compatibility with components */
  date?: DateRange;
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}
