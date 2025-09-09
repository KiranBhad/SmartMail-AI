import React, { useState } from "react";
import "./App.css";
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  MenuItem,
  CircularProgress,
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ReactTyped } from "react-typed";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
      });

      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );

      setTimeout(() => {
        setShowReply(true);
      }, 300);
    } catch (error) {
      console.error("Failed to generate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowReply(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", // Light blue gradient
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 6px 25px rgba(25,118,210,0.2)",
          borderBottom: "1px solid rgba(25,118,210,0.2)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              letterSpacing: 1,
              color: "#1976d2",
            }}
          >
            ✉️{" "}
            <ReactTyped
              strings={["SmartMail AI", "Your AI Email Assistant"]}
              typeSpeed={90}
              backSpeed={50}
              loop
            />
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main container */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ perspective: "1500px", minHeight: "440px" }}>
          <AnimatePresence mode="wait">
            {!showReply ? (
              // Front Card
              <motion.div
                key="front"
                initial={{ rotateY: -180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 180, opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 8px 30px rgba(25,118,210,0.2)",
                    transition: "all 0.3s ease",
                    ":hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 35px rgba(25,118,210,0.3)",
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      mb: 3,
                      color: "#1976d2",
                    }}
                  >
                    Paste your email content
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    label="Original Email Content"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        background: "#f9f9f9",
                      },
                    }}
                  />

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="tone-label">Tone (Optional)</InputLabel>
                    <Select
                      labelId="tone-label"
                      id="tone-select"
                      value={tone}
                      label="Tone (Optional)"
                      onChange={(e) => setTone(e.target.value)}
                      sx={{
                        borderRadius: 3,
                        background: "#f9f9f9",
                      }}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="Professional">Professional</MenuItem>
                      <MenuItem value="Friendly">Friendly</MenuItem>
                      <MenuItem value="Casual">Casual</MenuItem>
                      <MenuItem value="Angry">Angry</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: "bold",
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1rem",
                      background: "linear-gradient(90deg, #42a5f5, #64b5f6)",
                      boxShadow: "0 5px 15px rgba(66,165,245,0.3)",
                      ":hover": {
                        background: "linear-gradient(90deg, #1e88e5, #42a5f5)",
                        boxShadow: "0 8px 20px rgba(66,165,245,0.5)",
                        transform: "scale(1.02)",
                      },
                    }}
                    onClick={handleSubmit}
                    disabled={!emailContent || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Generate AI Reply"}
                  </Button>
                </Paper>
              </motion.div>
            ) : (
              // Back Card
              <motion.div
                key="back"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -180, opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 8px 30px rgba(25,118,210,0.25)",
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold", mb: 3, color: "#1976d2" }}
                  >
                    Your AI-Generated Reply
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    value={generatedReply}
                    inputProps={{ readOnly: true }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        background: "#f9f9f9",
                      },
                    }}
                  />

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderRadius: 3,
                        borderColor: "#42a5f5",
                        color: "#1976d2",
                        ":hover": {
                          borderColor: "#1e88e5",
                          background: "rgba(66,165,245,0.1)",
                        },
                      }}
                      onClick={() => navigator.clipboard.writeText(generatedReply)}
                    >
                      Copy to Clipboard
                    </Button>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleBack}
                      sx={{
                        borderRadius: 3,
                        background: "linear-gradient(90deg, #42a5f5, #64b5f6)",
                        boxShadow: "0 5px 15px rgba(66,165,245,0.3)",
                        ":hover": {
                          background: "linear-gradient(90deg, #1e88e5, #42a5f5)",
                          boxShadow: "0 8px 20px rgba(66,165,245,0.5)",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      Back
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
