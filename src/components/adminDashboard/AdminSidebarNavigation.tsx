import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation } from "react-router-dom";
import {
  ADMIN_DASHBOARD_BASE_PATH,
  ADMIN_DASHBOARD_MANAGE_USERS_PATH,
  ADMIN_DASHBOARD_OVERVIEW_PATH,
  ADMIN_DASHBOARD_SETTINGS_PATH,
} from "../../constants";
import DashboardSidebarPageItem from "../DashboardSidebarPageItem";
import DashboardSidebarDividerItem from "../DashboardSidebarDividerItem";

function isPathActive(pathname: string, targetPath: string, exact = false) {
  if (exact) {
    return pathname === targetPath;
  }

  if (targetPath === "/") {
    return pathname === "/";
  }

  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

export default function AdminSidebarNavigation() {
  const { pathname } = useLocation();

  return (
    <React.Fragment>
      {/* <DashboardSidebarHeaderItem>Main</DashboardSidebarHeaderItem> */}
      <DashboardSidebarPageItem
        id="admin-overview"
        title="Overview"
        icon={<DashboardIcon />}
        href={ADMIN_DASHBOARD_OVERVIEW_PATH}
        selected={
          pathname === ADMIN_DASHBOARD_BASE_PATH ||
          isPathActive(pathname, ADMIN_DASHBOARD_OVERVIEW_PATH)
        }
      />
      <DashboardSidebarPageItem
        id="admin-manage-users"
        title="Manage Users"
        icon={<PeopleIcon />}
        href={ADMIN_DASHBOARD_MANAGE_USERS_PATH}
        selected={isPathActive(pathname, ADMIN_DASHBOARD_MANAGE_USERS_PATH)}
      />
      <DashboardSidebarDividerItem />
      {/* <DashboardSidebarHeaderItem>Shortcuts</DashboardSidebarHeaderItem> */}
      {/* <DashboardSidebarPageItem
        id="admin-home"
        title="Home"
        icon={<HomeIcon />}
        href="/"
        selected={pathname === "/"}
      /> */}
      <DashboardSidebarPageItem
        id="admin-settings"
        title="Settings"
        icon={<SettingsIcon />}
        href={ADMIN_DASHBOARD_SETTINGS_PATH}
        selected={isPathActive(pathname, ADMIN_DASHBOARD_SETTINGS_PATH)}
      />
    </React.Fragment>
  );
}
