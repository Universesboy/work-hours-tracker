import React from 'react';
import { WorkLogEntry } from '../types';

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

  return (
    <tr>
      <td>{entry.date}</td>
      <td>
        <input 
          type="time" 
          value={entry.startTime}
          onChange={(e) => onEntryChange(index, 'startTime', e.target.value)}
        />
      </td>
      <td>
        <input 
          type="time" 
          value={entry.endTime}
          onChange={(e) => onEntryChange(index, 'endTime', e.target.value)}
        />
      </td>
      <td>{entry.totalHours.toFixed(2)}</td>
      <td>
        <input 
          type="number" 
          min="0"
          step="0.01"
          value={hourlyRate || ''}
          onChange={(e) => onEntryChange(index, 'hourlyRate', e.target.value)}
          placeholder="Rate"
        />
      </td>
      <td className="income-cell">${income.toFixed(2)}</td>
      <td>
        <input 
          type="text" 
          value={entry.project}
          onChange={(e) => onEntryChange(index, 'project', e.target.value)}
          placeholder="Project name"
        />
      </td>
      <td>
        <input 
          type="text" 
          value={entry.notes}
          onChange={(e) => onEntryChange(index, 'notes', e.target.value)}
          placeholder="Additional notes"
        />
      </td>
    </tr>
  );
};

export default WorkLogRow; 