import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { Settings as SettingsIcon, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { logoutUser } from "../store/authThunks";
import { fetchUsers } from "../store/userSlice";
import PageContainer from "../components/PageContainer";
import { printUtility, type PrintColumn } from "../utilities/printUtility";
import axios from "axios";
import Loading from "../components/Loading";

// New imports for refactored components and hooks
import StatsCards from "../components/ManageUsers/StatsCards";
import UserFilters from "../components/ManageUsers/UserFilters";
import UserDataGrid from "../components/ManageUsers/UserDataGrid";
import UserViewDialog from "../components/ManageUsers/dialogs/UserViewDialog";
import UserCreateDialog from "../components/ManageUsers/dialogs/UserCreateDialog";
import UserEditDialog from "../components/ManageUsers/dialogs/UserEditDialog";
import UserDeleteDialog from "../components/ManageUsers/dialogs/UserDeleteDialog";
import UserResetDialog from "../components/ManageUsers/dialogs/UserResetDialog";
import UserResendDialog from "../components/ManageUsers/dialogs/UserResendDialog";
import { useUserData } from "../hooks/users/useUserData";
import { useUserFilters } from "../hooks/users/useUserFilters";
import { useUserDialogs } from "../hooks/users/useUserDialogs";
import type { CreateUserRequest, UpdateUserRequest } from "../models/user";

const ManageUsers: React.FC = () => {
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // State for DataGrid
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<any[]>([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Loading states for print and export operations
  const [printLoading, setPrintLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Trigger refetch function
  const triggerRefetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  // Use custom hooks
  const {
    filters,
    filterModel,
    handleFilterChange,
    handleFilterModelChange,
    handleSearch,
    handleClearFilters,
  } = useUserFilters({
    onSearch: triggerRefetch,
  });
  const {
    dataGridRows,
    dataGridRowCount,
    loading: dataLoading,
  } = useUserData({
    filters,
    paginationModel,
    sortModel,
    filterModel,
    refetchTrigger,
  });

  const {
    dialogOpen,
    dialogType,
    selectedUser,
    formData,
    hasChanges,
    loadingCreate,
    loadingEdit,
    loadingDelete,
    loadingReset,
    loadingResend,
    handleView,
    handleCreate,
    handleEdit,
    handleDelete,
    handlePasswordReset,
    handleResendVerification,
    handleDialogClose,
    handleFormSubmit,
    setFormData,
  } = useUserDialogs(setSnackbar, triggerRefetch);

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
    handleClose();
    await dispatch(logoutUser());
    // Defer navigation to ensure Redux state is committed
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 0);
  };

  const handleSettings = () => {
    navigate("/settings");
    handleClose();
  };

  const handlePrint = () => {
    setPrintLoading(true);
    try {
      const printColumns: PrintColumn[] = [
        { field: "firstName", headerName: "First Name" },
        { field: "lastName", headerName: "Last Name" },
        { field: "username", headerName: "Username" },
        { field: "email", headerName: "Email" },
        { field: "roleName", headerName: "Role" },
        { field: "isVerified", headerName: "Verified" },
        { field: "isActive", headerName: "Active" },
        { field: "createdAt", headerName: "Created At" },
        { field: "updatedAt", headerName: "Updated At" },
      ];

      const formatCell = (value: any, field: string): React.ReactNode => {
        if (field === "isActive" || field === "isVerified") {
          return value ? "Yes" : "No";
        }
        if (field === "createdAt" || field === "updatedAt") {
          return value ? new Date(value).toLocaleString() : "N/A";
        }
        return value;
      };

      printUtility({
        title: "User Report",
        columns: printColumns,
        rows: users,
        appName: "NS Solutions",
        documentTitle: "Users List",
        extraStyles: "@page { size: A4 landscape; }",
        formatCell,
      });
    } finally {
      setPrintLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setExcelLoading(true);
    try {
      const params = new URLSearchParams();

      // Add pagination - for export, get all records
      params.append("take", "10000");

      // Add sorting
      if (sortModel.length > 0) {
        sortModel.forEach((sort) => {
          const field =
            sort.field.charAt(0).toUpperCase() + sort.field.slice(1);
          params.append("sort[field]", field);
          params.append("sort[dir]", sort.sort || "asc");
        });
      }

      // Add custom filters
      if (filters.firstName) params.append("FirstName", filters.firstName);
      if (filters.lastName) params.append("LastName", filters.lastName);
      if (filters.email) params.append("Email", filters.email);
      if (filters.role !== "All")
        params.append("RoleId", filters.role === "Administrator" ? "1" : "2");
      if (filters.isVerified !== "All")
        params.append(
          "IsVerified",
          filters.isVerified === "Verified" ? "true" : "false"
        );
      if (filters.isActive !== "All")
        params.append(
          "IsActive",
          filters.isActive === "Active" ? "true" : "false"
        );
      if (filters.createdAt) params.append("CreatedAt", filters.createdAt);
      if (filters.updatedAt) params.append("UpdatedAt", filters.updatedAt);

      const response = await axios.get(
        `/User/export/excel?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export Excel failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to export Excel file.",
        severity: "error",
      });
    } finally {
      setExcelLoading(false);
    }
  };

  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
      const params = new URLSearchParams();

      // Add pagination - for export, get all records
      params.append("take", "10000");

      // Add sorting
      if (sortModel.length > 0) {
        sortModel.forEach((sort) => {
          const field =
            sort.field.charAt(0).toUpperCase() + sort.field.slice(1);
          params.append("sort[field]", field);
          params.append("sort[dir]", sort.sort || "asc");
        });
      }

      // Add custom filters
      if (filters.firstName) params.append("FirstName", filters.firstName);
      if (filters.lastName) params.append("LastName", filters.lastName);
      if (filters.email) params.append("Email", filters.email);
      if (filters.role !== "All")
        params.append("RoleId", filters.role === "Administrator" ? "1" : "2");
      if (filters.isVerified !== "All")
        params.append(
          "IsVerified",
          filters.isVerified === "Verified" ? "true" : "false"
        );
      if (filters.isActive !== "All")
        params.append(
          "IsActive",
          filters.isActive === "Active" ? "true" : "false"
        );
      if (filters.createdAt) params.append("CreatedAt", filters.createdAt);
      if (filters.updatedAt) params.append("UpdatedAt", filters.updatedAt);

      const response = await axios.get(
        `/User/export/pdf?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export PDF failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to export PDF file.",
        severity: "error",
      });
    } finally {
      setPdfLoading(false);
    }
  };

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
        {loading ? (
          <Loading />
        ) : (
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
                  Manage user accounts, roles, and permissions across the
                  system.
                </Typography>
              </Box>
            </Box>

            {/* Stats Cards */}
            <StatsCards />

            {/* Filters */}
            <UserFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              onClearFilters={handleClearFilters}
            />

            <UserDataGrid
              data={dataGridRows}
              rowCount={dataGridRowCount}
              loading={dataLoading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onSortModelChange={setSortModel}
              onFilterModelChange={handleFilterModelChange}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPasswordReset={handlePasswordReset}
              onResendVerification={handleResendVerification}
              onCreate={handleCreate}
              printLoading={printLoading}
              excelLoading={excelLoading}
              pdfLoading={pdfLoading}
              onExportExcel={handleExportExcel}
              onExportPdf={handleExportPdf}
              onPrint={handlePrint}
            />
          </Stack>
        )}
      </PageContainer>

      {/* Dialogs */}
      <UserViewDialog
        open={dialogOpen && dialogType === "view"}
        user={selectedUser}
        onClose={handleDialogClose}
      />
      <UserCreateDialog
        open={dialogOpen && dialogType === "create"}
        formData={formData as CreateUserRequest}
        onFormDataChange={setFormData}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
        loading={loadingCreate}
      />
      <UserEditDialog
        open={dialogOpen && dialogType === "edit"}
        formData={formData as UpdateUserRequest}
        onFormDataChange={setFormData}
        hasChanges={hasChanges}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
        loading={loadingEdit}
      />
      <UserDeleteDialog
        open={dialogOpen && dialogType === "delete"}
        user={selectedUser}
        onClose={handleDialogClose}
        onConfirm={handleFormSubmit}
        loading={loadingDelete}
      />
      <UserResetDialog
        open={dialogOpen && dialogType === "reset"}
        user={selectedUser}
        onClose={handleDialogClose}
        onConfirm={handleFormSubmit}
        loading={loadingReset}
      />
      <UserResendDialog
        open={dialogOpen && dialogType === "resendVerification"}
        user={selectedUser}
        onClose={handleDialogClose}
        onConfirm={handleFormSubmit}
        loading={loadingResend}
      />

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
