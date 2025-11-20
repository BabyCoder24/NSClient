import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import {
  buttonCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  formInputCustomizations,
  sidebarCustomizations,
} from "../theme/customizations";

const theme = createTheme({
  palette: {
    mode: "light", // or 'dark'
    primary: {
      main: "#007FFF",
    },
    secondary: {
      main: "#007FFF",
    },
    background: {
      default: "#fff",
      paper: "#fff",
    },
  },
  components: {
    ...buttonCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...formInputCustomizations,
    ...sidebarCustomizations,
  },
});

export default function AppTheme({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
