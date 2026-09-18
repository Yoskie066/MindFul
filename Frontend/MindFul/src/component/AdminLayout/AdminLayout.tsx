import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import AdminHeader from "./AdminHeader";

const DRAWER_WIDTH = 260;

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AdminHeader />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          ml: { md: `${DRAWER_WIDTH}px` },
          mt: { xs: "56px", sm: "64px", md: 0 },
          bgcolor: "#F5F9FC",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}