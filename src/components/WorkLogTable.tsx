import React from 'react';
import WorkLogRow from './WorkLogRow';
import { WorkLogEntry } from '../types';

interface WorkLogTableProps {
  workLog: WorkLogEntry[];
  onEntryChange: (
    index: number, 
    field: 'date' | 'startTime' | 'endTime' | 'totalHours' | 'project' | 'notes' | 'hourlyRate' | 'income',
    value: string | number
  ) => void;
}

const WorkLogTable: React.FC<WorkLogTableProps> = ({ workLog, onEntryChange }) => {
  return (
    <div className="card">
      <h2>Work Log Entries</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Hours</th>
              <th>Hourly Rate</th>
              <th>Income</th>
              <th>Project</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {workLog.map((entry, index) => (
              <WorkLogRow 
                key={entry.date} 
                entry={entry} 
                index={index} 
                onEntryChange={onEntryChange} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkLogTable; 