import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Appeler au démarrage de l'app pour recharger l'utilisateur
  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const user = await authService.me();
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(email, password, name);
      localStorage.setItem('token', data.token);
      set({
        user: { email: data.email, name: data.name, role: data.role },
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de l'inscription";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      set({
        user: { email: data.email, name: data.name, role: data.role },
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Email ou mot de passe incorrect';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;