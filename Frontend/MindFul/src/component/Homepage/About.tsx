import { Box, Container, Typography, Paper, Stack } from "@mui/material";
import { keyframes } from "@emotion/react";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

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

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function About() {
  return (
    <Box>
      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 3, sm: 4 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating orbs */}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            right: "8%",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(100,181,246,0.3) 0%, rgba(100,181,246,0) 70%)",
            filter: "blur(20px)",
            animation: `${float} 10s ease-in-out infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(25,118,210,0.2) 0%, rgba(25,118,210,0) 70%)",
            filter: "blur(24px)",
            animation: `${float} 12s ease-in-out infinite reverse`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: 32, sm: 40, md: 48 },
                fontWeight: 800,
                color: "#0D3654",
                letterSpacing: -1,
                mb: 3,
                lineHeight: 1.15,
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.1s forwards`,
              }}
            >
              About{" "}
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
                MindFul
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 16, sm: 18 },
                color: "#4A6F88",
                lineHeight: 1.8,
                maxWidth: 700,
                mx: "auto",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.25s forwards`,
              }}
            >
              A quiet space for your mind. Built with care, for anyone who wants
              to feel a little more at peace in their everyday life.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* MISSION & VISION — CARDS */}
      {/* ============================================================ */}
      <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 3, sm: 4 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {/* MISSION CARD */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 5,
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(25, 118, 210, 0.1)",
                boxShadow: "0 8px 30px rgba(25, 118, 210, 0.08)",
                transition: "all 0.25s ease",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.1s forwards`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 35px rgba(25, 118, 210, 0.15)",
                  borderColor: "rgba(25, 118, 210, 0.25)",
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  color: "#1976D2",
                  mb: 2.5,
                }}
              >
                <FavoriteRoundedIcon sx={{ fontSize: 36 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: 22, sm: 24 },
                  fontWeight: 800,
                  color: "#0D3654",
                  mb: 2,
                  letterSpacing: -0.3,
                }}
              >
                Our Mission
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 15, sm: 16 },
                  color: "#4A6F88",
                  lineHeight: 1.85,
                }}
              >
                To empower every person to understand their emotions, build
                healthy habits, and find peace in everyday life. We combine the
                simplicity of journaling with the intelligence of AI to deliver
                insights that are actually personal — not generic advice, but
                reflections that resonate with your unique journey.
              </Typography>
            </Paper>

            {/* VISION CARD */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 5,
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(25, 118, 210, 0.1)",
                boxShadow: "0 8px 30px rgba(25, 118, 210, 0.08)",
                transition: "all 0.25s ease",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 35px rgba(25, 118, 210, 0.15)",
                  borderColor: "rgba(25, 118, 210, 0.25)",
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  color: "#1976D2",
                  mb: 2.5,
                }}
              >
                <VisibilityRoundedIcon sx={{ fontSize: 36 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: 22, sm: 24 },
                  fontWeight: 800,
                  color: "#0D3654",
                  mb: 2,
                  letterSpacing: -0.3,
                }}
              >
                Our Vision
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 15, sm: 16 },
                  color: "#4A6F88",
                  lineHeight: 1.85,
                }}
              >
                A world where caring for your mind feels as natural as caring
                for your body — where mental wellness is not a luxury, but a
                gentle part of everyday life. We envision a future where
                anyone, anywhere, can access a quiet space to reflect, grow,
                and feel truly heard.
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* ABOUT MINDFUL — bakit ginawa + impact */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: { xs: 3, sm: 4 },
          pb: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                justifyContent: "center",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.1s forwards`,
              }}
            >
              <SpaOutlinedIcon
                sx={{
                  color: "#1976D2",
                  fontSize: 28,
                  animation: `${float} 3.5s ease-in-out infinite`,
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: 26, sm: 32, md: 36 },
                  fontWeight: 800,
                  color: "#0D3654",
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Our Story
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 16,
                color: "#4A6F88",
                lineHeight: 1.9,
                textAlign: "center",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.25s forwards`,
              }}
            >
              MindFul was born from a personal struggle — from the quiet,
              everyday weight of stress, anxiety, and the feeling of being
              unheard. We searched for a tool that felt warm and human, one
              that didn't feel clinical or overwhelming. When we couldn't find
              it, we decided to build it ourselves.
            </Typography>

            <Typography
              sx={{
                fontSize: 16,
                color: "#4A6F88",
                lineHeight: 1.9,
                textAlign: "center",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.4s forwards`,
              }}
            >
              We wanted something that felt less like an app and more like a
              gentle companion — a place where you could slow down, be honest
              with yourself, and feel supported without pressure or judgment.
            </Typography>

            <Typography
              sx={{
                fontSize: 16,
                color: "#4A6F88",
                lineHeight: 1.9,
                textAlign: "center",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.55s forwards`,
              }}
            >
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "#1976D2" }}
              >
                Our hope:
              </Box>{" "}
              that MindFul becomes a small but meaningful part of your day —
              helping you understand yourself better, build habits that last,
              and feel a little more at peace, one moment at a time.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}