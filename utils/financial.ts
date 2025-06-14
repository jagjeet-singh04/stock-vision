// types/financial.ts
export interface FinancialDataPoint {
  period: string;
  v: number;
}

export interface FinancialData {
  metric?: {
    [key: string]: string | number;
  };
  [key: string]: unknown;
}