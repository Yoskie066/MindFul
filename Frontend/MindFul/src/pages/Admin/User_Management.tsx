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
import { userManagementApi } from "../../services/admin_Api";

interface AccountEntry {
  id: number;
  email: string;
  role: "user" | "admin";
  status: "online" | "offline";
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "user", label: "Users" },
  { value: "admin", label: "Admins" },
];

export default function UserManagement() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // ============================================================
  // STATE
  // ============================================================
  const [accounts, setAccounts] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Search & Filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Delete confirm
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AccountEntry | null>(null);
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
  // FETCH ACCOUNTS
  // ============================================================
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userManagementApi.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search,
        status: statusFilter,
        role: roleFilter,
      });
      setAccounts(res.data.accounts || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, statusFilter, roleFilter]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleChangePage = (_: any, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (acc: AccountEntry) => {
    setDeleteTarget(acc);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userManagementApi.delete(deleteTarget.role, deleteTarget.id);
      setDeleteOpen(false);
      setDeleteTarget(null);
      if (accounts.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else {
        fetchAccounts();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // BADGES
  // ============================================================
  const renderStatus = (status: "online" | "offline") => {
    const isOnline = status === "online";
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: isOnline ? "#4CAF50" : "#B0BEC5",
            boxShadow: isOnline ? "0 0 0 3px rgba(76,175,80,0.2)" : "none",
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: isOnline ? "#2E7D32" : "#607D8B",
          }}
        >
          {isOnline ? "Online" : "Offline"}
        </Typography>
      </Box>
    );
  };

  const renderRole = (role: "user" | "admin") => {
    const isAdmin = role === "admin";
    return (
      <Chip
        label={isAdmin ? "Admin" : "User"}
        size="small"
        sx={{
          fontWeight: 700,
          bgcolor: isAdmin ? "#EDE7F6" : "#E3F2FD",
          color: isAdmin ? "#5E35B1" : "#1565C0",
          border: `1px solid ${isAdmin ? "#B39DDB" : "#90CAF9"}`,
        }}
      />
    );
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
          User Management
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

        {/* Toolbar — Filters on left, Search on right */}
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
          {/* Left side: Role + Status filters */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              flex: { xs: "1 1 100%", sm: "0 0 auto" },
            }}
          >
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 160 }, flex: { xs: "1 1 100%", sm: "0 0 auto" } }}
            >
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
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
                {ROLE_OPTIONS.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 160 }, flex: { xs: "1 1 100%", sm: "0 0 auto" } }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
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
          </Box>

          {/* Right side: Search */}
          <TextField
            placeholder="Search by email..."
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
        ) : accounts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, color: "#5A7D96" }}>
            No accounts found.
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
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F0F7FE" }}>
                  {[
                    "ID",
                    "Email",
                    "Role",
                    "Status",
                    "Created At",
                    "Updated At",
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
                {accounts.map((a) => (
                  <TableRow
                    key={`${a.role}-${a.id}`}
                    hover
                    sx={{ "&:hover": { bgcolor: "#F7FBFF" } }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#1976D2",
                          fontSize: "0.85rem",
                        }}
                      >
                        #{a.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#1D425D",
                          fontSize: "0.85rem",
                        }}
                      >
                        {a.email}
                      </Typography>
                    </TableCell>

                    <TableCell>{renderRole(a.role)}</TableCell>

                    <TableCell>{renderStatus(a.status)}</TableCell>

                    <TableCell
                      sx={{
                        fontSize: "0.82rem",
                        color: "#35506B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(a.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "0.82rem",
                        color: "#35506B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(a.updatedAt).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(a)}
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
          /* ============================ MOBILE/TABLET: CARDS ============================ */
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            {accounts.map((a) => (
              <Paper
                key={`${a.role}-${a.id}`}
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
                      {a.email}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.72rem", color: "#7A96AD" }}
                    >
                      ID: #{a.id}
                    </Typography>
                  </Box>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(a)}
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

                {/* Role + Status */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  {renderRole(a.role)}
                  {renderStatus(a.status)}
                </Box>

                {/* Dates */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#F0F7FE",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.62rem",
                        color: "#5A7D96",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                      }}
                    >
                      CREATED
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        color: "#1D425D",
                        fontWeight: 600,
                        mt: 0.3,
                      }}
                    >
                      {new Date(a.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#F0F7FE",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.62rem",
                        color: "#5A7D96",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                      }}
                    >
                      UPDATED
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        color: "#1D425D",
                        fontWeight: 600,
                        mt: 0.3,
                      }}
                    >
                      {new Date(a.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
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
          Delete {deleteTarget?.role === "admin" ? "Admin" : "User"}?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#5A7D96", mb: 1.5 }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "#1D425D" }}>{deleteTarget?.email}</strong>?
          </Typography>
          {deleteTarget?.role === "user" && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              This will also delete <strong>all their journal entries</strong>.
              This action cannot be undone.
            </Alert>
          )}
          {deleteTarget?.role === "admin" && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              This action cannot be undone.
            </Alert>
          )}
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