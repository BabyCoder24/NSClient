import React, { useId } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  alpha,
} from "@mui/material";
import { Close, Email } from "@mui/icons-material";
import type { User } from "../../../models/user";

interface UserResendDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const UserResendDialog: React.FC<UserResendDialogProps> = ({
  open,
  user,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const titleId = useId();

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      fullScreen={isSmall}
      disableEscapeKeyDown
      aria-labelledby={titleId}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 4 },
            width: "100%",
            maxWidth: isSmall ? "100%" : 500,
            maxHeight: isSmall ? "100vh" : "60vh",
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
        disableTypography
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
          Resend Verification
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
          Send another verification email so the user can activate their
          account.
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Email sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Resend Verification Email?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user ? `${user.firstName} ${user.lastName} (${user.email})` : ""}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Another verification email will be sent to activate their account.
          </Typography>
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
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {loading ? "Sending..." : "Resend"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserResendDialog;
