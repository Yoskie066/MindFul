// src/pages/User/DailyJournal.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Slider,
  Button,
  alpha,
  Chip,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EmojiEmotionsRoundedIcon from "@mui/icons-material/EmojiEmotionsRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";

export default function DailyJournal() {
  const navigate = useNavigate();

  // ============================================================
  // MOOD (auto-filled from Dashboard – read-only)
  // ============================================================
  const moodLabel = localStorage.getItem("selectedMood") || "";
  const moodEmoji = localStorage.getItem("selectedMoodEmoji") || "";
  const moodColor = localStorage.getItem("selectedMoodColor") || "#1976D2";

  // Today's date for datetime-local min value
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);

  // ============================================================
  // STATE
  // ============================================================
  const [dateTime, setDateTime] = useState(localISOTime);
  const [feeling, setFeeling] = useState("");
  const [stressLevel, setStressLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableTags = [
    "School",
    "Work",
    "Family",
    "Friends",
    "Health",
    "Personal",
    "Exercise",
    "Hobbies",
    "Relationship",
    "Finance",
    "Sleep",
    "Meditation",
    "Reading",
    "Music",
    "Travel",
    "Weather",
    "Food",
    "Social Media",
  ];

  const handleTagToggle = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const journalEntry = {
        mood: moodLabel,
        moodEmoji,
        moodColor,
        dateTime,
        feeling,
        stressLevel,
        energyLevel,
        sleepHours,
        tags,
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem("journalEntries") || "[]");
      localStorage.setItem(
        "journalEntries",
        JSON.stringify([...existing, journalEntry])
      );

      setSuccess(true);
      setTimeout(() => {
        localStorage.removeItem("selectedMood");
        localStorage.removeItem("selectedMoodEmoji");
        localStorage.removeItem("selectedMoodColor");
        navigate("/history");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save journal entry.");
    } finally {
      setLoading(false);
    }
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
          Daily Journal
        </Typography>
      </Box>

      {/* Main Card */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
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
          position: "relative",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* ----- MOOD (read-only text) ----- */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#1D425D",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <EmojiEmotionsRoundedIcon sx={{ fontSize: 18, color: "#1976D2" }} />
            Your Mood
          </Typography>

          {moodLabel ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 2.5,
                backgroundColor: alpha(moodColor, 0.1),
                border: `2px solid ${alpha(moodColor, 0.3)}`,
              }}
            >
              <Typography sx={{ fontSize: "2rem", lineHeight: 1 }}>
                {moodEmoji}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: moodColor,
                }}
              >
                {moodLabel}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2.5,
                backgroundColor: "#FFF7E6",
                border: "2px solid #FFE0B2",
              }}
            >
              <Typography sx={{ fontSize: "0.9rem", color: "#FB8C00" }}>
                No mood selected — please pick one from the Dashboard first.
              </Typography>
            </Box>
          )}
        </Box>

        {/* ----- DATE & TIME ----- */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#1D425D",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <AccessTimeRoundedIcon sx={{ fontSize: 18, color: "#1976D2" }} />
            Date & Time
          </Typography>
          <TextField
            fullWidth
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
            size="small"
            slotProps={{
              htmlInput: { min: localISOTime },
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#F0F7FE",
                "& fieldset": { borderColor: "transparent", borderWidth: 2 },
                "&:hover fieldset": { borderColor: "#90CAF9" },
                "&.Mui-focused fieldset": { borderColor: "#1976D2", borderWidth: 2 },
              },
            }}
          />
        </Box>

        {/* ----- HOW ARE YOU FEELING TODAY? ----- */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#1D425D",
              mb: 1,
            }}
          >
            How are you feeling today?
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            placeholder="Write your thoughts here..."
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#F0F7FE",
                "& fieldset": { borderColor: "transparent", borderWidth: 2 },
                "&:hover fieldset": { borderColor: "#90CAF9" },
                "&.Mui-focused fieldset": { borderColor: "#1976D2", borderWidth: 2 },
              },
            }}
          />
        </Box>

        {/* ----- STRESS LEVEL ----- */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#1D425D" }}>
              Stress Level
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#E53935" }}>
              {stressLevel} / 10
            </Typography>
          </Box>
          <Slider
            value={stressLevel}
            onChange={(_, v) => setStressLevel(v as number)}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{
              color: "#E53935",
              "& .MuiSlider-mark": { backgroundColor: "#F8BBD0" },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#5A7D96" }}>Low</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#5A7D96" }}>High</Typography>
          </Box>
        </Box>

        {/* ----- ENERGY LEVEL ----- */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#1D425D" }}>
              Energy Level
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#43A047" }}>
              {energyLevel} / 10
            </Typography>
          </Box>
          <Slider
            value={energyLevel}
            onChange={(_, v) => setEnergyLevel(v as number)}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{
              color: "#43A047",
              "& .MuiSlider-mark": { backgroundColor: "#C8E6C9" },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#5A7D96" }}>Low</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#5A7D96" }}>High</Typography>
          </Box>
        </Box>

        {/* ----- SLEEP HOURS ----- */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#1D425D",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <BedtimeRoundedIcon sx={{ fontSize: 18, color: "#5C6BC0" }} />
            Sleep Hours
          </Typography>
          <TextField
            type="number"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            size="small"
            fullWidth
            slotProps={{
              htmlInput: { min: 0, max: 24, step: 0.5 },
              input: {
                endAdornment: <InputAdornment position="end">hours</InputAdornment>,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#F0F7FE",
                "& fieldset": { borderColor: "transparent", borderWidth: 2 },
                "&:hover fieldset": { borderColor: "#90CAF9" },
                "&.Mui-focused fieldset": { borderColor: "#1976D2", borderWidth: 2 },
              },
            }}
          />
        </Box>

        {/* ----- TAGS ----- */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#1D425D",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <LocalOfferRoundedIcon sx={{ fontSize: 18, color: "#FB8C00" }} />
            Tags (optional)
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.2,
              mt: 1,
            }}
          >
            {availableTags.map((tag) => {
              const isSelected = tags.includes(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagToggle(tag)}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    height: 36,
                    px: 0.5,
                    bgcolor: isSelected ? "#1976D2" : "#F0F7FE",
                    color: isSelected ? "#fff" : "#1D425D",
                    border: isSelected
                      ? "2px solid #1976D2"
                      : "2px solid transparent",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      bgcolor: isSelected ? "#0D47A1" : "#EAF3FF",
                      transform: "translateY(-2px)",
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* ----- SUBMIT BUTTON ----- */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={loading}
            startIcon={<SendRoundedIcon />}
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
              "&:active": { transform: "scale(0.98)" },
              "&.Mui-disabled": {
                background: "#90CAF9",
                color: "#fff",
              },
            }}
          >
            {loading ? "Saving..." : "Enter"}
          </Button>
        </Box>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          Journal saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}