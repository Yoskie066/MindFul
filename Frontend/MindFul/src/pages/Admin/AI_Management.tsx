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
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { aiManagementApi } from "../../services/admin_Api";

interface AIConversation {
  id: number;
  userId: number;
  userMessage: string;
  aiResponse: string;
  isError: boolean;
  entriesAnalyzed: number;
  createdAt: string;
  user?: {
    id: number;
    email: string;
  };
}

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

export default function AIManagement() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // View dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<AIConversation | null>(null);

  // Delete dialog
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
  // FETCH CONVERSATIONS
  // ============================================================
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiManagementApi.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search,
        status: statusFilter,
      });
      setConversations(res.data.conversations || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load AI conversations.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, statusFilter]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleChangePage = (_: any, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleView = (c: AIConversation) => {
    setViewTarget(c);
    setViewOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    try {
      await aiManagementApi.delete(deleteId);
      setDeleteOpen(false);
      setDeleteId(null);
      if (conversations.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else {
        fetchConversations();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete conversation.");
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================
  const truncate = (text: string, max = 80) =>
    text.length > max ? text.slice(0, max).trim() + "…" : text;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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
          AI Management
        </Typography>
      </Box>

      {/* Main card */}
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

        {/* Toolbar — Status Filter on left, Search on right */}
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
          {/* Status Filter (Left) */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 180 },
              flex: { xs: "1 1 100%", sm: "0 0 auto" },
            }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              label="Status Filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
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
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Search Bar (Right) */}
          <TextField
            placeholder="Search by user or message content..."
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

        {/* ============================ LOADING / EMPTY / DATA ============================ */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, color: "#5A7D96" }}>
            No AI conversations found.
          </Box>
        ) : isDesktop ? (
          /* ============================ DESKTOP: TABLE ============================ */
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
                    "User Message",
                    "AI Response",
                    "Status",
                    "Entries Used",
                    "Date",
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
                {conversations.map((c) => (
                  <TableRow
                    key={c.id}
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
                        {c.user?.email || `User #${c.userId}`}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "#7A96AD" }}>
                        ID: {c.userId}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 240,
                        fontSize: "0.82rem",
                        color: "#35506B",
                      }}
                    >
                      <Tooltip title={c.userMessage}>
                        <Box
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 240,
                          }}
                        >
                          {truncate(c.userMessage, 60)}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 280,
                        fontSize: "0.82rem",
                        color: "#35506B",
                      }}
                    >
                      <Tooltip title={c.aiResponse}>
                        <Box
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 280,
                          }}
                        >
                          {truncate(c.aiResponse, 70)}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={c.isError ? "Failed" : "Success"}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: c.isError ? "#FFEBEE" : "#E8F5E9",
                          color: c.isError ? "#C62828" : "#2E7D32",
                          border: `1px solid ${
                            c.isError ? "#EF9A9A" : "#A5D6A7"
                          }`,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={c.entriesAnalyzed}
                        size="small"
                        sx={{
                          bgcolor: "#E3F2FD",
                          color: "#1565C0",
                          fontWeight: 700,
                          minWidth: 40,
                        }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        color: "#35506B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(c.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => handleView(c)}
                            sx={{
                              bgcolor: "#EAF3FF",
                              "&:hover": { bgcolor: "#D6E9FF" },
                            }}
                          >
                            <VisibilityRoundedIcon
                              fontSize="small"
                              sx={{ color: "#1976D2" }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(c.id)}
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
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* ============================ MOBILE/TABLET: CARDS ============================ */
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            {conversations.map((c) => (
              <Paper
                key={c.id}
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
                {/* Header */}
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
                      {c.user?.email || `User #${c.userId}`}
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "#7A96AD" }}>
                      {formatDate(c.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleView(c)}
                      sx={{
                        bgcolor: "#EAF3FF",
                        "&:hover": { bgcolor: "#D6E9FF" },
                      }}
                    >
                      <VisibilityRoundedIcon
                        fontSize="small"
                        sx={{ color: "#1976D2" }}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(c.id)}
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
                  </Box>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Chip
                    label={c.isError ? "Failed" : "Success"}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: c.isError ? "#FFEBEE" : "#E8F5E9",
                      color: c.isError ? "#C62828" : "#2E7D32",
                      border: `1px solid ${c.isError ? "#EF9A9A" : "#A5D6A7"}`,
                    }}
                  />
                  <Chip
                    label={`${c.entriesAnalyzed} entries`}
                    size="small"
                    sx={{
                      bgcolor: "#E3F2FD",
                      color: "#1565C0",
                      fontWeight: 700,
                    }}
                  />
                </Box>

                {/* User message */}
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#7A96AD",
                    letterSpacing: "0.05em",
                    mb: 0.3,
                  }}
                >
                  USER MESSAGE
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "#35506B",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    mb: 1.2,
                  }}
                >
                  {c.userMessage}
                </Typography>

                {/* AI response */}
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#7A96AD",
                    letterSpacing: "0.05em",
                    mb: 0.3,
                  }}
                >
                  AI RESPONSE
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
                  {c.aiResponse}
                </Typography>
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

      {/* ============================ VIEW DIALOG ============================ */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 4, p: 1 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0D3654" }}>
          Conversation Details
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          {viewTarget && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Meta */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Chip
                  icon={<PersonRoundedIcon sx={{ fontSize: 16 }} />}
                  label={viewTarget.user?.email || `User #${viewTarget.userId}`}
                  size="small"
                  sx={{
                    bgcolor: "#E3F2FD",
                    color: "#1565C0",
                    fontWeight: 700,
                    "& .MuiChip-icon": { color: "#1565C0" },
                  }}
                />
                <Chip
                  label={viewTarget.isError ? "Failed" : "Success"}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: viewTarget.isError ? "#FFEBEE" : "#E8F5E9",
                    color: viewTarget.isError ? "#C62828" : "#2E7D32",
                  }}
                />
                <Chip
                  label={`${viewTarget.entriesAnalyzed} entries analyzed`}
                  size="small"
                  sx={{
                    bgcolor: "#FFF3E0",
                    color: "#E65100",
                    fontWeight: 700,
                  }}
                />
                <Typography
                  sx={{ fontSize: "0.78rem", color: "#5A7D96", ml: "auto" }}
                >
                  {formatDate(viewTarget.createdAt)}
                </Typography>
              </Box>

              {/* User message */}
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#7A96AD",
                    letterSpacing: "0.05em",
                    mb: 0.8,
                  }}
                >
                  USER MESSAGE
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#F0F7FE",
                    border: "1px solid #D6E9FF",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#1D425D",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {viewTarget.userMessage}
                  </Typography>
                </Paper>
              </Box>

              {/* AI response */}
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#7A96AD",
                    letterSpacing: "0.05em",
                    mb: 0.8,
                  }}
                >
                  AI RESPONSE
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#FFFFFF",
                    border: "1px solid #D6E9FF",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#1D425D",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.65,
                    }}
                  >
                    {viewTarget.aiResponse}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setViewOpen(false)}
            variant="contained"
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 3,
              px: 4,
              background: "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================ DELETE CONFIRM ============================ */}
      <Dialog
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0D3654" }}>
          Delete Conversation?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#5A7D96" }}>
            This action cannot be undone. Are you sure you want to delete this
            conversation record?
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