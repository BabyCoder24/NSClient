import React, { useMemo, useId, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  alpha,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type { CreateUserRequest } from "../../../models/user";

interface UserCreateDialogProps {
  open: boolean;
  formData: CreateUserRequest;
  onFormDataChange: (data: CreateUserRequest) => void;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => void;
  loading?: boolean;
}

const UserCreateDialog: React.FC<UserCreateDialogProps> = ({
  open,
  formData,
  onFormDataChange,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const titleId = useId();
  const roleLabelId = `${titleId}-role-label`;
  const roleSelectId = `${titleId}-role`;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleId, setRoleId] = useState(2);

  useEffect(() => {
    if (open) {
      setFirstName(formData.firstName || "");
      setLastName(formData.lastName || "");
      setUsername(formData.username || "");
      setEmail(formData.email || "");
      setCompanyName(formData.companyName || "");
      setRoleId(formData.roleId || 2);
    }
  }, [open, formData]);

  const firstNameError = useMemo(() => {
    return firstName.trim() ? "" : "First name is required";
  }, [firstName]);

  const lastNameError = useMemo(() => {
    return lastName.trim() ? "" : "Last name is required";
  }, [lastName]);

  const emailError = useMemo(() => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Invalid email format";
  }, [email]);

  const isDisabled = useMemo(
    () =>
      loading ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      Boolean(firstNameError) ||
      Boolean(lastNameError) ||
      Boolean(emailError),
    [
      loading,
      firstName,
      lastName,
      email,
      firstNameError,
      lastNameError,
      emailError,
    ]
  );

  const handleSubmit = () => {
    if (firstNameError || lastNameError || emailError) {
      return;
    }
    onSubmit({
      firstName,
      lastName,
      username,
      email,
      companyName,
      roleId,
    });
  };

  const handleClose = () => {
    onFormDataChange({
      firstName,
      lastName,
      username,
      email,
      companyName,
      roleId,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      fullScreen={isSmall}
      disableEscapeKeyDown
      aria-labelledby={titleId}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 4 },
            width: "100%",
            maxWidth: isSmall ? "100%" : 720,
            maxHeight: isSmall ? "100vh" : "80vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            boxShadow: "0px 32px 60px rgba(15, 23, 42, 0.35)",
            backgroundImage: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          },
        },
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        id={titleId}
        sx={{
          position: "relative",
          px: { xs: 2.5, sm: 3 },
          py: { xs: 2, sm: 2.75 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "common.white",
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          Create New User
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.85,
            maxWidth: 420,
            display: { xs: "none", sm: "block" },
          }}
        >
          Configure profile details and access permissions.
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              error={!!firstNameError}
              helperText={firstNameError || " "}
              id="create-first-name"
              name="first-name"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              error={!!lastNameError}
              helperText={lastNameError || " "}
              id="create-last-name"
              name="last-name"
            />
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="create-username"
              name="username"
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!!emailError}
              helperText={emailError || " "}
              id="create-email"
              name="email"
            />
            <TextField
              fullWidth
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              id="create-company-name"
              name="company-name"
            />
            <FormControl fullWidth>
              <InputLabel id={roleLabelId}>Role</InputLabel>
              <Select
                labelId={roleLabelId}
                id={roleSelectId}
                label="Role"
                value={roleId}
                onChange={(e) => setRoleId(Number(e.target.value))}
                inputProps={{ name: "role" }}
              >
                <MenuItem value={1}>Administrator</MenuItem>
                <MenuItem value={2}>Standard User</MenuItem>
              </Select>
              <FormHelperText>&nbsp;</FormHelperText>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(248, 250, 252, 0.96)"
              : theme.palette.background.paper,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          gap: 1.5,
        }}
      >
        <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isDisabled}
          sx={{ minWidth: 100 }}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserCreateDialog;
