import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { adminApi } from "../../../../services/admin_Api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");

  const showModal = (type: "success" | "error", title: string, delay = 2000) => {
    setModalType(type);
    setModalTitle(title);
    setModalOpen(true);
    setTimeout(() => setModalOpen(false), delay);
  };

  // ============================================================
  // LOGIN (email/password)
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminApi.login({ email, password });
      const { token, admin } = response.data;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminData", JSON.stringify(admin));

      showModal("success", "Successful Login");
      setTimeout(() => navigate("/analytics"), 2000);
    } catch (err: any) {
      console.error("Admin login error:", err);
      const msg = err?.response?.data?.message || "Login Failed";
      showModal("error", msg);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // GOOGLE LOGIN
  // ============================================================
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      showModal("error", "Google Login Failed");
      return;
    }

    setLoading(true);
    try {
      const response = await adminApi.googleAuth(credentialResponse.credential);
      const { token, admin } = response.data;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminData", JSON.stringify(admin));

      showModal("success", "Successful Login");
      setTimeout(() => navigate("/analytics"), 2000);
    } catch (err: any) {
      console.error("Google auth error:", err);
      const msg = err?.response?.data?.message || "Google Login Failed";
      showModal("error", msg);
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
          Admin Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          {/* EMAIL */}
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
            placeholder="admin@mindful.com"
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

          {/* PASSWORD */}
          <Typography
            component="label"
            htmlFor="password"
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
            Password
          </Typography>
          <TextField
            id="password"
            type="password"
            fullWidth
            placeholder="••••••"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          {/* FORGOT */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              component={Link}
              to="/admin-forgot-password"
              variant="text"
              disableElevation
              disabled={loading}
              sx={{
                fontSize: { xs: 12, sm: 13 },
                fontWeight: 600,
                color: "#1976D2",
                textTransform: "none",
                minWidth: "auto",
                p: 0,
                "&:hover": { color: "#0D47A1", backgroundColor: "transparent" },
              }}
            >
              Forgot password?
            </Button>
          </Box>

          {/* LOGIN BUTTON */}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
          </Button>

          {/* REGISTER LINK */}
          <Typography
            align="center"
            sx={{
              mt: { xs: 2, sm: 2.5 },
              mb: 0.5,
              fontSize: { xs: 13, sm: 14 },
              color: "#4A6F88",
            }}
          >
            Don't have an admin account?
          </Typography>
          <Button
            fullWidth
            component={Link}
            to="/admin-register"
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
            REGISTER
          </Button>

          <Divider
            sx={{
              my: { xs: 2, sm: 2.5 },
              fontSize: { xs: 11, sm: 12 },
              color: "#8AACBF",
              fontWeight: 500,
              "&::before, &::after": {
                borderColor: "#D5E4EE",
                borderWidth: 1,
              },
            }}
          >
            OR CONTINUE WITH
          </Divider>

          {/* ============================================================ */}
          {/* GOOGLE LOGIN  */}
          {/* ============================================================ */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",

              // Outer wrapper (GoogleLogin renders a <div>)
              "& > div": {
                width: "100% !important",
                maxWidth: "100% !important",
              },

              // Nested div (extra Google wrappers)
              "& > div > div": {
                width: "100% !important",
              },

              // iframe
              "& iframe": {
                width: "100% !important",
                minWidth: "100% !important",
                maxWidth: "100% !important",
              },

              // Google's internal button class
              "& .nsm7Bb-HzV7m-LgbsSe": {
                width: "100% !important",
                minWidth: "100% !important",
                maxWidth: "100% !important",
                borderRadius: "10px !important",
                height: { xs: "44px !important", sm: "46px !important" },
                fontSize: { xs: "13px !important", sm: "14px !important" },
              },
              "& .nsm7Bb-HzV7m-LgbsSe-BPrWId": {
                fontSize: { xs: "13px !important", sm: "14px !important" },
                fontWeight: "700 !important",
              },

              // Fallback
              '& div[role="button"]': {
                width: "100% !important",
                minWidth: "100% !important",
              },
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showModal("error", "Google Login Failed")}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="360"
              logo_alignment="center"
            />
          </Box>
        </Box>
      </Paper>

      {/* MODAL */}
      <Dialog
        open={modalOpen}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 4, p: 1, textAlign: "center" } },
        }}
      >
        <DialogContent sx={{ pt: 3, pb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            {modalType === "success" ? (
              <CheckCircleRoundedIcon sx={{ fontSize: 64, color: "#1976D2" }} />
            ) : (
              <ErrorRoundedIcon sx={{ fontSize: 64, color: "#E53935" }} />
            )}
          </Box>
          <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#0D3654" }}>
            {modalTitle}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}