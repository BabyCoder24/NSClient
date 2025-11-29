import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import "./App.css";

// Hooks
import { useInactivityTimeout } from "./hooks/useInactivityTimeout";
import { useTokenRefresh } from "./hooks/useTokenRefresh";

// Components
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import UserDashboard from "./layout/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import CompleteRegistrationForm from "./pages/CompleteRegistrationForm";
import SetPasswordForm from "./pages/SetPasswordForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import CrudDashboard from "./CrudDashboard";
import { InactivityTimeoutDialog } from "./components/InactivityTimeoutDialog";

// Store
import { store } from "./store/store";
import type { RootState } from "./store/store";

function AppContent() {
  // Check if user is authenticated
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!(accessToken && user);

  // Initialize inactivity timeout and token refresh only for authenticated users
  const inactivityTimeout = useInactivityTimeout({ enabled: isAuthenticated });
  useTokenRefresh({ enabled: isAuthenticated });

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/crud-dashboard/*" element={<CrudDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/complete-registration"
            element={<CompleteRegistrationForm />}
          />
          <Route path="/set-password" element={<SetPasswordForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute requiredRole="Administrator">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/manage-users"
            element={
              <ProtectedRoute requiredRole="Administrator">
                <ManageUsers />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute requiredRole="Standard User">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Navigate to="/admin-dashboard/settings" replace />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Inactivity Timeout Dialog - only show for authenticated users */}
        {isAuthenticated && inactivityTimeout && (
          <InactivityTimeoutDialog
            open={inactivityTimeout.dialogOpen}
            onStayLoggedIn={inactivityTimeout.onStayLoggedIn}
            onLogout={inactivityTimeout.onLogout}
            remainingTime={inactivityTimeout.remainingTime}
            totalWarningTime={inactivityTimeout.totalWarningTime}
          />
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
