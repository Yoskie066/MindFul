import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

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

// ============================================================
// SERVICES
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
// FAQ
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
      "From the Dashboard, you can pick how you feel today using our emoji-based mood selector. Once you select a mood and click \"Let's Begin,\" it takes you straight to the Daily Journal with your mood already filled in.",
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
      "On desktop, simply click any entry card to expand it and see the full details — mood, feeling, stress, energy, sleep, and tags. On mobile and tablet, tap the three-dot menu on each entry and select \"View Details\" to open a full-screen view.",
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

export default function Services() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

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
      {/* SERVICES GRID */}
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
      {/* FAQ SECTION */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: { xs: 3, sm: 4 },
          pb: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="md">
          {/* FAQ HEADER */}
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

          {/* FAQ ACCORDIONS */}
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
                    {/* CATEGORY CHIP */}
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

                    {/* QUESTION */}
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
    </Box>
  );
}