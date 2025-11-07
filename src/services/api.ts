import { Expense } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth methods
  async register(username: string, password: string, businessName?: string) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, business_name: businessName }),
    });
  }

  async login(username: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  // Expense methods
  async getExpenses(category?: string): Promise<Expense[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<Expense[]>(`/expenses${query}`, {
      method: 'GET',
    });
  }

  async getExpense(id: number): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'GET',
    });
  }

  async createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    return this.request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(id: number, expense: Partial<Expense>): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  async deleteExpense(id: number): Promise<void> {
    return this.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategorySummary(): Promise<{ category: string; total: string }[]> {
    return this.request<{ category: string; total: string }[]>('/expenses/summary/categories');
  }
}

export const api = new ApiService();

