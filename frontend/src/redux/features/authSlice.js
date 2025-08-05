import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      if (action.payload) {
        state.user = action.payload;
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUserRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
    updateUserDepartment: (state, action) => {
      if (state.user) {
        state.user.department = action.payload;
      }
    },
    updateUserAvailability: (state, action) => {
      if (state.user) {
        state.user.is_available_for_delivery = action.payload;
      }
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
    },
    finishInitialLoad: state => {
      state.isLoading = false;
    }
  },
});

export const {
  setAuth,
  setUser,
  updateUserRole,
  updateUserDepartment,
  updateUserAvailability,
  logout,
  finishInitialLoad
} = authSlice.actions;

export default authSlice.reducer;
