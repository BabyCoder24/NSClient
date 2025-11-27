import React from "react";
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
  useTheme,
  useMediaQuery,
  IconButton,
  alpha,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type { UpdateUserRequest, User } from "../../../models/user";

interface UserEditDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserRequest) => void;
  loading?: boolean;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({
  open,
  user,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = React.useState({
    id: 0,
    firstName: "",
    lastName: "",
    companyName: "",
    username: "",
    email: "",
    isVerified: false,
    isActive: false,
    roleId: 2,
  });

  const [initialData, setInitialData] = React.useState(formData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (user && open) {
      const data = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName || "",
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isActive: user.isActive,
        roleId: user.roleId,
      };
      setFormData(data);
      setInitialData(data);
    }
  }, [user, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSubmit = () => {
    if (validateForm() && hasChanges) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      id: 0,
      firstName: "",
      lastName: "",
      companyName: "",
      username: "",
      email: "",
      isVerified: false,
      isActive: false,
      roleId: 2,
    });
    setInitialData(formData);
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isSmall}
      disableEscapeKeyDown
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
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Edit User
        </Typography>
        <Typography
          variant="body2"
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
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
              error={!!errors.firstName}
              helperText={errors.firstName || " "}
              id="edit-first-name"
              name="first-name"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
              error={!!errors.lastName}
              helperText={errors.lastName || " "}
              id="edit-last-name"
              name="last-name"
            />
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              id="edit-username"
              name="username"
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              error={!!errors.email}
              helperText={errors.email || " "}
              id="edit-email"
              name="email"
            />
            <TextField
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              id="edit-company-name"
              name="company-name"
            />
            <TextField
              fullWidth
              select
              label="Role"
              value={formData.roleId}
              onChange={(e) =>
                setFormData({ ...formData, roleId: Number(e.target.value) })
              }
              id="edit-role"
              name="role"
            >
              <option value={1}>Administrator</option>
              <option value={2}>Standard User</option>
            </TextField>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isVerified}
                  onChange={(e) =>
                    setFormData({ ...formData, isVerified: e.target.checked })
                  }
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
          disabled={loading || !hasChanges}
          sx={{ minWidth: 100 }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;
