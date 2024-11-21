import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { setToken, removeToken, getUserFromToken } from '../utils/auth';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

// In a real app, this would be your backend API
const mockApi = {
  async login(email: string, password: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock users
    const users = {
      'admin@example.com': { password: 'admin123', role: 'admin' },
      'user@example.com': { password: 'user123', role: 'user' }
    };

    const user = users[email as keyof typeof users];
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    // Create mock JWT token
    const token = btoa(JSON.stringify({
      userId: email,
      email,
      role: user.role,
      exp: Date.now() / 1000 + 3600 // 1 hour
    }));

    return token;
  },

  async register(email: string, password: string, name: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create mock JWT token
    const token = btoa(JSON.stringify({
      userId: email,
      email,
      role: 'user',
      exp: Date.now() / 1000 + 3600 // 1 hour
    }));

    return token;
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      initialize: () => {
        const user = getUserFromToken();
        if (user) {
          set({ user, isAuthenticated: true });
        }
      },

      login: async (email: string, password: string) => {
        try {
          const token = await mockApi.login(email, password);
          setToken(token);
          const user = getUserFromToken();
          if (user) {
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          const token = await mockApi.register(email, password, name);
          setToken(token);
          const user = getUserFromToken();
          if (user) {
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        removeToken();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);