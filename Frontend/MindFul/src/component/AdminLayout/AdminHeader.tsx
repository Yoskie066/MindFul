import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

const DRAWER_WIDTH = 260;

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const adminEmail = adminData?.email || "Admin";
  const adminInitial = adminEmail.charAt(0).toUpperCase();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin-login");
  };

  const navItems = [
    {
      label: "Analytics",
      icon: <BarChartRoundedIcon />,
      path: "/analytics",
    },
    {
      label: "User Management",
      icon: <PeopleAltRoundedIcon />,
      path: "/user-management",
    },
    {
      label: "Journal Management",
      icon: <BookRoundedIcon />,
      path: "/journal-management",
    },
    {
      label: "AI Management",
      icon: <SmartToyRoundedIcon />,
      path: "/ai-management",
    },
    {
      label: "Logout",
      icon: <LogoutRoundedIcon />,
      path: null,
      isLogout: true,
    },
  ];

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ----- Logo (matches UserHeader) ----- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <SpaOutlinedIcon sx={{ color: "#1976D2" }} />
        <Typography variant="h6" fontWeight={800} color="#0D3654">
          MindFul
        </Typography>
      </Box>

      {/* ----- Navigation (transparent) ----- */}
      <List sx={{ flex: 1, pt: 1, overflow: "auto" }}>
        {navItems.map((item) => {
          const isActive =
            !item.isLogout &&
            item.path !== null &&
            location.pathname === item.path;

          // Logout item – special styling, no gradient hover
          if (item.isLogout) {
            return (
              <ListItem key="logout" disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    color: "#D32F2F",
                    "&:hover": { bgcolor: "rgba(211, 47, 47, 0.12)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "#D32F2F" }}>
                    <LogoutRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "0.95rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          }

          // Regular items
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.path) navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "rgba(255, 255, 255, 0.35)",
                    "& .MuiListItemIcon-root": { color: "#1976D2" },
                    "& .MuiTypography-root": {
                      color: "#1976D2",
                      fontWeight: 700,
                    },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "#1976D2" : "#0D3654" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "0.95rem",
                      fontWeight: isActive ? 700 : 500,
                      color: "#0D3654",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* ----- Profile (transparent) ----- */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1.5,
          borderTop: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#1976D2",
            color: "#fff",
          }}
        >
          {adminInitial}
        </Avatar>
        <Box sx={{ overflow: "hidden" }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#0D3654",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {adminEmail}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* ----- Mobile AppBar (may gradient) ----- */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { xs: "block", md: "none" },
          background:
            "linear-gradient(135deg, #EDF9FF 0%, #D6EFFF 48%, #BBDFF7 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.3)",
          color: "#0D3654",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "#0D3654" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ flexGrow: 1, color: "#0D3654" }}
          >
            MindFul
          </Typography>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#1976D2",
              color: "#fff",
              fontSize: "0.9rem",
            }}
          >
            {adminInitial}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* ----- Drawer ----- */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(255,255,255,0.3)",
            background:
              "linear-gradient(135deg, #EDF9FF 0%, #D6EFFF 48%, #BBDFF7 100%)",
            overflowX: "hidden",
            ...(isMobile && { top: 0 }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ----- Spacer ----- */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="sidebar"
      />
    </Box>
  );
}