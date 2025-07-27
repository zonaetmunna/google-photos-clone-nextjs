// lib/utils/formatDate.ts

/**
 * Formats a JavaScript Date object into a string with format DD/MM/YYYY.
 * @param date - The date to format
 * @returns Formatted string in "dd/mm/yyyy"
 */
export const formatDate = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid date provided");
    }
  
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
  
    return `${day}/${month}/${year}`;
  };
  