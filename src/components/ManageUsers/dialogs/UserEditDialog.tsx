import React, { useMemo, useId, useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  useTheme,
  useMediaQuery,
  IconButton,
  alpha,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type { UpdateUserRequest } from "../../../models/user";

interface UserEditDialogProps {
  open: boolean;
  formData: UpdateUserRequest;
  initialFormData: UpdateUserRequest;
  onFormDataChange: (data: UpdateUserRequest) => void;
  onClose: () => void;
  onSubmit: (data: UpdateUserRequest) => void;
  loading?: boolean;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({
  open,
  formData,
  initialFormData,
  onFormDataChange,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const titleId = useId();
  const roleLabelId = useId();

  const [localFormData, setLocalFormData] =
    useState<UpdateUserRequest>(formData);

  useEffect(() => {
    if (open) {
      setLocalFormData(formData);
    }
  }, [open, formData]);

  const localHasChanges = useMemo(() => {
    return (
      initialFormData.firstName !== localFormData.firstName ||
      initialFormData.lastName !== localFormData.lastName ||
      initialFormData.username !== localFormData.username ||
      initialFormData.email !== localFormData.email ||
      initialFormData.companyName !== localFormData.companyName ||
      initialFormData.roleId !== localFormData.roleId ||
      initialFormData.isActive !== localFormData.isActive
    );
  }, [initialFormData, localFormData]);

  const handleFirstNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalFormData((prev) => ({ ...prev, firstName: e.target.value }));
    },
    []
  );

  const handleLastNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalFormData((prev) => ({ ...prev, lastName: e.target.value }));
    },
    []
  );

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalFormData((prev) => ({ ...prev, username: e.target.value }));
    },
    []
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalFormData((prev) => ({ ...prev, email: e.target.value }));
    },
    []
  );

  const handleCompanyNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalFormData((prev) => ({ ...prev, companyName: e.target.value }));
    },
    []
  );

  const handleRoleChange = useCallback((e: any) => {
    setLocalFormData((prev) => ({ ...prev, roleId: Number(e.target.value) }));
  }, []);

  const handleIsActiveChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalFormData((prev) => ({ ...prev, isActive: e.target.checked }));
    },
    []
  );

  const firstNameError = useMemo(() => {
    return localFormData.firstName?.trim() ? "" : "First name is required";
  }, [localFormData.firstName]);

  const lastNameError = useMemo(() => {
    return localFormData.lastName?.trim() ? "" : "Last name is required";
  }, [localFormData.lastName]);

  const emailError = useMemo(() => {
    if (!localFormData.email?.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(localFormData.email) ? "" : "Invalid email format";
  }, [localFormData.email]);

  const handleSubmit = () => {
    if (firstNameError || lastNameError || emailError) {
      return;
    }
    onSubmit(localFormData);
  };

  const handleClose = () => {
    onFormDataChange(localFormData);
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
          Edit User
        </Typography>
        <Typography
          variant="body2"
          component="p"
          sx={{
            opacity: 0.85,
            maxWidth: 420,
            display: { xs: "none", sm: "block" },
          }}
        >
          Update personal information or adjust their role.
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
              value={localFormData.firstName || ""}
              onChange={handleFirstNameChange}
              required
              error={!!firstNameError}
              helperText={firstNameError || " "}
              id="edit-first-name"
              name="first-name"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={localFormData.lastName || ""}
              onChange={handleLastNameChange}
              required
              error={!!lastNameError}
              helperText={lastNameError || " "}
              id="edit-last-name"
              name="last-name"
            />
            <TextField
              fullWidth
              label="Username"
              value={localFormData.username || ""}
              onChange={handleUsernameChange}
              id="edit-username"
              name="username"
            />
            <TextField
              fullWidth
              label="Email"
              value={localFormData.email || ""}
              onChange={handleEmailChange}
              required
              error={!!emailError}
              helperText={emailError || " "}
              id="edit-email"
              name="email"
            />
            <TextField
              fullWidth
              label="Company Name"
              value={localFormData.companyName || ""}
              onChange={handleCompanyNameChange}
              id="edit-company-name"
              name="company-name"
            />
            <FormControl fullWidth>
              <InputLabel id={roleLabelId}>Role</InputLabel>
              <Select
                labelId={roleLabelId}
                id={`${roleLabelId}-select`}
                label="Role"
                value={localFormData.roleId || 2}
                onChange={handleRoleChange}
                name="role"
              >
                <MenuItem value={1}>Administrator</MenuItem>
                <MenuItem value={2}>Standard User</MenuItem>
              </Select>
              <FormHelperText>&nbsp;</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(localFormData.isActive)}
                  onChange={handleIsActiveChange}
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(localFormData.isVerified)}
                  disabled
                />
              }
              label="Verified"
            />
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
          disabled={loading || !localHasChanges}
          sx={{ minWidth: 100 }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;
