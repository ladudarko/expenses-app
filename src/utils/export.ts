import { Expense } from '../types';
import { format } from 'date-fns';

export const generateCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Vendor', 'Project', 'Currency', 'Amount'];
  const rows = expenses.map(expense => [
    format(new Date(expense.date), 'MM/dd/yyyy'),
    expense.expense_type || 'Business',
    expense.category,
    expense.description,
    expense.vendor || '',
    expense.project_name || '',
    expense.currency || 'USD',
    expense.amount.toFixed(2)
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

export const downloadCSV = (expenses: Expense[]): void => {
  const csvContent = generateCSV(expenses);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `BigSix_AutoSales_Expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateSummary = (expenses: Expense[]): { [key: string]: number } => {
  const summary: { [key: string]: number } = {};
  
  expenses.forEach(expense => {
    summary[expense.category] = (summary[expense.category] || 0) + expense.amount;
  });
  
  return summary;
};

