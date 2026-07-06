import { create } from 'zustand';

const TOKEN_KEY = 'library_token';
const USER_KEY = 'library_user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY) || null,
  user: readStoredUser(),

  isAuthenticated: () => !!get().token,

  hasRole: (...roles) => {
    const user = get().user;
    return !!user && roles.map((r) => r.toUpperCase()).includes(user.role);
  },

  // Called after a successful /api/auth/login or /api/auth/register response
  // which returns { token, data }.
  setSession: ({ token, data }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    set({ token, user: data });
  },

  updateUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null });
  },
}));
