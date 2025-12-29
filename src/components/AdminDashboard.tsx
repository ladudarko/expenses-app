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
      setBusinessSummary(businessData as BusinessSummary[]);
      setCategorySummary(categoryData as CategorySummary[]);
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
      setAllUsers(users as User[]);
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
      setAllExpenses(expenses as any[]);
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

  const handleDeleteUser = async (userId: number) => {
    if (!confirm(`Are you sure you want to delete this user? This will also delete all their expenses. This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await adminApi.deleteUser(userId);
      // Reload users list
      await loadUsers();
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = businessSummary.reduce((sum, business) => sum + (Number(business.total_amount) || 0), 0);
  const totalBusinesses = businessSummary.length;
  const totalExpenses = businessSummary.reduce((sum, business) => sum + (Number(business.expense_count) || 0), 0);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🛡️ Admin Dashboard
          </h1>
          <p className="text-xl text-gray-300 mb-4">
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
          <div className="border-b border-gray-700">
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
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-700 text-white py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading...</p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && !loading && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-600 text-white">
                    💰
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">${(totalRevenue || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-600 text-white">
                    🏢
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Active Businesses</p>
                    <p className="text-2xl font-bold text-white">{totalBusinesses}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-600 text-white">
                    📊
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Expenses</p>
                    <p className="text-2xl font-bold text-white">{totalExpenses}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Top Expense Categories</h3>
              <div className="space-y-3">
                {categorySummary.slice(0, 5).map((category) => (
                  <div key={category.category} className="flex justify-between items-center">
                    <span className="text-gray-300">{category.category}</span>
                    <div className="text-right">
                      <span className="font-semibold text-white">${(Number(category.total_amount) || 0).toFixed(2)}</span>
                      <span className="text-sm text-gray-400 ml-2">({category.expense_count} expenses)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && !loading && (
          <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
            <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Business Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {businessSummary.map((business, index) => (
                    <tr key={index} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">{business.business_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {business.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {business.expense_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                        ${(Number(business.total_amount) || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
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
          <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
            <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">All Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Joined</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {allUsers.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                        {userItem.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {userItem.business_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          userItem.is_admin 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-700 text-gray-200'
                        }`}>
                          {userItem.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {userItem.created_at ? new Date(userItem.created_at).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {userItem.id !== user.id && (
                          <button
                            onClick={() => handleDeleteUser(userItem.id!)}
                            className="text-red-400 hover:text-red-300 transition duration-200"
                          >
                            Delete
                          </button>
                        )}
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
            <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-300">Filter by Business:</label>
                <select
                  value={selectedBusiness}
                  onChange={(e) => setSelectedBusiness(e.target.value)}
                  className="border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm"
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
              <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
                <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    All Expenses {selectedBusiness && `- ${selectedBusiness}`}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Business</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {allExpenses.slice(0, 100).map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {new Date(expense.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {expense.business_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-600 text-white">
                              {expense.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-white max-w-xs truncate">
                            {expense.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            ${(Number(expense.amount) || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {allExpenses.length > 100 && (
                    <div className="px-6 py-4 bg-gray-800 text-sm text-gray-400">
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
