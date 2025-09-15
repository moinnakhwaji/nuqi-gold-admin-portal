import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';

// Initialize auth state from localStorage
const getInitialAuthState = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user')); // Only `user` object
    const token = localStorage.getItem('authToken');

    if (user && token) {
      return {
        user,          // user object with role
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }

  return {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

const initialState = getInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload || null;
      state.isAuthenticated = !!action.payload;
      state.error = null;

      if (action.payload?.token) {
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Login failed';
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user; // ✅ store only user object
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        if (action.payload?.token) {
          localStorage.setItem('authToken', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user)); // ✅ save only user
        }
      });
  },
});

export const { setUser, logout, clearError, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
