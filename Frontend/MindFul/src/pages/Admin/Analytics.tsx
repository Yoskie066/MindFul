import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  alpha,
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import OnlinePredictionRoundedIcon from "@mui/icons-material/OnlinePredictionRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import EmojiEmotionsRoundedIcon from "@mui/icons-material/EmojiEmotionsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { analyticsApi } from "../../services/admin_Api";

// ============================================================
// TYPES
// ============================================================
interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalJournals: number;
  onlineUsers: number;
  onlineAdmins: number;
  avgStress: number;
  avgEnergy: number;
  avgSleep: number;
}

interface AIStats {
  totalConversations: number;
  errorConversations: number;
  successConversations: number;
  uniqueUsers: number;
}

interface MoodDist {
  mood: string;
  count: number;
  emoji: string;
  color: string;
}

interface TopTag {
  tag: string;
  count: number;
}

interface TrendPoint {
  date: string;
  count: number;
}

interface RecentJournal {
  id: number;
  userId: number;
  userEmail: string;
  mood: string;
  moodEmoji: string;
  moodColor: string;
  dateTime: string;
  feeling: string;
  stressLevel: number;
  energyLevel: number;
  sleepHours: number;
  tags: string[];
}

// ============================================================
// SECTION LABEL COMPONENT
// ============================================================
interface SectionLabelProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accent?: string;
}

const SectionLabel = ({
  icon,
  title,
  subtitle,
  accent = "#1976D2",
}: SectionLabelProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      mb: 2,
      pl: 0.5,
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: alpha(accent, 0.12),
        color: accent,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: { xs: "1rem", sm: "1.1rem" },
          fontWeight: 800,
          color: "#0D3654",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "#7A96AD",
            fontWeight: 500,
            mt: 0.15,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
    <Box
      sx={{
        flex: 1,
        height: 1,
        background: `linear-gradient(90deg, ${alpha(accent, 0.25)}, transparent)`,
        ml: 1,
      }}
    />
  </Box>
);

// ============================================================
// COMPONENT
// ============================================================
export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [aiStats, setAiStats] = useState<AIStats | null>(null);
  const [moodDist, setMoodDist] = useState<MoodDist[]>([]);
  const [topTags, setTopTags] = useState<TopTag[]>([]);
  const [journalTrend, setJournalTrend] = useState<TrendPoint[]>([]);
  const [userTrend, setUserTrend] = useState<TrendPoint[]>([]);
  const [recent, setRecent] = useState<RecentJournal[]>([]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsApi.getAll();
      setStats(res.data.stats);
      setAiStats(res.data.aiStats || null);
      setMoodDist(res.data.moodDistribution || []);
      setTopTags(res.data.topTags || []);
      setJournalTrend(res.data.journalTrend || []);
      setUserTrend(res.data.userTrend || []);
      setRecent(res.data.recentJournals || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // ---------- shared card sx ----------
  const cardSx = {
    p: { xs: 2.5, sm: 3 },
    borderRadius: { xs: 3, sm: 4 },
    backgroundColor: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: (theme: any) =>
      `0 12px 40px ${alpha(theme.palette.primary.main, 0.08)}, 0 4px 16px ${alpha(
        theme.palette.primary.main,
        0.04
      )}`,
    border: "1px solid rgba(255,255,255,0.7)",
    transition: "all 0.3s ease",
  };

  // ---------- build line path helper ----------
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const buildLinePath = (values: number[], maxVal: number) => {
    if (values.length === 0) return "";
    const step = values.length > 1 ? innerWidth / (values.length - 1) : 0;
    return values
      .map((v, i) => {
        const x = padding.left + i * step;
        const y = padding.top + innerHeight - (v / maxVal) * innerHeight;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const journalValues = journalTrend.map((t) => t.count);
  const maxJournalCount = Math.max(...journalValues, 5);
  const journalPath = buildLinePath(journalValues, maxJournalCount);
  const journalXStep =
    journalValues.length > 1 ? innerWidth / (journalValues.length - 1) : 0;

  const userValues = userTrend.map((t) => t.count);
  const maxUserCount = Math.max(...userValues, 5);
  const userPath = buildLinePath(userValues, maxUserCount);
  const userXStep =
    userValues.length > 1 ? innerWidth / (userValues.length - 1) : 0;

  const formatShortDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        mt: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 },
        pb: 6,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          textAlign: "center",
          position: "relative",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.4rem", md: "2.8rem" },
            fontWeight: 800,
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #0D3654 30%, #1976D2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Analytics
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* ============================ OVERVIEW STATS ============================ */}
      {stats && (
        <>
          <SectionLabel
            icon={<DashboardRoundedIcon sx={{ fontSize: 20 }} />}
            title="Overview"
            accent="#1976D2"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
              gap: { xs: 1.5, sm: 2 },
              mb: 4,
            }}
          >
            {/* Total Users */}
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#1976D2", 0.1),
                  }}
                >
                  <PeopleAltRoundedIcon sx={{ color: "#1976D2", fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    TOTAL USERS
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#0D3654" }}
                  >
                    {stats.totalUsers}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#43A047", fontWeight: 600 }}>
                    {stats.onlineUsers} online now
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Total Admins */}
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#5E35B1", 0.1),
                  }}
                >
                  <AdminPanelSettingsRoundedIcon
                    sx={{ color: "#5E35B1", fontSize: 26 }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    TOTAL ADMINS
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#0D3654" }}
                  >
                    {stats.totalAdmins}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#43A047", fontWeight: 600 }}>
                    {stats.onlineAdmins} online now
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Total Journals */}
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#FB8C00", 0.1),
                  }}
                >
                  <BookRoundedIcon sx={{ color: "#FB8C00", fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    JOURNAL ENTRIES
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#0D3654" }}
                  >
                    {stats.totalJournals}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#90A4AE", fontWeight: 600 }}>
                    total all-time
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Online Now */}
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#43A047", 0.1),
                  }}
                >
                  <OnlinePredictionRoundedIcon
                    sx={{ color: "#43A047", fontSize: 26 }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    ONLINE NOW
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#0D3654" }}
                  >
                    {stats.onlineUsers + stats.onlineAdmins}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#43A047", fontWeight: 600 }}>
                    {stats.onlineUsers} users · {stats.onlineAdmins} admins
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </>
      )}

      {/* ============================ JOURNAL AVERAGES ============================ */}
      {stats && (
        <>
          <SectionLabel
            icon={<QueryStatsRoundedIcon sx={{ fontSize: 20 }} />}
            title="Journal Averages"
            accent="#43A047"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
              mb: 4,
            }}
          >
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <BoltRoundedIcon sx={{ color: "#E53935", fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700 }}
                  >
                    AVG STRESS LEVEL
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.4rem", fontWeight: 800, color: "#E53935" }}
                  >
                    {stats.avgStress}
                    <Box component="span" sx={{ fontSize: "0.8rem", color: "#90A4AE" }}>
                      /10
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <TrendingUpRoundedIcon sx={{ color: "#43A047", fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700 }}
                  >
                    AVG ENERGY LEVEL
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.4rem", fontWeight: 800, color: "#43A047" }}
                  >
                    {stats.avgEnergy}
                    <Box component="span" sx={{ fontSize: "0.8rem", color: "#90A4AE" }}>
                      /10
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <BedtimeRoundedIcon sx={{ color: "#5C6BC0", fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700 }}
                  >
                    AVG SLEEP HOURS
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.4rem", fontWeight: 800, color: "#5C6BC0" }}
                  >
                    {stats.avgSleep}
                    <Box component="span" sx={{ fontSize: "0.8rem", color: "#90A4AE" }}>
                      h
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </>
      )}

      {/* ============================ AI ASSISTANT ============================ */}
      {aiStats && (
        <>
          <SectionLabel
            icon={<SmartToyRoundedIcon sx={{ fontSize: 20 }} />}
            title="AI Assistant"
            accent="#5E35B1"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
              gap: { xs: 1.5, sm: 2 },
              mb: 4,
            }}
          >
            {/* Total Chats */}
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#1976D2", 0.1),
                  }}
                >
                  <SmartToyRoundedIcon sx={{ color: "#1976D2", fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    TOTAL CHATS
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#0D3654" }}
                  >
                    {aiStats.totalConversations}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#90A4AE", fontWeight: 600 }}>
                    user ↔ AI exchanges
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Success */}
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#43A047", 0.1),
                  }}
                >
                  <CheckCircleRoundedIcon
                    sx={{ color: "#43A047", fontSize: 26 }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    SUCCESS
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#0D3654" }}
                  >
                    {aiStats.successConversations}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#43A047", fontWeight: 600 }}>
                    successful AI replies
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Errors */}
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#E53935", 0.1),
                  }}
                >
                  <ErrorRoundedIcon sx={{ color: "#E53935", fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    ERRORS
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#0D3654" }}
                  >
                    {aiStats.errorConversations}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      color: aiStats.errorConversations > 0 ? "#E53935" : "#90A4AE",
                      fontWeight: 600,
                    }}
                  >
                    rejected / no-data
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Unique Users */}
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#FB8C00", 0.1),
                  }}
                >
                  <PersonRoundedIcon sx={{ color: "#FB8C00", fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#5A7D96", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    UNIQUE USERS
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#0D3654" }}
                  >
                    {aiStats.uniqueUsers}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#90A4AE", fontWeight: 600 }}>
                    users who chatted
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </>
      )}

      {/* ============================ EMPTY STATE ============================ */}
      {stats && stats.totalJournals === 0 && (
        <Paper
          elevation={0}
          sx={{ ...cardSx, p: { xs: 4, sm: 5 }, textAlign: "center", mb: 3 }}
        >
          <BookRoundedIcon sx={{ fontSize: 56, color: "#90CAF9", mb: 1.5 }} />
          <Typography
            sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#0D3654", mb: 0.5 }}
          >
            No journal data yet
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "#5A7D96" }}>
            Insights will appear once users start submitting entries.
          </Typography>
        </Paper>
      )}

      {stats && stats.totalJournals > 0 && (
        <>
          {/* ============================ TRENDS ============================ */}
          <SectionLabel
            icon={<ShowChartRoundedIcon sx={{ fontSize: 20 }} />}
            title="Activity Trends"
            accent="#00897B"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Journal trend */}
            <Paper elevation={0} sx={cardSx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InsightsRoundedIcon sx={{ color: "#1976D2" }} />
                  <Typography
                    sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#0D3654" }}
                  >
                    Journal Entries (30 days)
                  </Typography>
                </Box>
                <Chip
                  label={`${stats.totalJournals} total`}
                  size="small"
                  sx={{
                    bgcolor: alpha("#1976D2", 0.1),
                    color: "#1976D2",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                />
              </Box>

              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  style={{ width: "100%", maxWidth: chartWidth, height: "auto" }}
                >
                  {[0, maxJournalCount / 2, maxJournalCount].map((v, i) => {
                    const y =
                      padding.top +
                      innerHeight -
                      (v / maxJournalCount) * innerHeight;
                    return (
                      <g key={i}>
                        <line
                          x1={padding.left}
                          x2={chartWidth - padding.right}
                          y1={y}
                          y2={y}
                          stroke="rgba(0,0,0,0.06)"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padding.left - 6}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="9"
                          fill="#90A4AE"
                        >
                          {Math.round(v)}
                        </text>
                      </g>
                    );
                  })}

                  {journalValues.length > 1 && (
                    <path
                      d={`${journalPath} L ${
                        padding.left + (journalValues.length - 1) * journalXStep
                      } ${padding.top + innerHeight} L ${padding.left} ${
                        padding.top + innerHeight
                      } Z`}
                      fill={alpha("#1976D2", 0.1)}
                    />
                  )}

                  <path
                    d={journalPath}
                    stroke="#1976D2"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {journalTrend.map((t, i) => {
                    if (i % 5 !== 0 && i !== journalTrend.length - 1) return null;
                    return (
                      <text
                        key={i}
                        x={padding.left + i * journalXStep}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#5A7D96"
                      >
                        {formatShortDate(t.date)}
                      </text>
                    );
                  })}
                </svg>
              </Box>
            </Paper>

            {/* User registration trend */}
            <Paper elevation={0} sx={cardSx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PeopleAltRoundedIcon sx={{ color: "#43A047" }} />
                  <Typography
                    sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#0D3654" }}
                  >
                    New Users (30 days)
                  </Typography>
                </Box>
                <Chip
                  label={`${stats.totalUsers} total`}
                  size="small"
                  sx={{
                    bgcolor: alpha("#43A047", 0.1),
                    color: "#43A047",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                />
              </Box>

              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  style={{ width: "100%", maxWidth: chartWidth, height: "auto" }}
                >
                  {[0, maxUserCount / 2, maxUserCount].map((v, i) => {
                    const y =
                      padding.top +
                      innerHeight -
                      (v / maxUserCount) * innerHeight;
                    return (
                      <g key={i}>
                        <line
                          x1={padding.left}
                          x2={chartWidth - padding.right}
                          y1={y}
                          y2={y}
                          stroke="rgba(0,0,0,0.06)"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padding.left - 6}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="9"
                          fill="#90A4AE"
                        >
                          {Math.round(v)}
                        </text>
                      </g>
                    );
                  })}

                  {userValues.length > 1 && (
                    <path
                      d={`${userPath} L ${
                        padding.left + (userValues.length - 1) * userXStep
                      } ${padding.top + innerHeight} L ${padding.left} ${
                        padding.top + innerHeight
                      } Z`}
                      fill={alpha("#43A047", 0.1)}
                    />
                  )}

                  <path
                    d={userPath}
                    stroke="#43A047"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {userTrend.map((t, i) => {
                    if (i % 5 !== 0 && i !== userTrend.length - 1) return null;
                    return (
                      <text
                        key={i}
                        x={padding.left + i * userXStep}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#5A7D96"
                      >
                        {formatShortDate(t.date)}
                      </text>
                    );
                  })}
                </svg>
              </Box>
            </Paper>
          </Box>

          {/* ============================ INSIGHTS ============================ */}
          <SectionLabel
            icon={<CategoryRoundedIcon sx={{ fontSize: 20 }} />}
            title="Insights & Patterns"
            accent="#FB8C00"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Mood distribution */}
            <Paper elevation={0} sx={cardSx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <EmojiEmotionsRoundedIcon sx={{ color: "#1976D2" }} />
                <Typography
                  sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#0D3654" }}
                >
                  Overall Mood Distribution
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {moodDist.map((m) => {
                  const pct = (m.count / stats.totalJournals) * 100;
                  return (
                    <Box key={m.mood}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontSize: "1.15rem" }}>
                            {m.emoji}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              color: "#0D3654",
                            }}
                          >
                            {m.mood}
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

            {/* Top tags */}
            <Paper elevation={0} sx={cardSx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalOfferRoundedIcon sx={{ color: "#FB8C00" }} />
                  <Typography
                    sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#0D3654" }}
                  >
                    Top Tags Used
                  </Typography>
                </Box>
                <Chip
                  label={`${topTags.length} tags`}
                  size="small"
                  sx={{
                    bgcolor: alpha("#FB8C00", 0.1),
                    color: "#FB8C00",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                />
              </Box>

              {topTags.length === 0 ? (
                <Typography sx={{ fontSize: "0.9rem", color: "#5A7D96" }}>
                  No tags have been used yet.
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                  {topTags.map((t, i) => {
                    const maxCount = topTags[0].count;
                    const pct = (t.count / maxCount) * 100;
                    const gradient = [
                      "linear-gradient(90deg, #FB8C00, #FFB74D)",
                      "linear-gradient(90deg, #1976D2, #64B5F6)",
                      "linear-gradient(90deg, #43A047, #81C784)",
                      "linear-gradient(90deg, #8E24AA, #BA68C8)",
                      "linear-gradient(90deg, #E53935, #EF9A9A)",
                      "linear-gradient(90deg, #00897B, #4DB6AC)",
                      "linear-gradient(90deg, #5E35B1, #9575CD)",
                      "linear-gradient(90deg, #F9A825, #FDD835)",
                    ][i % 8];

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
                              fontWeight: 700,
                              color: "#0D3654",
                            }}
                          >
                            {t.tag}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              color: "#5A7D96",
                            }}
                          >
                            {t.count}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "rgba(0,0,0,0.05)",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${pct}%`,
                              height: "100%",
                              borderRadius: 4,
                              background: gradient,
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

          {/* ============================ RECENT ACTIVITY ============================ */}
          <SectionLabel
            icon={<HistoryRoundedIcon sx={{ fontSize: 20 }} />}
            title="Recent Activity"
            accent="#5C6BC0"
          />
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AccessTimeRoundedIcon sx={{ color: "#1976D2" }} />
              <Typography
                sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#0D3654" }}
              >
                Recent Journal Activity
              </Typography>
            </Box>

            {recent.length === 0 ? (
              <Typography sx={{ fontSize: "0.9rem", color: "#5A7D96" }}>
                No recent journal entries.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {recent.map((j, i) => (
                  <Box key={j.id}>
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
                            j.moodColor || "#1976D2",
                            0.25
                          )}, ${alpha(j.moodColor || "#1976D2", 0.08)})`,
                          border: `2px solid ${alpha(
                            j.moodColor || "#1976D2",
                            0.4
                          )}`,
                          flexShrink: 0,
                        }}
                      >
                        {j.moodEmoji}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#1D425D",
                          }}
                        >
                          {j.userEmail}
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
                          {j.feeling || "—"}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: j.moodColor || "#1976D2",
                          }}
                        >
                          {j.mood}
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: "#90A4AE" }}>
                          {formatShortDate(j.dateTime)}
                        </Typography>
                      </Box>
                    </Box>
                    {i < recent.length - 1 && (
                      <Divider sx={{ borderColor: "rgba(0,0,0,0.05)" }} />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}