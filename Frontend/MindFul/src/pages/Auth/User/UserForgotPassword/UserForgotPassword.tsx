import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { userApi } from "../../../../services/api";

export default function UserForgotPassword() {
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");

  // ============================================================
  // HANDLE RESET PASSWORD
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setModalType("error");
      setModalTitle("Reset Failed");
      setModalOpen(true);
      setTimeout(() => setModalOpen(false), 2000);
      return;
    }

    if (newPassword.length < 6) {
      setModalType("error");
      setModalTitle("Reset Failed");
      setModalOpen(true);
      setTimeout(() => setModalOpen(false), 2000);
      return;
    }

    setLoading(true);

    try {
      // Step 1: Request reset token
      const forgotResponse = await userApi.forgotPassword({ email });
      const resetToken = forgotResponse.data.resetToken;

      // Step 2: Reset password using the token
      await userApi.resetPassword({ token: resetToken, newPassword });

      // Success modal 
      setModalType("success");
      setModalTitle("Password Reset Successful");
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);

      // Error modal 
      setModalType("error");
      setModalTitle("Reset Failed");
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 },
        background:
          "linear-gradient(135deg, #EDF9FF 0%, #D6EFFF 48%, #BBDFF7 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 420, md: 420 },
          borderRadius: { xs: 3, sm: 4, md: 5 },
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow:
            "0 20px 50px rgba(25, 118, 210, 0.12), 0 6px 15px rgba(25, 118, 210, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          p: { xs: 3, sm: 4, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        <Typography
          align="center"
          sx={{
            mb: 0.5,
            fontSize: { xs: 26, sm: 28 },
            fontWeight: 800,
            color: "#0D3654",
            letterSpacing: -0.5,
          }}
        >
          Forgot Password
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          {/* ---------- EMAIL FIELD ---------- */}
          <Typography
            component="label"
            htmlFor="email"
            sx={{
              display: "block",
              mb: 0.5,
              fontSize: { xs: 12, sm: 13 },
              fontWeight: 700,
              color: "#1D425D",
              letterSpacing: 0.3,
            }}
          >
            Email
          </Typography>
          <TextField
            id="email"
            type="email"
            fullWidth
            placeholder="user1@gmail.com"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#F0F7FE",
                transition: "all 0.2s ease",
                "& fieldset": { borderColor: "transparent", borderWidth: 2 },
                "&:hover": { backgroundColor: "#EAF3FF", "& fieldset": { borderColor: "#90CAF9" } },
                "&.Mui-focused": { backgroundColor: "#FFFFFF", "& fieldset": { borderColor: "#1976D2", borderWidth: 2 } },
              },
            }}
          />

          {/* ---------- NEW PASSWORD FIELD ---------- */}
          <Typography
            component="label"
            htmlFor="newPassword"
            sx={{
              display: "block",
              mt: { xs: 1.5, sm: 2 },
              mb: 0.5,
              fontSize: { xs: 12, sm: 13 },
              fontWeight: 700,
              color: "#1D425D",
              letterSpacing: 0.3,
            }}
          >
            New Password
          </Typography>
          <TextField
            id="newPassword"
            type="password"
            fullWidth
            placeholder="••••••"
            size="small"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#F0F7FE",
                transition: "all 0.2s ease",
                "& fieldset": { borderColor: "transparent", borderWidth: 2 },
                "&:hover": { backgroundColor: "#EAF3FF", "& fieldset": { borderColor: "#90CAF9" } },
                "&.Mui-focused": { backgroundColor: "#FFFFFF", "& fieldset": { borderColor: "#1976D2", borderWidth: 2 } },
              },
            }}
          />

          {/* ---------- CONFIRM PASSWORD FIELD ---------- */}
          <Typography
            component="label"
            htmlFor="confirmPassword"
            sx={{
              display: "block",
              mt: { xs: 1.5, sm: 2 },
              mb: 0.5,
              fontSize: { xs: 12, sm: 13 },
              fontWeight: 700,
              color: "#1D425D",
              letterSpacing: 0.3,
            }}
          >
            Confirm Password
          </Typography>
          <TextField
            id="confirmPassword"
            type="password"
            fullWidth
            placeholder="••••••"
            size="small"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#F0F7FE",
                transition: "all 0.2s ease",
                "& fieldset": { borderColor: "transparent", borderWidth: 2 },
                "&:hover": { backgroundColor: "#EAF3FF", "& fieldset": { borderColor: "#90CAF9" } },
                "&.Mui-focused": { backgroundColor: "#FFFFFF", "& fieldset": { borderColor: "#1976D2", borderWidth: 2 } },
              },
            }}
          />

          {/* ---------- RESET PASSWORD BUTTON ---------- */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disableElevation
            disabled={loading}
            sx={{
              mt: { xs: 2, sm: 2.5 },
              minHeight: { xs: 44, sm: 46 },
              borderRadius: 2.5,
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 800,
              letterSpacing: 0.8,
              backgroundColor: "#1976D2",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                backgroundColor: "#0D47A1",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                transform: "translateY(-1px)",
              },
              "&.Mui-disabled": { backgroundColor: "#90CAF9" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "RESET PASSWORD"
            )}
          </Button>

          {/* ---------- LOGIN BUTTON ---------- */}
          <Typography
            align="center"
            sx={{
              mt: { xs: 2, sm: 2.5 },
              mb: 0.5,
              fontSize: { xs: 13, sm: 14 },
              color: "#4A6F88",
            }}
          >
            Remember your password?
          </Typography>
          <Button
            fullWidth
            component={Link}
            to="/login"
            type="button"
            variant="contained"
            disableElevation
            disabled={loading}
            sx={{
              minHeight: { xs: 44, sm: 46 },
              borderRadius: 2.5,
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 800,
              letterSpacing: 0.8,
              backgroundColor: "#1565C0",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px rgba(21, 101, 192, 0.25)",
              "&:hover": {
                backgroundColor: "#0D47A1",
                boxShadow: "0 6px 20px rgba(21, 101, 192, 0.35)",
                transform: "translateY(-1px)",
              },
              "&.Mui-disabled": { backgroundColor: "#90CAF9" },
            }}
          >
            LOGIN
          </Button>
        </Box>
      </Paper>

      {/* ============================================================ */}
      {/* MODAL Success  */}
      {/* ============================================================ */}
      <Dialog
        open={modalOpen}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              p: 1,
              textAlign: "center",
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
                }}
              />
            ) : (
              <ErrorRoundedIcon sx={{ fontSize: 64, color: "#E53935" }} />
            )}
          </Box>
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "#0D3654",
            }}
          >
            {modalTitle}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}