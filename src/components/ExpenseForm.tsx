import { useState, useEffect } from 'react';
import { Expense, EXPENSE_CATEGORIES } from '../types';

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => Promise<void>;
  existingProjects?: string[];
}

export default function ExpenseForm({ onSubmit, existingProjects = [] }: ExpenseFormProps) {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseType, setExpenseType] = useState<'Personal' | 'Business'>('Business');
  const [projectName, setProjectName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProjectSuggestions, setShowProjectSuggestions] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<string[]>([]);

  useEffect(() => {
    if (projectName && existingProjects.length > 0) {
      const filtered = existingProjects.filter(p => 
        p.toLowerCase().includes(projectName.toLowerCase()) && p !== projectName
      );
      setFilteredProjects(filtered.slice(0, 5));
      setShowProjectSuggestions(filtered.length > 0);
    } else {
      setShowProjectSuggestions(false);
    }
  }, [projectName, existingProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !category || !description || !amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    setIsSubmitting(true);

    try {
      const expense: Omit<Expense, 'id'> = {
        date,
        category,
        description,
        vendor: vendor.trim() || undefined,
        amount: parseFloat(amount),
        expense_type: expenseType,
        project_name: projectName.trim() || undefined,
      };

      await onSubmit(expense as Expense);
      // Reset form only after successful submission
      setDate('');
      setCategory('');
      setDescription('');
      setVendor('');
      setAmount('');
      setExpenseType('Business');
      setProjectName('');
    } catch (error) {
      // Error is handled in App.tsx, just don't reset the form
      console.error('Error submitting expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Expense</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="expenseType" className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            id="expenseType"
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value as 'Personal' | 'Business')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="Business">Business</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
            Project/Expense Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onFocus={() => projectName && setShowProjectSuggestions(true)}
              onBlur={() => setTimeout(() => setShowProjectSuggestions(false), 200)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2023 Ford F150 Truck Repair"
              list="project-suggestions"
            />
            {showProjectSuggestions && filteredProjects.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto">
                {filteredProjects.map((project) => (
                  <button
                    key={project}
                    type="button"
                    onClick={() => {
                      setProjectName(project);
                      setShowProjectSuggestions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                  >
                    {project}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Group related expenses together (optional)</p>
          {existingProjects.length > 0 && (
            <p className="mt-1 text-xs text-blue-600">
              Existing projects: {existingProjects.slice(0, 5).join(', ')}
              {existingProjects.length > 5 && ` +${existingProjects.length - 5} more`}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($) *
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
            Vendor
          </label>
          <input
            type="text"
            id="vendor"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Optional"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the expense"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}

