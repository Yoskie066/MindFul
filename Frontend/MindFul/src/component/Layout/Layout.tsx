import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #F5FBFF 0%, #EDF9FF 50%, #E3F2FD 100%)",
      }}
    >
      <CssBaseline />

      {/* TOP HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>

      {/* FOOTER */}
      <Footer />
    </Box>
  );
}