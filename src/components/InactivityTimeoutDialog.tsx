import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

interface InactivityTimeoutDialogProps {
  open: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
  remainingTime: number; // in seconds
  totalWarningTime: number; // in seconds
}

/**
 * Dialog shown when user's session is about to expire due to inactivity.
 * Shows countdown timer and allows user to stay logged in or logout.
 */
export const InactivityTimeoutDialog: React.FC<
  InactivityTimeoutDialogProps
> = ({ open, onStayLoggedIn, onLogout, remainingTime, totalWarningTime }) => {
  const [countdown, setCountdown] = useState(remainingTime);

  useEffect(() => {
    setCountdown(remainingTime);
  }, [remainingTime]);

  useEffect(() => {
    if (!open || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onLogout(); // Auto logout when countdown reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, countdown, onLogout]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progressValue =
    ((totalWarningTime - countdown) / totalWarningTime) * 100;

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing by clicking outside
      disableEscapeKeyDown // Prevent closing with escape
      maxWidth="sm"
      fullWidth
      slotProps={{
        root: {
          "data-activity-ignore": "true",
        } as React.HTMLAttributes<HTMLElement>,
        paper: {
          "data-activity-ignore": "true",
        } as React.HTMLAttributes<HTMLElement>,
        backdrop: {
          "data-activity-ignore": "true",
        } as React.HTMLAttributes<HTMLElement>,
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WarningIcon color="warning" />
        Session Expiring Soon
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Your session will expire due to inactivity in:
          </Typography>
          <Typography
            variant="h4"
            component="div"
            sx={{
              color: countdown <= 30 ? "error.main" : "warning.main",
              fontWeight: "bold",
              textAlign: "center",
              my: 2,
            }}
          >
            {formatTime(countdown)}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressValue}
          color={countdown <= 30 ? "error" : "warning"}
          sx={{ height: 8, borderRadius: 4 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          To continue using the application, please click "Stay Logged In".
          Otherwise, you will be automatically logged out.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onLogout}
          variant="outlined"
          color="error"
          sx={{ minWidth: 120 }}
        >
          Logout Now
        </Button>
        <Button
          onClick={onStayLoggedIn}
          variant="contained"
          color="primary"
          sx={{ minWidth: 120 }}
        >
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};
