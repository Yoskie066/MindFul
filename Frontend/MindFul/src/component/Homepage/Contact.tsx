import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import emailjs from "@emailjs/browser";

// ============================================================
// EMAILJS CONFIG
// ============================================================
const EMAILJS_SERVICE_ID = "service_hjeoj7r";
const EMAILJS_TEMPLATE_ID = "template_oqdpwqs";
const EMAILJS_PUBLIC_KEY = "cvuKtXJ5BhrX8FxVN";

// ============================================================
// ANIMATIONS
// ============================================================
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%   { transform: translateY(0px) rotate(0deg); }
  50%  { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");

  const showModal = (type: "success" | "error", title: string) => {
    setModalType(type);
    setModalTitle(title);
    setModalOpen(true);
    setTimeout(() => setModalOpen(false), 3000);
  };

  // ============================================================
  // SUBMIT — EmailJS
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      showModal("error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
        EMAILJS_PUBLIC_KEY
      );

      showModal("success", "Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("EmailJS error:", err);
      showModal("error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor: "#F0F7FE",
      transition: "all 0.2s ease",
      "& fieldset": { borderColor: "transparent", borderWidth: 2 },
      "&:hover": {
        backgroundColor: "#EAF3FF",
        "& fieldset": { borderColor: "#90CAF9" },
      },
      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
        "& fieldset": { borderColor: "#1976D2", borderWidth: 2 },
      },
    },
  };

  return (
    <Box>
      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          px: { xs: 3, sm: 4 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating orbs */}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            left: "8%",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(100,181,246,0.3) 0%, rgba(100,181,246,0) 70%)",
            filter: "blur(20px)",
            animation: `${float} 10s ease-in-out infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(25,118,210,0.2) 0%, rgba(25,118,210,0) 70%)",
            filter: "blur(24px)",
            animation: `${float} 12s ease-in-out infinite reverse`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: 32, sm: 40, md: 48 },
                fontWeight: 800,
                color: "#0D3654",
                letterSpacing: -1,
                mb: 3,
                lineHeight: 1.15,
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.1s forwards`,
              }}
            >
              Get in{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #1976D2 0%, #64B5F6 50%, #1976D2 100%)",
                  backgroundSize: "200% 200%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: `${gradientShift} 5s ease-in-out infinite`,
                }}
              >
                Touch
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 16, sm: 18 },
                color: "#4A6F88",
                lineHeight: 1.8,
                maxWidth: 620,
                mx: "auto",
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.25s forwards`,
              }}
            >
              Have a question, feedback, or just want to say hi? We'd love to
              hear from you.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* CONTACT FORM — CENTERED */}
      {/* ============================================================ */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          px: { xs: 3, sm: 4 },
          pb: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(25, 118, 210, 0.1)",
              boxShadow:
                "0 20px 50px rgba(25, 118, 210, 0.1), 0 8px 20px rgba(25, 118, 210, 0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              opacity: 0,
              animation: `${fadeInUp} 0.7s ease-out 0.2s forwards`,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 22, sm: 24 },
                fontWeight: 800,
                color: "#0D3654",
                mb: 1,
                letterSpacing: -0.3,
                textAlign: "center",
              }}
            >
              Send us a Message
            </Typography>
            <Typography
              sx={{
                fontSize: 14.5,
                color: "#4A6F88",
                textAlign: "center",
                mb: 3,
                lineHeight: 1.7,
              }}
            >
              Fill out the form below and we'll get back to you as soon as we
              can.
            </Typography>

            {/* NAME */}
            <Typography
              component="label"
              htmlFor="name"
              sx={{ mb: 0.5, fontSize: 13, fontWeight: 700, color: "#1D425D" }}
            >
              Your Name
            </Typography>
            <TextField
              id="name"
              fullWidth
              placeholder="Juan Dela Cruz"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              sx={inputSx}
            />

            {/* EMAIL */}
            <Typography
              component="label"
              htmlFor="email"
              sx={{
                mt: 2,
                mb: 0.5,
                fontSize: 13,
                fontWeight: 700,
                color: "#1D425D",
              }}
            >
              Email Address
            </Typography>
            <TextField
              id="email"
              type="email"
              fullWidth
              placeholder="juan@gmail.com"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              sx={inputSx}
            />

            {/* MESSAGE */}
            <Typography
              component="label"
              htmlFor="message"
              sx={{
                mt: 2,
                mb: 0.5,
                fontSize: 13,
                fontWeight: 700,
                color: "#1D425D",
              }}
            >
              Message
            </Typography>
            <TextField
              id="message"
              fullWidth
              placeholder="Tell us how we can help..."
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
              sx={inputSx}
            />

            {/* SUBMIT */}
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={loading}
              endIcon={!loading && <SendRoundedIcon />}
              sx={{
                mt: 3,
                minHeight: 48,
                borderRadius: 2.5,
                textTransform: "none",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                background:
                  "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.35)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)",
                  boxShadow: "0 8px 26px rgba(25, 118, 210, 0.45)",
                  transform: "translateY(-2px)",
                },
                "&.Mui-disabled": {
                  background: "#90CAF9",
                  color: "#fff",
                },
                "& .MuiButton-endIcon": {
                  transition: "transform 0.25s ease",
                },
                "&:hover .MuiButton-endIcon": {
                  transform: "translateX(4px)",
                },
                transition: "all 0.25s ease",
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Send Message"
              )}
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* MODAL — success / error */}
      {/* ============================================================ */}
      <Dialog
        open={modalOpen}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              p: 1,
              textAlign: "center",
              background:
                "linear-gradient(135deg, #FFFFFF 0%, #F0F7FE 100%)",
              border: "1px solid rgba(25, 118, 210, 0.15)",
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
                  animation: "popIn 0.4s ease",
                  "@keyframes popIn": {
                    "0%": { transform: "scale(0.5)", opacity: 0 },
                    "70%": { transform: "scale(1.1)", opacity: 1 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              />
            ) : (
              <ErrorRoundedIcon
                sx={{
                  fontSize: 64,
                  color: "#E53935",
                  animation: "popIn 0.4s ease",
                  "@keyframes popIn": {
                    "0%": { transform: "scale(0.5)", opacity: 0 },
                    "70%": { transform: "scale(1.1)", opacity: 1 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              />
            )}
          </Box>
          <Typography
            sx={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "#0D3654",
              lineHeight: 1.5,
            }}
          >
            {modalTitle}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}