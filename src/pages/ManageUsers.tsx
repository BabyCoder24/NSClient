import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Pagination,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
  type GridRowParams,
} from "@mui/x-data-grid";
import { alpha } from "@mui/material/styles";
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

const MOBILE_PAGE_SIZE = 5;
const DATA_GRID_ROW_HEIGHT = 52;
const DATA_GRID_HEADER_HEIGHT = 56;
const DATA_GRID_FOOTER_HEIGHT = 52;
const DATA_GRID_MIN_HEIGHT = 360;

type DialogType = "view" | "create" | "edit" | "delete" | "reset";

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
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("view");
  const [formData, setFormData] = useState<Partial<User>>({});
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    department: "",
  });
  const [displayedUsers, setDisplayedUsers] = useState<User[]>(initialUsers);
  const [mobilePage, setMobilePage] = useState(1);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const filterUsers = useCallback(
    (list: User[]) =>
      list.filter(
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
      ),
    [filters]
  );

  useEffect(() => {
    const maxPage = Math.max(
      1,
      Math.ceil(displayedUsers.length / MOBILE_PAGE_SIZE)
    );
    setMobilePage((prev) => Math.min(prev, maxPage));
  }, [displayedUsers.length]);

  useEffect(() => {
    setPaginationModel((prev) => {
      const maxPageIndex = Math.max(
        0,
        Math.ceil(displayedUsers.length / prev.pageSize) - 1
      );
      if (prev.page > maxPageIndex) {
        return { ...prev, page: maxPageIndex };
      }
      return prev;
    });
  }, [displayedUsers.length]);

  const mobileTotalPages = Math.max(
    1,
    Math.ceil(displayedUsers.length / MOBILE_PAGE_SIZE)
  );

  const mobilePaginatedUsers = useMemo(() => {
    const startIndex = (mobilePage - 1) * MOBILE_PAGE_SIZE;
    return displayedUsers.slice(startIndex, startIndex + MOBILE_PAGE_SIZE);
  }, [displayedUsers, mobilePage]);

  const visibleDesktopRowCount = useMemo(() => {
    if (displayedUsers.length === 0) {
      return 0;
    }
    const startIndex = paginationModel.page * paginationModel.pageSize;
    const remaining = displayedUsers.length - startIndex;
    return Math.max(0, Math.min(paginationModel.pageSize, remaining));
  }, [displayedUsers.length, paginationModel]);

  const dataGridHeight = useMemo(() => {
    const rowsHeight = visibleDesktopRowCount * DATA_GRID_ROW_HEIGHT;
    return Math.max(
      DATA_GRID_MIN_HEIGHT,
      DATA_GRID_HEADER_HEIGHT + DATA_GRID_FOOTER_HEIGHT + rowsHeight
    );
  }, [visibleDesktopRowCount]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const dialogMeta = useMemo<
    Record<DialogType, { title: string; subtitle: string }>
  >(
    () => ({
      view: {
        title: "View User",
        subtitle: "Review account information and access history.",
      },
      create: {
        title: "Create New User",
        subtitle: "Configure profile details and access permissions.",
      },
      edit: {
        title: "Edit User",
        subtitle: "Update personal information or adjust their role.",
      },
      delete: {
        title: "Delete User",
        subtitle: "Double-check before removing this account permanently.",
      },
      reset: {
        title: "Reset Password",
        subtitle: "Send the user a secure password reset link via email.",
      },
    }),
    []
  );

  const activeDialogMeta = dialogMeta[dialogType];

  const dialogHeaderStyles = useMemo(() => {
    switch (dialogType) {
      case "delete":
        return {
          background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
        };
      case "reset":
        return {
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
        };
      default:
        return {
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        };
    }
  }, [dialogType, theme]);

  const selectedUserDetails = useMemo(
    () =>
      selectedUser
        ? [
            { label: "First Name", value: selectedUser.firstName },
            { label: "Last Name", value: selectedUser.lastName },
            { label: "Email", value: selectedUser.email },
            { label: "Phone", value: selectedUser.phone || "Not provided" },
            { label: "Department", value: selectedUser.department },
            { label: "Status", value: selectedUser.status },
            { label: "Join Date", value: selectedUser.joinDate },
            { label: "Last Login", value: selectedUser.lastLogin },
          ]
        : [],
    [selectedUser]
  );

  const columnVisibilityModel = useMemo(() => {
    if (isSmall) {
      return {
        avatar: false,
        email: false,
        department: false,
        lastLogin: false,
        role: false,
      };
    }

    if (isTablet) {
      return {
        avatar: true,
        email: false,
        department: false,
        lastLogin: false,
        role: true,
      };
    }

    return {
      avatar: true,
      email: true,
      department: true,
      lastLogin: true,
      role: true,
    };
  }, [isSmall, isTablet]);

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
    const filtered = filterUsers(users);
    setDisplayedUsers(filtered);
    setMobilePage(1);
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
    setMobilePage(1);
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
      const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser: User = {
        ...formData,
        id: nextId,
        name: `${formData.firstName || ""} ${formData.lastName || ""}`.trim(),
        joinDate: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
        avatar: "",
      } as User;
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setDisplayedUsers(filterUsers(updatedUsers));
      setMobilePage(1);
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
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? updatedUser : u
      );
      setUsers(updatedUsers);
      setDisplayedUsers(filterUsers(updatedUsers));
      setSnackbar({
        open: true,
        message: "User updated successfully!",
        severity: "success",
      });
    } else if (dialogType === "delete" && selectedUser) {
      const updatedUsers = users.filter((u) => u.id !== selectedUser.id);
      setUsers(updatedUsers);
      setDisplayedUsers(filterUsers(updatedUsers));
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
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-end", sm: "center" },
              marginLeft: "auto",
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{
                color: "white",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                maxWidth: { xs: 120, sm: "none" },
                textAlign: { xs: "right", sm: "left" },
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
        <Box component="main" sx={{ flexGrow: 1, width: "100%", pt: 8 }}>
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

          <Container maxWidth="xl" sx={{ py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
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

          <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
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
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: { xs: 2, sm: 3, md: 4 },
                alignItems: "stretch",
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
                  height: "100%",
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
                  height: "100%",
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
                  height: "100%",
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
                  height: "100%",
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
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                color: "common.white",
                background:
                  "linear-gradient(135deg, #1e3c72 0%, #2a5298 45%, #38a3d1 100%)",
                boxShadow: "0px 18px 42px rgba(30, 64, 175, 0.22)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
                },
              }}
            >
              <CardContent
                sx={{
                  position: "relative",
                  zIndex: 1,
                  p: { xs: 2, sm: 3 },
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 2, sm: 2.5 },
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Smart Filters
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    Quickly narrow down users by name, contact, role, or status.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: (theme) =>
                      alpha(theme.palette.common.white, 0.92),
                    borderRadius: 2,
                    p: { xs: 1.5, sm: 2.5 },
                    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, sm: 2 },
                    color: "text.primary",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gap: { xs: 1, sm: 1.5, md: 2 },
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(auto-fit, minmax(200px, 1fr))",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Name"
                      value={filters.name}
                      onChange={(e) =>
                        handleFilterChange("name", e.target.value)
                      }
                      sx={{ minWidth: 0 }}
                      id="filter-name"
                      name="filter-name"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={filters.email}
                      onChange={(e) =>
                        handleFilterChange("email", e.target.value)
                      }
                      sx={{ minWidth: 0 }}
                      id="filter-email"
                      name="filter-email"
                    />
                    <TextField
                      fullWidth
                      select
                      label="Role"
                      value={filters.role}
                      onChange={(e) =>
                        handleFilterChange("role", e.target.value)
                      }
                      sx={{ minWidth: 0 }}
                      id="filter-role"
                      name="filter-role"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="User">User</MenuItem>
                      <MenuItem value="Moderator">Moderator</MenuItem>
                      <MenuItem value="Administrator">Administrator</MenuItem>
                    </TextField>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      sx={{ minWidth: 0 }}
                      id="filter-status"
                      name="filter-status"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                    <TextField
                      fullWidth
                      label="Department"
                      value={filters.department}
                      onChange={(e) =>
                        handleFilterChange("department", e.target.value)
                      }
                      sx={{ minWidth: 0 }}
                      id="filter-department"
                      name="filter-department"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<Search />}
                      onClick={handleSearch}
                      sx={{
                        minWidth: 140,
                        borderRadius: 999,
                        px: 3,
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        boxShadow: "0px 12px 24px rgba(37, 99, 235, 0.25)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                          boxShadow: "0px 10px 20px rgba(30, 64, 175, 0.3)",
                        },
                      }}
                    >
                      Apply Filters
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleClearFilters}
                      sx={{
                        minWidth: 140,
                        borderRadius: 999,
                        px: 3,
                        color: "text.primary",
                        borderColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.4),
                        "&:hover": {
                          borderColor: (theme) => theme.palette.primary.main,
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      Reset
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", md: "center" },
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 1.5, md: 2 },
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
                      width: { xs: "100%", md: "auto" },
                      alignSelf: { xs: "stretch", md: "center" },
                    }}
                  >
                    Add User
                  </Button>
                </Box>
                {isSmall ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {mobilePaginatedUsers.length > 0 ? (
                      mobilePaginatedUsers.map((user) => (
                        <Card key={user.id} sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              flexWrap: "wrap",
                            }}
                          >
                            <Avatar sx={{ width: 40, height: 40 }}>
                              {user.firstName?.[0] || "?"}
                              {user.lastName?.[0] || ""}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 160 }}>
                              <Typography variant="h6">{user.name}</Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {user.email}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  mt: 1,
                                  flexWrap: "wrap",
                                }}
                              >
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
                                    user.status === "Active"
                                      ? "success"
                                      : "error"
                                  }
                                  size="small"
                                />
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                                justifyContent: "flex-end",
                              }}
                            >
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
                      ))
                    ) : (
                      <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          No users found with the selected filters.
                        </Typography>
                      </Paper>
                    )}
                    {mobileTotalPages > 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 1,
                        }}
                      >
                        <Pagination
                          count={mobileTotalPages}
                          page={mobilePage}
                          onChange={(_, value) => setMobilePage(value)}
                          size="small"
                          color="primary"
                          showFirstButton
                          showLastButton
                        />
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ width: "100%", overflowX: "auto" }}>
                    <Box
                      sx={{
                        minWidth: 680,
                        borderRadius: 3,
                        border: (theme) =>
                          `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.18
                          )}`,
                        boxShadow: "0px 22px 48px rgba(15, 23, 42, 0.16)",
                        backgroundColor: (theme) =>
                          theme.palette.mode === "light"
                            ? theme.palette.background.paper
                            : alpha(theme.palette.background.paper, 0.9),
                        display: "flex",
                        flexDirection: "column",
                        minHeight: dataGridHeight,
                      }}
                    >
                      <DataGrid
                        rows={displayedUsers}
                        columns={columns}
                        showCellVerticalBorder
                        disableColumnResize
                        disableColumnFilter
                        disableColumnMenu
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 25]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        hideFooterSelectedRowCount
                        columnVisibilityModel={columnVisibilityModel}
                        sx={{
                          flexGrow: 1,
                          minWidth: 680,
                          border: 0,
                          "& .MuiDataGrid-columnHeaders": {
                            background: (theme) =>
                              `linear-gradient(135deg, ${alpha(
                                theme.palette.primary.main,
                                0.08
                              )} 0%, ${alpha(
                                theme.palette.primary.main,
                                0.18
                              )} 100%)`,
                            backdropFilter: "blur(6px)",
                            borderBottom: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.18
                              )}`,
                            color: (theme) => theme.palette.text.primary,
                            fontWeight: 600,
                          },
                          "& .MuiDataGrid-columnSeparator": {
                            color: (theme) =>
                              alpha(theme.palette.primary.main, 0.25),
                          },
                          "& .MuiDataGrid-cell": {
                            borderBottom: (theme) =>
                              `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                          },
                          "& .MuiDataGrid-cell:focus": {
                            outline: "none",
                          },
                          "& .MuiDataGrid-row:hover": {
                            backgroundColor: (theme) =>
                              alpha(theme.palette.primary.main, 0.06),
                          },
                          "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto",
                            overflowY: "auto",
                            backgroundColor: "transparent",
                          },
                          "& .MuiDataGrid-footerContainer": {
                            borderTop: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.18
                              )}`,
                            backgroundColor: (theme) =>
                              alpha(theme.palette.background.paper, 0.9),
                          },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Box>

      {/* User Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={(_event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          handleDialogClose();
        }}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: { xs: 3, sm: 4 },
            width: "100%",
            maxWidth: isSmall ? "92vw" : 720,
            maxHeight: isSmall ? "86vh" : "80vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0px 24px 48px rgba(15, 23, 42, 0.2)",
            backgroundImage: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          },
        }}
      >
        <DialogTitle
          sx={{
            position: "relative",
            px: { xs: 2.5, sm: 3 },
            py: { xs: 2, sm: 2.75 },
            background: dialogHeaderStyles.background,
            color: "common.white",
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {activeDialogMeta.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.85,
              maxWidth: 420,
              display: { xs: "none", sm: "block" },
            }}
          >
            {activeDialogMeta.subtitle}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              top: { xs: 10, sm: 12 },
              right: { xs: 10, sm: 12 },
              color: "common.white",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.24)",
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: { xs: 2.5, sm: 3 },
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(248, 250, 252, 0.96)"
                : theme.palette.background.paper,
            flex: 1,
            overflowY: "auto",
          }}
        >
          {dialogType === "view" && selectedUser && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, sm: 3 },
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(255, 255, 255, 0.92)"
                    : "rgba(15, 23, 42, 0.45)",
                p: { xs: 1.5, sm: 2.5 },
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "inset 0 1px 0 rgba(255, 255, 255, 0.65)"
                    : "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "minmax(0, 280px) 1fr",
                  },
                  gap: { xs: 2, md: 3 },
                  alignItems: "stretch",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      textAlign: "center",
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? "linear-gradient(180deg, rgba(227,242,253,0.9) 0%, rgba(187,222,251,0.9) 100%)"
                          : "linear-gradient(180deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.9) 100%)",
                      borderRadius: 2,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      boxShadow: "none",
                    }}
                  >
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      ID: #{selectedUser.id}
                    </Typography>
                  </Paper>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, md: 2 },
                  }}
                >
                  <Paper
                    sx={{
                      p: { xs: 1.5, sm: 2.5 },
                      borderRadius: 2,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgba(248, 250, 252, 0.85)"
                          : "rgba(15, 23, 42, 0.55)",
                      boxShadow: "none",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Account Details
                    </Typography>
                    <Divider sx={{ mt: 1.5, mb: { xs: 2, md: 2.5 } }} />
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(auto-fit, minmax(220px, 1fr))",
                        },
                        gap: { xs: 1.25, md: 2 },
                      }}
                    >
                      {selectedUserDetails.map((detail) => (
                        <Box
                          key={detail.label}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              textTransform: "uppercase",
                              letterSpacing: 0.6,
                            }}
                          >
                            {detail.label}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {detail.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          )}

          {(dialogType === "create" || dialogType === "edit") && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, sm: 2 },
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(255, 255, 255, 0.92)"
                    : "rgba(15, 23, 42, 0.45)",
                p: { xs: 1.5, sm: 2.5 },
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "inset 0 1px 0 rgba(255, 255, 255, 0.65)"
                    : "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
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
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3 },
            py: { xs: 2, sm: 2.5 },
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(255, 255, 255, 0.92)"
                : theme.palette.background.default,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            gap: 1,
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
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
