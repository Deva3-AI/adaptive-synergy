
import { format } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param dateString The date string to format
 * @param formatStr The format string to use (defaults to 'MMM d, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date | undefined, formatStr: string = 'MMM d, yyyy'): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a currency value
 * @param value The number value to format
 * @param currency The currency code (defaults to 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | undefined, currency: string = 'USD'): string => {
  if (value === undefined || value === null) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${value.toFixed(2)}`;
  }
};

/**
 * Format a number with commas and decimal places
 * @param value The number to format
 * @param decimals The number of decimal places (defaults to 0)
 * @returns Formatted number string
 */
export const formatNumber = (value: number | undefined, decimals: number = 0): string => {
  if (value === undefined || value === null) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toFixed(decimals);
  }
};

/**
 * Format a percentage value
 * @param value The number value to format (0-100 or 0-1)
 * @param decimals The number of decimal places (defaults to 0)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number | undefined, decimals: number = 0): string => {
  if (value === undefined || value === null) return 'N/A';
  
  // Convert 0-1 to 0-100 if needed
  const normalizedValue = value > 1 ? value : value * 100;
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(normalizedValue / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${normalizedValue.toFixed(decimals)}%`;
  }
};

/**
 * Format a file size
 * @param bytes The file size in bytes
 * @param decimals The number of decimal places (defaults to 2)
 * @returns Formatted file size string (e.g. "1.5 MB")
 */
export const formatFileSize = (bytes: number | undefined, decimals: number = 2): string => {
  if (bytes === undefined || bytes === null) return 'N/A';
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format a time duration in hours and minutes
 * @param hours The number of hours
 * @returns Formatted time duration string (e.g. "2h 30m")
 */
export const formatDuration = (hours: number | undefined): string => {
  if (hours === undefined || hours === null) return 'N/A';
  
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  if (h === 0) {
    return `${m}m`;
  }
  
  if (m === 0) {
    return `${h}h`;
  }
  
  return `${h}h ${m}m`;
};

/**
 * Format a timestamptz to a time string
 * @param timestamp The timestamp to format
 * @returns Formatted time string (e.g. "2:30 PM")
 */
export const formatTime = (timestamp: string | Date | undefined): string => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return format(date, 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

/**
 * Format task or project status
 * @param status The status string
 * @returns Formatted status with capitalized first letter
 */
export const formatStatus = (status: string | undefined): string => {
  if (!status) return 'N/A';
  
  // Capitalize first letter and replace underscores with spaces
  return status.charAt(0).toUpperCase() + 
         status.slice(1).replace(/_/g, ' ');
};
