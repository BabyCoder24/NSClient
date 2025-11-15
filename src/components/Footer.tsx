import React from "react";
import { Box, Typography, Link, Divider } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        p: 4,
        mt: "auto",
      }}
      component="footer"
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            mb: 3,
            gap: 3,
          }}
        >
          <Box sx={{ minWidth: { xs: "100%", sm: 250 }, mb: { xs: 3, sm: 0 } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <BusinessIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                NSolutions
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
              Your trusted partner in innovative solutions. Building the future
              with cutting-edge technology and exceptional service.
            </Typography>
          </Box>

          <Box sx={{ minWidth: { xs: "45%", sm: 150 }, mb: { xs: 3, sm: 0 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Useful Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="/"
                color="inherit"
                sx={{
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                  transition: "opacity 0.2s ease",
                }}
              >
                Home
              </Link>
              <Link
                href="/about"
                color="inherit"
                sx={{
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                  transition: "opacity 0.2s ease",
                }}
              >
                About
              </Link>
              <Link
                href="/products"
                color="inherit"
                sx={{
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                  transition: "opacity 0.2s ease",
                }}
              >
                Products
              </Link>
              <Link
                href="/services"
                color="inherit"
                sx={{
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                  transition: "opacity 0.2s ease",
                }}
              >
                Services
              </Link>
              <Link
                href="/contact"
                color="inherit"
                sx={{
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                  transition: "opacity 0.2s ease",
                }}
              >
                Contact
              </Link>
            </Box>
          </Box>

          <Box sx={{ minWidth: { xs: "45%", sm: 150 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Account
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="/login"
                color="inherit"
                sx={{
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                  transition: "opacity 0.2s ease",
                }}
              >
                Login
              </Link>
              <Link
                href="/register"
                color="inherit"
                sx={{
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                  transition: "opacity 0.2s ease",
                }}
              >
                Register
              </Link>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, bgcolor: "rgba(255, 255, 255, 0.2)" }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              fontSize: "0.875rem",
            }}
          >
            {"Copyright © "}
            <Link
              color="inherit"
              href="/"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
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
