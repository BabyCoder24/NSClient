import React from "react";
import { Typography, Box, Button } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Get in touch with our team.
        </Typography>
        <Button variant="contained" size="large">
          Send Message
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default Contact;
