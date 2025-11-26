import React, { useMemo, useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Chip,
} from "@mui/material";
import {
  Business,
  Security,
  Analytics,
  Support,
  Speed,
  DeviceHub,
} from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const services = useMemo(
    () => [
      {
        icon: <Business sx={{ fontSize: 48, color: "white" }} />,
        title: "Business Solutions",
        description:
          "Comprehensive business management and optimization solutions tailored to your needs.",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      {
        icon: <Security sx={{ fontSize: 48, color: "white" }} />,
        title: "Security & Compliance",
        description:
          "Advanced security measures and compliance frameworks to protect your business.",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      },
      {
        icon: <Analytics sx={{ fontSize: 48, color: "white" }} />,
        title: "Data Analytics",
        description:
          "Powerful analytics and insights to drive informed business decisions.",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      },
      {
        icon: <DeviceHub sx={{ fontSize: 48, color: "white" }} />,
        title: "System Integration",
        description:
          "Seamless integration of systems and applications for optimal workflow.",
        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      },
      {
        icon: <Speed sx={{ fontSize: 48, color: "white" }} />,
        title: "Performance Optimization",
        description:
          "Enhance system performance and efficiency with our optimization services.",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      },
      {
        icon: <Support sx={{ fontSize: 48, color: "white" }} />,
        title: "24/7 Support",
        description:
          "Round-the-clock technical support and maintenance services.",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      },
    ],
    []
  );

  const features = useMemo(
    () => [
      "Enterprise-grade security",
      "Scalable cloud solutions",
      "AI-powered analytics",
      "Mobile-first design",
      "API integration",
      "Real-time monitoring",
    ],
    []
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.1)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Welcome to NSolutions
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            Innovative solutions for your business needs. Building the future
            with cutting-edge technology and exceptional service.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Comprehensive solutions designed to transform your business and
            drive growth
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  background: service.gradient,
                  color: "white",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center", height: "100%" }}>
                  <Box sx={{ mb: 2 }}>{service.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      fontSize: "1.25rem",
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      lineHeight: 1.6,
                      fontSize: "0.9rem",
                    }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Why Choose NSolutions?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Experience the difference with our cutting-edge features and
              unparalleled service
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 500,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: 3,
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Ready to Transform Your Business?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Join thousands of satisfied clients who have revolutionized their
            operations with NSolutions
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                backgroundColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#45a049",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Start Your Journey
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};
export default Home;
