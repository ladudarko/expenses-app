import { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { User } from '../types';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface BusinessSummary {
  business_name: string;
  username: string;
  expense_count: number;
  total_amount: number;
  first_expense_date: string;
  last_expense_date: string;
}

interface CategorySummary {
  category: string;
  expense_count: number;
  total_amount: number;
  avg_amount: number;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'expenses' | 'users'>('overview');
  const [businessSummary, setBusinessSummary] = useState<BusinessSummary[]>([]);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allExpenses, setAllExpenses] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const [businessData, categoryData] = await Promise.all([
        adminApi.getBusinessSummary(),
        adminApi.getExpensesByCategory()
      ]);
      setBusinessSummary(businessData);
      setCategorySummary(categoryData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await adminApi.getAllUsers();
      setAllUsers(users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const filters = selectedBusiness ? { business_name: selectedBusiness } : undefined;
      const expenses = await adminApi.getAllExpenses(filters);
      setAllExpenses(expenses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setError('');
    
    if (tab === 'users' && allUsers.length === 0) {
      loadUsers();
    } else if (tab === 'expenses' && allExpenses.length === 0) {
      loadExpenses();
    }
  };

  const totalRevenue = businessSummary.reduce((sum, business) => sum + (Number(business.total_amount) || 0), 0);
  const totalBusinesses = businessSummary.length;
  const totalExpenses = businessSummary.reduce((sum, business) => sum + (Number(business.expense_count) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛡️ Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Welcome back, {user.username} • System Overview
          </p>
          <div className="flex justify-center items-center gap-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
              Admin
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: '📊 Overview', count: totalBusinesses },
                { id: 'businesses', label: '🏢 Businesses', count: totalBusinesses },
                { id: 'expenses', label: '💰 All Expenses', count: totalExpenses },
                { id: 'users', label: '👥 Users', count: allUsers.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as typeof activeTab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && !loading && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    💰
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${(totalRevenue || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    🏢
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Businesses</p>
                    <p className="text-2xl font-bold text-gray-900">{totalBusinesses}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    📊
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">{totalExpenses}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Expense Categories</h3>
              <div className="space-y-3">
                {categorySummary.slice(0, 5).map((category) => (
                  <div key={category.category} className="flex justify-between items-center">
                    <span className="text-gray-700">{category.category}</span>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">${(Number(category.total_amount) || 0).toFixed(2)}</span>
                      <span className="text-sm text-gray-500 ml-2">({category.expense_count} expenses)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && !loading && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Business Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {businessSummary.map((business, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{business.business_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {business.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {business.expense_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        ${(Number(business.total_amount) || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {business.first_expense_date && business.last_expense_date ? (
                          `${new Date(business.first_expense_date).toLocaleDateString()} - ${new Date(business.last_expense_date).toLocaleDateString()}`
                        ) : (
                          'No expenses'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && !loading && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-800">All Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {user.business_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_admin 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter by Business:</label>
                <select
                  value={selectedBusiness}
                  onChange={(e) => setSelectedBusiness(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Businesses</option>
                  {businessSummary.map((business) => (
                    <option key={business.business_name} value={business.business_name}>
                      {business.business_name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={loadExpenses}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  Apply Filter
                </button>
              </div>
            </div>

            {/* Expenses Table */}
            {!loading && allExpenses.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    All Expenses {selectedBusiness && `- ${selectedBusiness}`}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Business</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allExpenses.slice(0, 100).map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(expense.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {expense.business_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {expense.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {expense.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${(Number(expense.amount) || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {allExpenses.length > 100 && (
                    <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
                      Showing first 100 of {allExpenses.length} expenses
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
