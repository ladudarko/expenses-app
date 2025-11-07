export interface Expense {
  id?: string | number;
  date: string;
  category: string;
  description: string;
  amount: number;
  vendor?: string;
  expense_type?: 'Personal' | 'Business';
  project_name?: string;
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
  'Professional Services',
  'Utilities',
  'Rent',
  'Software & Subscriptions',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

