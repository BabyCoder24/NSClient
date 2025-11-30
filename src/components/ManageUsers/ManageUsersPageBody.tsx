import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import PageContainer from "../PageContainer";
import Loading from "../Loading";
import StatsCards from "./StatsCards";
import UserFilters from "./UserFilters";
import UserDataGrid from "./UserDataGrid";
import type { UserFilters as Filters } from "../../hooks/users/useUserFilters";

interface PaginationModel {
  page: number;
  pageSize: number;
}

type SortModel = Array<{ field: string; sort?: "asc" | "desc" }>;

interface ManageUsersPageBodyProps {
  loading: boolean;
  filters: Filters;
  onFilterChange: (field: string, value: string) => void;
  onSearch: () => void;
  onClearFilters: () => void;
  dataGridRows: any[];
  dataGridRowCount: number;
  dataLoading: boolean;
  paginationModel: PaginationModel;
  onPaginationModelChange: (model: PaginationModel) => void;
  onSortModelChange: (model: SortModel) => void;
  onFilterModelChange: (model: any) => void;
  onView: (user: any) => void;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onPasswordReset: (user: any) => void;
  onResendVerification: (user: any) => void;
  onCreate: () => void;
  printLoading: boolean;
  excelLoading: boolean;
  pdfLoading: boolean;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
}

const ManageUsersPageBodyComponent: React.FC<ManageUsersPageBodyProps> = ({
  loading,
  filters,
  onFilterChange,
  onSearch,
  onClearFilters,
  dataGridRows,
  dataGridRowCount,
  dataLoading,
  paginationModel,
  onPaginationModelChange,
  onSortModelChange,
  onFilterModelChange,
  onView,
  onEdit,
  onDelete,
  onPasswordReset,
  onResendVerification,
  onCreate,
  printLoading,
  excelLoading,
  pdfLoading,
  onExportExcel,
  onExportPdf,
  onPrint,
}) => {
  return (
    <PageContainer
      title="User Management"
      maxWidth="xl"
      breadcrumbs={[
        { title: "Admin Dashboard", path: "/admin-dashboard/overview" },
        { title: "Manage Users" },
      ]}
    >
      {loading ? (
        <Loading />
      ) : (
        <Stack spacing={4}>
          <Box
            sx={{
              background: "rgba(6, 117, 255, 0.66)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(3.8px)",
              WebkitBackdropFilter: "blur(3.8px)",
              border: "1px solid rgba(6, 117, 255, 0.3)",
              p: { xs: 1.5, sm: 2, md: 3 },
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, typography: { xs: "h5", md: "h4" } }}
              >
                User Management
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Manage user accounts, roles, and permissions across the system.
              </Typography>
            </Box>
          </Box>

          <StatsCards />

          <UserFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onSearch={onSearch}
            onClearFilters={onClearFilters}
          />

          <UserDataGrid
            data={dataGridRows}
            rowCount={dataGridRowCount}
            loading={dataLoading}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            onSortModelChange={onSortModelChange}
            onFilterModelChange={onFilterModelChange}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onPasswordReset={onPasswordReset}
            onResendVerification={onResendVerification}
            onCreate={onCreate}
            printLoading={printLoading}
            excelLoading={excelLoading}
            pdfLoading={pdfLoading}
            onExportExcel={onExportExcel}
            onExportPdf={onExportPdf}
            onPrint={onPrint}
          />
        </Stack>
      )}
    </PageContainer>
  );
};

const ManageUsersPageBody = React.memo(ManageUsersPageBodyComponent);

export default ManageUsersPageBody;
