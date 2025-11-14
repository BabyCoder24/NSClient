import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import {
  loginUser,
  forgotPassword,
  resetPassword,
  registerUser,
  completeRegistration,
} from "./authThunks";
import { logoutAPI } from "../services/authService";
import type { AuthState, AuthUser } from "../types/auth";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
      }>
    ) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.error = null;
      // Store tokens in localStorage
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("expiresAt", action.payload.expiresAt.toString());
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
    },

    // Forgot password actions
    forgotPasswordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    forgotPasswordSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reset password actions
    resetPasswordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      const accessToken = state.accessToken;
      const refreshToken = state.refreshToken;
      if (accessToken && refreshToken) {
        // Call logout API (fire and forget)
        logoutAPI(accessToken, refreshToken).catch(console.error);
      }
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expiresAt");
    },

    // Initialize auth from localStorage
    initializeAuth: (state) => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const expiresAt = localStorage.getItem("expiresAt");
      if (accessToken && refreshToken && expiresAt) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.expiresAt = parseInt(expiresAt);
        // Decode token to get user info
        try {
          const decoded: any = jwtDecode(accessToken);
          state.user = {
            id: parseInt(decoded.sub),
            email: decoded.email,
            username: decoded.username,
            firstName: decoded.firstName || "",
            lastName: decoded.lastName || "",
            companyName: decoded.companyName || "",
            roleId:
              decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ] === "User"
                ? 2
                : 0,
          };
        } catch (error) {
          // If token is invalid, clear it
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("expiresAt");
          state.accessToken = null;
          state.refreshToken = null;
          state.expiresAt = null;
          state.user = null;
        }
      }
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("expiresAt", action.payload.expiresAt.toString());
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiresAt = null;
      }) // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.loading = false;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.loading = false;
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })

      // Complete Registration
      .addCase(completeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRegistration.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(completeRegistration.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  logout,
  initializeAuth,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
