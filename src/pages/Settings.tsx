import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LockResetIcon from "@mui/icons-material/LockReset";
import DevicesIcon from "@mui/icons-material/Devices";
import LogoutIcon from "@mui/icons-material/Logout";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store/store";
import { logoutUser } from "../store/authThunks";

type PreferenceKey =
  | "emailNotifications"
  | "smsNotifications"
  | "pushNotifications"
  | "darkMode"
  | "twoFactor";

const Settings: React.FC = () => {
  const { user, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";
  const avatarInitials = useMemo(() => {
    if (!user) {
      return "U";
    }
    return (
      `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
      "U"
    );
  }, [user]);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    username: user?.username ?? "",
    companyName: user?.companyName ?? "",
  });

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      username: user?.username ?? "",
      companyName: user?.companyName ?? "",
    });
  }, [user]);

  const [profileSaving, setProfileSaving] = useState(false);
  const handleProfileInputChange =
    (field: keyof typeof profileForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleProfileSave = () => {
    setProfileSaving(true);
    window.setTimeout(() => setProfileSaving(false), 900);
  };

  const [preferences, setPreferences] = useState<
    Record<PreferenceKey, boolean>
  >({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    darkMode: false,
    twoFactor: true,
  });

  const handlePreferenceToggle =
    (key: PreferenceKey) =>
    (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setPreferences((prev) => ({ ...prev, [key]: checked }));
    };

  const activeSessions = useMemo(
    () => [
      {
        id: 1,
        device: "MacBook Pro",
        location: "Lagos, Nigeria",
        lastActive: "2 minutes ago",
        current: true,
      },
      {
        id: 2,
        device: "iPhone 15",
        location: "Abuja, Nigeria",
        lastActive: "1 hour ago",
        current: false,
      },
      {
        id: 3,
        device: "Windows Desktop",
        location: "London, UK",
        lastActive: "Yesterday",
        current: false,
      },
    ],
    []
  );

  const handleLogout = async () => {
    await dispatch(logoutUser());
    // Defer navigation to ensure Redux state is committed
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 0);
  };

  const lastLoginLabel = user ? "Moments ago" : "Just now";

  return (
    <Stack spacing={4} sx={{ width: "100%" }}>
      <Card
        sx={{
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 90%)`,
          color: "common.white",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "common.white",
                  color: "primary.main",
                }}
              >
                {avatarInitials}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {displayName}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {user?.email || "user@example.com"}
                </Typography>
                <Chip
                  sx={{
                    mt: 1,
                    color: "common.white",
                    borderColor: "rgba(255,255,255,0.6)",
                  }}
                  variant="outlined"
                  label={role ?? "User"}
                />
              </Box>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              ml={{ md: "auto" }}
            >
              <Button
                variant="contained"
                color="secondary"
                startIcon={<NotificationsActiveIcon />}
                sx={{ color: "common.white" }}
              >
                Enable Alerts
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<PersonIcon />}
              >
                Update Avatar
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.35)" }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Account Plan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Enterprise
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Last Active
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {lastLoginLabel}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Status
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {user?.isActive ? (
                  <CheckCircleIcon fontSize="small" />
                ) : (
                  <CancelIcon fontSize="small" sx={{ color: "error.main" }} />
                )}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {user?.isActive ? "Active" : "Inactive"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Profile Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Keep your personal details up to date so your teammates can
                    recognize you.
                  </Typography>
                </Box>
                <Divider />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileForm.firstName}
                      onChange={handleProfileInputChange("firstName")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileForm.lastName}
                      onChange={handleProfileInputChange("lastName")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profileForm.email}
                      onChange={handleProfileInputChange("email")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={profileForm.username}
                      onChange={handleProfileInputChange("username")}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={profileForm.companyName}
                      onChange={handleProfileInputChange("companyName")}
                    />
                  </Grid>
                </Grid>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  justifyContent="flex-end"
                >
                  <Button variant="text" color="inherit">
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                  >
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Preferences
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customize how and when we contact you.
                  </Typography>
                </Box>
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.emailNotifications}
                      onChange={handlePreferenceToggle("emailNotifications")}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.smsNotifications}
                      onChange={handlePreferenceToggle("smsNotifications")}
                    />
                  }
                  label="SMS Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.pushNotifications}
                      onChange={handlePreferenceToggle("pushNotifications")}
                    />
                  }
                  label="In-app Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.darkMode}
                      onChange={handlePreferenceToggle("darkMode")}
                    />
                  }
                  label="Dark Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.twoFactor}
                      onChange={handlePreferenceToggle("twoFactor")}
                    />
                  }
                  label="Two-Factor Authentication"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Security
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage authentication and account safety.
                  </Typography>
                </Box>
                <Divider />
                <List dense>
                  <ListItem disableGutters sx={{ py: 1 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <LockResetIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Update Password"
                      secondary="Last changed 45 days ago"
                    />
                    <Button variant="text">Change</Button>
                  </ListItem>
                  <ListItem disableGutters sx={{ py: 1 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <ShieldOutlinedIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Two-factor"
                      secondary={
                        preferences.twoFactor ? "Enabled for email" : "Disabled"
                      }
                    />
                    <Chip
                      color={preferences.twoFactor ? "success" : "default"}
                      label={preferences.twoFactor ? "On" : "Off"}
                      size="small"
                    />
                  </ListItem>
                </List>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    variant="outlined"
                    startIcon={<DevicesIcon />}
                    sx={{ flex: 1 }}
                  >
                    Sign out other devices
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ flex: 1 }}
                  >
                    Sign out
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Active Sessions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review devices that recently accessed your account.
                  </Typography>
                </Box>
                <Divider />
                <List dense>
                  {activeSessions.map((session) => (
                    <ListItem key={session.id} disableGutters sx={{ py: 1.25 }}>
                      <ListItemAvatar>
                        <Avatar>
                          <DevicesIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={session.device}
                        secondary={`${session.location} · ${session.lastActive}`}
                      />
                      {session.current ? (
                        <Chip label="Current" color="primary" size="small" />
                      ) : (
                        <Button variant="text" size="small">
                          Revoke
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Settings;
