import { useState, useEffect, useCallback } from "react";
import type { GridSortModel, GridFilterModel } from "@mui/x-data-grid";
import UserService from "../../services/userService";
import type { User } from "../../models/user";
import type { UserFilters } from "./useUserFilters";

export interface UseUserDataProps {
  filters: UserFilters;
  paginationModel: { page: number; pageSize: number };
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
  refetchTrigger: number;
}

export interface UseUserDataReturn {
  dataGridRows: User[];
  dataGridRowCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserData = ({
  filters,
  paginationModel,
  sortModel,
  filterModel,
  refetchTrigger,
}: UseUserDataProps): UseUserDataReturn => {
  const [dataGridRows, setDataGridRows] = useState<User[]>([]);
  const [dataGridRowCount, setDataGridRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        skip: paginationModel.page * paginationModel.pageSize,
        take: paginationModel.pageSize,
      };

      // Add sorting
      if (sortModel.length > 0) {
        sortModel.forEach((sort) => {
          const field =
            sort.field.charAt(0).toUpperCase() + sort.field.slice(1);
          params[`sort[field]`] = field;
          params[`sort[dir]`] = sort.sort;
        });
      }

      // Add filtering
      if (filterModel.items.length > 0) {
        filterModel.items.forEach((filter) => {
          const field =
            filter.field.charAt(0).toUpperCase() + filter.field.slice(1);
          params[field] = filter.value;
        });
      }

      // Add custom filters
      if (filters.firstName) params.FirstName = filters.firstName;
      if (filters.lastName) params.LastName = filters.lastName;
      if (filters.email) params.Email = filters.email;
      if (filters.role !== "All")
        params.RoleId = filters.role === "Administrator" ? 1 : 2;
      if (filters.isVerified !== "All")
        params.IsVerified = filters.isVerified === "Verified";
      if (filters.isActive !== "All")
        params.IsActive = filters.isActive === "Active";
      if (filters.createdAt) params.CreatedAt = filters.createdAt;
      if (filters.updatedAt) params.UpdatedAt = filters.updatedAt;

      const response = await UserService.findByQuery(params);
      setDataGridRows(response.records || []);
      setDataGridRowCount(response.recordCount || 0);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [paginationModel, sortModel, filterModel, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refetchTrigger]);

  const refetch = () => {
    fetchData();
  };

  return {
    dataGridRows,
    dataGridRowCount,
    loading,
    error,
    refetch,
  };
};
