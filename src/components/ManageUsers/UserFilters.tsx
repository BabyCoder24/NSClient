import React from "react";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useUserFilters } from "../../hooks/users/useUserFilters";

interface UserFiltersProps {
  onSearch?: () => void;
  onClearFilters?: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  onSearch,
  onClearFilters,
}) => {
  const theme = useTheme();
  const {
    filters,
    handleFilterChange,
    handleClearFilters: hookClearFilters,
    handleSearch: hookSearch,
  } = useUserFilters();

  return (
    <Card
      sx={{
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        color: "common.white",
        background:
          "linear-gradient(135deg, #1e3c72 0%, #2a5298 45%, #38a3d1 100%)",
        boxShadow: "0px 18px 42px rgba(30, 64, 175, 0.22)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
        },
      }}
    >
      <CardContent
        sx={{
          position: "relative",
          zIndex: 1,
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            User Filters
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Quickly narrow down users by name, role, or status.
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.common.white, 0.92),
            borderRadius: 2,
            p: { xs: 1.5, sm: 2.5 },
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.15)",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, sm: 2 },
            color: "text.primary",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gap: { xs: 1, sm: 1.5, md: 2 },
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fit, minmax(200px, 1fr))",
              },
            }}
          >
            <TextField
              fullWidth
              label="First Name"
              value={filters.firstName}
              onChange={(e) => handleFilterChange("firstName", e.target.value)}
              sx={{ minWidth: 0 }}
              id="filter-first-name"
              name="first-name"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={filters.lastName}
              onChange={(e) => handleFilterChange("lastName", e.target.value)}
              sx={{ minWidth: 0 }}
              id="filter-last-name"
              name="last-name"
            />
            <TextField
              fullWidth
              label="Email"
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              sx={{ minWidth: 0 }}
              id="filter-email"
              name="filter-email"
            />
            <TextField
              fullWidth
              select
              label="Role"
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              sx={{ minWidth: 0 }}
              id="filter-role"
              name="role"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Administrator">Administrator</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Verified"
              value={filters.isVerified}
              onChange={(e) => handleFilterChange("isVerified", e.target.value)}
              sx={{ minWidth: 0 }}
              id="filter-is-verified"
              name="is-verified"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Verified">Verified</MenuItem>
              <MenuItem value="Unverified">Unverified</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Active"
              value={filters.isActive}
              onChange={(e) => handleFilterChange("isActive", e.target.value)}
              sx={{ minWidth: 0 }}
              id="filter-is-active"
              name="is-active"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Created At"
              type="date"
              value={filters.createdAt}
              onChange={(e) => handleFilterChange("createdAt", e.target.value)}
              sx={{ minWidth: 0 }}
              id="filter-created-at"
              name="created-at"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Updated At"
              type="date"
              value={filters.updatedAt}
              onChange={(e) => handleFilterChange("updatedAt", e.target.value)}
              sx={{ minWidth: 0 }}
              id="filter-updated-at"
              name="updated-at"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Button variant="contained" onClick={onSearch || hookSearch}>
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={onClearFilters || hookClearFilters}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserFilters;
