import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store/store";
import * as authThunks from "../store/authThunks";
import { clearError } from "../store/authSlice";
import { store } from "../store/store";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const token = new URLSearchParams(window.location.search).get("token");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const isDisabled = useMemo(
    () => loading || !password.trim() || !confirmPassword.trim(),
    [loading, password, confirmPassword]
  );

  const passwordError = useMemo(() => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  }, [password, confirmPassword]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());

    // Check if token exists
    if (!token) {
      navigate("/login");
    }
  }, [dispatch, token, navigate]);

  useEffect(() => {
    if (error) {
      setFormError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validatePasswords = () => {
    return passwordError === "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormError(null);

    if (!validatePasswords() || !token) {
      return;
    }

    try {
      const result = await dispatch(
        authThunks.setPassword({ Token: token, NewPassword: password })
      ).unwrap();
      setSuccessMessage(result.message);
      // Wait for message to show
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Now login
      await dispatch(
        authThunks.loginUser({
          UsernameOrEmail: result.email,
          Password: password,
          RememberMe: false,
        })
      ).unwrap();
      // Get role
      const { role } = store.getState().auth;
      // Navigate
      if (role === "Administrator") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch {
      // Error is already handled in thunk
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  if (!token) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 2,
            pt: { xs: 10, md: 12 },
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              width: "100%",
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ width: 48, height: 48, mb: 1 }}
            />
            <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
              Invalid Link
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The link is invalid or has expired. Please request a new one.
            </Typography>
          </Paper>
        </Box>
        <Footer />
      </Box>
    );
  }

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
          pt: { xs: 10, md: 12 },
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: "100%",
            maxWidth: 350,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{ width: 48, height: 48, mb: 1 }}
          />
          <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
            Set Your Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a new password for your account.
          </Typography>

          {(formError || passwordError) && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {formError || passwordError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 1.5 }}
            >
              {loading ? "Setting Password..." : "Set Password"}
            </Button>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default SetPasswordForm;
