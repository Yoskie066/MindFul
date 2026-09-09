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
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); 
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); 

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

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

  // Determine items per slide based on screen size
  const itemsPerSlide = isDesktop ? 4 : 2;

  // Group moods into chunks based on itemsPerSlide
  const moodChunks = [];
  for (let i = 0; i < moods.length; i += itemsPerSlide) {
    moodChunks.push(moods.slice(i, i + itemsPerSlide));
  }
  const totalSlides = moodChunks.length;

  const handleMoodSelect = (emoji: string) => {
    setSelectedMood(emoji);
  };

  const handleStart = () => {
    navigate("/daily-journal");
  };

  // Carousel navigation
  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
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

  // Auto-slide for carousel (all devices)
  useEffect(() => {
    if (isHovering || totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering, totalSlides]);

  // Sync scroll when currentSlide changes
  useEffect(() => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
      const gap = 24;
      scrollRef.current.scrollTo({
        left: (slideWidth + gap) * currentSlide,
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  // Render mood item
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

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Welcome Section */}
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
          Welcome back, {userName} 👋
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
            color: "#5A7D96",
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          Let's check in with yourself today.
        </Typography>
      </Box>

      {/* Main Card */}
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

        {/* ===== CAROUSEL VIEW (ALL DEVICES) ===== */}
        <Box
          sx={{
            position: "relative",
            px: { xs: 3, sm: 4 },
            onMouseEnter: () => setIsHovering(true),
            onMouseLeave: () => setIsHovering(false),
          }}
        >
          {/* Left Arrow */}
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

          {/* Right Arrow */}
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

          {/* Carousel Slides */}
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
              // Determine grid columns based on items per slide
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

          {/* Slide Indicators (dots) */}
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

        {/* "Let's Begin Button */}
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
    </Box>
  );
}