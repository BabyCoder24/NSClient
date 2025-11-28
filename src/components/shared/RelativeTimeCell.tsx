import React from "react";
import Typography from "@mui/material/Typography";
import { formatRelativeTime } from "../../utilities/timeUtils";
import { useRelativeTime } from "../../hooks/useRelativeTime";

interface RelativeTimeCellProps {
  /**
   * The date value to format.
   */
  value: string | Date | null | undefined;
  /**
   * Whether to enable real-time updates (default: false).
   */
  useRealTime?: boolean;
  /**
   * Fallback string for null/invalid dates (default: "NA").
   */
  fallback?: string;
  /**
   * Update interval in ms for real-time mode (default: 1000ms).
   */
  updateInterval?: number;
}

/**
 * Reusable component for displaying relative time in DataGrid cells.
 * Supports static and real-time formatting with accessibility features.
 */
const RelativeTimeCell: React.FC<RelativeTimeCellProps> = ({
  value,
  useRealTime = true,
  fallback = "NA",
  updateInterval = 3000,
}) => {
  const timeString = useRealTime
    ? useRelativeTime(value, { fallback, updateInterval })
    : formatRelativeTime(value, { fallback });

  return (
    <Typography
      variant="body2"
      title={value ? new Date(value).toLocaleString() : undefined} // Tooltip with full datetime
      sx={{ color: "text.secondary" }}
    >
      {timeString}
    </Typography>
  );
};

export default RelativeTimeCell;
