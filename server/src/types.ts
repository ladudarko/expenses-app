export interface Expense {
  id?: number;
  user_id?: number;
  date: string;
  category: string;
  description: string;
  vendor?: string;
  amount: number;
  currency?: string;
  expense_type?: 'Personal' | 'Business';
  transaction_type?: 'Expense' | 'Income';
  project_name?: string;
  created_at?: string;
  updated_at?: string;
}

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

