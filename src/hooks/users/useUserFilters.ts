import { useState, useCallback } from "react";
import type { GridFilterModel } from "@mui/x-data-grid";

export interface UserFilters {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface UseUserFiltersReturn {
  filters: UserFilters;
  filterModel: GridFilterModel;
  handleFilterChange: (field: string, value: string) => void;
  handleClearFilters: () => void;
  handleSearch: () => void;
}

export interface UseUserFiltersProps {
  onSearch?: () => void;
}

export const useUserFilters = (
  props?: UseUserFiltersProps
): UseUserFiltersReturn => {
  const { onSearch } = props || {};

  const [filters, setFilters] = useState<UserFilters>({
    firstName: "",
    lastName: "",
    email: "",
    role: "All",
    isVerified: "All",
    isActive: "All",
    createdAt: "",
    updatedAt: "",
  });

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      firstName: "",
      lastName: "",
      email: "",
      role: "All",
      isVerified: "All",
      isActive: "All",
      createdAt: "",
      updatedAt: "",
    });
    setFilterModel({ items: [] });
    // Trigger search after clearing
    onSearch?.();
  }, [onSearch]);

  const handleSearch = useCallback(() => {
    // Trigger the search
    onSearch?.();
  }, [onSearch]);

  return {
    filters,
    filterModel,
    handleFilterChange,
    handleClearFilters,
    handleSearch,
  };
};
