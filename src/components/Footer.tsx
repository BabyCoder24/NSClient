import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
      <Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            mb: 4,
          }}
        >
          <Box sx={{ minWidth: 200, mb: 2 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              NSolutions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your trusted partner in innovative solutions.
            </Typography>
          </Box>
          <Box sx={{ minWidth: 200, mb: 2 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Useful Links
            </Typography>
            <Link href="/" color="inherit" display="block">
              Home
            </Link>
            <Link href="/about" color="inherit" display="block">
              About
            </Link>
            <Link href="/products" color="inherit" display="block">
              Products
            </Link>
            <Link href="/services" color="inherit" display="block">
              Services
            </Link>
            <Link href="/contact" color="inherit" display="block">
              Contact
            </Link>
          </Box>
          <Box sx={{ minWidth: 200, mb: 2 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Account
            </Typography>
            <Link href="/login" color="inherit" display="block">
              Login
            </Link>
            <Link href="/register" color="inherit" display="block">
              Register
            </Link>
          </Box>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="/">
              NSolutions
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
