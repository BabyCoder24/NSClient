import React, { useId } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
import type { User } from "../../../models/user";
import { DIALOG_TYPES } from "../../../constants/userConstants";

interface UserViewDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserViewDialog: React.FC<UserViewDialogProps> = ({
  open,
  onClose,
  user,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const titleId = useId();

  const selectedUserDetails = user
    ? [
        { label: "First Name", value: user.firstName },
        { label: "Last Name", value: user.lastName },
        { label: "Username", value: user.username },
        { label: "Email", value: user.email },
        {
          label: "Company",
          value: user.companyName || "Not provided",
        },
        { label: "Role", value: user.roleName || "N/A" },
        {
          label: "Status",
          value: user.isVerified ? "Verified" : "Unverified",
        },
        {
          label: "Active",
          value: user.isActive ? "Active" : "Inactive",
        },
        {
          label: "Created At",
          value: new Date(user.createdAt).toLocaleString(),
        },
        {
          label: "Updated At",
          value: user.updatedAt
            ? new Date(user.updatedAt).toLocaleString()
            : "N/A",
        },
      ]
    : [];

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
          {DIALOG_TYPES.view.title}
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
          {DIALOG_TYPES.view.subtitle}
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
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.24)" },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: { xs: 2.5, sm: 3 },
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(248, 250, 252, 0.96)"
              : theme.palette.background.paper,
          flex: 1,
          overflowY: "auto",
        }}
      >
        {user && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.92)"
                  : "rgba(15, 23, 42, 0.45)",
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "light"
                  ? "inset 0 1px 0 rgba(255, 255, 255, 0.65)"
                  : "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "minmax(0, 280px) 1fr" },
                gap: { xs: 2, md: 3 },
                alignItems: "stretch",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {selectedUserDetails.slice(0, 5).map((detail, index) => (
                  <Box key={index}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography variant="body1">{detail.value}</Typography>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 1.5, md: 2 },
                }}
              >
                {selectedUserDetails.slice(5).map((detail, index) => (
                  <Box key={index}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography variant="body1">{detail.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserViewDialog;
