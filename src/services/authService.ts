import { BASE_URL } from "../config/baseURL";
import axios from "axios";
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  CompleteRegistrationRequest,
  SetPasswordRequest,
} from "../types/auth";

// Login API
export const loginAPI = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Register API
export const registerAPI = async (data: RegistrationRequest): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/auth/register`, data);
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Forgot password API
export const forgotPasswordAPI = async (
  data: ForgotPasswordRequest
): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/auth/forgot-password`, data);
  } catch (error) {
    console.error("Error sending forgot password request:", error);
    throw error;
  }
};

// Reset password API
export const resetPasswordAPI = async (
  data: ResetPasswordRequest
): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/auth/reset-password`, data);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Refresh token API
export const refreshTokenAPI = async (
  refreshToken: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${BASE_URL}/auth/refresh`,
      { refreshToken: refreshToken }
    );
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Complete registration API
export const completeRegistrationAPI = async (
  data: CompleteRegistrationRequest
): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/auth/complete-registration`, data);
  } catch (error) {
    console.error("Error completing registration:", error);
    throw error;
  }
};

// Set password API
export const setPasswordAPI = async (
  data: SetPasswordRequest
): Promise<{ message: string; email: string }> => {
  try {
    const response = await axios.post<{ message: string; email: string }>(
      `${BASE_URL}/auth/set-password`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error setting password:", error);
    throw error;
  }
};

// Logout API
export const logoutAPI = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
