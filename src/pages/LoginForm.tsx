import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { loginUser } from "../store/authThunks";
import { clearError } from "../store/authSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const REMEMBERED_IDENTIFIER_KEY = "nsclient_login_identifier";
const REMEMBER_ME_KEY = "nsclient_remember_me";

const LoginForm: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    loading,
    role,
    user,
    error: authError,
  } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = Boolean(role && user);
  const isDisabled = loading || !usernameOrEmail.trim() || !password.trim();
  const errorMessage = formError || authError;

  useEffect(() => {
    if (!isAuthenticated || !role) {
      return;
    }

    if (role === "Administrator") {
      navigate("/admin-dashboard");
    } else if (role === "Standard User") {
      navigate("/user-dashboard");
    } else {
      navigate("/dashboard"); // fallback
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const remembered = localStorage.getItem(REMEMBER_ME_KEY) === "true";
    const storedIdentifier = localStorage.getItem(REMEMBERED_IDENTIFIER_KEY);
    setRememberMe(remembered);
    if (remembered && storedIdentifier) {
      setUsernameOrEmail(storedIdentifier);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormError(null);

    if (!usernameOrEmail.trim() || !password.trim()) {
      return;
    }

    try {
      await dispatch(
        loginUser({
          UsernameOrEmail: usernameOrEmail.trim(),
          Password: password,
          RememberMe: rememberMe,
        })
      ).unwrap();

      if (rememberMe) {
        localStorage.setItem(REMEMBERED_IDENTIFIER_KEY, usernameOrEmail.trim());
        localStorage.setItem(REMEMBER_ME_KEY, "true");
      } else {
        localStorage.removeItem(REMEMBERED_IDENTIFIER_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      // Navigation handled by useEffect on role change
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message === "Account is deactivated.") {
        console.log("Deactivated account login attempt:", usernameOrEmail);
        setFormError(
          "Your account has been deactivated. Please contact support."
        );
      } else if (error.status === 400 || error.status === 401) {
        setFormError(error.message);
      } else if (error.kind === "network") {
        setFormError(error.message);
      } else {
        setFormError("An error occurred");
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          background: "linear-gradient(135deg, #a0d1ff 0%, #0d6abf 100%)",
          p: 2,
          pt: { xs: 10, md: 12 }, // Add top padding to account for fixed header
          minHeight: "calc(100vh - 64px)", // Ensure full height minus header
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Welcome back! Please sign in to your account.
          </Typography>

          {errorMessage && (
            <Alert
              severity="error"
              sx={{ width: "100%", mb: 2 }}
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Username or Email"
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              autoComplete="username"
              disabled={loading}
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
              disabled={loading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        disabled={loading}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                  disabled={loading}
                />
              }
              label="Remember me"
              sx={{ alignSelf: "flex-start" }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isDisabled}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ textDecoration: "none" }}
              >
                Forgot your password?
              </Link>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{ textDecoration: "none", fontWeight: "bold" }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default LoginForm;
