<<<<<<< HEAD
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Home />
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
>>>>>>> e706338a35202b07b243bb08f5e0a8a70cf18f77
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
