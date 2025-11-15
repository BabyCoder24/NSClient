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
import { completeRegistration } from "../store/authThunks";
import { clearError } from "../store/authSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CompleteRegistrationForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const token = new URLSearchParams(window.location.search).get("token");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const isDisabled = useMemo(
    () =>
      loading ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim(),
    [loading, password, confirmPassword, firstName, lastName, email]
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

  const validatePasswords = () => {
    return passwordError === "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormError(null);

    if (!validatePasswords() || !token) {
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return;
    }

    try {
      await dispatch(
        completeRegistration({
          Token: token,
          Username: username.trim() || undefined,
          Password: password,
          FirstName: firstName.trim(),
          LastName: lastName.trim(),
          CompanyName: company.trim() || undefined,
          Email: email.trim(),
        })
      ).unwrap();

      setSuccess(true);

      // Redirect to login after a short delay
      setTimeout(() => {
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
              Registration Completed
            </Typography>

            <Alert severity="success" sx={{ width: "100%", mb: 3 }}>
              Your registration has been completed successfully!
            </Alert>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You will be redirected to the sign in page shortly...
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/login")}
            >
              Go to Sign In
            </Button>
          </Paper>
        </Box>
        <Footer />
      </Box>
    );
  }

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
              Invalid Registration Link
            </Typography>

            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              The registration link is invalid or has expired.
            </Alert>

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/login")}
            >
              Go to Sign In
            </Button>
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
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Complete Registration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Complete your account details and set your password to finish
            registration.
          </Typography>

          {(formError || passwordError) && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {formError || passwordError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                margin="normal"
                variant="outlined"
                autoComplete="given-name"
                disabled={loading}
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                margin="normal"
                variant="outlined"
                autoComplete="family-name"
                disabled={loading}
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
              />
            </Box>
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
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                fullWidth
                label="Company (Optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                margin="normal"
                variant="outlined"
                autoComplete="organization"
                disabled={loading}
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
              />
              <TextField
                fullWidth
                label="Username (Optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                variant="outlined"
                autoComplete="username"
                disabled={loading}
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                variant="outlined"
                autoComplete="new-password"
                disabled={loading}
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                margin="normal"
                variant="outlined"
                autoComplete="new-password"
                disabled={loading}
                error={!!passwordError}
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, py: 1.5 }}
              disabled={isDisabled}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Complete Registration"
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

export default CompleteRegistrationForm;
