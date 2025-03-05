import { WorkLogEntry, MonthlyData, YearlyData } from '../types';
import { getMonthName } from './dateUtils';

/**
 * Calculate monthly data from work log entries for a specific month and year
 */
export const calculateMonthlyData = (
  workLog: WorkLogEntry[], 
  month: number, 
  year: number
): MonthlyData => {
  // Filter entries with hours for this month
  const entriesWithHours = workLog.filter(entry => entry.totalHours > 0);
  
  // Calculate total hours
  const totalHours = entriesWithHours.reduce((total, entry) => 
    total + entry.totalHours, 0);
  
  // Calculate total income
  const totalIncome = entriesWithHours.reduce((total, entry) => 
    total + (typeof entry.income === 'number' ? entry.income : 0), 0);
  
  // Calculate average rate
  const entriesWithRates = entriesWithHours.filter(entry => {
    const hourlyRate = typeof entry.hourlyRate === 'number' ? entry.hourlyRate : 0;
    return hourlyRate > 0;
  });
  
  let averageRate = 0;
  if (entriesWithRates.length > 0) {
    const weightedRates = entriesWithRates.reduce((sum, entry) => {
      const hourlyRate = typeof entry.hourlyRate === 'number' ? entry.hourlyRate : 0;
      return sum + (hourlyRate * entry.totalHours);
    }, 0);
    
    const totalHoursWithRates = entriesWithRates.reduce((sum, entry) => 
      sum + entry.totalHours, 0);
    
    averageRate = weightedRates / totalHoursWithRates;
  }
  
  // Count days worked
  const daysWorked = entriesWithHours.length;
  
  // Default target hours
  const targetHours = 60;
  
  return {
    month,
    year,
    totalHours,
    totalIncome,
    averageRate,
    daysWorked,
    targetHours,
    workLog
  };
};

/**
 * Calculate yearly data from monthly data
 */
export const calculateYearlyData = (monthlyData: MonthlyData[]): YearlyData => {
  // Ensure we have data
  if (monthlyData.length === 0) {
    return {
      year: new Date().getFullYear(),
      months: [],
      totalHours: 0,
      totalIncome: 0,
      averageRate: 0,
      totalDaysWorked: 0
    };
  }
  
  // Get the year from the first month (all should be the same year)
  const year = monthlyData[0].year;
  
  // Calculate totals
  const totalHours = monthlyData.reduce((total, month) => 
    total + month.totalHours, 0);
    
  const totalIncome = monthlyData.reduce((total, month) => 
    total + month.totalIncome, 0);
    
  const totalDaysWorked = monthlyData.reduce((total, month) => 
    total + month.daysWorked, 0);
    
  // Calculate weighted average rate
  let averageRate = 0;
  if (totalHours > 0) {
    const weightedRates = monthlyData.reduce((sum, month) => 
      sum + (month.averageRate * month.totalHours), 0);
    averageRate = weightedRates / totalHours;
  }
  
  return {
    year,
    months: monthlyData,
    totalHours,
    totalIncome,
    averageRate,
    totalDaysWorked
  };
};

/**
 * Get all available years from stored data
 */
export const getAvailableYears = (storedData: Record<string, WorkLogEntry[]>): number[] => {
  // Extract all years from stored data keys (format: "year-month")
  const years = Object.keys(storedData)
    .map(key => parseInt(key.split('-')[0]));
    
  // Return unique years in descending order
  return Array.from(new Set(years)).sort((a, b) => b - a);
};

/**
 * Generate a color based on percentage completion
 */
export const getColorForPercentage = (percentage: number): string => {
  if (percentage < 25) return '#ff6b6b'; // Red
  if (percentage < 50) return '#ffa06b'; // Orange
  if (percentage < 75) return '#ffd56b'; // Yellow
  if (percentage < 100) return '#66d98b'; // Light green
  return '#2ecc71'; // Green
}; 