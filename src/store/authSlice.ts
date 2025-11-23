import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import {
  loginUser,
  forgotPassword,
  resetPassword,
  registerUser,
  completeRegistration,
  setPassword,
  refreshToken,
  logoutUser,
} from "./authThunks";
import type { AuthState, AuthUser } from "../models/auth";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  role: null,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        role: string;
        message?: string;
      }>
    ) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.role = action.payload.role;
      state.error = null;
      state.successMessage = action.payload.message || "Login successful.";
      // Store tokens in localStorage
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("expiresAt", action.payload.expiresAt.toString());
      localStorage.setItem("role", action.payload.role);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.successMessage = null;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.role = null;
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

    // Initialize auth from localStorage
    initializeAuth: (state) => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const expiresAt = localStorage.getItem("expiresAt");
      const role = localStorage.getItem("role");
      if (accessToken && refreshToken && expiresAt) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.expiresAt = parseInt(expiresAt);
        state.role = role;
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
            isActive: true,
          };
        } catch (error) {
          // If token is invalid, clear it
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("expiresAt");
          localStorage.removeItem("role");
          state.accessToken = null;
          state.refreshToken = null;
          state.expiresAt = null;
          state.role = null;
          state.user = null;
        }
      }
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.role = action.payload.role;
        state.error = null;
        state.successMessage = action.payload.message || "Login successful.";
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("expiresAt", action.payload.expiresAt.toString());
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.role = null;
        const message =
          (action.payload as any)?.message ||
          action.error.message ||
          "Login failed";
        state.error = message;
        state.successMessage = null;
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
      })

      // Set Password
      .addCase(setPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message || "Failed to set password";
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.role = action.payload.role;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("expiresAt", action.payload.expiresAt.toString());
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.role = null;
        state.loading = false;
        state.error = null;
        state.successMessage = null;
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
  initializeAuth,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
