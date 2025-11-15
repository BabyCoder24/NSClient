import React from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Divider,
  Toolbar,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  Person,
  Email,
  LocationOn,
  AccountBalance,
  TrendingUp,
  ShoppingCart,
  Notifications,
  Settings,
  Receipt,
  CreditCard,
  Home,
  NavigateNext,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Header from "../components/Header";
import Footer from "../components/Footer";

const accountStats = [
  {
    title: "Total Balance",
    value: "$12,450.00",
    change: "+2.5%",
    icon: <AccountBalance />,
    color: "primary",
  },
  {
    title: "Monthly Spending",
    value: "$2,340.00",
    change: "-5.2%",
    icon: <TrendingUp />,
    color: "success",
  },
  {
    title: "Active Orders",
    value: "8",
    change: "+3",
    icon: <ShoppingCart />,
    color: "warning",
  },
  {
    title: "Rewards Points",
    value: "1,250",
    change: "+150",
    icon: <CreditCard />,
    color: "info",
  },
];

const recentActivities = [
  {
    id: 1,
    action: "Purchase",
    description: "Office Supplies Order #12345",
    amount: "-$89.99",
    date: "2 hours ago",
    type: "expense",
  },
  {
    id: 2,
    action: "Payment",
    description: "Salary Deposit",
    amount: "+$3,500.00",
    date: "1 day ago",
    type: "income",
  },
  {
    id: 3,
    action: "Subscription",
    description: "Premium Plan Renewal",
    amount: "-$29.99",
    date: "3 days ago",
    type: "expense",
  },
  {
    id: 4,
    action: "Refund",
    description: "Product Return #67890",
    amount: "+$45.00",
    date: "5 days ago",
    type: "income",
  },
];

const Dashboard: React.FC = () => {
  const { user, role } = useSelector((state: RootState) => state.auth);

  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";
  const avatarInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";
  const userEmail = user?.email || "user@example.com";
  const accountType = role === "Administrator" ? "Admin" : "User";

  const quickActions = [
    {
      label: "View Profile",
      icon: <Person />,
      action: () => console.log("View Profile"),
    },
    {
      label: "Account Settings",
      icon: <Settings />,
      action: () => console.log("Account Settings"),
    },
    {
      label: "Transaction History",
      icon: <Receipt />,
      action: () => console.log("Transaction History"),
    },
    {
      label: "Notifications",
      icon: <Notifications />,
      action: () => console.log("Notifications"),
    },
    ...(role === "Administrator"
      ? [
          {
            label: "User Management",
            icon: <Person />,
            action: () => console.log("User Management"),
          },
        ]
      : []),
  ];
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Toolbar /> {/* Offset for AppBar */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
          aria-label="breadcrumb"
        >
          <MuiLink
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </MuiLink>
          <Typography color="text.primary">Dashboard</Typography>
        </Breadcrumbs>
      </Container>
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {displayName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your {accountType.toLowerCase()} account
            activity
          </Typography>
          {role === "Administrator" && (
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              You have administrative privileges.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {/* User Profile Card */}
          <Box
            sx={{
              flex: "1 1 300px",
              minWidth: "300px",
              maxWidth: { xs: "100%", md: "calc(33.333% - 16px)" },
            }}
          >
            <Card
              sx={{
                height: "100%",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", pt: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "primary.main",
                    fontSize: "2rem",
                  }}
                >
                  {avatarInitials}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {displayName}
                </Typography>
                <Chip
                  label={accountType}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ textAlign: "left" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Email
                      sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
                    />
                    <Typography variant="body2">{userEmail}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Person
                      sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
                    />
                    <Typography variant="body2">
                      {user?.username || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn
                      sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
                    />
                    <Typography variant="body2">
                      {user?.companyName || "N/A"}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, display: "block" }}
                >
                  Welcome to NSolutions
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Account Statistics */}
          <Box
            sx={{
              flex: "1 1 500px",
              minWidth: "500px",
              maxWidth: { xs: "100%", md: "calc(66.666% - 16px)" },
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {accountStats.map((stat, index) => (
                <Box key={index} sx={{ flex: "1 1 250px", minWidth: "250px" }}>
                  <Card
                    sx={{
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: (theme) => theme.shadows[4],
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: `${stat.color}.light`,
                            color: `${stat.color}.main`,
                            mr: 2,
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {stat.title}
                          </Typography>
                          <Typography variant="h5" component="div">
                            {stat.value}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: stat.change.startsWith("+")
                            ? "success.main"
                            : "error.main",
                        }}
                      >
                        {stat.change} from last month
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Recent Activity */}
          <Box
            sx={{
              flex: "1 1 500px",
              minWidth: "500px",
              maxWidth: { xs: "100%", md: "calc(66.666% - 16px)" },
            }}
          >
            <Card
              sx={{
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              bgcolor:
                                activity.type === "income"
                                  ? "success.light"
                                  : "error.light",
                              color:
                                activity.type === "income"
                                  ? "success.main"
                                  : "error.main",
                            }}
                          >
                            {activity.type === "income" ? (
                              <TrendingUp />
                            ) : (
                              <Receipt />
                            )}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.description}
                          secondary={activity.date}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            color:
                              activity.type === "income"
                                ? "success.main"
                                : "error.main",
                          }}
                        >
                          {activity.amount}
                        </Typography>
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Quick Actions & Progress */}
          <Box
            sx={{
              flex: "1 1 300px",
              minWidth: "300px",
              maxWidth: { xs: "100%", md: "calc(33.333% - 16px)" },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Quick Actions */}
              <Box>
                <Card
                  sx={{
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          startIcon={action.icon}
                          onClick={action.action}
                          sx={{
                            justifyContent: "flex-start",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateX(4px)",
                              boxShadow: (theme) => theme.shadows[2],
                            },
                          }}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Account Goals */}
              <Box>
                <Card
                  sx={{
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Account Goals
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">Monthly Savings</Typography>
                        <Typography variant="body2">$850 / $1,000</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={85} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">
                          Investment Target
                        </Typography>
                        <Typography variant="body2">
                          $5,200 / $10,000
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={52} />
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">Reward Points</Typography>
                        <Typography variant="body2">1,250 / 2,000</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={62.5} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Dashboard;
