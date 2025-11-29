import * as React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Chip from "@mui/material/Chip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DashboardSidebarContext from "../../context/DashboardSidebarContext";
import { BASE_URL } from "../../config/baseURL";

interface AdminSidebarFooterProps {
  // isOnline prop removed, now checked internally
}

const SUCCESS_CODES = new Set([
  200, 201, 202, 204, 301, 302, 304, 401, 403, 404, 405,
]);

export default function AdminSidebarFooter({}: AdminSidebarFooterProps) {
  const theme = useTheme();
  const sidebarContext = React.useContext(DashboardSidebarContext);
  const isViewportCompact = useMediaQuery(theme.breakpoints.down("md"));
  const isSidebarMini = sidebarContext?.mini ?? false;
  const isSidebarCollapsed = sidebarContext?.fullyCollapsed ?? false;
  const isCompact = isViewportCompact || isSidebarMini || isSidebarCollapsed;
  const [isOnline, setIsOnline] = React.useState(true);
  const [lastChecked, setLastChecked] = React.useState<Date | null>(null);
  const [checking, setChecking] = React.useState(false);
  const inFlightController = React.useRef<AbortController | null>(null);
  const baseUrl = React.useMemo(() => BASE_URL.replace(/\/$/, ""), []);
  const statusLabel = isOnline ? "API Server Online" : "API Server Offline";
  const currentYear = new Date().getFullYear();
  const isReachableStatus = React.useCallback((status: number) => {
    if (SUCCESS_CODES.has(status)) return true;
    return status >= 200 && status < 400;
  }, []);

  const checkConnection = React.useCallback(
    async (signal?: AbortSignal) => {
      if (!baseUrl) return;
      setChecking(true);
      let reachable = false;
      try {
        const response = await axios.get("/", {
          baseURL: baseUrl,
          signal,
          timeout: 5000,
          withCredentials: false,
          headers: { "Cache-Control": "no-cache" },
        });
        reachable = isReachableStatus(response.status);
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") {
          return;
        }
        if (axios.isAxiosError(error) && error.response) {
          reachable = isReachableStatus(error.response.status);
        } else {
          reachable = false;
        }
      } finally {
        if (!signal?.aborted) {
          setIsOnline(reachable);
          setLastChecked(new Date());
          setChecking(false);
        }
      }
    },
    [baseUrl, isReachableStatus]
  );

  const triggerCheck = React.useCallback(() => {
    inFlightController.current?.abort();
    const controller = new AbortController();
    inFlightController.current = controller;
    checkConnection(controller.signal).finally(() => {
      if (inFlightController.current === controller) {
        inFlightController.current = null;
      }
    });
  }, [checkConnection]);

  React.useEffect(() => {
    triggerCheck();
    const interval = setInterval(triggerCheck, 30000);
    return () => {
      clearInterval(interval);
      inFlightController.current?.abort();
    };
  }, [triggerCheck]);

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

  const lastCheckedLabel = lastChecked
    ? new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(lastChecked)
    : "Not checked yet";

  const footerContent = (
    <Stack
      spacing={1.5}
      sx={{
        width: "100%",
        borderRadius: 3,
        p: { xs: 1.25, md: 1.75 },
        background: "linear-gradient(135deg, #607e9b 0%, #80a8ce 100%)",
        color: theme.palette.common.white,
        // border: statusColors.border,
        border: `1px solid rgba(255, 255, 255, 0.15)`,
        boxShadow: `0 0 10px rgba(10, 157, 198, 0.6)`,
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          // background: statusColors.overlay,
          zIndex: -1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: { xs: 1, md: 1.25 },
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 1,
              opacity: 0.75,
              fontWeight: 600,
              fontSize: "0.65rem",
            }}
          >
            System Status
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, lineHeight: 1.15, fontSize: "1rem" }}
          >
            Namakala Solutions
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          sx={{ width: { xs: "100%", md: "auto" }, rowGap: 1 }}
        >
          <Tooltip title={checking ? "Checking..." : "Refresh status"}>
            <span>
              <IconButton
                size="small"
                onClick={triggerCheck}
                disabled={checking}
                sx={{
                  color: theme.palette.common.white,
                  p: 0.5,
                  "&:hover": {
                    // bgcolor: statusColors.actionHover,
                  },
                  alignContent: "center",
                }}
              >
                <RefreshRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>
      <Stack spacing={1.1}>
        <Chip
          icon={
            <FiberManualRecordIcon
              {...(isOnline ? { color: "success" } : { color: "error" })}
            />
          }
          label={statusLabel}
          size="small"
          sx={{
            alignSelf: "flex-start",
            // bgcolor: statusColors.chipBg,
            // border: statusColors.chipBorder,
            color: theme.palette.common.white,
            fontWeight: 600,
            fontSize: "0.8rem",
            height: 26,
            px: 0.75,
          }}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={0.5}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography
            variant="body2"
            sx={{ opacity: 0.85, fontSize: "0.85rem", lineHeight: 1.35 }}
          >
            {isOnline
              ? "All services are responding normally."
              : "Unable to reach the API server. We will keep retrying."}
          </Typography>
          <Typography
            variant="caption"
            sx={{ opacity: 0.75, fontSize: "0.72rem" }}
          >
            Checked {lastCheckedLabel}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{ opacity: 0.7, fontSize: "0.72rem" }}
        >
          Auto-refresh every 30 seconds
        </Typography>
      </Stack>
      <Box sx={{ pt: 0.5 }}>
        <Typography
          variant="caption"
          display="block"
          sx={{ fontSize: "0.7rem", opacity: 0.75 }}
        >
          © {currentYear} Namakala Solutions · All rights reserved.
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
            paper: {
              sx: {
                p: 0,
                borderRadius: 3,
                background: "transparent",
                boxShadow: "none",
              },
            },
          }}
        >
          {footerContent}
        </Popover>
      </Box>
    );
  }

  return footerContent;
}
