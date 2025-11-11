import React, { useState } from "react";
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
import axios from "axios";
import type { RegistrationRequest } from "../types/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const registrationData: RegistrationRequest = {
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        Email: email.trim(),
        CompanyName: company.trim() || undefined,
      };

      await axios.post("/auth/register", registrationData);

      setSuccess(true);

      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setCompany("");

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      const message =
        (error as any)?.__kind === "network"
          ? "Network error. Please check your connection."
          : (error as any).response?.data?.message || "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
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
            maxWidth: 450,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join NSolutions and start your journey with us.
          </Typography>

          {success ? (
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Registration successful! Please check your email to complete the
                verification process.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Redirecting to login page...
              </Typography>
            </Box>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
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
                />
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
                <TextField
                  fullWidth
                  label="Company (Optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  autoComplete="organization"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={
                    loading ||
                    !firstName.trim() ||
                    !lastName.trim() ||
                    !email.trim()
                  }
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

          <Box sx={{ textAlign: "center", mt: 2 }}>
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
