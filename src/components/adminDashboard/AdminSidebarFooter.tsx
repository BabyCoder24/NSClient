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
import DashboardSidebarContext from "../../context/DashboardSidebarContext";

interface AdminSidebarFooterProps {
  isOnline: boolean;
}

export default function AdminSidebarFooter({
  isOnline,
}: AdminSidebarFooterProps) {
  const theme = useTheme();
  const sidebarContext = React.useContext(DashboardSidebarContext);
  const isViewportCompact = useMediaQuery(theme.breakpoints.down("md"));
  const isSidebarMini = sidebarContext?.mini ?? false;
  const isSidebarCollapsed = sidebarContext?.fullyCollapsed ?? false;
  const isCompact = isViewportCompact || isSidebarMini || isSidebarCollapsed;
  const statusLabel = isOnline ? "All systems operational" : "Offline";
  const statusColor = isOnline ? "success.main" : "error.main";
  const currentYear = new Date().getFullYear();

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
        borderRadius: 2,
        border: (theme) => `1px solid ${(theme.vars || theme).palette.divider}`,
        p: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? (theme.vars || theme).palette.action.selected
            : (theme.vars || theme).palette.grey[50],
        textAlign: { xs: "center", sm: "left" },
        minWidth: isCompact ? 220 : undefined,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent={{ xs: "center", sm: "flex-start" }}
        sx={{ flexWrap: "wrap" }}
      >
        <FiberManualRecordIcon fontSize="small" sx={{ color: statusColor }} />
        <Typography variant="body2" fontWeight={600} noWrap>
          NSolutions
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {statusLabel}
      </Typography>
      <Button
        component={RouterLink}
        to="/settings"
        variant="outlined"
        size="small"
        startIcon={<SettingsIcon fontSize="small" />}
        fullWidth
        aria-label="Open settings"
      >
        Settings
      </Button>
      <Box sx={{ mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          © {currentYear} NSolutions
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
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
            color="primary"
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
          slotProps={{ paper: { sx: { p: 1, borderRadius: 2 } } }}
        >
          {footerContent}
        </Popover>
      </Box>
    );
  }

  return footerContent;
}
