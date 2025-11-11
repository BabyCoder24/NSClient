import axios from "axios";
import { BASE_URL } from "./baseURL";

// Set global defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 15000;

// Request interceptor to add JWT token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Normalize errors: keep AxiosError shape, enrich message and flags
axios.interceptors.response.use(
  (response) => response,
  (error) => {
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
    if (error?.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("authToken");
      // You might want to dispatch a logout action here
      // For now, we'll just clear the token
    }

    // Prefer server-provided message, fallback to original
    const serverMsg = error?.response?.data?.message;
    if (serverMsg && typeof serverMsg === "string") {
      error.message = serverMsg;
    }
    (error as any).__kind = "http";
    (error as any).__status = error?.response?.status;
    return Promise.reject(error);
  }
);

export {}; // side-effect module
