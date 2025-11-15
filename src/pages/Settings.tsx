import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Grid,
  Switch,
  FormControlLabel,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link as MuiLink,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person,
  Settings as SettingsIcon,
  Logout,
  FiberManualRecord,
  Menu as MenuIcon,
  Business,
  Home,
  NavigateNext,
  AccountCircle,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../store/authSlice";

const drawerWidth = 240;

const Settings: React.FC = () => {
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
            keepMounted: true,
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
              <SettingsIcon sx={{ fontSize: 24, color: "primary.main" }} />
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
              <SettingsIcon sx={{ mr: 1 }} />
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
              <MuiLink
                component={Link}
                to="/admin-dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Admin Dashboard
              </MuiLink>
              <Typography color="text.primary">Settings</Typography>
            </Breadcrumbs>
          </Container>

          <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              User Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Manage your account settings and preferences.
            </Typography>

            <Grid container spacing={4}>
              {/* Profile Information */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Profile Information
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
                        <Person sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{displayName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {role === "Administrator" ? "Administrator" : "User"}
                        </Typography>
                      </Box>
                    </Box>
                    <TextField
                      fullWidth
                      label="First Name"
                      defaultValue={user?.firstName || ""}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      defaultValue={user?.lastName || ""}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      defaultValue={user?.email || ""}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Username"
                      defaultValue={user?.username || ""}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Company"
                      defaultValue={user?.companyName || ""}
                      sx={{ mb: 3 }}
                    />
                    <Button variant="contained" color="primary">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Preferences */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Preferences
                    </Typography>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Email Notifications"
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="SMS Notifications"
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Dark Mode"
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Two-Factor Authentication"
                      sx={{ mb: 3 }}
                    />
                    <Divider sx={{ mb: 3 }} />
                    <Typography variant="h6" gutterBottom>
                      Security
                    </Typography>
                    <Button variant="outlined" color="secondary" sx={{ mb: 2 }}>
                      Change Password
                    </Button>
                    <Button variant="outlined" color="error">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
