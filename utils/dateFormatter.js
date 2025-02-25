// utils/dateFormatter.js
import { format, formatDistanceToNow } from 'date-fns';

// Format date to "Month DD, YYYY" (e.g., "January 1, 2023")
export const formatFullDate = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, 'MMMM dd, yyyy');
};

// Format date to "MM/DD/YYYY" (e.g., "01/01/2023")
export const formatShortDate = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, 'MM/dd/yyyy');
};

// Format date to "Month YYYY" (e.g., "January 2023")
export const formatMonthYear = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, 'MMMM yyyy');
};

// Format date to relative time (e.g., "2 days ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Group dates by month and year
export const groupByMonthYear = (items, dateField = 'publishDate') => {
  const groups = {};
  
  items.forEach(item => {
    if (!item[dateField]) return;
    
    const date = item[dateField] instanceof Date ? item[dateField] : new Date(item[dateField]);
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push(item);
  });
  
  return groups;
};

export default {
  formatFullDate,
  formatShortDate,
  formatMonthYear,
  formatRelativeTime,
  groupByMonthYear
};