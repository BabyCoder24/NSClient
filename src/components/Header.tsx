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
import BusinessIcon from "@mui/icons-material/Business";
import { Link } from "react-router-dom";

const drawerWidth = 240;
const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        NSolutions
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              sx={{
                textAlign: "center",
                padding: "8px 16px",
                margin: "4px 8px",
                ...(item.label === "Login" && {
                  backgroundColor: "green",
                  color: "white",
                  "&:hover": { backgroundColor: "#32CD32", color: "#fff" },
                }),
                ...(item.label === "Register" && {
                  backgroundColor: "secondary.main",
                  color: "white",
                  "&:hover": { backgroundColor: "#FF6347", color: "#fff" },
                }),
                ...(item.label !== "Login" &&
                  item.label !== "Register" && {
                    "&:hover": { backgroundColor: "#BBDEFB", color: "inherit" },
                  }),
              }}
              component={Link}
              to={item.to}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <BusinessIcon sx={{ mr: 2, display: { xs: "none", md: "block" } }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }}
          >
            NSolutions
          </Typography>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={
                  item.label === "Login" || item.label === "Register"
                    ? "contained"
                    : "text"
                }
                sx={
                  item.label === "Login"
                    ? {
                        backgroundColor: "green",
                        color: "white",
                        mr: 1,
                        padding: "8px 16px",
                        borderRadius: "4px",
                        minWidth: "100px",
                        ml: 2,
                        "&:hover": {
                          backgroundColor: "#32CD32",
                          color: "#fff",
                        },
                      }
                    : item.label === "Register"
                    ? {
                        backgroundColor: "secondary.main",
                        color: "white",
                        mr: 1,
                        padding: "8px 16px",
                        borderRadius: "4px",
                        minWidth: "100px",
                        "&:hover": {
                          backgroundColor: "#FF6347",
                          color: "#fff",
                        },
                      }
                    : {
                        color: "#fff",
                        mr: 1,
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          color: "#fff",
                        },
                      }
                }
                component={Link}
                to={item.to}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
