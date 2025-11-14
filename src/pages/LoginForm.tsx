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
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { loginUser } from "../store/authThunks";
import { clearError } from "../store/authSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginForm: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

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

      // Redirect to dashboard on successful login
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.status === 400 || error.status === 401) {
        setFormError(error.message);
      } else if (error.kind === "network") {
        setFormError(error.message);
      } else {
        setFormError("An error occurred");
      }
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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

          {formError && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {formError}
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
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
              disabled={loading}
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
              disabled={loading || !usernameOrEmail.trim() || !password.trim()}
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
