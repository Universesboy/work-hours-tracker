import React, { useState, useEffect } from 'react';
import { YearlyData, MonthlyData } from '../types';
import { getMonthName } from '../utils/dateUtils';
import { getColorForPercentage } from '../utils/summaryUtils';
import '../styles/YearlySummary.css';

interface YearlySummaryProps {
  yearlyData: YearlyData;
  onMonthSelect: (month: number) => void;
}

const YearlySummary: React.FC<YearlySummaryProps> = ({ yearlyData, onMonthSelect }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'months'>('overview');
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [yearlyData]);
  
  const { year, months, totalHours, totalIncome, averageRate, totalDaysWorked } = yearlyData;
  
  // Sort months in chronological order
  const sortedMonths = [...months].sort((a, b) => a.month - b.month);
  
  // Find the month with highest income
  const topEarningMonth = months.length > 0 
    ? months.reduce((max, month) => month.totalIncome > max.totalIncome ? month : max, months[0])
    : null;
  
  // Find the month with highest hours
  const topHoursMonth = months.length > 0 
    ? months.reduce((max, month) => month.totalHours > max.totalHours ? month : max, months[0])
    : null;
  
  const handleMonthClick = (month: number) => {
    onMonthSelect(month);
  };
  
  const handleMonthExpand = (month: number) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };
  
  const renderMonthCard = (monthData: MonthlyData) => {
    const { month, totalHours, totalIncome, targetHours, averageRate, daysWorked } = monthData;
    const progressPercentage = Math.min(100, (totalHours / targetHours) * 100);
    const isExpanded = expandedMonth === month;
    const progressColor = getColorForPercentage(progressPercentage);
    
    return (
      <div 
        key={month} 
        className={`month-card ${isExpanded ? 'expanded' : ''}`}
        onClick={() => handleMonthExpand(month)}
      >
        <div className="month-header">
          <h3>{getMonthName(month)}</h3>
          <div 
            className="progress-indicator" 
            style={{ 
              background: progressColor,
              width: `${progressPercentage}%` 
            }}
          />
        </div>
        
        <div className="month-stats">
          <div className="stat">
            <span className="stat-value">{totalHours.toFixed(1)}</span>
            <span className="stat-label">Hours</span>
          </div>
          <div className="stat">
            <span className="stat-value">${totalIncome.toFixed(2)}</span>
            <span className="stat-label">Income</span>
          </div>
          <div className="stat">
            <span className="stat-value">${averageRate.toFixed(2)}</span>
            <span className="stat-label">Avg Rate</span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="month-details">
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Days Worked:</span>
                <span className="detail-value">{daysWorked}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Target Hours:</span>
                <span className="detail-value">{targetHours}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Completion:</span>
                <span className="detail-value">{progressPercentage.toFixed(1)}%</span>
              </div>
            </div>
            <button 
              className="view-month-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleMonthClick(month);
              }}
            >
              View Month Details
            </button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="yearly-summary">
      <div className="yearly-header">
        <h2>{year} Annual Summary</h2>
        <div className="tab-selector">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'months' ? 'active' : ''}
            onClick={() => setActiveTab('months')}
          >
            Monthly Breakdown
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading yearly data...</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="yearly-overview">
              <div className="overview-cards">
                <div className="overview-card total-hours">
                  <h3>Total Hours</h3>
                  <div className="card-value">{totalHours.toFixed(1)}</div>
                  <div className="card-subtitle">Hours Worked in {year}</div>
                </div>
                
                <div className="overview-card total-income">
                  <h3>Total Income</h3>
                  <div className="card-value">${totalIncome.toFixed(2)}</div>
                  <div className="card-subtitle">Income Earned in {year}</div>
                </div>
                
                <div className="overview-card average-rate">
                  <h3>Average Rate</h3>
                  <div className="card-value">${averageRate.toFixed(2)}</div>
                  <div className="card-subtitle">Per Hour in {year}</div>
                </div>
                
                <div className="overview-card days-worked">
                  <h3>Days Worked</h3>
                  <div className="card-value">{totalDaysWorked}</div>
                  <div className="card-subtitle">Working Days in {year}</div>
                </div>
              </div>
              
              {topEarningMonth && (
                <div className="top-stats">
                  <div className="top-stat-card">
                    <h3>Top Earning Month</h3>
                    <div className="top-stat-value">${topEarningMonth.totalIncome.toFixed(2)}</div>
                    <div className="top-stat-month">{getMonthName(topEarningMonth.month)}</div>
                    <button 
                      className="view-month-btn"
                      onClick={() => handleMonthClick(topEarningMonth.month)}
                    >
                      View Month
                    </button>
                  </div>
                  
                  {topHoursMonth && (
                    <div className="top-stat-card">
                      <h3>Most Hours</h3>
                      <div className="top-stat-value">{topHoursMonth.totalHours.toFixed(1)}</div>
                      <div className="top-stat-month">{getMonthName(topHoursMonth.month)}</div>
                      <button 
                        className="view-month-btn"
                        onClick={() => handleMonthClick(topHoursMonth.month)}
                      >
                        View Month
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="monthly-distribution">
                <h3>Monthly Distribution</h3>
                <div className="chart-container">
                  {sortedMonths.map(monthData => {
                    const maxHeight = 200; // Max bar height in pixels
                    const maxHours = Math.max(...months.map(m => m.totalHours), 1);
                    const barHeight = (monthData.totalHours / maxHours) * maxHeight;
                    const monthProgress = (monthData.totalHours / monthData.targetHours) * 100;
                    const barColor = getColorForPercentage(monthProgress);
                    
                    return (
                      <div key={monthData.month} className="chart-column">
                        <div className="chart-bar-container">
                          <div 
                            className="chart-bar"
                            style={{ 
                              height: `${barHeight}px`,
                              backgroundColor: barColor
                            }}
                          >
                            <div className="bar-value">{monthData.totalHours.toFixed(0)}</div>
                          </div>
                        </div>
                        <div className="chart-label">
                          <button 
                            onClick={() => handleMonthClick(monthData.month)}
                            className="month-label-btn"
                          >
                            {getMonthName(monthData.month).substring(0, 3)}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'months' && (
            <div className="monthly-breakdown">
              <div className="months-grid">
                {sortedMonths.map(monthData => renderMonthCard(monthData))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default YearlySummary; 