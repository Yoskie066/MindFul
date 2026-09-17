import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  IconButton,
  Button,
  Typography,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import EmojiEmotionsRoundedIcon from "@mui/icons-material/EmojiEmotionsRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import { dashboardApi } from "../../services/api";

// ============================================================
// TYPES
// ============================================================
interface JournalEntry {
  mood: string;
  moodEmoji: string;
  moodColor: string;
  dateTime: string;
  feeling: string;
  stressLevel: number;
  energyLevel: number;
  sleepHours: number;
  tags: string[];
  createdAt: string;
}

const MOOD_SCORES: Record<string, number> = {
  Happy: 9,
  Calm: 8,
  Excited: 9,
  Grateful: 9,
  Focused: 7,
  Reflective: 6,
  Tired: 4,
  Stressed: 3,
  Sad: 3,
  Frustrated: 2,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userEmail = userData?.email || "User";
  const userName = userEmail.split("@")[0];

  const moods = [
    { emoji: "😊", label: "Happy", color: "#43A047" },
    { emoji: "😌", label: "Calm", color: "#1E88E5" },
    { emoji: "😅", label: "Stressed", color: "#FB8C00" },
    { emoji: "😢", label: "Sad", color: "#5C6BC0" },
    { emoji: "😤", label: "Frustrated", color: "#E53935" },
    { emoji: "🥱", label: "Tired", color: "#8D6E63" },
    { emoji: "🤔", label: "Reflective", color: "#6A1B9A" },
    { emoji: "😄", label: "Excited", color: "#FF6F00" },
    { emoji: "🧘", label: "Focused", color: "#00897B" },
    { emoji: "🤗", label: "Grateful", color: "#2E7D32" },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getAll();
        setEntries(res.data.entries || []);
      } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    }
  };
  fetchDashboard();
}, []);

  const itemsPerSlide = isDesktop ? 4 : 2;

  const moodChunks = [];
  for (let i = 0; i < moods.length; i += itemsPerSlide) {
    moodChunks.push(moods.slice(i, i + itemsPerSlide));
  }
  const totalSlides = moodChunks.length;

  const handleMoodSelect = (emoji: string) => {
    setSelectedMood(emoji);
  };

  const handleStart = () => {
    if (selectedMood) {
      const moodObj = moods.find((m) => m.emoji === selectedMood);
      if (moodObj) {
        localStorage.setItem("selectedMood", moodObj.label);
        localStorage.setItem("selectedMoodEmoji", moodObj.emoji);
        localStorage.setItem("selectedMoodColor", moodObj.color);
      }
    }
    navigate("/daily-journal");
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const slideWidth =
        scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
      const gap = 24;
      scrollRef.current.scrollTo({
        left: (slideWidth + gap) * index,
        behavior: "smooth",
      });
      setCurrentSlide(index);
    }
  };

  const goToPrev = () => {
    const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    scrollToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentSlide + 1) % totalSlides;
    scrollToSlide(newIndex);
  };

  useEffect(() => {
    if (isHovering || totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering, totalSlides]);

  useEffect(() => {
    if (scrollRef.current) {
      const slideWidth =
        scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
      const gap = 24;
      scrollRef.current.scrollTo({
        left: (slideWidth + gap) * currentSlide,
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  const renderMoodItem = (mood: typeof moods[0]) => {
    const isSelected = selectedMood === mood.emoji;
    return (
      <Box
        key={mood.emoji}
        onClick={() => handleMoodSelect(mood.emoji)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 2.5 },
          borderRadius: "50%",
          aspectRatio: "1/1",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: isSelected
            ? `radial-gradient(circle at 30% 30%, ${mood.color}40, ${mood.color}15)`
            : "transparent",
          border: isSelected ? `3px solid ${mood.color}` : "3px solid transparent",
          boxShadow: isSelected ? `0 8px 32px ${alpha(mood.color, 0.25)}` : "none",
          transform: isSelected ? "scale(1.04)" : "scale(1)",
          "&:hover": {
            transform: isSelected ? "scale(1.04)" : "scale(1.02)",
            backgroundColor: alpha(mood.color, 0.06),
          },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "2.8rem", sm: "3.2rem", md: "3.6rem" },
            lineHeight: 1,
          }}
        >
          {mood.emoji}
        </Typography>
        <Typography
          sx={{
            mt: 1,
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
            fontWeight: 600,
            color: isSelected ? mood.color : "#5A7D96",
            transition: "color 0.3s ease",
          }}
        >
          {mood.label}
        </Typography>
      </Box>
    );
  };

  // ============================================================
  // STATS / ANALYTICS
  // ============================================================
  const totalEntries = entries.length;

  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    const dates = entries
      .map((e) => new Date(e.dateTime).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dates[0] !== today && dates[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const curr = new Date(dates[i - 1]).getTime();
      const prev = new Date(dates[i]).getTime();
      const diffDays = (curr - prev) / 86400000;
      if (diffDays === 1) streak++;
      else break;
    }
    return streak;
  };

  const streak = calculateStreak();

  const avgSleep =
    totalEntries > 0
      ? (
          entries.reduce((s, e) => s + (e.sleepHours || 0), 0) / totalEntries
        ).toFixed(1)
      : "0";

  const avgMoodScore =
    totalEntries > 0
      ? (
          entries.reduce(
            (s, e) => s + (MOOD_SCORES[e.mood] || 5),
            0
          ) / totalEntries
        ).toFixed(1)
      : "0";

  const moodDistribution = moods
    .map((m) => ({
      ...m,
      count: entries.filter((e) => e.mood === m.label).length,
    }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);

  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags || [])));
  const moodByTag = allTags
    .map((tag) => {
      const tagged = entries.filter((e) => e.tags?.includes(tag));
      const avgScore =
        tagged.reduce((s, e) => s + (MOOD_SCORES[e.mood] || 5), 0) /
        tagged.length;
      return { tag, avgScore, count: tagged.length };
    })
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 6);

  const recentActivity = [...entries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // ============================================================
  // CHART HELPERS
  // ============================================================
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const pointsCount = entries.length;
  const xStep = pointsCount > 1 ? innerWidth / (pointsCount - 1) : 0;

  const buildLinePath = (values: number[], maxVal: number = 10) => {
    if (values.length === 0) return "";
    return values
      .map((v, i) => {
        const x = padding.left + i * xStep;
        const y = padding.top + innerHeight - (v / maxVal) * innerHeight;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const moodScores = entries.map((e) => MOOD_SCORES[e.mood] || 5);
  const stressValues = entries.map((e) => e.stressLevel);

  const moodPath = buildLinePath(moodScores, 10);
  const stressPath = buildLinePath(stressValues, 10);

  const maxSleep = 12;
  const sleepBarWidth =
    pointsCount > 0 ? Math.min(40, innerWidth / pointsCount / 1.5) : 0;

  const formatShortDate = (dt: string) => {
    if (!dt) return "";
    const d = new Date(dt);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const cardSx = {
    p: { xs: 2.5, sm: 3 },
    borderRadius: { xs: 4, sm: 5 },
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: (theme: any) =>
      `0 12px 40px ${alpha(
        theme.palette.primary.main,
        0.08
      )}, 0 4px 16px ${alpha(theme.palette.primary.main, 0.04)}`,
    border: "1px solid rgba(255, 255, 255, 0.7)",
    transition: "all 0.3s ease",
  };

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 },
        pb: 4,
      }}
    >
      {/* ============================================================ */}
      {/* WELCOME SECTION */}
      {/* ============================================================ */}
      <Box sx={{ mb: { xs: 3, sm: 5 }, textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: 800,
            color: "#0D3654",
            mb: 1,
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #0D3654 30%, #1976D2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome back, {userName}
        </Typography>
      </Box>

      {/* ============================================================ */}
      {/* MOOD CAROUSEL CARD */}
      {/* ============================================================ */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: { xs: 4, sm: 5, md: 6 },
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: (theme) =>
            `0 20px 60px ${alpha(theme.palette.primary.main, 0.1)}, 0 8px 24px ${alpha(
              theme.palette.primary.main,
              0.04
            )}`,
          border: "1px solid rgba(255, 255, 255, 0.7)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: (theme) =>
              `0 30px 80px ${alpha(theme.palette.primary.main, 0.12)}, 0 12px 32px ${alpha(
                theme.palette.primary.main,
                0.05
              )}`,
          },
          textAlign: "center",
          position: "relative",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
            fontWeight: 700,
            color: "#0D3654",
            mb: { xs: 2.5, sm: 3.5 },
            letterSpacing: "-0.01em",
            position: "relative",
            display: "inline-block",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 48,
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(90deg, #1976D2, #64B5F6)",
            },
          }}
        >
          How are you today?
        </Typography>

        <Box
          sx={{
            position: "relative",
            px: { xs: 3, sm: 4 },
            onMouseEnter: () => setIsHovering(true),
            onMouseLeave: () => setIsHovering(false),
          }}
        >
          <IconButton
            onClick={goToPrev}
            sx={{
              position: "absolute",
              left: { xs: -4, sm: -8 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.9)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              "&:hover": { bgcolor: "white", boxShadow: "0 6px 20px rgba(0,0,0,0.12)" },
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
            }}
          >
            <ArrowBackIosNewRoundedIcon
              sx={{ fontSize: { xs: 16, sm: 20 }, color: "#0D3654" }}
            />
          </IconButton>

          <IconButton
            onClick={goToNext}
            sx={{
              position: "absolute",
              right: { xs: -4, sm: -8 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.9)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              "&:hover": { bgcolor: "white", boxShadow: "0 6px 20px rgba(0,0,0,0.12)" },
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
            }}
          >
            <ArrowForwardIosRoundedIcon
              sx={{ fontSize: { xs: 16, sm: 20 }, color: "#0D3654" }}
            />
          </IconButton>

          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 3,
              py: 2,
              px: 0.5,
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
              scrollSnapStop: "always",
            }}
          >
            {moodChunks.map((chunk, index) => {
              const cols = isDesktop ? 4 : 2;
              return (
                <Box
                  key={index}
                  sx={{
                    minWidth: { xs: "100%", sm: "calc(50% - 12px)", md: "100%" },
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gap: 2,
                  }}
                >
                  {chunk.map((mood) => renderMoodItem(mood))}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
            {moodChunks.map((_, index) => (
              <Box
                key={index}
                onClick={() => scrollToSlide(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: currentSlide === index ? "#1976D2" : "#CBD5E1",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    bgcolor: currentSlide === index ? "#1976D2" : "#94A3B8",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {selectedMood && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              mt: 3,
              animation: "fadeUp 0.5s ease",
              "@keyframes fadeUp": {
                "0%": { opacity: 0, transform: "translateY(12px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Button
              variant="contained"
              disableElevation
              onClick={handleStart}
              sx={{
                minHeight: { xs: 48, sm: 54 },
                px: { xs: 5, sm: 7, md: 8 },
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: 4,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                fontWeight: 700,
                letterSpacing: 0.6,
                textTransform: "none",
                background: "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                boxShadow: "0 8px 28px rgba(25, 118, 210, 0.35)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)",
                  boxShadow: "0 12px 36px rgba(25, 118, 210, 0.45)",
                  transform: "translateY(-3px) scale(1.02)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              Let's Begin
            </Button>
          </Box>
        )}
      </Paper>

      {/* ============================================================ */}
      {/* 1. QUICK STATS  */}
      
      {/* ============================================================ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", 
            sm: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 1.5, sm: 2 },
          mt: 3,
          mb: 3,
        }}
      >
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha("#1976D2", 0.1),
              }}
            >
              <EventNoteRoundedIcon sx={{ color: "#1976D2" }} />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 600 }}
              >
                TOTAL ENTRIES
              </Typography>
              <Typography
                sx={{ fontSize: "1.4rem", fontWeight: 800, color: "#0D3654" }}
              >
                {totalEntries}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha("#FB8C00", 0.1),
              }}
            >
              <LocalFireDepartmentRoundedIcon sx={{ color: "#FB8C00" }} />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 600 }}
              >
                STREAK
              </Typography>
              <Typography
                sx={{ fontSize: "1.4rem", fontWeight: 800, color: "#0D3654" }}
              >
                {streak} {streak === 1 ? "day" : "days"}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha("#5C6BC0", 0.1),
              }}
            >
              <BedtimeRoundedIcon sx={{ color: "#5C6BC0" }} />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 600 }}
              >
                AVG SLEEP
              </Typography>
              <Typography
                sx={{ fontSize: "1.4rem", fontWeight: 800, color: "#0D3654" }}
              >
                {avgSleep}h
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha("#43A047", 0.1),
              }}
            >
              <SpaRoundedIcon sx={{ color: "#43A047" }} />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 600 }}
              >
                AVG MOOD
              </Typography>
              <Typography
                sx={{ fontSize: "1.4rem", fontWeight: 800, color: "#0D3654" }}
              >
                {avgMoodScore}
                <Box
                  component="span"
                  sx={{ fontSize: "0.8rem", color: "#90A4AE" }}
                >
                  /10
                </Box>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* ---------- EMPTY STATE ---------- */}
      {entries.length === 0 && (
        <Paper
          elevation={0}
          sx={{ ...cardSx, p: { xs: 4, sm: 5 }, textAlign: "center", mb: 3 }}
        >
          <EventNoteRoundedIcon
            sx={{ fontSize: 56, color: "#90CAF9", mb: 1.5 }}
          />
          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#0D3654",
              mb: 0.5,
            }}
          >
            No data yet
          </Typography>
        </Paper>
      )}

      {entries.length > 0 && (
        <>
          {/* ---------- 2. MOOD TREND ---------- */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InsightsRoundedIcon sx={{ color: "#1976D2" }} />
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.15rem" },
                    fontWeight: 700,
                    color: "#0D3654",
                  }}
                >
                  Mood Trend
                </Typography>
              </Box>
              <Chip
                icon={<EmojiEmotionsRoundedIcon sx={{ fontSize: 16 }} />}
                label={`${totalEntries} entries`}
                size="small"
                sx={{
                  bgcolor: alpha("#1976D2", 0.1),
                  color: "#1976D2",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  borderRadius: 2,
                  "& .MuiChip-icon": { color: "#1976D2" },
                }}
              />
            </Box>

            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                style={{
                  width: "100%",
                  maxWidth: chartWidth,
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                }}
              >
                {[0, 2, 4, 6, 8, 10].map((v) => {
                  const y = padding.top + innerHeight - (v / 10) * innerHeight;
                  return (
                    <g key={v}>
                      <line
                        x1={padding.left}
                        x2={chartWidth - padding.right}
                        y1={y}
                        y2={y}
                        stroke="rgba(0,0,0,0.06)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padding.left - 6}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="9"
                        fill="#90A4AE"
                      >
                        {v}
                      </text>
                    </g>
                  );
                })}

                {moodScores.length > 1 && (
                  <path
                    d={`${moodPath} L ${
                      padding.left + (pointsCount - 1) * xStep
                    } ${padding.top + innerHeight} L ${padding.left} ${
                      padding.top + innerHeight
                    } Z`}
                    fill={alpha("#1976D2", 0.1)}
                  />
                )}

                <path
                  d={moodPath}
                  stroke="#1976D2"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {entries.map((entry, i) => {
                  const x = padding.left + i * xStep;
                  const y =
                    padding.top +
                    innerHeight -
                    ((MOOD_SCORES[entry.mood] || 5) / 10) * innerHeight;
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#fff"
                        stroke="#1976D2"
                        strokeWidth="2.5"
                      />
                      <text
                        x={x}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#5A7D96"
                      >
                        {formatShortDate(entry.dateTime)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </Box>
          </Paper>

          {/* ---------- 3. MOOD DISTRIBUTION + STRESS TREND ---------- */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              mb: 3,
            }}
          >
            <Paper elevation={0} sx={cardSx}>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  fontWeight: 700,
                  color: "#0D3654",
                  mb: 2,
                }}
              >
                Mood Distribution
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {moodDistribution.map((m) => {
                  const pct = (m.count / totalEntries) * 100;
                  return (
                    <Box key={m.label}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography sx={{ fontSize: "1.1rem" }}>
                            {m.emoji}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: "#0D3654",
                            }}
                          >
                            {m.label}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: m.color,
                          }}
                        >
                          {m.count} ({pct.toFixed(0)}%)
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(m.color, 0.1),
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${pct}%`,
                            height: "100%",
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${m.color}, ${alpha(
                              m.color,
                              0.6
                            )})`,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Paper>

            <Paper elevation={0} sx={cardSx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.15rem" },
                    fontWeight: 700,
                    color: "#0D3654",
                  }}
                >
                  Stress Trend
                </Typography>
                <Chip
                  icon={<TrendingUpRoundedIcon sx={{ fontSize: 16 }} />}
                  label="Daily"
                  size="small"
                  sx={{
                    bgcolor: alpha("#E53935", 0.1),
                    color: "#E53935",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    borderRadius: 2,
                    "& .MuiChip-icon": { color: "#E53935" },
                  }}
                />
              </Box>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  style={{
                    width: "100%",
                    maxWidth: chartWidth,
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                >
                  {[0, 2, 4, 6, 8, 10].map((v) => {
                    const y =
                      padding.top + innerHeight - (v / 10) * innerHeight;
                    return (
                      <g key={v}>
                        <line
                          x1={padding.left}
                          x2={chartWidth - padding.right}
                          y1={y}
                          y2={y}
                          stroke="rgba(0,0,0,0.06)"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padding.left - 6}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="9"
                          fill="#90A4AE"
                        >
                          {v}
                        </text>
                      </g>
                    );
                  })}
                  {stressValues.length > 1 && (
                    <path
                      d={`${stressPath} L ${
                        padding.left + (pointsCount - 1) * xStep
                      } ${padding.top + innerHeight} L ${padding.left} ${
                        padding.top + innerHeight
                      } Z`}
                      fill={alpha("#E53935", 0.1)}
                    />
                  )}
                  <path
                    d={stressPath}
                    stroke="#E53935"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {entries.map((entry, i) => {
                    const x = padding.left + i * xStep;
                    const y =
                      padding.top +
                      innerHeight -
                      (entry.stressLevel / 10) * innerHeight;
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#fff"
                          stroke="#E53935"
                          strokeWidth="2"
                        />
                        <text
                          x={x}
                          y={chartHeight - 8}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#5A7D96"
                        >
                          {formatShortDate(entry.dateTime)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </Box>
            </Paper>
          </Box>

          {/* ---------- 4. SLEEP OVERVIEW + MOOD BY TAG ---------- */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              mb: 3,
            }}
          >
            <Paper elevation={0} sx={cardSx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.15rem" },
                    fontWeight: 700,
                    color: "#0D3654",
                  }}
                >
                  Sleep Overview
                </Typography>
                <Chip
                  icon={<BedtimeRoundedIcon sx={{ fontSize: 16 }} />}
                  label={`avg ${avgSleep}h`}
                  size="small"
                  sx={{
                    bgcolor: alpha("#5C6BC0", 0.1),
                    color: "#5C6BC0",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    borderRadius: 2,
                    "& .MuiChip-icon": { color: "#5C6BC0" },
                  }}
                />
              </Box>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <svg
                  viewBox={`0 0 ${chartWidth} 200`}
                  style={{
                    width: "100%",
                    maxWidth: chartWidth,
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                >
                  {[0, 3, 6, 9, 12].map((v) => {
                    const y =
                      padding.top + innerHeight - (v / maxSleep) * innerHeight;
                    return (
                      <g key={v}>
                        <line
                          x1={padding.left}
                          x2={chartWidth - padding.right}
                          y1={y}
                          y2={y}
                          stroke="rgba(0,0,0,0.06)"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padding.left - 6}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="9"
                          fill="#90A4AE"
                        >
                          {v}
                        </text>
                      </g>
                    );
                  })}
                  {entries.map((entry, i) => {
                    const barHeight =
                      (entry.sleepHours / maxSleep) * innerHeight;
                    const x = padding.left + i * xStep - sleepBarWidth / 2;
                    const y = padding.top + innerHeight - barHeight;
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width={sleepBarWidth}
                          height={barHeight}
                          rx="6"
                          fill="url(#sleepGradient3)"
                        />
                        <text
                          x={padding.left + i * xStep}
                          y={y - 5}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="700"
                          fill="#5C6BC0"
                        >
                          {entry.sleepHours}h
                        </text>
                        <text
                          x={padding.left + i * xStep}
                          y={chartHeight - 18}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#5A7D96"
                        >
                          {formatShortDate(entry.dateTime)}
                        </text>
                      </g>
                    );
                  })}
                  <defs>
                    <linearGradient
                      id="sleepGradient3"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#7986CB" />
                      <stop offset="100%" stopColor="#C5CAE9" />
                    </linearGradient>
                  </defs>
                </svg>
              </Box>
            </Paper>

            <Paper elevation={0} sx={cardSx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.15rem" },
                    fontWeight: 700,
                    color: "#0D3654",
                  }}
                >
                  Mood by Tag
                </Typography>
                <Chip
                  icon={<LocalOfferRoundedIcon sx={{ fontSize: 16 }} />}
                  label={`${allTags.length} tags`}
                  size="small"
                  sx={{
                    bgcolor: alpha("#FB8C00", 0.1),
                    color: "#FB8C00",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    borderRadius: 2,
                    "& .MuiChip-icon": { color: "#FB8C00" },
                  }}
                />
              </Box>
              {moodByTag.length === 0 ? (
                <Typography sx={{ fontSize: "0.85rem", color: "#5A7D96" }}>
                  Add tags to your journal entries to see patterns.
                </Typography>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {moodByTag.map((t) => {
                    const pct = (t.avgScore / 10) * 100;
                    const color =
                      t.avgScore >= 7
                        ? "#43A047"
                        : t.avgScore >= 5
                        ? "#FB8C00"
                        : "#E53935";
                    return (
                      <Box key={t.tag}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: "#0D3654",
                            }}
                          >
                            {t.tag}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              color,
                            }}
                          >
                            {t.avgScore.toFixed(1)}/10 ({t.count})
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: alpha(color, 0.1),
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${pct}%`,
                              height: "100%",
                              borderRadius: 4,
                              background: `linear-gradient(90deg, ${color}, ${alpha(
                                color,
                                0.6
                              )})`,
                              transition: "width 0.6s ease",
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Paper>
          </Box>

          {/* ---------- 5. RECENT ACTIVITY ---------- */}
          <Paper elevation={0} sx={cardSx}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <AccessTimeRoundedIcon sx={{ color: "#1976D2" }} />
              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  fontWeight: 700,
                  color: "#0D3654",
                }}
              >
                Recent Activity
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {recentActivity.map((entry, i) => (
                <Box key={i}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      py: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        background: `radial-gradient(circle at 30% 30%, ${alpha(
                          entry.moodColor || "#1976D2",
                          0.25
                        )}, ${alpha(entry.moodColor || "#1976D2", 0.08)})`,
                        border: `2px solid ${alpha(
                          entry.moodColor || "#1976D2",
                          0.4
                        )}`,
                        flexShrink: 0,
                      }}
                    >
                      {entry.moodEmoji}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: entry.moodColor || "#1976D2",
                        }}
                      >
                        {entry.mood}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#5A7D96",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {entry.feeling || "—"}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography sx={{ fontSize: "0.7rem", color: "#90A4AE" }}>
                        {formatShortDate(entry.dateTime)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          mt: 0.3,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.65rem",
                            color: "#E53935",
                            fontWeight: 700,
                          }}
                        >
                          S:{entry.stressLevel}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.65rem",
                            color: "#43A047",
                            fontWeight: 700,
                          }}
                        >
                          E:{entry.energyLevel}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.65rem",
                            color: "#5C6BC0",
                            fontWeight: 700,
                          }}
                        >
                          💤{entry.sleepHours}h
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {i < recentActivity.length - 1 && (
                    <Divider sx={{ borderColor: "rgba(0,0,0,0.05)" }} />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}