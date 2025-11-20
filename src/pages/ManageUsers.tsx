import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
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
  Avatar,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
  Pagination,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
  type GridRowParams,
  type GridSortModel,
  type GridFilterModel,
} from "@mui/x-data-grid";
import { alpha } from "@mui/material/styles";
import {
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout,
  Add,
  Edit,
  Delete,
  Visibility,
  LockReset,
  Work,
  CheckCircle,
  Cancel,
  Save,
  Close,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { logoutUser } from "../store/authThunks";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  adminResetPassword,
} from "../store/userSlice";
import UserService from "../services/userService";
import PageContainer from "../components/PageContainer";

const MOBILE_PAGE_SIZE = 5;
const DATA_GRID_ROW_HEIGHT = 56;
const DATA_GRID_ROW_HEIGHT_COMPACT = 48;
const DATA_GRID_HEADER_HEIGHT = 56;
const DATA_GRID_HEADER_HEIGHT_COMPACT = 52;
const DATA_GRID_FOOTER_HEIGHT = 52;
const DATA_GRID_MIN_HEIGHT = 360;

type DialogType = "view" | "create" | "edit" | "delete" | "reset";

const ManageUsers: React.FC = () => {
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("view");
  const [formData, setFormData] = useState<any>({});
  const [initialFormData, setInitialFormData] = useState<any>({});
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "All",
    isVerified: "All",
  });
  const [mobilePage, setMobilePage] = useState(1);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [dataGridRows, setDataGridRows] = useState<User[]>([]);
  const [dataGridRowCount, setDataGridRowCount] = useState(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const filterUsers = useCallback(
    (list: User[]) =>
      list.filter(
        (user) =>
          (filters.firstName === "" ||
            user.firstName
              .toLowerCase()
              .includes(filters.firstName.toLowerCase())) &&
          (filters.lastName === "" ||
            user.lastName
              .toLowerCase()
              .includes(filters.lastName.toLowerCase())) &&
          (filters.email === "" ||
            user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
          (filters.role === "All" || user.roleName === filters.role) &&
          (filters.isVerified === "All" ||
            (user.isVerified ? "Verified" : "Unverified") ===
              filters.isVerified)
      ),
    [filters]
  );

  const displayedUsers = useMemo(
    () => filterUsers(users),
    [users, filterUsers]
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

  const gridRowHeight = isTablet
    ? DATA_GRID_ROW_HEIGHT_COMPACT
    : DATA_GRID_ROW_HEIGHT;
  const gridHeaderHeight = isTablet
    ? DATA_GRID_HEADER_HEIGHT_COMPACT
    : DATA_GRID_HEADER_HEIGHT;
  const showQuickFilter = !isSmall;
  const gridContainerMinWidth = isTablet ? "100%" : "auto";

  const visibleRowCount = useMemo(() => {
    if (displayedUsers.length === 0) {
      return 0;
    }
    const startIndex = paginationModel.page * paginationModel.pageSize;
    const remaining = displayedUsers.length - startIndex;
    return Math.max(0, Math.min(paginationModel.pageSize, remaining));
  }, [displayedUsers.length, paginationModel]);

  const dataGridHeight = useMemo(() => {
    const rowsHeight = visibleRowCount * gridRowHeight;
    return Math.max(
      DATA_GRID_MIN_HEIGHT,
      gridHeaderHeight + DATA_GRID_FOOTER_HEIGHT + rowsHeight
    );
  }, [gridHeaderHeight, gridRowHeight, visibleRowCount]);

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

  const firstNameError = useMemo(() => {
    return formData.firstName?.trim() ? "" : "First name is required";
  }, [formData.firstName]);

  const lastNameError = useMemo(() => {
    return formData.lastName?.trim() ? "" : "Last name is required";
  }, [formData.lastName]);

  const emailError = useMemo(() => {
    if (!formData.email?.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email) ? "" : "Invalid email format";
  }, [formData.email]);

  const isFormValid = useMemo(() => {
    if (dialogType === "create" || dialogType === "edit") {
      return !firstNameError && !lastNameError && !emailError;
    }
    return true;
  }, [dialogType, firstNameError, lastNameError, emailError]);

  const hasChanges = useMemo(() => {
    if (dialogType === "create") return true;
    if (dialogType === "edit") {
      return (
        initialFormData.firstName !== formData.firstName ||
        initialFormData.lastName !== formData.lastName ||
        initialFormData.username !== formData.username ||
        initialFormData.email !== formData.email ||
        initialFormData.companyName !== formData.companyName ||
        initialFormData.roleId !== formData.roleId
      );
    }
    return false;
  }, [dialogType, initialFormData, formData]);

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
            { label: "Username", value: selectedUser.username },
            { label: "Email", value: selectedUser.email },
            {
              label: "Company",
              value: selectedUser.companyName || "Not provided",
            },
            { label: "Role", value: selectedUser.roleName || "N/A" },
            {
              label: "Status",
              value: selectedUser.isVerified ? "Verified" : "Unverified",
            },
            {
              label: "Created At",
              value: new Date(selectedUser.createdAt).toLocaleDateString(),
            },
            {
              label: "Updated At",
              value: selectedUser.updatedAt
                ? new Date(selectedUser.updatedAt).toLocaleDateString()
                : "N/A",
            },
          ]
        : [],
    [selectedUser]
  );

  const columnVisibilityModel = useMemo(() => {
    if (isSmall) {
      return {
        id: false,
        firstName: true,
        lastName: true,
        username: false,
        email: false,
        roleName: false,
        isVerified: true,
        createdAt: false,
        updatedAt: false,
      };
    }

    if (isTablet) {
      return {
        id: true,
        firstName: true,
        lastName: true,
        username: false,
        email: false,
        roleName: true,
        isVerified: true,
        createdAt: false,
        updatedAt: false,
      };
    }

    return {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      roleName: true,
      isVerified: true,
      createdAt: true,
      updatedAt: false,
    };
  }, [isSmall, isTablet]);

  const gridPageSizeOptions = useMemo(
    () => (isTablet ? [5, 10, 25] : [10, 25, 50]),
    [isTablet]
  );
  const gridDensity = isTablet ? "compact" : "standard";
  const gridContainerMinHeight = dataGridHeight;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: "error" });
    }
  }, [error]);

  const handleClose = () => {
    setAnchorEl(null);
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

  const handleClearFilters = () => {
    setFilters({
      firstName: "",
      lastName: "",
      email: "",
      role: "All",
      isVerified: "All",
    });
    setFilterModel({ items: [] });
    setMobilePage(1);
  };

  const handleSearch = () => {
    const items = [];
    if (filters.firstName)
      items.push({
        field: "firstName",
        operator: "contains",
        value: filters.firstName,
      });
    if (filters.lastName)
      items.push({
        field: "lastName",
        operator: "contains",
        value: filters.lastName,
      });
    if (filters.email)
      items.push({
        field: "email",
        operator: "contains",
        value: filters.email,
      });
    if (filters.role && filters.role !== "All")
      items.push({
        field: "roleName",
        operator: "contains",
        value: filters.role,
      });
    if (filters.isVerified && filters.isVerified !== "All") {
      const value = filters.isVerified === "Verified" ? "true" : "false";
      items.push({ field: "isVerified", operator: "equals", value });
    }
    setFilterModel({ items });
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDialogType("view");
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      username: "",
      email: "",
      roleId: 2,
    });
    setDialogType("create");
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    const data = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      roleId: user.roleId,
    };
    setFormData(data);
    setInitialFormData(data);
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
    setInitialFormData({});
  };

  const fetchData = useCallback(async () => {
    try {
      const params: Record<string, any> = {
        skip: paginationModel.page * paginationModel.pageSize,
        take: paginationModel.pageSize,
      };

      // Add sorting
      if (sortModel.length > 0) {
        sortModel.forEach((sort) => {
          const field =
            sort.field.charAt(0).toUpperCase() + sort.field.slice(1);
          params[`sort[field]`] = field;
          params[`sort[dir]`] = sort.sort;
        });
      }

      // Add filtering
      if (filterModel.items.length > 0) {
        filterModel.items.forEach((filter) => {
          const field =
            filter.field.charAt(0).toUpperCase() + filter.field.slice(1);
          params[field] = filter.value;
        });
      }

      const response = await UserService.findByQuery(params);
      setDataGridRows(response.records || []);
      setDataGridRowCount(response.recordCount || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbar({
        open: true,
        message: "Failed to load users. Please try again.",
        severity: "error",
      });
    }
  }, [paginationModel, sortModel, filterModel, refetchTrigger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSubmit = async () => {
    if (dialogType === "create") {
      if (!isFormValid) {
        setSnackbar({
          open: true,
          message:
            "Please resolve the highlighted validation errors before creating the user.",
          severity: "error",
        });
        return;
      }
      try {
        const result = await dispatch(
          createUser(formData as CreateUserRequest)
        ).unwrap();
        setRefetchTrigger((prev) => prev + 1);
        setSnackbar({
          open: true,
          message:
            (result as any).message ||
            "User created successfully. A set-password email has been sent to the user's email address.",
          severity: "success",
        });
        dispatch(fetchUsers());
        handleDialogClose();
      } catch (err: unknown) {
        const errorMessage =
          (err as any)?.message || "Failed to create user. Please try again.";
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
      return;
    } else if (dialogType === "edit" && selectedUser) {
      if (!isFormValid) {
        setSnackbar({
          open: true,
          message:
            "Please resolve the highlighted validation errors before saving changes.",
          severity: "error",
        });
        return;
      }
      try {
        await dispatch(updateUser(formData as UpdateUserRequest)).unwrap();
        setRefetchTrigger((prev) => prev + 1);
        setSnackbar({
          open: true,
          message: "User updated successfully.",
          severity: "success",
        });
        dispatch(fetchUsers());
        handleDialogClose();
        return;
      } catch (err: unknown) {
        const errorMessage =
          (err as any)?.message || "Failed to update user. Please try again.";
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
        return;
      }
    } else if (dialogType === "delete" && selectedUser) {
      try {
        const result = await dispatch(deleteUser(selectedUser.id)).unwrap();
        setRefetchTrigger((prev) => prev + 1);
        setSnackbar({
          open: true,
          message: result.message || "User deleted successfully.",
          severity: "success",
        });
        dispatch(fetchUsers());
        handleDialogClose();
      } catch (err: unknown) {
        const errorMessage = (err as any)?.message || "Failed to delete user.";
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    } else if (dialogType === "reset" && selectedUser) {
      try {
        const result = await dispatch(
          adminResetPassword(selectedUser.id)
        ).unwrap();
        setRefetchTrigger((prev) => prev + 1);
        setSnackbar({
          open: true,
          message:
            (result as any)?.message ||
            "Password reset email sent successfully.",
          severity: "success",
        });
        dispatch(fetchUsers());
        handleDialogClose();
      } catch (err: unknown) {
        const errorMessage =
          (err as any)?.message || "Failed to send reset email.";
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 60,
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "username",
      headerName: "Username",
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
      field: "roleName",
      headerName: "Role",
      flex: 0,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          color={params.value === "Administrator" ? "error" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "isVerified",
      headerName: "Status",
      flex: 0,
      minWidth: 80,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Verified" : "Unverified"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "N/A",
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

  return (
    <>
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

      <PageContainer
        title="User Management"
        maxWidth="xl"
        breadcrumbs={[
          { title: "Admin Dashboard", path: "/admin-dashboard/overview" },
          { title: "Manage Users" },
        ]}
      >
        <Stack spacing={4}>
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              borderRadius: 3,
              p: { xs: 1.5, sm: 2, md: 3 },
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
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, typography: { xs: "h5", md: "h4" } }}
              >
                User Management
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Manage user accounts, roles, and permissions across the system.
              </Typography>
            </Box>
          </Box>

          {/* Stats Cards - Using CSS Grid for responsive layout */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: { xs: 2, sm: 3, md: 4 },
              alignItems: "stretch",
            }}
          >
            <Card
              sx={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
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
                background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
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
                      {users.filter((u) => u.isVerified).length}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      Verified Users
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card
              sx={{
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
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
                      {
                        users.filter((u) => u.roleName === "Administrator")
                          .length
                      }
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
                background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
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
                      {users.filter((u) => !u.isVerified).length}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      Unverified Users
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Filters Card */}
          <Card
            sx={{
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
                  User Filters
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Quickly narrow down users by name, role, or status.
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
                    label="First Name"
                    value={filters.firstName}
                    onChange={(e) =>
                      handleFilterChange("firstName", e.target.value)
                    }
                    sx={{ minWidth: 0 }}
                    id="filter-first-name"
                    name="first-name"
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={filters.lastName}
                    onChange={(e) =>
                      handleFilterChange("lastName", e.target.value)
                    }
                    sx={{ minWidth: 0 }}
                    id="filter-last-name"
                    name="last-name"
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
                    onChange={(e) => handleFilterChange("role", e.target.value)}
                    sx={{ minWidth: 0 }}
                    id="filter-role"
                    name="filter-role"
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Administrator">Administrator</MenuItem>
                    <MenuItem value="Standard User">Standard User</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={filters.isVerified}
                    onChange={(e) =>
                      handleFilterChange("isVerified", e.target.value)
                    }
                    sx={{ minWidth: 0 }}
                    id="filter-is-verified"
                    name="filter-is-verified"
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Verified">Verified</MenuItem>
                    <MenuItem value="Unverified">Unverified</MenuItem>
                  </TextField>
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
                    onClick={handleSearch}
                    sx={{
                      minWidth: 140,
                      borderRadius: 999,
                      px: 3,
                    }}
                  >
                    Search
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
                    minWidth: { md: 160 },
                    alignSelf: { xs: "stretch", md: "center" },
                  }}
                >
                  Add User
                </Button>
              </Box>
              {isSmall ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                            <Typography variant="h6">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
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
                                label={user.roleName || "N/A"}
                                color={
                                  user.roleName === "Administrator"
                                    ? "error"
                                    : "default"
                                }
                                size="small"
                              />
                              <Chip
                                label={
                                  user.isVerified ? "Verified" : "Unverified"
                                }
                                color={user.isVerified ? "success" : "error"}
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
                      minWidth: gridContainerMinWidth,
                      borderRadius: 3,
                      border: (theme) =>
                        `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                      boxShadow: "0px 22px 48px rgba(15, 23, 42, 0.16)",
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? theme.palette.background.paper
                          : alpha(theme.palette.background.paper, 0.9),
                      display: "flex",
                      flexDirection: "column",
                      minHeight: gridContainerMinHeight,
                      height: gridContainerMinHeight,
                    }}
                  >
                    <DataGrid
                      rows={dataGridRows}
                      columns={columns}
                      density={gridDensity}
                      rowHeight={gridRowHeight}
                      columnHeaderHeight={gridHeaderHeight}
                      showCellVerticalBorder
                      // disableColumnResize
                      disableColumnFilter
                      disableColumnMenu
                      paginationMode="server"
                      sortingMode="server"
                      filterMode="server"
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      sortModel={sortModel}
                      onSortModelChange={setSortModel}
                      filterModel={filterModel}
                      onFilterModelChange={setFilterModel}
                      rowCount={dataGridRowCount}
                      pageSizeOptions={gridPageSizeOptions}
                      disableRowSelectionOnClick
                      // hideFooterSelectedRowCount
                      columnVisibilityModel={columnVisibilityModel}
                      loading={loading}
                      // showToolbar={showToolbar}
                      slotProps={{
                        toolbar: {
                          showQuickFilter,
                          quickFilterProps: { debounceMs: 300 },
                        },
                      }}
                      sx={(theme) => ({
                        flexGrow: 1,
                        width: "100%",
                        border: 0,
                        "& .MuiDataGrid-columnHeaders": {
                          background: `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.08
                          )} 0%, ${alpha(
                            theme.palette.primary.main,
                            0.18
                          )} 100%)`,
                          backdropFilter: "blur(6px)",
                          borderBottom: `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.18
                          )}`,
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          fontSize: "0.95rem",
                          [theme.breakpoints.down("lg")]: {
                            fontSize: "0.85rem",
                          },
                        },
                        "& .MuiDataGrid-columnSeparator": {
                          color: alpha(theme.palette.primary.main, 0.25),
                        },
                        "& .MuiDataGrid-cell": {
                          borderBottom: `1px solid ${alpha(
                            theme.palette.divider,
                            0.6
                          )}`,
                          fontSize: "0.95rem",
                          paddingBlock: theme.spacing(1.25),
                          [theme.breakpoints.down("lg")]: {
                            fontSize: "0.85rem",
                            paddingBlock: theme.spacing(0.75),
                          },
                        },
                        "& .MuiDataGrid-cell:focus": {
                          outline: "none",
                        },
                        "& .MuiDataGrid-row:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.06
                          ),
                        },
                        "& .MuiDataGrid-virtualScroller": {
                          overflowX: "auto",
                          overflowY: "auto",
                          backgroundColor: "transparent",
                        },
                        "& .MuiDataGrid-footerContainer": {
                          borderTop: `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.18
                          )}`,
                          backgroundColor: alpha(
                            theme.palette.background.paper,
                            0.9
                          ),
                          "& .MuiTablePagination-displayedRows": {
                            fontSize: "0.85rem",
                          },
                        },
                      })}
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      </PageContainer>

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
        fullScreen={isSmall}
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
                      label={selectedUser.roleName || "N/A"}
                      color={
                        selectedUser.roleName === "Administrator"
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
              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              >
                Account Details
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: { xs: 1, sm: 2 },
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
                  error={!!firstNameError}
                  helperText={firstNameError || " "}
                  id="form-first-name"
                  name="first-name"
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  error={!!lastNameError}
                  helperText={lastNameError || " "}
                  id="form-last-name"
                  name="last-name"
                />
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  // required
                  id="form-username"
                  name="username"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  error={!!emailError}
                  helperText={emailError || " "}
                  id="form-email"
                  name="email"
                  sx={{
                    gridColumn: {
                      xs: "span 1",
                      sm: "span 2",
                      md: "span 3",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.companyName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  id="form-company-name"
                  name="company-name"
                  sx={{
                    gridColumn: {
                      xs: "span 1",
                      sm: "span 2",
                      md: "span 3",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  select
                  label="Role"
                  value={formData.roleId || 2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roleId: Number(e.target.value),
                    })
                  }
                  id="form-role-id"
                  name="role-id"
                >
                  <MenuItem value={1}>Administrator</MenuItem>
                  <MenuItem value={2}>Standard User</MenuItem>
                </TextField>
                {dialogType === "edit" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gridColumn: {
                        xs: "span 1",
                        sm: "span 2",
                        md: "span 3",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isVerified || false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isVerified: e.target.checked,
                            })
                          }
                          disabled
                        />
                      }
                      label="Verified"
                    />
                  </Box>
                )}
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
              disabled={
                loading ||
                ((dialogType === "create" || dialogType === "edit") &&
                  (!isFormValid || (dialogType === "edit" && !hasChanges)))
              }
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                (dialogType === "create" && "Create User") ||
                (dialogType === "edit" && "Save Changes") ||
                (dialogType === "delete" && "Delete User") ||
                (dialogType === "reset" && "Send Reset Email")
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ManageUsers;
