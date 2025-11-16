import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Fab,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link as MuiLink,
  Avatar,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
  type GridRowParams,
} from "@mui/x-data-grid";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout,
  FiberManualRecord,
  Menu as MenuIcon,
  Business,
  Home,
  NavigateNext,
  AccountCircle,
  Add,
  Edit,
  Delete,
  Visibility,
  LockReset,
  Work,
  CheckCircle,
  Cancel,
  Save,
  Search,
  Close,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { logoutUser } from "../store/authThunks";

const drawerWidth = 240;

// Static user data
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    status: "Active",
    department: "IT",
    joinDate: "2023-01-15",
    lastLogin: "2025-11-16",
    avatar: "",
  },
  {
    id: 2,
    name: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 234-5678",
    role: "User",
    status: "Active",
    department: "HR",
    joinDate: "2023-03-20",
    lastLogin: "2025-11-15",
    avatar: "",
  },
  {
    id: 3,
    name: "Mike Johnson",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 345-6789",
    role: "User",
    status: "Inactive",
    department: "Finance",
    joinDate: "2023-05-10",
    lastLogin: "2025-10-28",
    avatar: "",
  },
  {
    id: 4,
    name: "Sarah Williams",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@example.com",
    phone: "+1 (555) 456-7890",
    role: "Moderator",
    status: "Active",
    department: "Marketing",
    joinDate: "2023-07-05",
    lastLogin: "2025-11-14",
    avatar: "",
  },
  {
    id: 5,
    name: "David Brown",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    phone: "+1 (555) 567-8901",
    role: "User",
    status: "Active",
    department: "Sales",
    joinDate: "2023-09-12",
    lastLogin: "2025-11-13",
    avatar: "",
  },
];

interface User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  department: string;
  joinDate: string;
  lastLogin: string;
  avatar: string;
}

const ManageUsers: React.FC = () => {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "view" | "create" | "edit" | "delete" | "reset"
  >("view");
  const [formData, setFormData] = useState<Partial<User>>({});
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    department: "",
  });
  const [displayedUsers, setDisplayedUsers] = useState<User[]>(initialUsers);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
    handleClose();
  };

  const handleSettings = () => {
    navigate("/settings");
    handleClose();
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSearch = () => {
    const filtered = users.filter(
      (user) =>
        (filters.name === "" ||
          user.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.email === "" ||
          user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (filters.role === "" || user.role === filters.role) &&
        (filters.status === "" || user.status === filters.status) &&
        (filters.department === "" ||
          user.department
            .toLowerCase()
            .includes(filters.department.toLowerCase()))
    );
    setDisplayedUsers(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      email: "",
      role: "",
      status: "",
      department: "",
    });
    setDisplayedUsers(users);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDialogType("view");
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "User",
      status: "Active",
      department: "",
    });
    setDialogType("create");
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({ ...user });
    setDialogType("edit");
    setDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDialogType("delete");
    setDialogOpen(true);
  };

  const handlePasswordReset = (user: User) => {
    setSelectedUser(user);
    setDialogType("reset");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setFormData({});
  };

  const handleFormSubmit = () => {
    if (dialogType === "create") {
      const newUser: User = {
        ...formData,
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: `${formData.firstName || ""} ${formData.lastName || ""}`.trim(),
        joinDate: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
        avatar: "",
      } as User;
      setUsers([...users, newUser]);
      setSnackbar({
        open: true,
        message: "User created successfully!",
        severity: "success",
      });
    } else if (dialogType === "edit" && selectedUser) {
      const updatedUser = {
        ...selectedUser,
        ...formData,
        name: `${formData.firstName || selectedUser.firstName} ${
          formData.lastName || selectedUser.lastName
        }`.trim(),
      };
      setUsers(users.map((u) => (u.id === selectedUser.id ? updatedUser : u)));
      setSnackbar({
        open: true,
        message: "User updated successfully!",
        severity: "success",
      });
    } else if (dialogType === "delete" && selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setSnackbar({
        open: true,
        message: "User deleted successfully!",
        severity: "success",
      });
    } else if (dialogType === "reset" && selectedUser) {
      // Simulate password reset
      setSnackbar({
        open: true,
        message: `Password reset email sent to ${selectedUser.email}!`,
        severity: "success",
      });
    }
    handleDialogClose();
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 60,
      flex: 0,
      renderCell: (params) => (
        <Avatar sx={{ width: 32, height: 32 }}>
          {params.row.firstName?.[0] || "?"}
          {params.row.lastName?.[0] || ""}
        </Avatar>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Administrator"
              ? "error"
              : params.value === "Moderator"
              ? "warning"
              : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      minWidth: 80,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Active" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "lastLogin",
      headerName: "Last Login",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 0,
      minWidth: 120,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={() => handleView(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<LockReset />}
          label="Reset Password"
          onClick={() => handlePasswordReset(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.row)}
          showInMenu
        />,
      ],
    },
  ];

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
        <Box
          component="main"
          sx={{ flexGrow: 1, p: { xs: 0, sm: 0.25, md: 1 }, pt: 8 }}
        >
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

          <Container maxWidth={false} sx={{ py: 2 }}>
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
              <Typography color="text.primary">Manage Users</Typography>
            </Breadcrumbs>
          </Container>

          <Container maxWidth={false} sx={{ py: 4 }}>
            {/* Header Section */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                borderRadius: 3,
                p: { xs: 0.5, sm: 1, md: 2 },
                mb: 4,
                color: "white",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 3,
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  variant={{ xs: "h4", sm: "h4", md: "h4" } as any}
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                >
                  User Management
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                  Manage user accounts, roles, and permissions across the
                  system.
                </Typography>
              </Box>
            </Box>

            {/* Stats Cards - Using CSS Grid for responsive layout */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                },
                gap: { xs: 1, sm: 2, md: 4 },
                mb: 4,
              }}
            >
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "0.3s",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <PeopleIcon
                      sx={{
                        fontSize: { xs: 30, md: 40 },
                        color: "primary.main",
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography
                        variant={isSmall ? "h5" : "h4"}
                        color="primary"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {users.length}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        Total Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "0.3s",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: { xs: 30, md: 40 },
                        color: "success.main",
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography
                        variant={isSmall ? "h5" : "h4"}
                        color="success.main"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {users.filter((u) => u.status === "Active").length}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        Active Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "0.3s",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Work
                      sx={{
                        fontSize: { xs: 30, md: 40 },
                        color: "warning.main",
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography
                        variant={isSmall ? "h5" : "h4"}
                        color="warning.main"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {users.filter((u) => u.role === "Administrator").length}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        Administrators
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "0.3s",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Cancel
                      sx={{
                        fontSize: { xs: 30, md: 40 },
                        color: "error.main",
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography
                        variant={isSmall ? "h5" : "h4"}
                        color="error.main"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {users.filter((u) => u.status === "Inactive").length}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        Inactive Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Filters Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Filters
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  <TextField
                    label="Name"
                    value={filters.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                    sx={{
                      minWidth: { xs: "100%", sm: 120 },
                      flex: { xs: "1 1 100%", sm: "1 1 120px" },
                    }}
                    id="filter-name"
                    name="filter-name"
                  />
                  <TextField
                    label="Email"
                    value={filters.email}
                    onChange={(e) =>
                      handleFilterChange("email", e.target.value)
                    }
                    sx={{
                      minWidth: { xs: "100%", sm: 120 },
                      flex: { xs: "1 1 100%", sm: "1 1 120px" },
                    }}
                    id="filter-email"
                    name="filter-email"
                  />
                  <TextField
                    select
                    label="Role"
                    value={filters.role}
                    onChange={(e) => handleFilterChange("role", e.target.value)}
                    sx={{
                      minWidth: { xs: "100%", sm: 120 },
                      flex: { xs: "1 1 100%", sm: "1 1 120px" },
                    }}
                    id="filter-role"
                    name="filter-role"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Moderator">Moderator</MenuItem>
                    <MenuItem value="Administrator">Administrator</MenuItem>
                  </TextField>
                  <TextField
                    select
                    label="Status"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    sx={{
                      minWidth: { xs: "100%", sm: 120 },
                      flex: { xs: "1 1 100%", sm: "1 1 120px" },
                    }}
                    id="filter-status"
                    name="filter-status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                  <TextField
                    label="Department"
                    value={filters.department}
                    onChange={(e) =>
                      handleFilterChange("department", e.target.value)
                    }
                    sx={{
                      minWidth: { xs: "100%", sm: 120 },
                      flex: { xs: "1 1 100%", sm: "1 1 120px" },
                    }}
                    id="filter-department"
                    name="filter-department"
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  <Button variant="outlined" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Users</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                    sx={{
                      borderRadius: 2,
                      display: { xs: "none", md: "inline-flex" },
                    }}
                  >
                    Add User
                  </Button>
                </Box>
                {isSmall ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {displayedUsers.map((user) => (
                      <Card key={user.id} sx={{ p: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar sx={{ width: 40, height: 40 }}>
                            {user.firstName?.[0] || "?"}
                            {user.lastName?.[0] || ""}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6">{user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                              <Chip
                                label={user.role}
                                color={
                                  user.role === "Administrator"
                                    ? "error"
                                    : user.role === "Moderator"
                                    ? "warning"
                                    : "default"
                                }
                                size="small"
                              />
                              <Chip
                                label={user.status}
                                color={
                                  user.status === "Active" ? "success" : "error"
                                }
                                size="small"
                              />
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleView(user)}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handlePasswordReset(user)}
                            >
                              <LockReset />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(user)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <DataGrid
                      autoHeight // Dynamic height to prevent fixed overflows
                      rows={displayedUsers}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 10 },
                        },
                      }}
                      pageSizeOptions={[5, 10, 25]}
                      checkboxSelection
                      disableRowSelectionOnClick
                      columnVisibilityModel={{
                        avatar: !isMobile,
                        department: !isMobile,
                        lastLogin: !isMobile,
                        email: !isMobile, // Hide email on medium down
                        role: !isMobile, // Hide role on medium down
                      }}
                      sx={{
                        border: 0,
                        "& .MuiDataGrid-cell:focus": {
                          outline: "none",
                        },
                        "& .MuiDataGrid-row:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Container>

          {/* Floating Action Button for Mobile */}
          {isMobile && (
            <Fab
              color="primary"
              aria-label="add user"
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                zIndex: 1000,
              }}
              onClick={handleCreate}
            >
              <Add />
            </Fab>
          )}
        </Box>
      </Box>

      {/* User Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={(reason) => {
          if (reason === "backdropClick") return;
          handleDialogClose();
        }}
        maxWidth="md"
        fullWidth
        fullScreen={isSmall}
      >
        <DialogTitle>
          {dialogType === "view" && "View User"}
          {dialogType === "create" && "Create New User"}
          {dialogType === "edit" && "Edit User"}
          {dialogType === "delete" && "Delete User"}
          {dialogType === "reset" && "Reset Password"}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {dialogType === "view" && selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
                  gap: { xs: 0.5, sm: 2 },
                }}
              >
                <Box
                  sx={{
                    flex: "1 1 300px",
                    minWidth: { xs: "100%", sm: "300px" },
                    maxWidth: { xs: "100%", md: "calc(33.333% - 16px)" },
                  }}
                >
                  <Paper sx={{ p: { xs: 1, sm: 2 }, textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: { xs: 60, sm: 80, md: 100 },
                        height: { xs: 60, sm: 80, md: 100 },
                        mx: "auto",
                        mb: 2,
                        bgcolor: "primary.main",
                        fontSize: { xs: "1.5rem", sm: "2rem" },
                      }}
                    >
                      {selectedUser.firstName[0]}
                      {selectedUser.lastName[0]}
                    </Avatar>
                    <Typography variant="h6">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </Typography>
                    <Chip
                      label={selectedUser.role}
                      color={
                        selectedUser.role === "Administrator"
                          ? "error"
                          : "default"
                      }
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </Box>
                <Box
                  sx={{
                    flex: "1 1 400px",
                    minWidth: { xs: "100%", sm: 400 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: { xs: 1, md: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: { xs: 1, sm: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          flex: "1 1 120px",
                          minWidth: { xs: "100%", sm: 120 },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="First Name"
                          value={selectedUser.firstName}
                          InputProps={{ readOnly: true }}
                          id="view-first-name"
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: "1 1 120px",
                          minWidth: { xs: "100%", sm: 120 },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={selectedUser.lastName}
                          InputProps={{ readOnly: true }}
                          id="view-last-name"
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: "1 1 120px",
                          minWidth: { xs: "100%", sm: 120 },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Email"
                          value={selectedUser.email}
                          InputProps={{ readOnly: true }}
                          id="view-email"
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: "1 1 120px",
                          minWidth: { xs: "100%", sm: 120 },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Phone"
                          value={selectedUser.phone}
                          InputProps={{ readOnly: true }}
                          id="view-phone"
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: "1 1 120px",
                          minWidth: { xs: "100%", sm: 120 },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Department"
                          value={selectedUser.department}
                          InputProps={{ readOnly: true }}
                          id="view-department"
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: "1 1 120px",
                          minWidth: { xs: "100%", sm: 120 },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Status"
                          value={selectedUser.status}
                          InputProps={{ readOnly: true }}
                          id="view-status"
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: "1 1 120px",
                          minWidth: { xs: "100%", sm: 120 },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Join Date"
                          value={selectedUser.joinDate}
                          InputProps={{ readOnly: true }}
                          id="view-join-date"
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: "1 1 120px",
                          minWidth: { xs: "100%", sm: 120 },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Last Login"
                          value={selectedUser.lastLogin}
                          InputProps={{ readOnly: true }}
                          id="view-last-login"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {(dialogType === "create" || dialogType === "edit") && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.5, sm: 1.5 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 1, sm: 2 },
                }}
              >
                <Box
                  sx={{
                    flex: "1 1 120px",
                    minWidth: { xs: "100%", sm: 120 },
                  }}
                >
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    id="form-first-name"
                    name="first-name"
                  />
                </Box>
                <Box
                  sx={{
                    flex: "1 1 120px",
                    minWidth: { xs: "100%", sm: 120 },
                  }}
                >
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                    id="form-last-name"
                    name="last-name"
                  />
                </Box>
                <Box
                  sx={{
                    flex: "1 1 120px",
                    minWidth: { xs: "100%", sm: 120 },
                  }}
                >
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    id="form-email"
                    name="email"
                  />
                </Box>
                <Box
                  sx={{
                    flex: "1 1 120px",
                    minWidth: { xs: "100%", sm: 120 },
                  }}
                >
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    id="form-phone"
                    name="phone"
                  />
                </Box>
                <Box
                  sx={{
                    flex: "1 1 120px",
                    minWidth: { xs: "100%", sm: 120 },
                  }}
                >
                  <TextField
                    fullWidth
                    select
                    label="Role"
                    value={formData.role || "User"}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    id="form-role"
                    name="role"
                  >
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Moderator">Moderator</MenuItem>
                    <MenuItem value="Administrator">Administrator</MenuItem>
                  </TextField>
                </Box>
                <Box
                  sx={{
                    flex: "1 1 120px",
                    minWidth: { xs: "100%", sm: 120 },
                  }}
                >
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={formData.status || "Active"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    id="form-status"
                    name="status"
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                </Box>
              </Box>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="Department"
                  value={formData.department || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  id="form-department"
                  name="department"
                />
              </Box>
            </Box>
          )}

          {dialogType === "delete" && selectedUser && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete the user "{selectedUser.firstName}{" "}
              {selectedUser.lastName}"? This action cannot be undone.
            </Alert>
          )}

          {dialogType === "reset" && selectedUser && (
            <Alert severity="info" sx={{ mb: 2 }}>
              This will send a password reset email to {selectedUser.email}. The
              user will be able to set a new password using the link in the
              email.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {dialogType !== "view" && (
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              color={dialogType === "delete" ? "error" : "primary"}
              startIcon={
                dialogType === "create" ? (
                  <Add />
                ) : dialogType === "edit" ? (
                  <Save />
                ) : dialogType === "delete" ? (
                  <Delete />
                ) : (
                  <LockReset />
                )
              }
            >
              {dialogType === "create" && "Create User"}
              {dialogType === "edit" && "Save Changes"}
              {dialogType === "delete" && "Delete User"}
              {dialogType === "reset" && "Send Reset Email"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUsers;
