import axios from "axios";
import { BASE_URL } from "./baseURL";
import { refreshTokenAPI } from "../services/authService";
import { store } from "../store/store";
import { logoutUser } from "../store/authThunks";

// Set global defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 15000;

// Request interceptor to add JWT token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh for auth endpoints
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/forgot-password") ||
      originalRequest?.url?.includes("/auth/reset-password") ||
      originalRequest?.url?.includes("/auth/complete-registration");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await refreshTokenAPI(refreshToken);
          const newAccessToken = response.accessToken;
          const newRefreshToken = response.refreshToken;
          const expiresAt = Date.now() + response.expiresIn * 1000;

          // Update localStorage
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          localStorage.setItem("expiresAt", expiresAt.toString());

          // Update Redux store
          store.dispatch({
            type: "auth/loginSuccess",
            payload: {
              user: null, // Will be decoded in the action
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              expiresAt,
            },
          });

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout
        store.dispatch(logoutUser());
        window.location.href = "/login";
      }
    }

    const isNetwork =
      !error?.response ||
      error?.code === "ERR_NETWORK" ||
      error?.code === "ECONNABORTED";
    if (isNetwork) {
      // Mutate the error to keep AxiosError type while standardizing message
      error.message = "Cannot reach server. Check your connection.";
      (error as any).__kind = "network";
      return Promise.reject(error);
    }

    // Handle unauthorized errors (token expired, etc.)
    if (error?.response?.status === 401 && !isAuthEndpoint) {
      // Clear token and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expiresAt");
      store.dispatch(logoutUser());
      window.location.href = "/login";
    }

    // Prefer server-provided message, check multiple possible fields
    let serverMsg = error?.response?.data?.message;
    if (!serverMsg) serverMsg = error?.response?.data?.detail;
    if (!serverMsg) serverMsg = error?.response?.data?.title;
    if (!serverMsg) serverMsg = error?.response?.data?.error;
    if (!serverMsg && typeof error?.response?.data === "string")
      serverMsg = error.response.data;
    if (serverMsg && typeof serverMsg === "string") {
      error.message = serverMsg;
    }
    (error as any).__kind = "http";
    (error as any).__status = error?.response?.status;
    return Promise.reject(error);
  }
);

export {}; // side-effect module
