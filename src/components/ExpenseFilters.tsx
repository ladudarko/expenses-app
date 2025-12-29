import { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../types';

export interface FilterOptions {
  category: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  vendor: string;
  description: string;
  expenseType: string;
  transactionType: string;
  projectName: string;
}

interface ExpenseFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClear: () => void;
}

export default function ExpenseFilters({ filters, onFiltersChange, onClear }: ExpenseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = 
    filters.category ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin ||
    filters.amountMax ||
    filters.vendor ||
    filters.description ||
    filters.expenseType ||
    filters.transactionType ||
    filters.projectName;

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Filter Transactions</h3>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition duration-200"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
          >
            {isExpanded ? '▼ Hide' : '▶ Show'} Filters
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Transaction Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Transaction Type
            </label>
            <select
              value={filters.transactionType}
              onChange={(e) => handleChange('transactionType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Transactions</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          {/* Expense Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Expense Type
            </label>
            <select
              value={filters.expenseType}
              onChange={(e) => handleChange('expenseType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Types</option>
              <option value="Business">Business</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Project Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={filters.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="Search project..."
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Date Range Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Amount Range Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Min Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={filters.amountMin}
              onChange={(e) => handleChange('amountMin', e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Max Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={filters.amountMax}
              onChange={(e) => handleChange('amountMax', e.target.value)}
              placeholder="No limit"
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Vendor Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Vendor/Customer
            </label>
            <input
              type="text"
              value={filters.vendor}
              onChange={(e) => handleChange('vendor', e.target.value)}
              placeholder="Search vendor/customer..."
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Description Filter */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={filters.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Search in description..."
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {hasActiveFilters && !isExpanded && (
        <div className="mt-2 flex flex-wrap gap-2">
          {filters.category && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
              Category: {filters.category}
            </span>
          )}
          {filters.dateFrom && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
              From: {filters.dateFrom}
            </span>
          )}
          {filters.dateTo && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
              To: {filters.dateTo}
            </span>
          )}
          {filters.amountMin && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
              Min: ${filters.amountMin}
            </span>
          )}
          {filters.amountMax && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
              Max: ${filters.amountMax}
            </span>
          )}
          {filters.vendor && (
            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">
              Vendor/Customer: {filters.vendor}
            </span>
          )}
          {filters.description && (
            <span className="px-2 py-1 bg-pink-600 text-white text-xs rounded">
              Description: {filters.description}
            </span>
          )}
          {filters.transactionType && (
            <span className="px-2 py-1 bg-emerald-600 text-white text-xs rounded">
              Transaction: {filters.transactionType}
            </span>
          )}
          {filters.expenseType && (
            <span className="px-2 py-1 bg-teal-600 text-white text-xs rounded">
              Type: {filters.expenseType}
            </span>
          )}
          {filters.projectName && (
            <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded">
              Project: {filters.projectName}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

