import React, { useState } from 'react';
import WorkLogRow from './WorkLogRow';
import { WorkLogEntry } from '../types';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface WorkLogTableProps {
  workLog: WorkLogEntry[];
  onEntryChange: (
    index: number, 
    field: 'date' | 'startTime' | 'endTime' | 'totalHours' | 'project' | 'notes' | 'hourlyRate' | 'income',
    value: string | number
  ) => void;
}

const WorkLogTable: React.FC<WorkLogTableProps> = ({ workLog, onEntryChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmptyRows, setShowEmptyRows] = useState(true);
  
  const filteredWorkLog = workLog.filter(entry => {
    // If entry has start time or end time or project or notes, it's not empty
    const isEmpty = !entry.startTime && !entry.endTime && !entry.project && !entry.notes;
    
    // If showEmptyRows is false, filter out empty entries
    if (!showEmptyRows && isEmpty) {
      return false;
    }
    
    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (entry.project && entry.project.toLowerCase().includes(searchLower)) ||
        (entry.notes && entry.notes.toLowerCase().includes(searchLower)) ||
        (entry.date.toString().includes(searchTerm))
      );
    }
    
    return true;
  });
  
  return (
    <div className="card">
      <div className="table-header">
        <h2>Work Log Entries</h2>
        <div className="table-controls">
          <div className="search-container">
            <span className="search-icon"><FaSearch /></span>
            <input
              type="text"
              placeholder="Search projects, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={showEmptyRows}
                onChange={() => setShowEmptyRows(!showEmptyRows)}
              />
              Show empty days
            </label>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        {filteredWorkLog.length > 0 ? (
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
              {filteredWorkLog.map((entry, index) => {
                // Find the original index in the workLog array
                const originalIndex = workLog.findIndex(e => e.date === entry.date);
                return (
                  <WorkLogRow 
                    key={entry.date} 
                    entry={entry} 
                    index={originalIndex} 
                    onEntryChange={onEntryChange} 
                  />
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <p>No entries match your search. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkLogTable; 