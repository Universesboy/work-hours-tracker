export interface WorkLogEntry {
  date: number;
  startTime: string;
  endTime: string;
  totalHours: number;
  project: string;
  notes: string;
  hourlyRate: number;
  income: number;
}

export interface UserInfo {
  name: string;
  month: number;
  year: number;
} 