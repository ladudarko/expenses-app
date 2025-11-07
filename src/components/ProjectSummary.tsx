import { Expense } from '../types';
import { format } from 'date-fns';

interface ProjectSummaryProps {
  expenses: Expense[];
}

export default function ProjectSummary({ expenses }: ProjectSummaryProps) {
  // Group expenses by project name
  const projectGroups: { [key: string]: Expense[] } = {};
  
  expenses.forEach(expense => {
    const projectName = expense.project_name || 'Unassigned';
    if (!projectGroups[projectName]) {
      projectGroups[projectName] = [];
    }
    projectGroups[projectName].push(expense);
  });

  // Calculate totals for each project
  const projectTotals = Object.entries(projectGroups).map(([project, projectExpenses]) => ({
    project,
    expenses: projectExpenses,
    total: projectExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    count: projectExpenses.length
  })).sort((a, b) => b.total - a.total); // Sort by total descending

  if (projectTotals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Project Summary</h2>
      
      <div className="space-y-4">
        {projectTotals.map(({ project, expenses: projectExpenses, total, count }) => (
          <div key={project} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project}</h3>
                <p className="text-sm text-gray-600">{count} expense{count !== 1 ? 's' : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="space-y-2 mt-3">
              {projectExpenses.slice(0, 3).map(expense => (
                <div key={expense.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                  <div>
                    <span className="font-medium text-gray-900">{expense.description}</span>
                    <span className="text-gray-500 ml-2">
                      {format(new Date(expense.date), 'MM/dd/yyyy')}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">${expense.amount.toFixed(2)}</span>
                </div>
              ))}
              {projectExpenses.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{projectExpenses.length - 3} more expense{projectExpenses.length - 3 !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total All Projects</span>
          <span className="text-xl font-bold text-blue-600">
            ${projectTotals.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

