import React from 'react';
import { WorkLogEntry } from '../types';

interface MonthlySummaryProps {
  workLog: WorkLogEntry[];
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ workLog }) => {
  // Memoize calculations to avoid recalculating on each render
  const calculations = React.useMemo(() => {
    // Filter entries with hours first to avoid multiple iterations
    const entriesWithHours = workLog.filter(entry => entry.totalHours > 0);
    
    const totalHours = entriesWithHours.reduce((total, entry) => 
      total + entry.totalHours, 0);
      
    const totalIncome = entriesWithHours.reduce((total, entry) => {
      const income = typeof entry.income === 'number' ? entry.income : 0;
      return total + income;
    }, 0);
    
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
    
    const daysWorked = entriesWithHours.length;
    const averageHoursPerDay = daysWorked > 0 ? totalHours / daysWorked : 0;
    const averageIncomePerDay = daysWorked > 0 ? totalIncome / daysWorked : 0;
    
    const targetHours = 60;
    const remainingHours = Math.max(0, targetHours - totalHours);
    const progressPercentage = Math.min(100, (totalHours / targetHours) * 100);
    
    return {
      totalHours,
      totalIncome,
      averageRate,
      daysWorked,
      averageHoursPerDay,
      averageIncomePerDay,
      targetHours,
      remainingHours,
      progressPercentage
    };
  }, [workLog]);

  const {
    totalHours,
    totalIncome,
    averageRate,
    daysWorked,
    averageHoursPerDay,
    averageIncomePerDay,
    targetHours,
    remainingHours,
    progressPercentage
  } = calculations;

  return (
    <div className="summary">
      <h2>Monthly Summary</h2>
      
      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-value">{totalHours.toFixed(1)}</div>
          <div className="summary-label">Total Hours Worked</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">{targetHours}</div>
          <div className="summary-label">Target Hours</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">{remainingHours.toFixed(1)}</div>
          <div className="summary-label">Remaining Hours</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">${totalIncome.toFixed(2)}</div>
          <div className="summary-label">Total Income</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">${averageRate.toFixed(2)}</div>
          <div className="summary-label">Avg Hourly Rate</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">{daysWorked}</div>
          <div className="summary-label">Days Worked</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">{averageHoursPerDay.toFixed(1)}</div>
          <div className="summary-label">Avg Hours/Day</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">${averageIncomePerDay.toFixed(2)}</div>
          <div className="summary-label">Avg Income/Day</div>
        </div>
      </div>
      
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
          title={`${progressPercentage.toFixed(1)}% of target completed`}
        ></div>
      </div>
    </div>
  );
};

export default MonthlySummary; 