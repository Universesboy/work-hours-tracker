export const calculateHours = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const start = new Date(`2023-01-01T${startTime}`);
  const end = new Date(`2023-01-01T${endTime}`);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }
  
  const hoursDiff = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return parseFloat(hoursDiff.toFixed(2));
};

export const getMonthName = (month: number): string => {
  return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
}; 