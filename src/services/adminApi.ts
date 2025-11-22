import { User } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

class AdminApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/admin/users');
  }

  // Get all expenses across all users (admin only)
  async getAllExpenses(filters?: { user_id?: number; business_name?: string }) {
    const params = new URLSearchParams();
    if (filters?.user_id) params.append('user_id', filters.user_id.toString());
    if (filters?.business_name) params.append('business_name', filters.business_name);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/admin/expenses${query}`);
  }

  // Get business summary (admin only)
  async getBusinessSummary() {
    return this.request('/admin/summary');
  }

  // Get expenses by category (admin only)
  async getExpensesByCategory() {
    return this.request('/admin/expenses/by-category');
  }

  // Make user admin (admin only)
  async makeUserAdmin(userId: number) {
    return this.request(`/admin/users/${userId}/make-admin`, {
      method: 'POST',
    });
  }
}

export const adminApi = new AdminApiService();
