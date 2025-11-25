import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { logoutUser } from "../store/authThunks";
import DashboardLayout from "../components/DashboardLayout";
import AppTheme from "../shared-theme/AppTheme";
import AdminSidebarNavigation from "../components/adminDashboard/AdminSidebarNavigation";
import AdminSidebarFooter from "../components/adminDashboard/AdminSidebarFooter";
import ManageUsers from "./ManageUsers";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import PageContainer from "../components/PageContainer";
import {
  ADMIN_DASHBOARD_OVERVIEW_PATH,
  ADMIN_DASHBOARD_SETTINGS_PATH,
} from "../constants";

const AdminDashboard: React.FC = () => {
  const { user, accessToken, role } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";
  const avatarInitials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
      "U"
    : "U";
  const roleLabel = role || "Administrator";

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate(ADMIN_DASHBOARD_SETTINGS_PATH);
    handleMenuClose();
  };

  const headerActions = (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "right",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, lineHeight: 1.2, color: "white" }}
        >
          {displayName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {roleLabel}
        </Typography>
      </Box>
      <Tooltip title="Account settings">
        <IconButton
          color="inherit"
          aria-label="account settings"
          onClick={handleMenuOpen}
          size="small"
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: 14,
            }}
          >
            {avatarInitials}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="admin-dashboard-user-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              minWidth: 200,
              boxShadow: (theme) => theme.shadows[8],
            },
          },
        }}
      >
        <MenuItem onClick={handleSettings}>
          <SettingsIcon fontSize="small" style={{ marginRight: 8 }} />
          Settings
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </Stack>
  );

  return (
    <AppTheme>
      <Box sx={{ height: "100%" }}>
        <Routes>
          <Route
            element={
              <DashboardLayout
                // title="NSolutions"
                headerActions={headerActions}
                sidebarNavigation={<AdminSidebarNavigation />}
                sidebarFooter={<AdminSidebarFooter isOnline={!!accessToken} />}
              />
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route
              path="settings"
              element={
                <PageContainer
                  title="Settings"
                  maxWidth="xl"
                  breadcrumbs={[
                    {
                      title: "Admin Dashboard",
                      path: ADMIN_DASHBOARD_OVERVIEW_PATH,
                    },
                    { title: "Settings" },
                  ]}
                >
                  <Stack spacing={4} sx={{ my: 0 }}>
                    <Settings />
                  </Stack>
                </PageContainer>
              }
            />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Route>
        </Routes>
      </Box>
    </AppTheme>
  );
};

export default React.memo(AdminDashboard);
