import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
// import { ScopedCssBaseline } from "@mui/material";

import Home from "./pages/Home";

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />{" "}
      {/* Provides a consistent baseline for styling accross different browsers */}
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
