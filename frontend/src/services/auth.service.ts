import { User } from '../types';

const API_URL = 'http://localhost:8081/api';

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data;
  },

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    return data;
  },

  async socialLoginDemo(provider: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/social-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Social login failed');
    }
    return data;
  }
};
