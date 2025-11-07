import { Expense } from '../types';

const STORAGE_KEY = 'bigsix_expenses';

export const saveExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};

export const loadExpenses = (): Expense[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const clearExpenses = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

