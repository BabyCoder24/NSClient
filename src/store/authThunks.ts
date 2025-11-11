import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthUser,
} from "../types/auth";

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      // For now, we'll create a basic user object from the token
      // In a real app, you'd decode the JWT or make another call to get user details
      const user: AuthUser = {
        id: 0, // This would come from decoding the JWT
        email: credentials.UsernameOrEmail.includes("@")
          ? credentials.UsernameOrEmail
          : "",
        username: credentials.UsernameOrEmail,
      };

      return {
        user,
        token: response.data.Token,
      };
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? "Network error. Please check your connection."
          : error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Forgot password thunk
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      await axios.post("/auth/forgot-password", data);
      return true;
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? "Network error. Please check your connection."
          : error.response?.data?.message || "Failed to send reset email";
      return rejectWithValue(message);
    }
  }
);

// Reset password thunk
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      await axios.post("/auth/reset-password", data);
      return true;
    } catch (error: any) {
      const message =
        error?.__kind === "network"
          ? "Network error. Please check your connection."
          : error.response?.data?.message || "Failed to reset password";
      return rejectWithValue(message);
    }
  }
);
