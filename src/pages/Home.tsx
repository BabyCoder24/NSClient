import React from "react";
import { Typography, Box, Button, Paper } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
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
    </Box>
  );
};

export default Home;
