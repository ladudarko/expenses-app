import { Expense } from '../types';
import { generateSummary } from '../utils/export';

interface SummaryCardProps {
  expenses: Expense[];
}

export default function SummaryCard({ expenses }: SummaryCardProps) {
  const summary = generateSummary(expenses);
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryList = Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Category Summary</h2>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Total Expenses</p>
        <p className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</p>
      </div>

      <div className="space-y-3">
        {categoryList.map(([category, amount]) => {
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          return (
            <div key={category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-sm font-semibold text-gray-900">${amount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
    </div>
  );
}

