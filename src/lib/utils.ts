
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

// Format number with commas
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substr(0, 2);
}

// Generate random color
export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Get status color
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    completed: 'bg-green-500',
    in_progress: 'bg-yellow-500',
    pending: 'bg-blue-500',
    cancelled: 'bg-red-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    paid: 'bg-green-500',
    unpaid: 'bg-red-500',
    overdue: 'bg-red-500',
  };
  
  return statusMap[status.toLowerCase()] || 'bg-gray-500';
}
