import { Box, Container, Typography, Link as MuiLink, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", path: "/home" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact Us", path: "/contact-us" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #0D3654 0%, #1D425D 100%)",
        color: "#E3F2FD",
        py: { xs: 4, md: 5 },
        mt: "auto",
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 3, sm: 4 } }}>
        <Stack
          spacing={{ xs: 3, sm: 2.5 }}
          sx={{ alignItems: "center", textAlign: "center" }}
        >
          {/* NAV LINKS */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 4 }}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            {NAV_LINKS.map((link) => (
              <MuiLink
                key={link.path}
                component={Link}
                to={link.path}
                underline="none"
                sx={{
                  fontSize: { xs: 14, sm: 15 },
                  fontWeight: 600,
                  color: "#B0C4D8",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "#90CAF9" },
                }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Stack>

          {/* COPYRIGHT */}
          <Typography
            sx={{
              fontSize: { xs: 12.5, sm: 13 },
              color: "#8FA9C0",
              textAlign: "center",
            }}
          >
            © {currentYear} MindFul. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}