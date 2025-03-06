export const calculateHours = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  try {
    const start = new Date(`2023-01-01T${startTime}`);
    const end = new Date(`2023-01-01T${endTime}`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
    
    // Handle case where end time is earlier than start time (overnight work)
    let hoursDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < 0) {
      // Add 24 hours if end time is on the next day
      hoursDiff += 24;
    }
    
    return parseFloat(hoursDiff.toFixed(2));
  } catch (error) {
    console.error('Error calculating hours:', error);
    return 0;
  }
};

export const getMonthName = (month: number): string => {
  return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
}; 