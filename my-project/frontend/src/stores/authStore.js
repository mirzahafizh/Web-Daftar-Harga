
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // Login
      login: async (email, password) => {
        set({ loading: true });

        try {
          const response = await api.post('/auth/login', {
            email,
            password,
          });

          const { token, user } = response.data;

          // Simpan token
          localStorage.setItem('hyundai-token', token);

          // Update state
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return {
            success: true,
          };

        } catch (error) {
          set({
            loading: false,
          });

          return {
            success: false,
            message:
              error.response?.data?.message ||
              'Gagal menghubungkan ke server.',
          };
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('hyundai-token');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      // Update informasi user
      setUser: (user) => {
        set({ user });
      },
    }),

    {
      name: 'hyundai-auth',

      // State yang disimpan ke localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
