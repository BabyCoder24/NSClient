import CssBaseline from "@mui/material/CssBaseline";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import EmployeeList from "./components/EmployeeList";
import EmployeeShow from "./components/EmployeeShow";
import EmployeeCreate from "./components/EmployeeCreate";
import EmployeeEdit from "./components/EmployeeEdit";
import NotificationsProvider from "./hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "./hooks/useDialogs/DialogsProvider";
import AppTheme from "./shared-theme/AppTheme";

export default function CrudDashboard() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="employees" replace />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="employees/new" element={<EmployeeCreate />} />
              <Route path="employees/:employeeId" element={<EmployeeShow />} />
              <Route
                path="employees/:employeeId/edit"
                element={<EmployeeEdit />}
              />
              <Route path="*" element={<EmployeeList />} />
            </Route>
          </Routes>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
