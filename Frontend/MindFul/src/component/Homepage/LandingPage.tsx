import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Dialog,
  DialogContent,
  CircularProgress,
  alpha,
} from "@mui/material";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import emailjs from "@emailjs/browser";

// ============================================================
// EMAILJS CONFIG
// ============================================================
const EMAILJS_SERVICE_ID = "service_hjeoj7r";
const EMAILJS_TEMPLATE_ID = "template_oqdpwqs";
const EMAILJS_PUBLIC_KEY = "cvuKtXJ5BhrX8FxVN";

// ============================================================
// SHARED ANIMATIONS
// ============================================================
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%   { transform: translateY(0px) rotate(0deg); }
  50%  { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const glowPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.35); }
  70%  { box-shadow: 0 0 0 18px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ============================================================
// SERVICES DATA
// ============================================================
const SERVICES = [
  {
    icon: <DashboardRoundedIcon sx={{ fontSize: 40 }} />,
    title: "Dashboard",
    desc: "See your mood, stress, energy, and sleep at a glance — beautifully visualized for instant clarity.",
    features: [
      "Mood, stress & energy overview",
      "Sleep pattern insights",
      "Weekly wellness snapshot",
    ],
  },
  {
    icon: <EditNoteRoundedIcon sx={{ fontSize: 40 }} />,
    title: "Daily Journal",
    desc: "Capture your feelings, moods, and thoughts with a guided journal that takes less than a minute.",
    features: [
      "Guided reflection prompts",
      "Mood tracking with emojis",
      "Tag & search your entries",
    ],
  },
  {
    icon: <HistoryRoundedIcon sx={{ fontSize: 40 }} />,
    title: "History",
    desc: "Revisit your past entries, track your emotional patterns, and see how far you've come.",
    features: [
      "Full search & filter",
      "Calendar view of entries",
      "Track your mood trends",
    ],
  },
  {
    icon: <SmartToyRoundedIcon sx={{ fontSize: 40 }} />,
    title: "AI Assistant",
    desc: "Get empathetic, personalized insights drawn from your own entries — like a friend who truly listens.",
    features: [
      "Context-aware responses",
      "Insights from your entries",
      "Available 24/7, judgment-free",
    ],
  },
];

// ============================================================
// FAQ DATA
// ============================================================
const FAQS = [
  {
    category: "Dashboard",
    question: "What can I see on my Dashboard?",
    answer:
      "Your Dashboard shows a quick snapshot of your wellness: total journal entries, current streak, average sleep, and average mood score. It also visualizes mood trends, stress patterns, sleep overview, and mood-by-tag insights — all in one calm view.",
  },
  {
    category: "Dashboard",
    question: "How does the mood picker work?",
    answer:
      'From the Dashboard, you can pick how you feel today using our emoji-based mood selector. Once you select a mood and click "Let\'s Begin," it takes you straight to the Daily Journal with your mood already filled in.',
  },
  {
    category: "Daily Journal",
    question: "How long does it take to write a journal entry?",
    answer:
      "Less than a minute. Our guided prompts make it easy to capture how you feel, your stress and energy levels, hours of sleep, and optional tags. You can write as little or as much as you want — there's no pressure.",
  },
  {
    category: "Daily Journal",
    question: "Can I edit a journal entry after I save it?",
    answer:
      "Each entry is logged with a timestamp to keep your reflections honest and your mood trends accurate. Right now, entries are meant to be a snapshot in time, so you cannot edit them — but you can always write a new entry to reflect how you feel now.",
  },
  {
    category: "History",
    question: "How do I find a specific journal entry?",
    answer:
      'On desktop, simply click any entry card to expand it and see the full details — mood, feeling, stress, energy, sleep, and tags. On mobile and tablet, tap the three-dot menu on each entry and select "View Details" to open a full-screen view.',
  },
  {
    category: "History",
    question: "Can I see patterns in my mood over time?",
    answer:
      "Yes! Your History page shows each entry in order, with the mood color and emoji for a quick visual read. Combine this with the Dashboard's mood trends chart to spot patterns across weeks and months.",
  },
  {
    category: "AI Assistant",
    question: "How does the AI Assistant use my entries?",
    answer:
      "The AI Assistant reads your recent journal entries to give you personalized, empathetic insights — not generic advice. It's like a friend who truly listens, understands your context, and responds with care.",
  },
  {
    category: "AI Assistant",
    question: "Is my conversation with the AI private?",
    answer:
      "Yes. Your conversations are private and tied only to your account. We never share your entries or chats with anyone, and we don't sell your data. Your mind is your space — we just help you make sense of it.",
  },
  {
    category: "General",
    question: "Is MindFul free to use?",
    answer:
      "Yes! All core features — Dashboard, Daily Journal, History, and AI Assistant — are free to use. Just sign up with a Google account or email, and you're ready to go.",
  },
  {
    category: "General",
    question: "Can I use MindFul on my phone?",
    answer:
      "Absolutely. MindFul is designed to work beautifully on phones, tablets, and desktops. Everything syncs seamlessly, so you can journal on your phone in the morning and review your trends on your laptop later.",
  },
];

// ============================================================
// LANDING PAGE
// ============================================================
export default function Landingpage() {
  // FAQ state
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");

  const showModal = (type: "success" | "error", title: string) => {
    setModalType(type);
    setModalTitle(title);
    setModalOpen(true);
    setTimeout(() => setModalOpen(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      showModal("error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
        EMAILJS_PUBLIC_KEY
      );

      showModal("success", "Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("EmailJS error:", err);
      showModal("error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor: "#F0F7FE",
      transition: "all 0.2s ease",
      "& fieldset": { borderColor: "transparent", borderWidth: 2 },
      "&:hover": {
        backgroundColor: "#EAF3FF",
        "& fieldset": { borderColor: "#90CAF9" },
      },
      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
        "& fieldset": { borderColor: "#1976D2", borderWidth: 2 },
      },
    },
  };

  return (
    <Box>
      {/* ============================================================ */}
      {/* 1. HOME — HERO */}
      {/* ============================================================ */}
      <Box
        id="home"
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
                component="a"
                href="#about"
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

      {/* ============================================================ */}
      {/* 2. ABOUT — HERO */}
      {/* ============================================================ */}
      <Box
        id="about"
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 3, sm: 4 },
          position: "relative",
          overflow: "hidden",
        }}
      >
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
      {/* 3. ABOUT — MISSION & VISION */}
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
            {/* MISSION */}
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

            {/* VISION */}
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
      {/* 4. ABOUT — OUR STORY */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: { xs: 3, sm: 4 },
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

      {/* ============================================================ */}
      {/* 5. SERVICES — HERO */}
      {/* ============================================================ */}
      <Box
        id="services"
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 3, sm: 4 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 240,
            height: 240,
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
            right: "5%",
            width: 300,
            height: 300,
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
              Our{" "}
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
                Services
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 16, sm: 18 },
                color: "#4A6F88",
                lineHeight: 1.8,
                maxWidth: 620,
                mx: "auto",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.25s forwards`,
              }}
            >
              Four simple tools, one calm experience. Everything you need to
              understand and care for your mind.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* 6. SERVICES — GRID */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 4, md: 8 },
          px: { xs: 3, sm: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 3,
            }}
          >
            {SERVICES.map((service, i) => (
              <Paper
                key={service.title}
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(25, 118, 210, 0.08)",
                  boxShadow: "0 4px 20px rgba(25, 118, 210, 0.06)",
                  transition: "all 0.25s ease",
                  display: "flex",
                  flexDirection: "column",
                  opacity: 0,
                  animation: `${fadeInUp} 0.7s ease-out ${0.15 + i * 0.1}s forwards`,
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(25, 118, 210, 0.15)",
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
                  {service.icon}
                </Box>

                <Typography
                  sx={{ fontSize: 19, fontWeight: 700, color: "#0D3654", mb: 1 }}
                >
                  {service.title}
                </Typography>

                <Typography
                  sx={{ fontSize: 14.5, color: "#4A6F88", lineHeight: 1.7, mb: 2 }}
                >
                  {service.desc}
                </Typography>

                <Stack spacing={0.75} sx={{ mt: "auto" }}>
                  {service.features.map((feature) => (
                    <Box
                      key={feature}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#1976D2",
                          flexShrink: 0,
                        }}
                      />
                      <Typography sx={{ fontSize: 13.5, color: "#4A6F88" }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* 7. SERVICES — FAQ */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: { xs: 3, sm: 4 },
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              justifyContent: "center",
              mb: 2,
              opacity: 0,
              animation: `${fadeInUp} 0.8s ease-out 0.1s forwards`,
            }}
          >
            <HelpOutlineRoundedIcon
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
              Frequently Asked Questions
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: 15, sm: 16 },
              color: "#4A6F88",
              textAlign: "center",
              mb: { xs: 4, md: 5 },
              maxWidth: 620,
              mx: "auto",
              lineHeight: 1.7,
              opacity: 0,
              animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
            }}
          >
            Everything you need to know about our features. Still have
            questions? Feel free to reach out anytime.
          </Typography>

          <Stack spacing={1.5}>
            {FAQS.map((faq, i) => {
              const panelId = `panel-${i}`;
              const isExpanded = expanded === panelId;

              return (
                <Accordion
                  key={panelId}
                  expanded={isExpanded}
                  onChange={handleChange(panelId)}
                  disableGutters
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(25, 118, 210, 0.08)",
                    boxShadow: isExpanded
                      ? "0 8px 24px rgba(25, 118, 210, 0.1)"
                      : "0 2px 10px rgba(25, 118, 210, 0.04)",
                    transition: "all 0.25s ease",
                    opacity: 0,
                    animation: `${fadeInUp} 0.6s ease-out ${0.1 + i * 0.05}s forwards`,
                    "&::before": { display: "none" },
                    "&.Mui-expanded": {
                      margin: 0,
                      borderColor: "rgba(25, 118, 210, 0.25)",
                    },
                    "&:hover": {
                      borderColor: "rgba(25, 118, 210, 0.2)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreRoundedIcon
                        sx={{
                          color: isExpanded ? "#1976D2" : "#5A7D96",
                          transition: "all 0.25s ease",
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    }
                    sx={{
                      px: { xs: 2, sm: 3 },
                      py: 0.5,
                      minHeight: 64,
                      "& .MuiAccordionSummary-content": {
                        my: 1.5,
                        flexDirection: "column",
                        gap: 0.5,
                      },
                      "&.Mui-expanded": {
                        minHeight: 64,
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        alignSelf: "flex-start",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: 0.6,
                        color: "#1976D2",
                        textTransform: "uppercase",
                        backgroundColor: alpha("#1976D2", 0.1),
                        px: 1.2,
                        py: 0.25,
                        borderRadius: 1.5,
                        mb: 0.4,
                      }}
                    >
                      {faq.category}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: { xs: "0.95rem", sm: "1.02rem" },
                        fontWeight: 700,
                        color: isExpanded ? "#1976D2" : "#0D3654",
                        lineHeight: 1.4,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      px: { xs: 2, sm: 3 },
                      pt: 0,
                      pb: { xs: 2.5, sm: 3 },
                      animation: isExpanded
                        ? "fadeInAnswer 0.3s ease"
                        : "none",
                      "@keyframes fadeInAnswer": {
                        "0%": { opacity: 0, transform: "translateY(-6px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 1,
                        width: "100%",
                        background:
                          "linear-gradient(90deg, rgba(25,118,210,0.2), transparent)",
                        mb: 2,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "0.95rem" },
                        color: "#4A6F88",
                        lineHeight: 1.8,
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* 8. CONTACT — HERO */}
      {/* ============================================================ */}
      <Box
        id="contact"
        sx={{
          py: { xs: 8, md: 10 },
          px: { xs: 3, sm: 4 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            left: "8%",
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
            right: "5%",
            width: 280,
            height: 280,
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
              Get in{" "}
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
                Touch
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 16, sm: 18 },
                color: "#4A6F88",
                lineHeight: 1.8,
                maxWidth: 620,
                mx: "auto",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.25s forwards`,
              }}
            >
              Have a question, feedback, or just want to say hi? We'd love to
              hear from you.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* 9. CONTACT — FORM (CENTERED) */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          px: { xs: 3, sm: 4 },
          pb: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(25, 118, 210, 0.1)",
              boxShadow:
                "0 20px 50px rgba(25, 118, 210, 0.1), 0 8px 20px rgba(25, 118, 210, 0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              opacity: 0,
              animation: `${fadeInUp} 0.7s ease-out 0.2s forwards`,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 22, sm: 24 },
                fontWeight: 800,
                color: "#0D3654",
                mb: 1,
                letterSpacing: -0.3,
                textAlign: "center",
              }}
            >
              Send us a Message
            </Typography>
            <Typography
              sx={{
                fontSize: 14.5,
                color: "#4A6F88",
                textAlign: "center",
                mb: 3,
                lineHeight: 1.7,
              }}
            >
              Fill out the form below and we'll get back to you as soon as we
              can.
            </Typography>

            {/* NAME */}
            <Typography
              component="label"
              htmlFor="landing-name"
              sx={{ mb: 0.5, fontSize: 13, fontWeight: 700, color: "#1D425D" }}
            >
              Your Name
            </Typography>
            <TextField
              id="landing-name"
              fullWidth
              placeholder="Juan Dela Cruz"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              sx={inputSx}
            />

            {/* EMAIL */}
            <Typography
              component="label"
              htmlFor="landing-email"
              sx={{
                mt: 2,
                mb: 0.5,
                fontSize: 13,
                fontWeight: 700,
                color: "#1D425D",
              }}
            >
              Email Address
            </Typography>
            <TextField
              id="landing-email"
              type="email"
              fullWidth
              placeholder="juan@gmail.com"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              sx={inputSx}
            />

            {/* MESSAGE */}
            <Typography
              component="label"
              htmlFor="landing-message"
              sx={{
                mt: 2,
                mb: 0.5,
                fontSize: 13,
                fontWeight: 700,
                color: "#1D425D",
              }}
            >
              Message
            </Typography>
            <TextField
              id="landing-message"
              fullWidth
              placeholder="Tell us how we can help..."
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
              sx={inputSx}
            />

            {/* SUBMIT */}
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={loading}
              endIcon={!loading && <SendRoundedIcon />}
              sx={{
                mt: 3,
                minHeight: 48,
                borderRadius: 2.5,
                textTransform: "none",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                background:
                  "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.35)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)",
                  boxShadow: "0 8px 26px rgba(25, 118, 210, 0.45)",
                  transform: "translateY(-2px)",
                },
                "&.Mui-disabled": {
                  background: "#90CAF9",
                  color: "#fff",
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
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Send Message"
              )}
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* MODAL — success / error */}
      {/* ============================================================ */}
      <Dialog
        open={modalOpen}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              p: 1,
              textAlign: "center",
              background:
                "linear-gradient(135deg, #FFFFFF 0%, #F0F7FE 100%)",
              border: "1px solid rgba(25, 118, 210, 0.15)",
            },
          },
        }}
      >
        <DialogContent sx={{ pt: 3, pb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {modalType === "success" ? (
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 64,
                  color: "#1976D2",
                  animation: "popIn 0.4s ease",
                  "@keyframes popIn": {
                    "0%": { transform: "scale(0.5)", opacity: 0 },
                    "70%": { transform: "scale(1.1)", opacity: 1 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              />
            ) : (
              <ErrorRoundedIcon
                sx={{
                  fontSize: 64,
                  color: "#E53935",
                  animation: "popIn 0.4s ease",
                  "@keyframes popIn": {
                    "0%": { transform: "scale(0.5)", opacity: 0 },
                    "70%": { transform: "scale(1.1)", opacity: 1 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              />
            )}
          </Box>
          <Typography
            sx={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "#0D3654",
              lineHeight: 1.5,
            }}
          >
            {modalTitle}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}