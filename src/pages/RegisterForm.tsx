import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { registerUser } from "../store/authThunks";
import type { RegistrationRequest } from "../models/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error: authError } = useSelector(
    (state: RootState) => state.auth
  );

  const emailError = useMemo(() => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Invalid email format";
  }, [email]);

  const isDisabled = useMemo(
    () => loading || !email.trim() || !!emailError,
    [loading, email, emailError]
  );

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormError(null);

    if (!email.trim()) {
      return;
    }

    try {
      const registrationData: RegistrationRequest = {
        Email: email.trim(),
      };

      await dispatch(registerUser(registrationData)).unwrap();

      setSuccess(true);

      // Clear form
      setEmail("");

      // Redirect to login after a delay
      timeoutRef.current = window.setTimeout(() => {
        navigate("/login");
      }, 3000);
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
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Join NSolutions and start your journey with us.
          </Typography>

          {success ? (
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Registration successful! Check your email to complete your
                account setup.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Redirecting to login page...
              </Typography>
            </Box>
          ) : (
            <>
              {(formError || authError || emailError) && (
                <Alert
                  severity="error"
                  sx={{ width: "100%", mb: 2 }}
                  role="alert"
                  aria-live="assertive"
                >
                  {formError || authError || emailError}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  margin="dense"
                  variant="outlined"
                  autoComplete="email"
                  disabled={loading}
                  autoFocus
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 1, py: 1.2 }}
                  disabled={isDisabled || success}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Box>
            </>
          )}

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ textDecoration: "none", fontWeight: "bold" }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default RegisterForm;
