import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock users for demonstration
const mockUsers = [
  { id: '1', email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
  { id: '2', email: 'user@example.com', password: 'user123', name: 'Demo User' },
];

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = mockUsers.find((u) => u.email === email && u.password === password);

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false });
          return { success: true };
        } else {
          set({ error: 'Invalid email or password', isLoading: false });
          return { success: false, error: 'Invalid email or password' };
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const existingUser = mockUsers.find((u) => u.email === email);

        if (existingUser) {
          set({ error: 'Email already exists', isLoading: false });
          return { success: false, error: 'Email already exists' };
        }

        const newUser = {
          id: String(mockUsers.length + 1),
          email,
          password,
          name,
        };
        mockUsers.push(newUser);

        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;