import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAPI,
  registerAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
} from "../services/authService";
import { showCrudMessage } from "./createMessageSlice";
import type {
  LoginRequest,
  RegistrationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthUser,
} from "../types/auth";

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await loginAPI(credentials);

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
        token: response.Token,
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
