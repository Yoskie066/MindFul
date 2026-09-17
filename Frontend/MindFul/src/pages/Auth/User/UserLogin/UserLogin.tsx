import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import GoogleIcon from "@mui/icons-material/Google";
import { userApi } from "../../../../services/api";

export default function UserLogin() {
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");

  // ============================================================
  // HANDLE LOGIN
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userApi.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem("userToken", token);
      localStorage.setItem("userData", JSON.stringify(user));

      // Success modal 
      setModalType("success");
      setModalTitle("Successful Login");
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Login error:", err);

      // Error modal 
      setModalType("error");
      setModalTitle("Login Failed");
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
          minHeight: { xs: "auto", sm: "auto" },
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
          Login
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

          {/* ---------- PASSWORD FIELD ---------- */}
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

          {/* ---------- FORGOT PASSWORD ---------- */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              component={Link}
              to="/forgot-password"
              variant="text"
              disableElevation
              disabled={loading}
              sx={{
                fontSize: { xs: 12, sm: 13 },
                fontWeight: 600,
                color: "#0D3654",
                textTransform: "none",
                minWidth: "auto",
                p: 0,
                "&:hover": { color: "#0D47A1", backgroundColor: "transparent" },
              }}
            >
              Forgot password?
            </Button>
          </Box>

          {/* ---------- LOGIN BUTTON ---------- */}
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

          {/* ---------- REGISTER SECTION ---------- */}
          <Typography
            align="center"
            sx={{
              mt: { xs: 2, sm: 2.5 },
              mb: 0.5,
              fontSize: { xs: 13, sm: 14 },
              color: "#4A6F88",
            }}
          >
            Don't have an account?
          </Typography>
          <Button
            fullWidth
            component={Link}
            to="/register"
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

          <Button
            fullWidth
            type="button"
            variant="outlined"
            startIcon={<GoogleIcon />}
            disabled={loading}
            sx={{
              minHeight: { xs: 42, sm: 44 },
              borderRadius: 2.5,
              textTransform: "none",
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 700,
              color: "#1D425D",
              borderColor: "#C5D8E6",
              backgroundColor: "rgba(255,255,255,0.6)",
              "&:hover": {
                borderColor: "#1976D2",
                backgroundColor: "#F0F7FE",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Continue with Google
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