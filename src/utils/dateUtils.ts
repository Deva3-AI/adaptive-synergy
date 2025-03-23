
/**
 * Utility functions for handling dates
 */

/**
 * Convert Date object to ISO string for API requests
 * @param date Date object or string
 * @returns ISO string format of the date
 */
export const dateToString = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
};

/**
 * Convert string date to Date object
 * @param dateStr Date string
 * @returns Date object
 */
export const stringToDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

/**
 * Format difference between two dates as duration string
 * @param start Start date
 * @param end End date (defaults to now)
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export const formatDuration = (start: Date | string, end?: Date | string): string => {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = end 
    ? (typeof end === 'string' ? new Date(end) : end) 
    : new Date();
  
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHrs}h ${diffMins}m`;
};

/**
 * Calculate time difference in milliseconds
 * @param start Start date
 * @param end End date (defaults to now)
 * @returns Time difference in milliseconds
 */
export const getTimeDifference = (start: Date | string, end?: Date | string): number => {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = end 
    ? (typeof end === 'string' ? new Date(end) : end) 
    : new Date();
  
  return endDate.getTime() - startDate.getTime();
};

/**
 * Safely gets date object from various formats
 * @param date Date in string or Date format
 * @returns Date object
 */
export const ensureDate = (date: Date | string): Date => {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
};

/**
 * Format date for display in the UI
 * @param date Date to format
 * @param includeTime Whether to include time in the formatted string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, includeTime = false): string => {
  const dateObj = ensureDate(date);
  
  if (includeTime) {
    return dateObj.toLocaleString();
  }
  return dateObj.toLocaleDateString();
};

/**
 * Convert Date to string for platform integrations
 * This is needed to convert Date objects to strings for platform APIs
 */
export const dateToApiString = (date: Date): string => {
  return date.toISOString();
};

export default {
  dateToString,
  stringToDate,
  formatDuration,
  getTimeDifference,
  dateToApiString,
  ensureDate,
  formatDate
};
