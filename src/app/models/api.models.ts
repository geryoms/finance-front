export interface User {
  id?: number;
  email: string;
  password?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Account {
  id?: number;
  name: string;
  initialBalance: number;
  currentBalance: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface AuthResponse {
  token: string;
}

export interface MessageResponse {
  message: string;
}
export interface Transaction {
  id?: number;
  description: string;
  amount: number;
  date: string;
  type: 'INGRESO' | 'GASTO'; 
  account: Account;
  category?: any;
}
export interface CategoryStat {
  name: string;
  total: number;
}
export interface Category {
  id?: number;
  name: string;
}
export interface MonthlyStat {
  year: number;
  month: number;
  income: number;
  expense: number;
}
export interface SubscriptionModel {
  id?: number;
  name: string;
  amount: number;
  frequency: 'MONTHLY' | 'YEARLY';
  startDate: string;
  nextPaymentDate?: string;
  account?: { id: number; name?: string }; 
  category?: { id: number; name?: string };
  accountId?: number;
  categoryId?: number;
}
