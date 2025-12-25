import { useState, useMemo } from 'react';
import { Expense } from '../types';
import { generateSummary } from '../utils/export';
import { formatCurrency, getCurrencyCode } from '../utils/currency';

interface SummaryCardProps {
  expenses: Expense[];
}

type ViewMode = 'All' | 'Income' | 'Expenses';

export default function SummaryCard({ expenses }: SummaryCardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('All');

  const filteredExpenses = useMemo(() => {
    if (viewMode === 'All') return expenses;
    return expenses.filter(exp => (exp.transaction_type || 'Expense') === viewMode);
  }, [expenses, viewMode]);

  const summary = generateSummary(filteredExpenses);
  
  const totals = useMemo(() => {
    const income = expenses
      .filter(exp => (exp.transaction_type || 'Expense') === 'Income')
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const expenseTotal = expenses
      .filter(exp => (exp.transaction_type || 'Expense') === 'Expense')
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const netProfit = income - expenseTotal;
    
    // Calculate totals by currency
    const incomeByCurrency: { [key: string]: number } = {};
    const expensesByCurrency: { [key: string]: number } = {};
    
    expenses.forEach(exp => {
      const currency = getCurrencyCode(exp.currency);
      const amount = exp.amount;
      if ((exp.transaction_type || 'Expense') === 'Income') {
        incomeByCurrency[currency] = (incomeByCurrency[currency] || 0) + amount;
      } else {
        expensesByCurrency[currency] = (expensesByCurrency[currency] || 0) + amount;
      }
    });
    
    return { income, expenseTotal, netProfit, incomeByCurrency, expensesByCurrency };
  }, [expenses]);

  const categoryList = Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Financial Summary</h2>
      
      {/* View Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setViewMode('All')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            viewMode === 'All'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setViewMode('Income')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            viewMode === 'Income'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setViewMode('Expenses')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            viewMode === 'Expenses'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Expenses
        </button>
      </div>

      {/* Net Profit Display */}
      {viewMode === 'All' && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
          <p className="text-sm text-gray-600 mb-1">Net Profit</p>
          <p className={`text-3xl font-bold ${totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totals.netProfit >= 0 ? '+' : ''}{formatCurrency(totals.netProfit, 'USD')}
          </p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Income:</span>
              <span className="text-green-600 font-semibold">{formatCurrency(totals.income, 'USD')}</span>
            </div>
            <div className="flex justify-between">
              <span>Expenses:</span>
              <span className="text-red-600 font-semibold">{formatCurrency(totals.expenseTotal, 'USD')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Current View Total */}
      {viewMode !== 'All' && (
        <div className={`mb-4 p-4 rounded-lg ${
          viewMode === 'Income' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <p className="text-sm text-gray-600">
            Total {viewMode}
          </p>
          <p className={`text-3xl font-bold ${
            viewMode === 'Income' ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(total, 'USD')}
          </p>
        </div>
      )}

      {/* Category Breakdown */}
      {categoryList.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Category Breakdown</h3>
          <div className="space-y-3">
            {categoryList.map(([category, amount]) => {
              const percentage = total > 0 ? (amount / total) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(amount, 'USD')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        viewMode === 'Income' ? 'bg-green-600' : viewMode === 'Expenses' ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(summary).length > 5 && (
            <p className="mt-3 text-sm text-gray-500 text-center">
              +{Object.keys(summary).length - 5} more categories
            </p>
          )}
        </>
      )}
    </div>
  );
}

