import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
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
  Business,
  Logout,
  FiberManualRecord,
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../store/authSlice";

const drawerWidth = 240;

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

const AdminDashboard: React.FC = () => {
  const { user, role, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    handleClose();
  };

  const handleSettings = () => {
    navigate("/settings");
    handleClose();
  };

  const sidebarItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
    { text: "Manage Users", icon: <PeopleIcon />, path: "/manage-users" },
  ];

  return (
    <Box>
      {/* Admin Header */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          backdropFilter: "blur(10px)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          {/* Mobile Menu Button - only show when sidebar is temporary */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Company Branding - Mobile Only */}
          <Box
            sx={{
              flexGrow: { xs: 1, md: 0 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Business sx={{ mr: 1, fontSize: 28 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              NSolutions
            </Typography>
          </Box>

          {/* User Menu */}
          <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
          >
            <Typography
              variant="body1"
              sx={{
                mr: 1,
                color: "white",
              }}
            >
              Welcome, {displayName}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleMenu}
              sx={{
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Layout with Sidebar and Content */}
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
              display: "flex",
              flexDirection: "column",
            },
          }}
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          anchor="left"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {/* Sidebar Header */}
          <Box
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Business sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              NSolutions
            </Typography>
          </Box>

          <Divider />

          {/* Navigation Menu */}
          <List sx={{ flexGrow: 1 }}>
            {sidebarItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={isMobile ? handleDrawerToggle : undefined}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Settings Icon at Bottom of Menu */}
          <Box sx={{ p: 2, mt: "auto" }}>
            <IconButton
              onClick={handleMenu}
              sx={{
                width: "100%",
                height: 48,
                borderRadius: 1,
                backgroundColor: "rgba(25, 118, 210, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.2)",
                },
              }}
            >
              <Settings sx={{ fontSize: 24, color: "primary.main" }} />
            </IconButton>
          </Box>

          <Divider />

          {/* Footer at Bottom */}
          <Box
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <FiberManualRecord
                sx={{
                  color: accessToken ? "success.main" : "error.main",
                  fontSize: 12,
                  mr: 0.5,
                }}
              />
              <Typography variant="body2">NSolutions</Typography>
            </Box>
            <Typography variant="caption">
              © 2025 All rights reserved
            </Typography>
          </Box>
        </Drawer>

        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, p: isMobile ? 1 : 3, pt: 8 }}>
          {/* User Menu */}
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleSettings}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>

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
              <Typography color="text.primary">Admin Dashboard</Typography>
            </Breadcrumbs>
          </Container>

          <Container maxWidth="lg" sx={{ py: 4 }}>
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Email
                          sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
                        />
                        <Typography variant="body2">{userEmail}</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Person
                          sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
                        />
                        <Typography variant="body2">
                          {user?.username || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
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
                    <Box
                      key={index}
                      sx={{ flex: "1 1 250px", minWidth: "250px" }}
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
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
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
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
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
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
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
                            <Typography variant="body2">
                              Monthly Savings
                            </Typography>
                            <Typography variant="body2">
                              $850 / $1,000
                            </Typography>
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
                            <Typography variant="body2">
                              Reward Points
                            </Typography>
                            <Typography variant="body2">
                              1,250 / 2,000
                            </Typography>
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
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
