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

export interface MonthlyData {
  month: number;
  year: number;
  totalHours: number;
  totalIncome: number;
  averageRate: number;
  daysWorked: number;
  targetHours: number;
  workLog: WorkLogEntry[];
}

export interface YearlyData {
  year: number;
  months: MonthlyData[];
  totalHours: number;
  totalIncome: number;
  averageRate: number;
  totalDaysWorked: number;
} 