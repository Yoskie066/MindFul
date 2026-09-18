import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
  CircularProgress,
  Tooltip,
  alpha,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { journalManagementApi } from "../../services/admin_Api";

interface JournalEntry {
  id: number;
  userId: number;
  mood: string;
  moodEmoji: string;
  moodColor: string;
  dateTime: string;
  feeling: string;
  stressLevel: number;
  energyLevel: number;
  sleepHours: number;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    email: string;
  };
}

const MOOD_OPTIONS = [
  "Happy",
  "Sad",
  "Angry",
  "Anxious",
  "Stressed",
  "Calm",
  "Excited",
  "Tired",
  "Neutral",
  "Grateful",
];

export default function Journal_Management() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // ============================================================
  // STATE
  // ============================================================
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Search & Filter
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState("");

  // Delete confirm
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ============================================================
  // DEBOUNCE SEARCH
  // ============================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ============================================================
  // FETCH JOURNALS
  // ============================================================
  const fetchJournals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await journalManagementApi.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search,
        mood: moodFilter,
      });
      setJournals(res.data.journals || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load journal entries."
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, moodFilter]);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleChangePage = (_: any, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    try {
      await journalManagementApi.delete(deleteId);
      setDeleteOpen(false);
      setDeleteId(null);
      if (journals.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else {
        fetchJournals();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete entry.");
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
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
      <Box sx={{ mb: 4, textAlign: "center" }}>
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
          Journal Management
        </Typography>
      </Box>

      {/* Main Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 3, sm: 4, md: 5 },
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: (theme) =>
            `0 20px 60px ${alpha(theme.palette.primary.main, 0.1)}`,
          border: "1px solid rgba(255,255,255,0.7)",
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Toolbar — Mood Filter on left, Search on right */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Mood Filter (Left) */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 180 },
              flex: { xs: "1 1 100%", sm: "0 0 auto" },
            }}
          >
            <InputLabel>Mood Filter</InputLabel>
            <Select
              label="Mood Filter"
              value={moodFilter}
              onChange={(e) => {
                setMoodFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: 3,
                backgroundColor: "#F0F7FE",
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "#90CAF9" },
                "&.Mui-focused fieldset": { borderColor: "#1976D2" },
              }}
            >
              <MenuItem value="">All Moods</MenuItem>
              {MOOD_OPTIONS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Search Bar (Right) */}
          <TextField
            placeholder="Search by user, feeling, mood..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 320 },
              flex: { xs: "1 1 100%", sm: "0 1 380px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#F0F7FE",
                "& fieldset": { borderColor: "transparent", borderWidth: 2 },
                "&:hover fieldset": { borderColor: "#90CAF9" },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976D2",
                  borderWidth: 2,
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: "#1976D2" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* ============================ LOADING ============================ */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : journals.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, color: "#5A7D96" }}>
            No journal entries found.
          </Box>
        ) : isDesktop ? (
          /* ============================ DESKTOP: TABLE VIEW ============================ */
          <TableContainer
            sx={{
              borderRadius: 3,
              border: "1px solid #E3EEF9",
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F0F7FE" }}>
                  {[
                    "User",
                    "Mood",
                    "Date & Time",
                    "Feeling",
                    "Stress",
                    "Energy",
                    "Sleep",
                    "Tags",
                    "Actions",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 800,
                        color: "#1D425D",
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {journals.map((j) => (
                  <TableRow
                    key={j.id}
                    hover
                    sx={{ "&:hover": { bgcolor: "#F7FBFF" } }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#1D425D",
                          fontSize: "0.85rem",
                        }}
                      >
                        {j.user?.email || `User #${j.userId}`}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#7A96AD" }}>
                        ID: {j.userId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`${j.moodEmoji || ""} ${j.mood}`.trim()}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: alpha(j.moodColor || "#1976D2", 0.15),
                          color: j.moodColor || "#1976D2",
                          border: `1px solid ${alpha(
                            j.moodColor || "#1976D2",
                            0.35
                          )}`,
                        }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "0.82rem",
                        color: "#35506B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(j.dateTime).toLocaleString()}
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 220,
                        fontSize: "0.82rem",
                        color: "#35506B",
                      }}
                    >
                      <Tooltip title={j.feeling}>
                        <Box
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 220,
                          }}
                        >
                          {j.feeling}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={j.stressLevel}
                        size="small"
                        sx={{
                          bgcolor: "#FFEBEE",
                          color: "#C62828",
                          fontWeight: 700,
                          minWidth: 40,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={j.energyLevel}
                        size="small"
                        sx={{
                          bgcolor: "#E8F5E9",
                          color: "#2E7D32",
                          fontWeight: 700,
                          minWidth: 40,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontSize: "0.85rem", color: "#35506B" }}>
                      {j.sleepHours} h
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          maxWidth: 220,
                        }}
                      >
                        {Array.isArray(j.tags) && j.tags.length > 0 ? (
                          j.tags.slice(0, 3).map((t, i) => (
                            <Chip
                              key={i}
                              label={t}
                              size="small"
                              sx={{
                                fontSize: "0.7rem",
                                height: 22,
                                bgcolor: "#FFF3E0",
                                color: "#E65100",
                                fontWeight: 600,
                              }}
                            />
                          ))
                        ) : (
                          <Typography
                            sx={{ fontSize: "0.75rem", color: "#9AAEBD" }}
                          >
                            —
                          </Typography>
                        )}
                        {Array.isArray(j.tags) && j.tags.length > 3 && (
                          <Chip
                            label={`+${j.tags.length - 3}`}
                            size="small"
                            sx={{ fontSize: "0.7rem", height: 22 }}
                          />
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(j.id)}
                          sx={{
                            bgcolor: "#FFEBEE",
                            "&:hover": { bgcolor: "#FFCDD2" },
                          }}
                        >
                          <DeleteRoundedIcon
                            fontSize="small"
                            sx={{ color: "#E53935" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* ============================ MOBILE/TABLET: CARD VIEW ============================ */
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            {journals.map((j) => (
              <Paper
                key={j.id}
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: 3,
                  border: "1px solid #E3EEF9",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "#90CAF9",
                    boxShadow: "0 8px 24px rgba(25,118,210,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Card Header: User + Delete */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#1D425D",
                        fontSize: "0.95rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {j.user?.email || `User #${j.userId}`}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.72rem", color: "#7A96AD" }}
                    >
                      User ID: {j.userId}
                    </Typography>
                  </Box>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(j.id)}
                      sx={{
                        bgcolor: "#FFEBEE",
                        "&:hover": { bgcolor: "#FFCDD2" },
                        flexShrink: 0,
                      }}
                    >
                      <DeleteRoundedIcon
                        fontSize="small"
                        sx={{ color: "#E53935" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                {/* Mood + DateTime */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    label={`${j.moodEmoji || ""} ${j.mood}`.trim()}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: alpha(j.moodColor || "#1976D2", 0.15),
                      color: j.moodColor || "#1976D2",
                      border: `1px solid ${alpha(
                        j.moodColor || "#1976D2",
                        0.35
                      )}`,
                    }}
                  />
                  <Typography
                    sx={{ fontSize: "0.75rem", color: "#5A7D96" }}
                  >
                    {new Date(j.dateTime).toLocaleString()}
                  </Typography>
                </Box>

                {/* Feeling */}
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#7A96AD",
                      letterSpacing: "0.05em",
                      mb: 0.3,
                    }}
                  >
                    FEELING
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: "#35506B",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {j.feeling}
                  </Typography>
                </Box>

                {/* Stress / Energy / Sleep */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#FFEBEE",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: "#C62828",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                      }}
                    >
                      STRESS
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "#C62828",
                        fontWeight: 800,
                      }}
                    >
                      {j.stressLevel}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#E8F5E9",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: "#2E7D32",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                      }}
                    >
                      ENERGY
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "#2E7D32",
                        fontWeight: 800,
                      }}
                    >
                      {j.energyLevel}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#E3F2FD",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: "#1565C0",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                      }}
                    >
                      SLEEP
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "#1565C0",
                        fontWeight: 800,
                      }}
                    >
                      {j.sleepHours}h
                    </Typography>
                  </Box>
                </Box>

                {/* Tags */}
                {Array.isArray(j.tags) && j.tags.length > 0 && (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        color: "#7A96AD",
                        letterSpacing: "0.05em",
                        mb: 0.5,
                      }}
                    >
                      TAGS
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {j.tags.map((t, i) => (
                        <Chip
                          key={i}
                          label={t}
                          size="small"
                          sx={{
                            fontSize: "0.7rem",
                            height: 22,
                            bgcolor: "#FFF3E0",
                            color: "#E65100",
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        )}

        {/* Pagination */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            mt: 2,
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "#5A7D96",
                fontWeight: 600,
              },
          }}
        />
      </Paper>

      {/* ============================ DELETE CONFIRM ============================ */}
      <Dialog
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0D3654" }}>
          Delete Journal Entry?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#5A7D96" }}>
            This action cannot be undone. Are you sure you want to delete this
            entry?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            disabled={deleting}
            sx={{ textTransform: "none", fontWeight: 700, color: "#5A7D96" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleting}
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 3,
              px: 3,
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}