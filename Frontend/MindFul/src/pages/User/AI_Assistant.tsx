import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  alpha,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { aiAssistantApi } from "../../services/api";

// ============================================================
// TYPES
// ============================================================
interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isError?: boolean;
}

// ============================================================
// WELCOME MESSAGE
// ============================================================
const WELCOME_MESSAGE = "Hi there! 👋 How can I help you today?";

// Height of the input row (TextField single line + Send button)
const INPUT_HEIGHT = 48;

// ============================================================
// AI ASSISTANT PAGE
// ============================================================
export default function AI_Assistant() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: WELCOME_MESSAGE,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // AUTO-SCROLL
  // ============================================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ============================================================
  // HANDLE SEND
  // ============================================================
  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await aiAssistantApi.chat({ message: messageText });
      const aiText =
        res.data.response || "Sorry, I couldn't generate a response.";

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiText,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error("AI Assistant error:", err);

      const errorText =
        err.response?.data?.message ||
        "Sorry, I'm having trouble connecting right now. Please try again in a moment.";

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
        sender: "ai",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ============================================================
  // COPY MESSAGE
  // ============================================================
  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // ============================================================
  // FORMAT TIME
  // ============================================================
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  // ============================================================
  // RENDER MARKDOWN
  // ============================================================
  const renderMessageText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <Box
          key={i}
          sx={{
            minHeight: line === "" ? "0.6em" : "auto",
            fontSize: { xs: "0.875rem", sm: "0.925rem" },
            lineHeight: 1.75,
            letterSpacing: 0.15,
          }}
        >
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <Box
                  key={j}
                  component="span"
                  sx={{ fontWeight: 800, color: "inherit" }}
                >
                  {part.slice(2, -2)}
                </Box>
              );
            }
            return <span key={j}>{part}</span>;
          })}
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        mt: { xs: 2, sm: 4 },
        px: { xs: 1.5, sm: 3 },
        pb: 4,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          mb: { xs: 2.5, sm: 3.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.85rem" },
            fontWeight: 800,
            color: "#0D3654",
            lineHeight: 1.2,
            letterSpacing: -0.6,
            textAlign: "center",
          }}
        >
          AI Assistant
        </Typography>
      </Box>

      {/* CHAT CONTAINER */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: { xs: 3, sm: 4, md: 5 },
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: (theme) =>
            `0 24px 70px ${alpha(
              theme.palette.primary.main,
              0.12
            )}, 0 10px 28px ${alpha(theme.palette.primary.main, 0.05)}`,
          border: "1px solid rgba(255, 255, 255, 0.8)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: {
            xs: "calc(100vh - 200px)",
            sm: "calc(100vh - 220px)",
          },
          minHeight: 460,
          maxHeight: 760,
        }}
      >
        {/* MESSAGES AREA */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, sm: 3.5, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2.5, sm: 3.5 },
            bgcolor: "rgba(240, 247, 254, 0.35)",
            "&::-webkit-scrollbar": { width: 8 },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
              margin: "8px 0",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#CBD5E1",
              borderRadius: 4,
              border: "2px solid transparent",
              backgroundClip: "padding-box",
              "&:hover": {
                background: "#94A3B8",
                backgroundClip: "padding-box",
              },
            },
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                gap: { xs: 1.5, sm: 2 },
                flexDirection:
                  message.sender === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
                animation: "fadeIn 0.35s ease",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0, transform: "translateY(10px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {message.sender === "ai" && (
                <Avatar
                  sx={{
                    width: { xs: 36, sm: 42 },
                    height: { xs: 36, sm: 42 },
                    flexShrink: 0,
                    background: message.isError
                      ? "linear-gradient(135deg, #E53935 0%, #EF5350 100%)"
                      : "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                    boxShadow: message.isError
                      ? "0 6px 16px rgba(229, 57, 53, 0.3)"
                      : "0 6px 16px rgba(25, 118, 210, 0.3)",
                    mt: 0.5,
                  }}
                >
                  {message.isError ? (
                    <ErrorOutlineRoundedIcon
                      sx={{ fontSize: { xs: 18, sm: 22 } }}
                    />
                  ) : (
                    <SmartToyRoundedIcon
                      sx={{ fontSize: { xs: 18, sm: 22 } }}
                    />
                  )}
                </Avatar>
              )}

              {/* Message bubble */}
              <Box
                sx={{
                  maxWidth: { xs: "82%", sm: "72%" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 1.75, sm: 2 },
                    borderRadius: 3,
                    borderTopLeftRadius: message.sender === "ai" ? 0.75 : 3,
                    borderTopRightRadius: message.sender === "user" ? 0.75 : 3,
                    background:
                      message.sender === "user"
                        ? "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)"
                        : message.isError
                        ? "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)"
                        : "#FFFFFF",
                    color:
                      message.sender === "user"
                        ? "#fff"
                        : message.isError
                        ? "#B71C1C"
                        : "#1D425D",
                    boxShadow:
                      message.sender === "user"
                        ? "0 6px 18px rgba(25, 118, 210, 0.28)"
                        : message.isError
                        ? "0 3px 14px rgba(229, 57, 53, 0.15)"
                        : "0 3px 14px rgba(0, 0, 0, 0.06)",
                    border: message.isError
                      ? "1px solid rgba(229, 57, 53, 0.2)"
                      : message.sender === "ai"
                      ? "1px solid rgba(25, 118, 210, 0.1)"
                      : "none",
                  }}
                >
                  <Typography component="div">
                    {renderMessageText(message.text)}
                  </Typography>
                </Box>

                {/* Timestamp + actions */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                    mx: 0.75,
                    flexDirection:
                      message.sender === "user" ? "row-reverse" : "row",
                    opacity: 0.85,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      color: "#90A4AE",
                      fontWeight: 500,
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>

                  {message.sender === "ai" &&
                    message.id !== 1 &&
                    !message.isError && (
                      <Box sx={{ display: "flex", gap: 0.3 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(message.id, message.text)}
                          sx={{
                            p: 0.5,
                            color:
                              copiedId === message.id ? "#43A047" : "#90A4AE",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              color: "#1976D2",
                              bgcolor: "rgba(25, 118, 210, 0.08)",
                            },
                          }}
                        >
                          {copiedId === message.id ? (
                            <CheckRoundedIcon sx={{ fontSize: 14 }} />
                          ) : (
                            <ContentCopyRoundedIcon sx={{ fontSize: 14 }} />
                          )}
                        </IconButton>
                      </Box>
                    )}
                </Box>
              </Box>
            </Box>
          ))}

          {/* TYPING INDICATOR */}
          {isTyping && (
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1.5, sm: 2 },
                alignItems: "flex-start",
                animation: "fadeIn 0.35s ease",
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 36, sm: 42 },
                  height: { xs: 36, sm: 42 },
                  background:
                    "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
                  mt: 0.5,
                }}
              >
                <SmartToyRoundedIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
              </Avatar>
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  borderRadius: 3,
                  borderTopLeftRadius: 0.75,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(25, 118, 210, 0.1)",
                  boxShadow: "0 3px 14px rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      bgcolor: "#1976D2",
                      opacity: 0.4,
                      animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                      "@keyframes bounce": {
                        "0%, 60%, 100%": {
                          transform: "translateY(0)",
                          opacity: 0.4,
                        },
                        "30%": {
                          transform: "translateY(-7px)",
                          opacity: 1,
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT AREA */}
        <Divider sx={{ borderColor: "rgba(25, 118, 210, 0.08)" }} />
        <Box
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            display: "flex",
            gap: { xs: 1.2, sm: 1.5 },
            alignItems: "flex-end",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Ask me anything about your mindfulness journey..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            size="small"
            disabled={isTyping}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#F0F7FE",
                transition: "all 0.25s ease",
                fontSize: "0.925rem",
                lineHeight: 1.5,
                padding: 0,
                "& fieldset": {
                  borderColor: "transparent",
                  borderWidth: 2,
                },
                "&:hover fieldset": { borderColor: "#90CAF9" },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976D2",
                  borderWidth: 2,
                },
              },
              // Same vertical padding + line-height everywhere so the
              // single-line height matches INPUT_HEIGHT exactly
              "& .MuiOutlinedInput-input": {
                padding: "12px 16px",
                lineHeight: 1.5,
                fontSize: "0.925rem",
                boxSizing: "border-box",
                "&::placeholder": {
                  color: "#8FA9BC",
                  opacity: 1,
                },
              },
            }}
          />

          <IconButton
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            sx={{
              width: { xs: INPUT_HEIGHT, sm: INPUT_HEIGHT },
              height: { xs: INPUT_HEIGHT, sm: INPUT_HEIGHT },
              minWidth: INPUT_HEIGHT,
              flexShrink: 0,
              borderRadius: 2.5,
              alignSelf: "flex-end",
              background: input.trim()
                ? "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)"
                : "#E0E7EF",
              color: input.trim() ? "#fff" : "#90A4AE",
              boxShadow: input.trim()
                ? "0 6px 18px rgba(25, 118, 210, 0.35)"
                : "none",
              transition: "all 0.25s ease",
              "&:hover": {
                background: input.trim()
                  ? "linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)"
                  : "#E0E7EF",
                transform: input.trim() ? "scale(1.06)" : "none",
                boxShadow: input.trim()
                  ? "0 8px 24px rgba(25, 118, 210, 0.45)"
                  : "none",
              },
              "&:active": {
                transform: "scale(0.94)",
              },
              "&.Mui-disabled": {
                color: "#90A4AE",
              },
            }}
          >
            {isTyping ? (
              <CircularProgress size={20} sx={{ color: "#90A4AE" }} />
            ) : (
              <SendRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
            )}
          </IconButton>
        </Box>
      </Paper>

      {/* FOOTER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.8,
          mt: 2,
          px: 2,
        }}
      >
        <SpaRoundedIcon sx={{ fontSize: 14, color: "#90A4AE" }} />
      </Box>
    </Box>
  );
}