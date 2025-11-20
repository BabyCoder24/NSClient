import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import SitemarkIcon from "./SitemarkIcon";

export interface DashboardLayoutProps {
  title?: string;
  logo?: React.ReactNode;
  headerActions?: React.ReactNode;
  sidebarNavigation?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  disableCollapsibleSidebar?: boolean;
  children?: React.ReactNode;
}

export default function DashboardLayout({
  title = "NSolutions",
  logo = <SitemarkIcon />,
  headerActions,
  sidebarNavigation,
  sidebarFooter,
  disableCollapsibleSidebar = false,
  children,
}: DashboardLayoutProps) {
  const theme = useTheme();

  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
    React.useState(true);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
    React.useState(false);

  const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

  const isNavigationExpanded = isOverMdViewport
    ? isDesktopNavigationExpanded
    : isMobileNavigationExpanded;

  const setIsNavigationExpanded = React.useCallback(
    (newExpanded: boolean) => {
      if (isOverMdViewport) {
        setIsDesktopNavigationExpanded(newExpanded);
      } else {
        setIsMobileNavigationExpanded(newExpanded);
      }
    },
    [
      isOverMdViewport,
      setIsDesktopNavigationExpanded,
      setIsMobileNavigationExpanded,
    ]
  );

  const handleToggleHeaderMenu = React.useCallback(
    (isExpanded: boolean) => {
      setIsNavigationExpanded(isExpanded);
    },
    [setIsNavigationExpanded]
  );

  const layoutRef = React.useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={layoutRef}
      sx={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        height: "100%",
        width: "100%",
      }}
    >
      <DashboardHeader
        logo={logo}
        title={title}
        menuOpen={isNavigationExpanded}
        onToggleMenu={handleToggleHeaderMenu}
        actions={headerActions}
      />
      <DashboardSidebar
        expanded={isNavigationExpanded}
        setExpanded={setIsNavigationExpanded}
        navigation={sidebarNavigation}
        footer={sidebarFooter}
        disableCollapsibleSidebar={disableCollapsibleSidebar}
        container={layoutRef?.current ?? undefined}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Toolbar sx={{ displayPrint: "none" }} />
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "auto",
          }}
        >
          {children ?? <Outlet />}
        </Box>
      </Box>
    </Box>
  );
}
