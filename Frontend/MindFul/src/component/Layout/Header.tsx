import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

const NAV_ITEMS = [
  { label: "Home", path: "/home" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact-us" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          "linear-gradient(135deg, #EDF9FF 0%, #D6EFFF 48%, #BBDFF7 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.3)",
        color: "#0D3654",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: { xs: 64, md: 72 },
          gap: 2,
        }}
      >
        {/* LOGO  */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: "inherit",
            flexGrow: { xs: 1, md: 0 },
          }}
        >
          <SpaOutlinedIcon sx={{ color: "#1976D2", fontSize: 28 }} />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 20, md: 22 },
              color: "#0D3654",
              letterSpacing: -0.5,
            }}
          >
            MindFul
          </Typography>
        </Box>

        {/* DESKTOP  */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              ml: "auto",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  disableRipple
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#1976D2" : "#0D3654",
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.35)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.35)",
                      color: "#1976D2",
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        )}

        {/* HAMBURGER MENU TABLET/MOBILE */}
        {isMobile && (
          <IconButton
            edge="end"
            onClick={handleDrawerToggle}
            sx={{
              color: "#0D3654",
              border: "1px solid rgba(25, 118, 210, 0.2)",
              borderRadius: 2,
              p: 1,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.35)" },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* MOBILE DRAWER  */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              background:
                "linear-gradient(135deg, #EDF9FF 0%, #D6EFFF 48%, #BBDFF7 100%)",
              p: 0,
            },
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* DRAWER HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1.5,
              borderBottom: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SpaOutlinedIcon sx={{ color: "#1976D2" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#0D3654" }}
              >
                MindFul
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "#0D3654" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* DRAWER NAV LINKS */}
          <List sx={{ flex: 1, pt: 1 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      mb: 0.5,
                      "&.Mui-selected": {
                        bgcolor: "rgba(255,255,255,0.35)",
                        "& .MuiTypography-root": {
                          color: "#1976D2",
                          fontWeight: 700,
                        },
                      },
                      "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                    }}
                  >
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

          {/* BOTTOM BRAND TAG */}
          <Box sx={{ p: 1.5, borderTop: "1px solid rgba(255,255,255,0.3)" }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#4A6F88",
                textAlign: "center",
                letterSpacing: 0.3,
              }}
            >
              Your Mental Wellness Companion
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}