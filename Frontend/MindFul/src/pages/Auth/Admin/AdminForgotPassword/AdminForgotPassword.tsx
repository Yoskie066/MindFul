import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function AdminForgotPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================================
  // NEW PASSWORD FIELD - Toggle Visibility (using slotProps for MUI v9)
  // ============================================================
  const newPasswordSlotProps = {
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            edge="end"
            size="small"
            onClick={() => setShowNewPassword((value) => !value)}
            sx={{
              color: "#5D9DCA",
              "&:hover": { color: "#1976D2" },
            }}
          >
            {showNewPassword ? (
              <VisibilityOutlinedIcon fontSize="small" />
            ) : (
              <VisibilityOffOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </InputAdornment>
      ),
    },
  };

  // ============================================================
  // CONFIRM PASSWORD FIELD - Toggle Visibility
  // ============================================================
  const confirmPasswordSlotProps = {
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            edge="end"
            size="small"
            onClick={() => setShowConfirmPassword((value) => !value)}
            sx={{
              color: "#5D9DCA",
              "&:hover": { color: "#1976D2" },
            }}
          >
            {showConfirmPassword ? (
              <VisibilityOutlinedIcon fontSize="small" />
            ) : (
              <VisibilityOffOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </InputAdornment>
      ),
    },
  };

  return (
    // ============================================================
    // MAIN CONTAINER - Full viewport, centered, light blue gradient
    // ============================================================
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
      {/* ============================================================
          ADMIN FORGOT PASSWORD CARD - Glass-morphism paper
          ============================================================ */}
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
        {/* ============================================================
            PAGE TITLE
            ============================================================ */}
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
          Admin Forgot Password
        </Typography>

        {/* ============================================================
            ADMIN FORGOT PASSWORD FORM
            ============================================================ */}
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
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
            placeholder="admin@mindful.com"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#F0F7FE",
                transition: "all 0.2s ease",
                "& fieldset": {
                  borderColor: "transparent",
                  borderWidth: 2,
                },
                "&:hover": {
                  backgroundColor: "#EAF3FF",
                  "& fieldset": { borderColor: "#90CAF9" },
                },
                "&.Mui-focused": {
                  backgroundColor: "#FFFFFF",
                  "& fieldset": { borderColor: "#1976D2", borderWidth: 2 },
                },
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
            type={showNewPassword ? "text" : "password"}
            fullWidth
            placeholder="••••••"
            size="small"
            slotProps={newPasswordSlotProps}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#F0F7FE",
                transition: "all 0.2s ease",
                "& fieldset": {
                  borderColor: "transparent",
                  borderWidth: 2,
                },
                "&:hover": {
                  backgroundColor: "#EAF3FF",
                  "& fieldset": { borderColor: "#90CAF9" },
                },
                "&.Mui-focused": {
                  backgroundColor: "#FFFFFF",
                  "& fieldset": { borderColor: "#1976D2", borderWidth: 2 },
                },
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
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            placeholder="••••••"
            size="small"
            slotProps={confirmPasswordSlotProps}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#F0F7FE",
                transition: "all 0.2s ease",
                "& fieldset": {
                  borderColor: "transparent",
                  borderWidth: 2,
                },
                "&:hover": {
                  backgroundColor: "#EAF3FF",
                  "& fieldset": { borderColor: "#90CAF9" },
                },
                "&.Mui-focused": {
                  backgroundColor: "#FFFFFF",
                  "& fieldset": { borderColor: "#1976D2", borderWidth: 2 },
                },
              },
            }}
          />

          {/* ---------- RESET PASSWORD BUTTON ---------- */}
          <Button
            fullWidth
            type="button"
            variant="contained"
            disableElevation
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
            }}
          >
            RESET PASSWORD
          </Button>

          {/* ---------- LOGIN SECTION ---------- */}
          <Typography
            align="center"
            sx={{
              mt: { xs: 2, sm: 2.5 },
              mb: 0.5,
              fontSize: { xs: 13, sm: 14 },
              color: "#4A6F88",
            }}
          >
            Already have an admin account?
          </Typography>
          <Button
            fullWidth
            component={Link}
            to="/admin-login" 
            type="button"
            variant="contained"
            disableElevation
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
            }}
          >
            LOGIN
          </Button>
        </Box>
        {/* ============================================================
            END OF ADMIN FORGOT PASSWORD FORM
            ============================================================ */}
      </Paper>
      {/* ============================================================
          END OF ADMIN FORGOT PASSWORD CARD
          ============================================================ */}
    </Box>
    // ============================================================
    // END OF MAIN CONTAINER
    // ============================================================
  );
}