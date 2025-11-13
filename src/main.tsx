import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store";
import { initializeAuth } from "./store/authSlice";
import "./config/axiosConfig"; // Import to set up axios interceptors

// Initialize auth state from localStorage
store.dispatch(initializeAuth());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
