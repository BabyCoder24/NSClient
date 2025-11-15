import React from "react";
import { Typography, Box, Button } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About: React.FC = () => {
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
          About NSolutions
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Learn more about our company and mission.
        </Typography>
        <Button variant="contained" size="large">
          Contact Us
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default About;
