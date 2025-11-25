import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { RootState, AppDispatch } from "../store/store";
import { logoutUser } from "../store/authThunks";

const drawerWidth = 240;
const navItems = [
  { label: "Home", to: "/" },
  { label: "CRUD Dashboard", to: "/crud-dashboard" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
];

const publicNavItems = navItems.filter(
  (item) => !["Login", "Register"].includes(item.label)
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // Custom breakpoint for desktop menu (1136px and up)
  const isDesktopView = useMediaQuery(`(min-width: 1136px)`);

  // Close mobile drawer when switching to desktop view
  React.useEffect(() => {
    if (isDesktopView && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isDesktopView, mobileOpen]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", height: "100%" }}
    >
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #2c3e50 0%, #58b8c7 100%)",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{ mr: 1, width: 28, height: 28 }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              NSolutions
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.7rem" }}
            >
              Innovative solutions for your business needs
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <List sx={{ pt: 2 }}>
        {publicNavItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              sx={{
                textAlign: "center",
                padding: "12px 16px",
                margin: "4px 8px",
                borderRadius: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#BBDEFB",
                  color: "inherit",
                  transform: "translateX(4px)",
                },
              }}
              component={Link}
              to={item.to}
            >
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontWeight: 500 } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {!accessToken ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  textAlign: "center",
                  padding: "12px 16px",
                  margin: "8px",
                  border: "1px solid #2196f3",
                  borderRadius: 2,
                  boxShadow: "0 0 10px rgba(33, 150, 243, 0.5)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    backgroundColor: "rgba(33, 150, 243, 0.04)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 0 15px rgba(33, 150, 243, 0.7)",
                  },
                }}
                component={Link}
                to="/login"
              >
                <ListItemText
                  primary="Login"
                  slotProps={{
                    primary: {
                      fontWeight: 600,
                      color: "#2196f3",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  textAlign: "center",
                  padding: "12px 16px",
                  margin: "8px",
                  backgroundColor: "#4caf50",
                  color: "white",
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#45a049",
                    transform: "translateY(-1px)",
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)",
                  },
                }}
                component={Link}
                to="/register"
              >
                <ListItemText
                  primary="Register"
                  slotProps={{ primary: { fontWeight: 600, color: "white" } }}
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                textAlign: "center",
                padding: "12px 16px",
                margin: "8px",
                backgroundColor: "#f44336",
                color: "white",
                borderRadius: 2,
                fontWeight: 600,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 4px rgba(244, 67, 54, 0.3)",
                },
              }}
              onClick={handleLogout}
            >
              <ListItemText
                primary="Logout"
                slotProps={{ primary: { fontWeight: 600 } }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        elevation={2}
        sx={{
          background: "linear-gradient(135deg, #2c3e50 0%, #58b8c7 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          {!isDesktopView && (
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
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              mr: 1,
              width: { xs: 24, md: 32 },
              height: { xs: 24, md: 32 },
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: 0.5,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            NSolutions
          </Typography>
          {isDesktopView && (
            <Box>
              {publicNavItems.map((item) => (
                <Button
                  key={item.label}
                  variant="text"
                  sx={{
                    color: "#fff",
                    mr: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      transform: "translateY(-1px)",
                    },
                  }}
                  component={Link}
                  to={item.to}
                >
                  {item.label}
                </Button>
              ))}
              {!accessToken ? (
                <>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      mr: 1,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                      ml: 2,
                      boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "white",
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)",
                      },
                    }}
                    component={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      mr: 1,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#45a049",
                        color: "#fff",
                        transform: "translateY(-1px)",
                        boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)",
                      },
                    }}
                    component={Link}
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#f44336",
                    color: "white",
                    mr: 1,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                      color: "#fff",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 8px rgba(244, 67, 54, 0.3)",
                    },
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <nav>
        {!isDesktopView && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </nav>
    </Box>
  );
}
