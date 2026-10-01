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
import GoogleIcon from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";
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
      const msg = err?.response?.data?.message || "Login Failed";
      showModal("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const response = await adminApi.googleAuth(tokenResponse.access_token);
        const { token, admin } = response.data;

        // admin = { id, email, name, picture }
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminData", JSON.stringify(admin));

        showModal("success", "Successful Login");
        setTimeout(() => navigate("/analytics"), 2000);
      } catch (err: any) {
        const msg = err?.response?.data?.message || "Google Login Failed";
        showModal("error", msg);
      } finally {
        setLoading(false);
      }
    },
    onError: () => showModal("error", "Google Login Failed"),
    onNonOAuthError: (err) => console.error("Non-OAuth error:", err),
  });

  return (
    <Box
      sx={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 },
        background: "linear-gradient(135deg, #EDF9FF 0%, #D6EFFF 48%, #BBDFF7 100%)",
      }}
    >
      <Paper elevation={0}
        sx={{
          width: "100%", maxWidth: 420, borderRadius: { xs: 3, sm: 4, md: 5 },
          backgroundColor: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)",
          boxShadow: "0 20px 50px rgba(25, 118, 210, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          p: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Typography align="center"
          sx={{ mb: 0.5, fontSize: { xs: 26, sm: 28 }, fontWeight: 800, color: "#0D3654" }}>
          Admin Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography component="label" htmlFor="email"
            sx={{ mb: 0.5, fontSize: 13, fontWeight: 700, color: "#1D425D" }}>
            Email
          </Typography>
          <TextField
            id="email" type="email" fullWidth placeholder="admin@mindful.com" size="small"
            value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, backgroundColor: "#F0F7FE",
              "& fieldset": { borderColor: "transparent", borderWidth: 2 },
              "&.Mui-focused": { backgroundColor: "#FFFFFF", "& fieldset": { borderColor: "#1976D2", borderWidth: 2 } } } }}
          />

          <Typography component="label" htmlFor="password"
            sx={{ mt: 2, mb: 0.5, fontSize: 13, fontWeight: 700, color: "#1D425D" }}>
            Password
          </Typography>
          <TextField
            id="password" type="password" fullWidth placeholder="••••••" size="small"
            value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, backgroundColor: "#F0F7FE",
              "& fieldset": { borderColor: "transparent", borderWidth: 2 },
              "&.Mui-focused": { backgroundColor: "#FFFFFF", "& fieldset": { borderColor: "#1976D2", borderWidth: 2 } } } }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button component={Link} to="/admin-forgot-password" variant="text" disabled={loading}
              sx={{ fontSize: 13, fontWeight: 600, color: "#1976D2", textTransform: "none" }}>
              Forgot password?
            </Button>
          </Box>

          <Button fullWidth type="submit" variant="contained" disableElevation disabled={loading}
            sx={{ mt: 2.5, minHeight: 46, borderRadius: 2.5, fontWeight: 800,
              backgroundColor: "#1976D2", "&:hover": { backgroundColor: "#0D47A1" },
              "&.Mui-disabled": { backgroundColor: "#90CAF9" } }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
          </Button>

          <Typography align="center" sx={{ mt: 2.5, mb: 0.5, fontSize: 14, color: "#4A6F88" }}>
            Don't have an admin account?
          </Typography>
          <Button fullWidth component={Link} to="/admin-register" variant="contained" disableElevation disabled={loading}
            sx={{ minHeight: 46, borderRadius: 2.5, fontWeight: 800,
              backgroundColor: "#1565C0", "&:hover": { backgroundColor: "#0D47A1" },
              "&.Mui-disabled": { backgroundColor: "#90CAF9" } }}>
            REGISTER
          </Button>

          <Divider sx={{ my: 2.5, fontSize: 12, color: "#8AACBF",
            "&::before, &::after": { borderColor: "#D5E4EE" } }}>
            OR CONTINUE WITH
          </Divider>

          <Button fullWidth type="button" variant="outlined" startIcon={<GoogleIcon />}
            onClick={() => handleGoogleLogin()} disabled={loading}
            sx={{ minHeight: 46, borderRadius: 2.5, textTransform: "none", fontSize: 14, fontWeight: 700,
              color: "#1D425D", borderColor: "#C5D8E6", borderWidth: 2,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { borderColor: "#1976D2", backgroundColor: "#F0F7FE" } }}>
            Continue with Google
          </Button>
        </Box>
      </Paper>

      <Dialog open={modalOpen} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1, textAlign: "center" } } }}>
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