import { useState, useMemo } from 'react';
import { Expense } from '../types';
import { format } from 'date-fns';
import { FilterOptions } from './ExpenseFilters';
import { formatCurrency, getCurrencyCode } from '../utils/currency';
import { generateInvoice } from '../utils/invoice';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string | number) => void;
  filters: FilterOptions;
  businessName?: string;
  address?: string;
  username?: string;
}

type SortColumn = 'date' | 'category' | 'description' | 'vendor' | 'amount' | null;
type SortDirection = 'asc' | 'desc';

export default function ExpenseList({ expenses, onDelete, filters, businessName, address, username }: ExpenseListProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
    // Category filter
    if (filters.category && expense.category !== filters.category) {
      return false;
    }

    // Date range filters
    if (filters.dateFrom && expense.date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && expense.date > filters.dateTo) {
      return false;
    }

    // Amount range filters
    if (filters.amountMin && expense.amount < parseFloat(filters.amountMin)) {
      return false;
    }
    if (filters.amountMax && expense.amount > parseFloat(filters.amountMax)) {
      return false;
    }

    // Vendor filter (case-insensitive partial match)
    if (filters.vendor && expense.vendor) {
      const vendorMatch = expense.vendor.toLowerCase().includes(filters.vendor.toLowerCase());
      if (!vendorMatch) {
        return false;
      }
    } else if (filters.vendor && !expense.vendor) {
      return false; // If vendor filter is set but expense has no vendor
    }

    // Description filter (case-insensitive partial match)
    if (filters.description) {
      const descMatch = expense.description.toLowerCase().includes(filters.description.toLowerCase());
      if (!descMatch) {
        return false;
      }
    }

    // Expense type filter
    const expenseTypeValue = expense.expense_type || 'Business';
    if (filters.expenseType && expenseTypeValue !== filters.expenseType) {
      return false;
    }

    // Transaction type filter
    const transactionTypeValue = expense.transaction_type || 'Expense';
    if (filters.transactionType && transactionTypeValue !== filters.transactionType) {
      return false;
    }

    // Project name filter (case-insensitive partial match)
    if (filters.projectName) {
      if (!expense.project_name) {
        return false; // If filter is set but expense has no project name
      }
      const projectMatch = expense.project_name.toLowerCase().includes(filters.projectName.toLowerCase());
      if (!projectMatch) {
        return false;
      }
    }

    return true;
    });
  }, [expenses, filters]);

  const sortedExpenses = useMemo(() => {
    if (!sortColumn) return filteredExpenses;

    const sorted = [...filteredExpenses].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortColumn) {
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'category':
          aVal = a.category.toLowerCase();
          bVal = b.category.toLowerCase();
          break;
        case 'description':
          aVal = a.description.toLowerCase();
          bVal = b.description.toLowerCase();
          break;
        case 'vendor':
          aVal = (a.vendor || '').toLowerCase();
          bVal = (b.vendor || '').toLowerCase();
          break;
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredExpenses, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column with default descending for dates/amounts, ascending for text
      setSortColumn(column);
      setSortDirection(column === 'date' || column === 'amount' ? 'desc' : 'asc');
    }
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return (
        <span className="ml-1 text-gray-400">
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      );
    }
    return (
      <span className="ml-1 text-blue-600">
        {sortDirection === 'asc' ? (
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };

  // Calculate totals by currency
  const totalsByCurrency = useMemo(() => {
    const totals: { [key: string]: number } = {};
    sortedExpenses.forEach(exp => {
      const currency = getCurrencyCode(exp.currency);
      totals[currency] = (totals[currency] || 0) + exp.amount;
    });
    return totals;
  }, [sortedExpenses]);

  if (expenses.length === 0) {
    return (
      <div className="bg-gray-900 p-8 rounded-lg shadow-md text-center border border-gray-700">
        <p className="text-gray-400 text-lg">No transactions recorded yet. Add your first item above!</p>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-gray-900 p-8 rounded-lg shadow-md text-center border border-gray-700">
        <p className="text-gray-400 text-lg">No transactions match your filters. Try adjusting your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
      <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Transactions {filteredExpenses.length !== expenses.length && `(${filteredExpenses.length} of ${expenses.length})`}
          </h2>
          <div className="flex flex-col items-end">
            {Object.entries(totalsByCurrency).map(([currency, total]) => (
              <span key={currency} className="text-lg font-semibold text-white">
                {currency} Total: {formatCurrency(total, currency)}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon column="date" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Transaction
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  <SortIcon column="category" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center">
                  Description
                  <SortIcon column="description" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('vendor')}
              >
                <div className="flex items-center">
                  Vendor/Customer
                  <SortIcon column="vendor" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Currency
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  <SortIcon column="amount" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {sortedExpenses.map((expense) => {
              const expenseTypeValue = expense.expense_type || 'Business';
              const transactionTypeValue = expense.transaction_type || 'Expense';
              const projectNameValue = expense.project_name || '-';

              return (
              <tr key={expense.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {format(new Date(expense.date), 'MM/dd/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    expenseTypeValue === 'Business' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-purple-600 text-white'
                  }`}>
                    {expenseTypeValue}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transactionTypeValue === 'Income' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-orange-600 text-white'
                  }`}>
                    {transactionTypeValue}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-600 text-white">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {expense.description || 'No description'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {expense.vendor || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {projectNameValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-600 text-white">
                    {getCurrencyCode(expense.currency)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {formatCurrency(expense.amount, expense.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex gap-2 justify-end">
                    {transactionTypeValue === 'Income' && (
                      <button
                        onClick={() => generateInvoice(expense, businessName, address, username)}
                        className="text-blue-600 hover:text-blue-900 transition duration-200 font-semibold"
                        title="Generate Invoice"
                      >
                        📄 Invoice
                      </button>
                    )}
                    <button
                      onClick={() => expense.id && onDelete(expense.id)}
                      className="text-red-600 hover:text-red-900 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

