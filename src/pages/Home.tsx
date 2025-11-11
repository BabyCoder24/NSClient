import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Modal,
  TextField,
  Link,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../components/Header";
import Footer from "../components/Footer";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Home: React.FC = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegisterClose = () => setRegisterOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handleOpenRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const handleOpenLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Registering with email:", email);
    // Handle registration logic here
    setRegisterOpen(false);
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Logging in with username:", username, "password:", password);
    // Handle login logic here
    setLoginOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header
        onRegisterClick={handleOpenRegister}
        onLoginClick={handleOpenLogin}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          marginTop: "50px",
          marginLeft: "20px",
          marginRight: "20px",
          marginBottom: "20px",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", mb: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to NSolutions
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Innovative solutions for your business needs.
          </Typography>
          <Button variant="contained" size="large" sx={{ mt: 2 }}>
            Get Started
          </Button>
        </Paper>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Our Services
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We provide top-notch services to help your business thrive.
          </Typography>
        </Box>
      </Box>
      <Footer />

      {/* Register Modal */}
      <Modal
        open={registerOpen}
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
      >
        <Box sx={modalStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography id="register-modal-title" variant="h6" component="h2">
              Register
            </Typography>
            <IconButton onClick={handleRegisterClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link component="button" variant="body2" onClick={handleOpenLogin}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Modal>

      {/* Login Modal */}
      <Modal
        open={loginOpen}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <Box sx={modalStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography id="login-modal-title" variant="h6" component="h2">
              Login
            </Typography>
            <IconButton onClick={handleLoginClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              margin="normal"
              variant="outlined"
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2">
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
              >
                Forgot Password?
              </Link>
            </Typography>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={handleOpenRegister}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
