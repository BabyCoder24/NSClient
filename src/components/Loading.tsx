import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <CircularProgress disableShrink size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
