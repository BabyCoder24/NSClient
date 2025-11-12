import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import {
  loginAPI,
  registerAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
  completeRegistrationAPI,
} from "../services/authService";
import { showCrudMessage } from "./createMessageSlice";
import type {
  LoginRequest,
  RegistrationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  CompleteRegistrationRequest,
  AuthUser,
} from "../types/auth";

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await loginAPI(credentials);

      // Decode JWT to get user info
      const decoded: any = jwtDecode(response.token);
      const user: AuthUser = {
        id: parseInt(decoded.sub),
        email: decoded.email,
        username: decoded.username,
        firstName: "", // Not included in JWT
        lastName: "", // Not included in JWT
        companyName: "", // Not included in JWT
        roleId:
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] === "User"
            ? 2
            : 0, // Map role to ID
      };

      return {
        user,
        token: response.token,
      };
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? "Network error. Please check your connection."
          : error.response?.data?.message || "Login failed";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue(message);
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
          ? "Network error. Please check your connection."
          : error.response?.data?.message || "Failed to send reset email";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue(message);
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
          ? "Network error. Please check your connection."
          : error.response?.data?.message || "Failed to reset password";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue(message);
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
          ? "Network error. Please check your connection."
          : error.response?.data?.message || "Registration failed";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue(message);
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
          text: "Registration completed successfully! You can now log in.",
          type: "update",
        })
      );
      return true;
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? "Network error. Please check your connection."
          : error.response?.data?.message || "Failed to complete registration";
      dispatch(showCrudMessage({ text: message, type: "error" }));
      return rejectWithValue(message);
    }
  }
);
