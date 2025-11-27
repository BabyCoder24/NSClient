import React, { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import {
  Add,
  Visibility,
  Edit,
  Email,
  LockReset,
  Delete,
  Print,
  PictureAsPdf,
  TableChart,
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import type { User } from "../../models/user";
import {
  DATA_GRID_ROW_HEIGHT,
  DATA_GRID_ROW_HEIGHT_SMALL,
  DATA_GRID_ROW_HEIGHT_TABLET,
  DATA_GRID_HEADER_HEIGHT,
  DATA_GRID_HEADER_HEIGHT_COMPACT,
  DATA_GRID_FOOTER_HEIGHT,
  DATA_GRID_MIN_HEIGHT,
} from "../../constants/userConstants";

interface UserDataGridProps {
  data: User[];
  rowCount: number;
  loading: boolean;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: any) => void;
  onSortModelChange: (model: any) => void;
  onFilterModelChange: (model: any) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onPasswordReset: (user: User) => void;
  onResendVerification: (user: User) => void;
  onCreate: () => void;
  printLoading?: boolean;
  excelLoading?: boolean;
  pdfLoading?: boolean;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
}

const UserDataGrid: React.FC<UserDataGridProps> = ({
  data,
  rowCount,
  loading,
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
  printLoading = false,
  excelLoading = false,
  pdfLoading = false,
  onExportExcel,
  onExportPdf,
  onPrint,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const gridRowHeight = isSmall
    ? DATA_GRID_ROW_HEIGHT_SMALL
    : isTablet
    ? DATA_GRID_ROW_HEIGHT_TABLET
    : DATA_GRID_ROW_HEIGHT;
  const gridHeaderHeight = isTablet
    ? DATA_GRID_HEADER_HEIGHT_COMPACT
    : DATA_GRID_HEADER_HEIGHT;
  const gridContainerMinWidth = isTablet ? "100%" : "auto";

  const visibleRowCount = useMemo(() => {
    if (data.length === 0) return 0;
    const startIndex = paginationModel.page * paginationModel.pageSize;
    const remaining = data.length - startIndex;
    return Math.max(0, Math.min(paginationModel.pageSize, remaining));
  }, [data.length, paginationModel]);

  const dataGridHeight = useMemo(() => {
    const rowsHeight = visibleRowCount * gridRowHeight;
    return Math.max(
      DATA_GRID_MIN_HEIGHT,
      gridHeaderHeight + DATA_GRID_FOOTER_HEIGHT + rowsHeight
    );
  }, [gridHeaderHeight, gridRowHeight, visibleRowCount]);

  const columnVisibilityModel = useMemo(() => {
    if (isSmall) {
      return {
        firstName: true,
        lastName: true,
        username: false,
        email: false,
        roleName: false,
        isVerified: true,
        isActive: true,
        createdAt: false,
        updatedAt: false,
      };
    }
    if (isTablet) {
      return {
        firstName: true,
        lastName: true,
        username: false,
        email: false,
        roleName: true,
        isVerified: true,
        isActive: true,
        createdAt: false,
        updatedAt: false,
      };
    }
    return {
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      roleName: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    };
  }, [isSmall, isTablet]);

  const gridPageSizeOptions = useMemo(
    () => (isSmall ? [5, 10] : isTablet ? [5, 10, 25] : [10, 25, 50]),
    [isSmall, isTablet]
  );
  const gridDensity = isTablet ? "compact" : "standard";

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "roleName",
      headerName: "Role",
      flex: 0,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          color={params.value === "Administrator" ? "error" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "isVerified",
      headerName: "Status",
      flex: 0,
      minWidth: 80,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Verified" : "Unverified"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 0,
      minWidth: 80,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "N/A",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 0,
      minWidth: 120,
      getActions: (params: GridRowParams) => {
        const isInactive = !params.row.isActive;
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={<Visibility />}
            label="View"
            onClick={() => onView(params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            key="edit"
            icon={<Edit />}
            label="Edit"
            onClick={() => onEdit(params.row)}
            showInMenu
          />,
        ];
        if (!params.row.isVerified) {
          actions.push(
            <GridActionsCellItem
              key="resend"
              icon={<Email />}
              label="Resend Verification"
              onClick={() => onResendVerification(params.row)}
              showInMenu
            />
          );
        }
        if (!isInactive) {
          actions.push(
            <GridActionsCellItem
              key="reset"
              icon={<LockReset />}
              label="Reset Password"
              onClick={() => onPasswordReset(params.row)}
              showInMenu
            />
          );
        }
        actions.push(
          <GridActionsCellItem
            key="delete"
            icon={<Delete />}
            label="Delete"
            onClick={() => onDelete(params.row)}
            showInMenu
          />
        );
        return actions;
      },
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 1.5, md: 2 },
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6">Users</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onCreate}
              sx={{
                borderRadius: 3,
                width: { xs: "100%", md: "auto" },
                minWidth: { md: 130 },
                alignSelf: { xs: "stretch", md: "center" },
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "white",
                fontWeight: 300,
                fontSize: "0.65rem",
                textTransform: "none",
                px: 3,
                py: 1.5,
                boxShadow: "0 4px 14px 0 rgba(0,0,0,0.15)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.23)",
                  transform: "translateY(-2px)",
                  "& .MuiButton-startIcon": {
                    transform: "rotate(90deg)",
                  },
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                },
                "& .MuiButton-startIcon": {
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  mr: 1,
                },
              }}
            >
              Add User
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={
                printLoading ? <CircularProgress size={16} /> : <Print />
              }
              onClick={onPrint}
              disabled={printLoading}
              sx={{ color: "primary.main", borderColor: "primary.main" }}
            >
              {printLoading ? "Printing..." : "Print"}
            </Button>
            <Button
              variant="outlined"
              startIcon={
                excelLoading ? <CircularProgress size={16} /> : <TableChart />
              }
              onClick={onExportExcel}
              disabled={excelLoading}
              sx={{ color: "success.main", borderColor: "success.main" }}
            >
              {excelLoading ? "Exporting..." : "Export Excel"}
            </Button>
            <Button
              variant="outlined"
              startIcon={
                pdfLoading ? <CircularProgress size={16} /> : <PictureAsPdf />
              }
              onClick={onExportPdf}
              disabled={pdfLoading}
              sx={{ color: "error.main", borderColor: "error.main" }}
            >
              {pdfLoading ? "Exporting..." : "Export PDF"}
            </Button>
          </Box>
        </Box>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={data}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            paginationModel={paginationModel}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            onPaginationModelChange={onPaginationModelChange}
            onSortModelChange={onSortModelChange}
            onFilterModelChange={onFilterModelChange}
            pageSizeOptions={gridPageSizeOptions}
            columnVisibilityModel={columnVisibilityModel}
            density={gridDensity}
            sx={{
              minHeight: dataGridHeight,
              "& .MuiDataGrid-root": {
                minWidth: gridContainerMinWidth,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserDataGrid;
