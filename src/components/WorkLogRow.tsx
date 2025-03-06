import React from 'react';
import { WorkLogEntry } from '../types';
import { FaRegClock, FaDollarSign, FaFolder, FaRegEdit } from 'react-icons/fa';

interface WorkLogRowProps {
  entry: WorkLogEntry;
  index: number;
  onEntryChange: (
    index: number, 
    field: 'date' | 'startTime' | 'endTime' | 'totalHours' | 'project' | 'notes' | 'hourlyRate' | 'income', 
    value: string | number
  ) => void;
}

const WorkLogRow: React.FC<WorkLogRowProps> = ({ entry, index, onEntryChange }) => {
  // Access properties safely with optional chaining and defaults
  const hourlyRate = typeof entry.hourlyRate === 'number' ? entry.hourlyRate : 0;
  const income = typeof entry.income === 'number' ? entry.income : 0;
  
  // Check if this row represents the current day
  const isCurrentDay = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    
    // This assumes the entry.date is the day of the month (1-31)
    return currentDay === entry.date;
  };
  
  const rowClass = isCurrentDay() ? 'current-day' : '';
  const isEmpty = !entry.startTime && !entry.endTime && !entry.project && !entry.notes;

  return (
    <tr className={`${rowClass} ${isEmpty ? 'empty-row' : ''}`}>
      <td className="date-cell">{entry.date}</td>
      <td>
        <div className="input-with-icon">
          <span className="input-icon"><FaRegClock /></span>
          <input 
            type="time" 
            value={entry.startTime}
            onChange={(e) => onEntryChange(index, 'startTime', e.target.value)}
            title="Start time"
          />
        </div>
      </td>
      <td>
        <div className="input-with-icon">
          <span className="input-icon"><FaRegClock /></span>
          <input 
            type="time" 
            value={entry.endTime}
            onChange={(e) => onEntryChange(index, 'endTime', e.target.value)}
            title="End time"
          />
        </div>
      </td>
      <td className="hours-cell">{entry.totalHours.toFixed(2)}</td>
      <td>
        <div className="input-with-icon">
          <span className="input-icon"><FaDollarSign /></span>
          <input 
            type="number" 
            min="0"
            step="0.01"
            value={hourlyRate || ''}
            onChange={(e) => onEntryChange(index, 'hourlyRate', e.target.value)}
            placeholder="Rate"
            title="Hourly rate"
          />
        </div>
      </td>
      <td className="income-cell">${income.toFixed(2)}</td>
      <td>
        <div className="input-with-icon">
          <span className="input-icon"><FaFolder /></span>
          <input 
            type="text" 
            value={entry.project}
            onChange={(e) => onEntryChange(index, 'project', e.target.value)}
            placeholder="Project name"
            title="Project name"
          />
        </div>
      </td>
      <td>
        <div className="input-with-icon">
          <span className="input-icon"><FaRegEdit /></span>
          <input 
            type="text" 
            value={entry.notes}
            onChange={(e) => onEntryChange(index, 'notes', e.target.value)}
            placeholder="Additional notes"
            title="Notes"
          />
        </div>
      </td>
    </tr>
  );
};

export default WorkLogRow; 