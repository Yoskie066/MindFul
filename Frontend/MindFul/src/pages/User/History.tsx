import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  alpha,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { historyApi } from "../../services/api";

interface JournalEntry {
  id?: number;
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

export default function History() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsIndex, setDetailsIndex] = useState<number | null>(null);

  // ============================================================
  // LOAD ENTRIES FROM API
  // ============================================================
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await historyApi.getAll();
        setEntries(res.data.entries || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();
  }, []);

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "—";
    const d = new Date(dateTimeStr);
    return d.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Desktop: toggle expand
  const handleToggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Mobile/Tablet: open menu
  const handleOpenMenu = (
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setMenuAnchor(e.currentTarget);
    setMenuIndex(index);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuIndex(null);
  };

  // Mobile/Tablet: view details
  const handleViewDetails = () => {
    if (menuIndex !== null) {
      setDetailsIndex(menuIndex);
      setDetailsOpen(true);
    }
    handleCloseMenu();
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setDetailsIndex(null);
  };

  const selectedEntry =
    detailsIndex !== null ? entries[detailsIndex] : null;

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 },
        pb: 4,
      }}
    >
      {/* Header */}
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
          History
        </Typography>
      </Box>

      {/* Empty State */}
      {entries.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: { xs: 4, sm: 5, md: 6 },
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.7)",
            textAlign: "center",
          }}
        >
          <EventNoteRoundedIcon sx={{ fontSize: 64, color: "#90CAF9", mb: 2 }} />
          <Typography
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.4rem" },
              fontWeight: 700,
              color: "#0D3654",
              mb: 1,
            }}
          >
            No journal entries yet
          </Typography>
        </Paper>
      )}

      {/* ----- Entries List ----- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        {entries.map((entry, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <Paper
              key={entry.id ?? index}
              elevation={0}
              sx={{
                borderRadius: { xs: 3, sm: 4 },
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: (theme) =>
                  `0 12px 40px ${alpha(
                    theme.palette.primary.main,
                    0.08
                  )}, 0 4px 16px ${alpha(theme.palette.primary.main, 0.04)}`,
                border: "1px solid rgba(255, 255, 255, 0.7)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: (theme) =>
                    `0 20px 50px ${alpha(
                      theme.palette.primary.main,
                      0.12
                    )}, 0 8px 20px ${alpha(theme.palette.primary.main, 0.05)}`,
                },
              }}
            >
              {/* ----- Row Header  ----- */}
              <Box
                onClick={
                  isDesktop ? () => handleToggleExpand(index) : undefined
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  p: { xs: 2, sm: 2.5 },
                  cursor: isDesktop ? "pointer" : "default",
                  transition: "background-color 0.2s ease",
                  ...(isDesktop && {
                    "&:hover": {
                      backgroundColor: alpha(entry.moodColor || "#1976D2", 0.04),
                    },
                  }),
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {/* Mood Emoji */}
                  <Box
                    sx={{
                      width: { xs: 44, sm: 52 },
                      height: { xs: 44, sm: 52 },
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: { xs: "1.5rem", sm: "1.8rem" },
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
                    {entry.moodEmoji || "🙂"}
                  </Box>

                  {/* Mood Label + Date */}
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.95rem", sm: "1.05rem" },
                        fontWeight: 800,
                        color: entry.moodColor || "#1976D2",
                        lineHeight: 1.2,
                      }}
                    >
                      {entry.mood || "Unknown"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        color: "#5A7D96",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <AccessTimeRoundedIcon sx={{ fontSize: 13 }} />
                      {formatDateTime(entry.dateTime)}
                    </Typography>
                  </Box>
                </Box>

                {/* Desktop: down arrow */}
                {isDesktop && (
                  <IconButton
                    size="small"
                    sx={{
                      color: "#5A7D96",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <KeyboardArrowDownRoundedIcon />
                  </IconButton>
                )}

                {/* Mobile/Tablet: three-dot menu */}
                {!isDesktop && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenMenu(e, index)}
                    sx={{
                      color: "#5A7D96",
                      "&:hover": {
                        color: "#1976D2",
                        bgcolor: "rgba(25,118,210,0.08)",
                      },
                    }}
                  >
                    <MoreVertRoundedIcon />
                  </IconButton>
                )}
              </Box>

              {/* ----- Desktop: Expandable Details ----- */}
              {isDesktop && (
                <Box
                  sx={{
                    maxHeight: isExpanded ? 1000 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}
                >
                  <Divider sx={{ borderColor: "rgba(0,0,0,0.05)" }} />
                  <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <DetailsContent entry={entry} formatDateTime={formatDateTime} />
                  </Box>
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>

      {/* ----- Mobile/Tablet: Three-Dot Menu ----- */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              mt: 0.5,
              minWidth: 180,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.05)",
            },
          },
        }}
      >
        <MenuItem onClick={handleViewDetails} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <VisibilityRoundedIcon fontSize="small" sx={{ color: "#1976D2" }} />
          </ListItemIcon>
          <ListItemText
            primary="View Details"
            slotProps={{
              primary: {
                sx: {
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#0D3654",
                },
              },
            }}
          />
        </MenuItem>
      </Menu>

      {/* ----- Mobile/Tablet: Details Dialog ----- */}
      <Dialog
        open={detailsOpen}
        onClose={closeDetails}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              p: 1,
            },
          },
        }}
      >
        {selectedEntry && (
          <>
            {/* DialogTitle  */}
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                pb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    background: `radial-gradient(circle at 30% 30%, ${alpha(
                      selectedEntry.moodColor || "#1976D2",
                      0.25
                    )}, ${alpha(selectedEntry.moodColor || "#1976D2", 0.08)})`,
                    border: `2px solid ${alpha(
                      selectedEntry.moodColor || "#1976D2",
                      0.4
                    )}`,
                  }}
                >
                  {selectedEntry.moodEmoji || "🙂"}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: selectedEntry.moodColor || "#1976D2",
                    }}
                  >
                    {selectedEntry.mood}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#5A7D96" }}>
                    {formatDateTime(selectedEntry.dateTime)}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 2 }}>
              <DetailsContent
                entry={selectedEntry}
                formatDateTime={formatDateTime}
              />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={closeDetails}
                variant="contained"
                disableElevation
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

// ============================================================
// SHARED DETAILS CONTENT
// ============================================================
function DetailsContent({
  entry,
  formatDateTime,
}: {
  entry: JournalEntry;
  formatDateTime: (s: string) => string;
}) {
  return (
    <Box>
      {/* Feeling */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: "#F0F7FE",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#5A7D96",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            mb: 0.5,
          }}
        >
          Feeling
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "#1D425D",
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {entry.feeling || "—"}
        </Typography>
      </Box>

      {/* Metrics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1.5,
          mb: 2,
        }}
      >
        {/* Stress */}
        <Box
          sx={{
            p: 1.2,
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: alpha("#E53935", 0.07),
            border: `1px solid ${alpha("#E53935", 0.15)}`,
          }}
        >
          <TrendingUpRoundedIcon
            sx={{ fontSize: 18, color: "#E53935", mb: 0.3 }}
          />
          <Typography
            sx={{ fontSize: "0.65rem", color: "#5A7D96", fontWeight: 600 }}
          >
            STRESS
          </Typography>
          <Typography
            sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#E53935" }}
          >
            {entry.stressLevel}
            <Box component="span" sx={{ fontSize: "0.7rem", color: "#90A4AE" }}>
              /10
            </Box>
          </Typography>
        </Box>

        {/* Energy */}
        <Box
          sx={{
            p: 1.2,
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: alpha("#43A047", 0.07),
            border: `1px solid ${alpha("#43A047", 0.15)}`,
          }}
        >
          <BoltRoundedIcon sx={{ fontSize: 18, color: "#43A047", mb: 0.3 }} />
          <Typography
            sx={{ fontSize: "0.65rem", color: "#5A7D96", fontWeight: 600 }}
          >
            ENERGY
          </Typography>
          <Typography
            sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#43A047" }}
          >
            {entry.energyLevel}
            <Box component="span" sx={{ fontSize: "0.7rem", color: "#90A4AE" }}>
              /10
            </Box>
          </Typography>
        </Box>

        {/* Sleep */}
        <Box
          sx={{
            p: 1.2,
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: alpha("#5C6BC0", 0.07),
            border: `1px solid ${alpha("#5C6BC0", 0.15)}`,
          }}
        >
          <BedtimeRoundedIcon
            sx={{ fontSize: 18, color: "#5C6BC0", mb: 0.3 }}
          />
          <Typography
            sx={{ fontSize: "0.65rem", color: "#5A7D96", fontWeight: 600 }}
          >
            SLEEP
          </Typography>
          <Typography
            sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#5C6BC0" }}
          >
            {entry.sleepHours}
            <Box component="span" sx={{ fontSize: "0.7rem", color: "#90A4AE" }}>
              h
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#5A7D96",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 0.8,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <LocalOfferRoundedIcon sx={{ fontSize: 13 }} />
            Tags
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
            {entry.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  borderRadius: 2,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  height: 24,
                  bgcolor: "#EAF3FF",
                  color: "#1976D2",
                  border: "1px solid rgba(25,118,210,0.15)",
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Footer */}
      <Divider sx={{ my: 1.5, borderColor: "rgba(0,0,0,0.05)" }} />
      <Typography
        sx={{
          fontSize: "0.7rem",
          color: "#90A4AE",
          fontStyle: "italic",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <SpaRoundedIcon sx={{ fontSize: 12 }} />
        Logged on {formatDateTime(entry.createdAt)}
      </Typography>
    </Box>
  );
}