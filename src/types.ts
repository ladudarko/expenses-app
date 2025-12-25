export interface Expense {
  id?: string | number;
  date: string;
  category: string;
  description: string;
  amount: number;
  currency?: string;
  vendor?: string;
  expense_type?: 'Personal' | 'Business';
  transaction_type?: 'Expense' | 'Income';
  project_name?: string;
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GHC', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
] as const;

export const DEFAULT_CURRENCY = 'USD';

export interface User {
  id?: number;
  username: string;
  password_hash?: string;
  business_name?: string;
  address?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const EXPENSE_CATEGORIES = [
  'Vehicle Purchase',
  'Vehicle Maintenance',
  'Parts & Supplies',
  'Fuel',
  'Insurance',
  'Licensing & Registration',
  'Office Supplies',
  'Marketing & Advertising',
  'Labor',
  'Utilities',
  'Rent',
  'Software & Subscriptions',
  'Other'
] as const;

export const INCOME_CATEGORIES = [
  'Vehicle Sale',
  'Service Revenue',
  'Parts Sales',
  'Labor',
  'Consulting',
  'Other Income'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];