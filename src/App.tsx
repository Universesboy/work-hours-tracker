import React, { useState } from 'react';
import Header from './components/Header';
import UserInfoForm from './components/UserInfoForm';
import WorkLogTable from './components/WorkLogTable';
import MonthlySummary from './components/MonthlySummary';
import { WorkLogEntry, UserInfo } from './types';
import { calculateHours } from './utils/dateUtils';
import './styles/App.css';

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const [workLog, setWorkLog] = useState<WorkLogEntry[]>(
    Array(31).fill(null).map((_, index) => ({
      date: index + 1,
      startTime: '',
      endTime: '',
      totalHours: 0,
      hourlyRate: 0,
      income: 0,
      project: '',
      notes: ''
    }))
  );

  const handleUserInfoChange = (field: keyof UserInfo, value: string | number) => {
    setUserInfo(prevInfo => ({
      ...prevInfo,
      [field]: value
    }));
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

  return (
    <div className="App">
      <Header />
      <UserInfoForm 
        userInfo={userInfo}
        onUserInfoChange={handleUserInfoChange}
      />
      <WorkLogTable 
        workLog={workLog}
        onEntryChange={handleEntryChange}
      />
      <MonthlySummary workLog={workLog} />
    </div>
  );
};

export default App; 