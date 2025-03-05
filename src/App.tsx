import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UserInfoForm from './components/UserInfoForm';
import WorkLogTable from './components/WorkLogTable';
import MonthlySummary from './components/MonthlySummary';
import YearlySummary from './components/YearlySummary';
import { WorkLogEntry, UserInfo, MonthlyData, YearlyData } from './types';
import { calculateHours } from './utils/dateUtils';
import { calculateMonthlyData, calculateYearlyData, getAvailableYears } from './utils/summaryUtils';
import { ThemeProvider } from './context/ThemeContext';
import './styles/App.css';

// Local storage keys
const USER_INFO_STORAGE_KEY = 'workHoursTracker_userInfo';
const WORK_LOG_STORAGE_KEY_PREFIX = 'workHoursTracker_workLog_';

const App: React.FC = () => {
  // Initialize state from localStorage or use default values
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    const savedUserInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);
    if (savedUserInfo) {
      try {
        return JSON.parse(savedUserInfo);
      } catch (error) {
        console.error('Error parsing saved user info:', error);
      }
    }
    return {
      name: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    };
  });

  // Load all worklog data from localStorage
  const [allWorkLogs, setAllWorkLogs] = useState<Record<string, WorkLogEntry[]>>(() => {
    const storedLogs: Record<string, WorkLogEntry[]> = {};
    
    // Look for all worklog entries in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(WORK_LOG_STORAGE_KEY_PREFIX)) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            storedLogs[key.replace(WORK_LOG_STORAGE_KEY_PREFIX, '')] = JSON.parse(value);
          }
        } catch (error) {
          console.error(`Error parsing worklog for key ${key}:`, error);
        }
      }
    }
    
    // If no data found, initialize with current month
    if (Object.keys(storedLogs).length === 0) {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const key = `${currentYear}-${currentMonth}`;
      storedLogs[key] = Array(31).fill(null).map((_, index) => ({
        date: index + 1,
        startTime: '',
        endTime: '',
        totalHours: 0,
        hourlyRate: 0,
        income: 0,
        project: '',
        notes: ''
      }));
    }
    
    return storedLogs;
  });

  // Track view mode
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  
  // Get current month's worklog
  const currentKey = `${userInfo.year}-${userInfo.month}`;
  const [workLog, setWorkLog] = useState<WorkLogEntry[]>(() => {
    // If we have data for the current month, use it
    if (allWorkLogs[currentKey]) {
      return allWorkLogs[currentKey];
    }
    
    // Otherwise, create a new empty month
    return Array(31).fill(null).map((_, index) => ({
      date: index + 1,
      startTime: '',
      endTime: '',
      totalHours: 0,
      hourlyRate: 0,
      income: 0,
      project: '',
      notes: ''
    }));
  });

  // Calculate yearly summary data when allWorkLogs or userInfo changes
  const [yearlyData, setYearlyData] = useState<YearlyData>(() => {
    const monthlyDataArray: MonthlyData[] = [];
    const currentYear = userInfo.year;
    
    // Generate monthly data for all available months in the current year
    Object.keys(allWorkLogs).forEach(key => {
      const [year, month] = key.split('-').map(Number);
      if (year === currentYear) {
        const monthData = calculateMonthlyData(allWorkLogs[key], month, year);
        monthlyDataArray.push(monthData);
      }
    });
    
    return calculateYearlyData(monthlyDataArray);
  });

  const [isLoading, setIsLoading] = useState(true);

  // Save to localStorage whenever userInfo changes
  useEffect(() => {
    localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(userInfo));
  }, [userInfo]);

  // Save to localStorage whenever workLog changes
  useEffect(() => {
    const key = `${userInfo.year}-${userInfo.month}`;
    const storageKey = `${WORK_LOG_STORAGE_KEY_PREFIX}${key}`;
    localStorage.setItem(storageKey, JSON.stringify(workLog));
    
    // Update allWorkLogs
    setAllWorkLogs(prev => ({
      ...prev,
      [key]: workLog
    }));
  }, [workLog, userInfo.year, userInfo.month]);

  // Update yearly data when allWorkLogs changes
  useEffect(() => {
    const monthlyDataArray: MonthlyData[] = [];
    const currentYear = userInfo.year;
    
    // Generate monthly data for all available months in the current year
    Object.keys(allWorkLogs).forEach(key => {
      const [year, month] = key.split('-').map(Number);
      if (year === currentYear) {
        const monthData = calculateMonthlyData(allWorkLogs[key], month, year);
        monthlyDataArray.push(monthData);
      }
    });
    
    setYearlyData(calculateYearlyData(monthlyDataArray));
  }, [allWorkLogs, userInfo.year]);

  // Update workLog when userInfo.month or userInfo.year changes
  useEffect(() => {
    const key = `${userInfo.year}-${userInfo.month}`;
    
    // If we already have data for this month, use it
    if (allWorkLogs[key]) {
      setWorkLog(allWorkLogs[key]);
    } else {
      // Otherwise create a new empty month
      const newWorkLog = Array(31).fill(null).map((_, index) => ({
        date: index + 1,
        startTime: '',
        endTime: '',
        totalHours: 0,
        hourlyRate: 0,
        income: 0,
        project: '',
        notes: ''
      }));
      
      setWorkLog(newWorkLog);
      setAllWorkLogs(prev => ({
        ...prev,
        [key]: newWorkLog
      }));
    }
  }, [userInfo.month, userInfo.year, allWorkLogs]);

  useEffect(() => {
    try {
      // ... existing localStorage loading logic ...
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUserInfoChange = (field: keyof UserInfo, value: string | number) => {
    setUserInfo(prevInfo => ({
      ...prevInfo,
      [field]: value
    }));
    
    // If month or year changes, automatically switch to month view
    if (field === 'month' || field === 'year') {
      setViewMode('month');
    }
  };

  const handleEntryChange = (
    index: number, 
    field: 'date' | 'startTime' | 'endTime' | 'totalHours' | 'project' | 'notes' | 'hourlyRate' | 'income', 
    value: string | number
  ) => {
    const updatedLog = [...workLog];
    
    // Handle numeric values
    if (field === 'hourlyRate') {
      const numericValue = value === '' ? 0 : parseFloat(value as string);
      updatedLog[index] = { 
        ...updatedLog[index], 
        hourlyRate: numericValue 
      };
    } else {
      updatedLog[index] = { 
        ...updatedLog[index], 
        [field]: value 
      } as WorkLogEntry;
    }

    // Calculate total hours if start or end time changes
    if (field === 'startTime' || field === 'endTime') {
      const { startTime, endTime } = updatedLog[index];
      updatedLog[index].totalHours = calculateHours(startTime, endTime);
    }

    // Calculate income based on hours and rate
    if (field === 'hourlyRate' || field === 'totalHours' || field === 'startTime' || field === 'endTime') {
      const entry = updatedLog[index];
      // Use explicit property access
      const rate = typeof entry.hourlyRate === 'number' ? entry.hourlyRate : 0;
      const hours = typeof entry.totalHours === 'number' ? entry.totalHours : 0;
      updatedLog[index] = {
        ...entry,
        income: rate * hours
      };
    }

    setWorkLog(updatedLog);
  };

  const handleToggleView = () => {
    setViewMode(prevMode => prevMode === 'month' ? 'year' : 'month');
  };

  const handleMonthSelect = (month: number) => {
    setUserInfo(prev => ({
      ...prev,
      month
    }));
    setViewMode('month');
  };

  return (
    <ThemeProvider>
      <div className="App">
        <Header 
          viewMode={viewMode} 
          onToggleView={handleToggleView} 
        />
        
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          viewMode === 'month' ? (
            <>
              <UserInfoForm 
                userInfo={userInfo}
                onUserInfoChange={handleUserInfoChange}
              />
              <WorkLogTable 
                workLog={workLog}
                onEntryChange={handleEntryChange}
              />
              <MonthlySummary workLog={workLog} />
            </>
          ) : (
            <YearlySummary 
              yearlyData={yearlyData} 
              onMonthSelect={handleMonthSelect} 
            />
          )
        )}
      </div>
    </ThemeProvider>
  );
};

export default App; 