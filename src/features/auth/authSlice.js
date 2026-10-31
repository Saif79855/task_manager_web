import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { saveToken, removeToken } from "@/lib/authStorage";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "./authService";

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// FETCH CURRENT USER
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// LOGOUT
export const logoutUserThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await logoutUser();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    authInitialized: false,
    loading: false,
    error: null,
  },

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.authInitialized = true;
      state.loading = false;
      state.error = null;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    authChecked: (state) => {
      state.loading = false;
      state.authInitialized = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authInitialized = true;
      state.loading = false;
      state.error = null;

      removeToken();
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.authInitialized = true;

        saveToken(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.authInitialized = true;

        saveToken(action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.authInitialized = true;

        state.user = action.payload.user ?? action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.authInitialized = true;
        state.loading = false;
        state.error = action.payload || action.error.message;

        removeToken();
      })

      // LOGOUT
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.authInitialized = true;
        state.loading = false;
        state.error = null;

        removeToken();
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.authInitialized = true;
        state.loading = false;
        state.error = action.payload || action.error.message;

        removeToken();
      });
  },
});

export const { setCredentials, setToken, authChecked, logout } =
  authSlice.actions;

export default authSlice.reducer;
