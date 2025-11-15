import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { forgotPassword } from "../store/authThunks";
import { clearError } from "../store/authSlice";
import Header from "./Header";
import Footer from "./Footer";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const isDisabled = useMemo(() => loading || !email.trim(), [loading, email]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormError(null);

    if (!email.trim()) {
      return;
    }

    try {
      await dispatch(
        forgotPassword({
          Email: email.trim(),
        })
      ).unwrap();

      setSuccess(true);
    } catch (error: any) {
      if (error.status === 400 || error.status === 401) {
        setFormError(error.message);
      } else if (error.kind === "network") {
        setFormError(error.message);
      } else {
        setFormError("An error occurred");
      }
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (success) {
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
              Check Your Email
            </Typography>

            <Alert severity="success" sx={{ width: "100%", mb: 3 }}>
              If the email exists, a password reset link has been sent to{" "}
              <strong>{email}</strong>
            </Alert>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please check your email and click the reset link to continue.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={handleBackToLogin}
              sx={{ mb: 2 }}
            >
              Back to Sign In
            </Button>

            <Typography variant="body2">
              Didn't receive the email?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => setSuccess(false)}
                sx={{ textDecoration: "none", fontWeight: "bold" }}
              >
                Try again
              </Link>
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
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              autoComplete="email"
              disabled={loading}
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
                "Send Reset Link"
              )}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ textDecoration: "none" }}
              >
                Back to Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default ForgotPasswordForm;
