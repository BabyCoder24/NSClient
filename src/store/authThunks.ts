import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import {
  loginAPI,
  registerAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
  completeRegistrationAPI,
  setPasswordAPI,
  refreshTokenAPI,
  logoutAPI,
} from "../services/authService";
import { showCrudMessage } from "./createMessageSlice";
import type {
  LoginRequest,
  RegistrationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  CompleteRegistrationRequest,
  SetPasswordRequest,
  AuthUser,
} from "../models/auth";
import type { RootState } from "./store";

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await loginAPI(credentials);
      console.log("Login API response:", response);

      // Decode JWT to get user info
      let decoded: any;
      try {
        decoded = jwtDecode(response.accessToken);
        console.log("Decoded JWT:", decoded);
      } catch (decodeError) {
        console.error("JWT decode error:", decodeError);
        throw new Error("Invalid token format received from server");
      }

      const user: AuthUser = {
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
            : 0, // Map role to ID
        isActive: true,
      };

      const role =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || "Standard User";

      // Normalize role values to match frontend expectations
      let normalizedRole = role;
      if (role === "Admin" || role === "Administrator") {
        normalizedRole = "Administrator";
      } else if (role === "User" || role === "Standard User") {
        normalizedRole = "Standard User";
      }

      const expiresAt = Date.now() + response.expiresIn * 1000;
      const serverMessage =
        response?.message ||
        (response as any)?.Message ||
        (response as any)?.detail ||
        (response as any)?.title ||
        "Login successful.";

      return {
        user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt,
        role: normalizedRole,
        message: serverMessage,
      };
    } catch (error: any) {
      console.error("Login thunk error:", error);
      const message =
        error?.__kind === "network"
          ? error.message
          : error.response?.data?.message ||
            error.response?.data?.detail ||
            error.response?.data?.title ||
            error.message ||
            "Login failed";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue({
        message,
        status: error.__status,
        kind: error.__kind,
      });
    }
  }
);

// Forgot password thunk
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordRequest, { rejectWithValue, dispatch }) => {
    try {
      await forgotPasswordAPI(data);
      dispatch(
        showCrudMessage({
          text: "Password reset email sent successfully",
          type: "create",
        })
      );
      return true;
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? error.message
          : error.response?.data?.message || "Failed to send reset email";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue({
        message: error.message,
        status: error.__status,
        kind: error.__kind,
      });
    }
  }
);

// Reset password thunk
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordRequest, { rejectWithValue, dispatch }) => {
    try {
      await resetPasswordAPI(data);
      dispatch(
        showCrudMessage({ text: "Password reset successfully", type: "update" })
      );
      return true;
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? error.message
          : error.response?.data?.message || "Failed to reset password";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue({
        message: error.message,
        status: error.__status,
        kind: error.__kind,
      });
    }
  }
);

// Register user thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    registrationData: RegistrationRequest,
    { rejectWithValue, dispatch }
  ) => {
    try {
      await registerAPI(registrationData);
      dispatch(
        showCrudMessage({
          text: "Registration successful! Please check your email to verify your account.",
          type: "create",
        })
      );
      return true;
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? error.message
          : error.response?.data?.message || "Registration failed";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue({
        message: error.message,
        status: error.__status,
        kind: error.__kind,
      });
    }
  }
);

// Complete registration thunk
export const completeRegistration = createAsyncThunk(
  "auth/completeRegistration",
  async (data: CompleteRegistrationRequest, { rejectWithValue, dispatch }) => {
    try {
      await completeRegistrationAPI(data);
      dispatch(
        showCrudMessage({
          text: "Registration completed successfully!",
          type: "create",
        })
      );
      return true;
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? error.message
          : error.response?.data?.message || "Failed to complete registration";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue({
        message: error.message,
        status: error.__status,
        kind: error.__kind,
      });
    }
  }
);

// Set password thunk
export const setPassword = createAsyncThunk(
  "auth/setPassword",
  async (data: SetPasswordRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await setPasswordAPI(data);
      return response; // { message, email }
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? error.message
          : error.response?.data?.message || "Failed to set password";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue({
        message: error.message,
        status: error.__status,
        kind: error.__kind,
      });
    }
  }
);

// Refresh token thunk
export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const refreshToken = state.auth.refreshToken;
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await refreshTokenAPI(refreshToken);

      // Decode JWT to get user info
      const decoded: any = jwtDecode(response.accessToken);
      const user: AuthUser = {
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

      const role =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || "Standard User";

      // Normalize role values to match frontend expectations
      let normalizedRole = role;
      if (role === "Admin" || role === "Administrator") {
        normalizedRole = "Administrator";
      } else if (role === "User" || role === "Standard User") {
        normalizedRole = "Standard User";
      }

      const expiresAt = Date.now() + response.expiresIn * 1000;

      return {
        user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt,
        role: normalizedRole,
      };
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? error.message
          : "Session expired. Please log in again.";
      dispatch(
        showCrudMessage({
          text: message,
          type: "error",
        })
      );
      return rejectWithValue({
        message: error.message,
        status: error.__status,
        kind: error.__kind,
      });
    }
  }
);

// Proactive refresh token thunk (for automatic refresh before expiry)
export const proactiveRefreshToken = createAsyncThunk(
  "auth/proactiveRefresh",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const refreshToken = state.auth.refreshToken;
    if (!refreshToken) {
      return rejectWithValue("No refresh token available");
    }

    try {
      const response = await refreshTokenAPI(refreshToken);

      // Decode JWT to get user info
      const decoded: any = jwtDecode(response.accessToken);
      const user: AuthUser = {
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

      const role =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || "Standard User";
      const expiresAt = Date.now() + response.expiresIn * 1000;

      // Normalize role values to match frontend expectations
      let normalizedRole = role;
      if (role === "Admin" || role === "Administrator") {
        normalizedRole = "Administrator";
      } else if (role === "User" || role === "Standard User") {
        normalizedRole = "Standard User";
      }

      return {
        user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt,
        role: normalizedRole,
      };
    } catch (error: any) {
      console.error("Proactive refresh error:", error);
      // If refresh fails, logout
      dispatch(logoutUser());
      return rejectWithValue({
        message: "Session expired. Please log in again.",
        status: error.__status,
        kind: error.__kind,
      });
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;
    const refreshToken = state.auth.refreshToken;
    if (accessToken && refreshToken) {
      try {
        await logoutAPI(accessToken, refreshToken);
      } catch (error) {
        console.error("Logout API error:", error);
        // Still proceed to clear local state
      }
    }
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("role");
    return {};
  }
);
