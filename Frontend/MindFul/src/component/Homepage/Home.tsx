import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

// ============================================================
// ANIMATIONS
// ============================================================
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%   { transform: translateY(0px) rotate(0deg); }
  50%  { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const glowPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.35);
  }
  70% {
    box-shadow: 0 0 0 18px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function Home() {
  return (
    <Box>
      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 8, sm: 10, md: 14 },
          px: { xs: 3, sm: 4 },
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: "auto", md: "calc(100vh - 72px)" },
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background floating orbs */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(100,181,246,0.35) 0%, rgba(100,181,246,0) 70%)",
            filter: "blur(20px)",
            animation: `${float} 9s ease-in-out infinite`,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(25,118,210,0.25) 0%, rgba(25,118,210,0) 70%)",
            filter: "blur(24px)",
            animation: `${float} 11s ease-in-out infinite reverse`,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            {/* HEADLINE */}
            <Typography
              sx={{
                fontSize: { xs: 34, sm: 44, md: 56 },
                fontWeight: 800,
                color: "#0D3654",
                lineHeight: 1.15,
                letterSpacing: -1,
                mb: 3,
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.15s forwards`,
              }}
            >
              Find Peace in Every{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #1976D2 0%, #64B5F6 50%, #1976D2 100%)",
                  backgroundSize: "200% 200%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: `${gradientShift} 5s ease-in-out infinite`,
                }}
              >
                Moment
              </Box>
            </Typography>

            {/* SUBTEXT — mas mahaba, warm, at pang-advertise */}
            <Typography
              sx={{
                fontSize: { xs: 16, sm: 18 },
                color: "#4A6F88",
                lineHeight: 1.85,
                maxWidth: 640,
                mx: "auto",
                mb: 5,
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.3s forwards`,
              }}
            >
              Your gentle companion for a calmer, more mindful mind. Slow down,
              breathe, and give yourself the space to reflect — without pressure,
              without judgment. Whether you're journaling your thoughts, tracking
              your mood, or simply seeking a quiet moment, MindFul is here to walk
              with you, every step of the way.
            </Typography>

            {/* BUTTONS */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.45s forwards`,
              }}
            >
              <Button
                component={Link}
                to="/login"
                variant="contained"
                disableElevation
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  textTransform: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  backgroundColor: "#1976D2",
                  borderRadius: 2.5,
                  px: 4,
                  py: 1.5,
                  boxShadow: "0 6px 20px rgba(25, 118, 210, 0.35)",
                  animation: `${glowPulse} 2.6s ease-out infinite`,
                  "&:hover": {
                    backgroundColor: "#0D47A1",
                    boxShadow: "0 8px 25px rgba(25, 118, 210, 0.45)",
                    transform: "translateY(-2px)",
                  },
                  "& .MuiButton-endIcon": {
                    transition: "transform 0.25s ease",
                  },
                  "&:hover .MuiButton-endIcon": {
                    transform: "translateX(4px)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Start Your Journey
              </Button>

              <Button
                component={Link}
                to="/about"
                variant="outlined"
                disableElevation
                sx={{
                  textTransform: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1976D2",
                  borderColor: "#1976D2",
                  borderWidth: 2,
                  borderRadius: 2.5,
                  px: 4,
                  py: 1.5,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "#0D47A1",
                    borderWidth: 2,
                    backgroundColor: "rgba(25, 118, 210, 0.06)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}