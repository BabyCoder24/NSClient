import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import DashboardSidebarContext from "../../context/DashboardSidebarContext";
import { ADMIN_DASHBOARD_SETTINGS_PATH } from "../../constants";

interface AdminSidebarFooterProps {
  // isOnline prop removed, now checked internally
}

export default function AdminSidebarFooter({}: AdminSidebarFooterProps) {
  const theme = useTheme();
  const sidebarContext = React.useContext(DashboardSidebarContext);
  const isViewportCompact = useMediaQuery(theme.breakpoints.down("md"));
  const isSidebarMini = sidebarContext?.mini ?? false;
  const isSidebarCollapsed = sidebarContext?.fullyCollapsed ?? false;
  const isCompact = isViewportCompact || isSidebarMini || isSidebarCollapsed;
  const [isOnline, setIsOnline] = React.useState(true);
  const statusLabel = isOnline ? "API Server Online" : "API Server Offline";
  const statusColor = isOnline ? "success.main" : "error.main";
  const glowColor = isOnline
    ? "rgba(76, 175, 80, 0.6)"
    : "rgba(244, 67, 54, 0.6)";
  const currentYear = new Date().getFullYear();

  const checkConnection = React.useCallback(async () => {
    try {
      const healthAxios = axios.create({
        baseURL: axios.defaults.baseURL,
        timeout: 5000,
      });
      await healthAxios.get("/health");
      setIsOnline(true);
    } catch (error) {
      const isNetwork =
        !(error as any)?.response ||
        (error as any)?.code === "ERR_NETWORK" ||
        (error as any)?.code === "ECONNABORTED";
      if (isNetwork) {
        setIsOnline(false);
      } else {
        setIsOnline(true);
      }
    }
  }, []);

  React.useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkConnection]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const popoverOpen = Boolean(anchorEl);

  React.useEffect(() => {
    if (!isCompact && popoverOpen) {
      setAnchorEl(null);
    }
  }, [isCompact, popoverOpen]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const footerContent = (
    <Stack
      spacing={1.5}
      sx={{
        width: "100%",
        borderRadius: 2,
        border: (theme) => `1px solid ${(theme.vars || theme).palette.divider}`,
        p: 1.5,
        // background: (theme) =>
        //   theme.palette.mode === "dark"
        //     ? "rgba(255, 255, 255, 0.05)"
        //     : "rgba(0, 0, 0, 0.02)",
        background: "linear-gradient(135deg, #2c3e50 0%, #58b8c7 100%)",
        backdropFilter: "blur(8px)",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent={{ xs: "center", sm: "flex-start" }}
        sx={{ flexWrap: "wrap" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            boxShadow: `0 0 8px ${glowColor}`,
          }}
        >
          <FiberManualRecordIcon fontSize="small" sx={{ color: statusColor }} />
        </Box>
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          sx={{ color: "white" }}
        >
          Namakala Solutions
        </Typography>
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ color: "white" }}
      >
        {statusLabel}
      </Typography>
      <Button
        component={RouterLink}
        to={ADMIN_DASHBOARD_SETTINGS_PATH}
        variant="contained"
        size="small"
        startIcon={<SettingsIcon fontSize="small" />}
        fullWidth
        aria-label="Open settings"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
          color: "white",
          "&:hover": {
            color: "white",
          },
          border: (theme) =>
            `1px solid ${(theme.vars || theme).palette.divider}`,
        }}
      >
        Settings
      </Button>
      <Box sx={{ mt: 0.5 }}>
        <Typography variant="caption" color="white" display="block">
          © {currentYear} Namakala Solutions
        </Typography>
        <Typography variant="caption" color="white">
          All rights reserved.
        </Typography>
      </Box>
    </Stack>
  );

  if (isCompact) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title="Show system status">
          <IconButton
            size="small"
            onClick={handleOpen}
            aria-label="Show sidebar footer details"
            aria-haspopup="true"
            sx={{ color: "#fff" }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Popover
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          slotProps={{
            paper: { sx: { p: 1, borderRadius: 2 } },
          }}
        >
          {footerContent}
        </Popover>
      </Box>
    );
  }

  return footerContent;
}
