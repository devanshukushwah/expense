"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import { HttpUrlConfig } from "../../core/HttpUrlConfig";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { AppConstants } from "../../common/AppConstants";
import LazyInvoke from "@/utils/LazyInvoke";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setToken] = useLocalStorage<string | null>("token", null);
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const router = useRouter(); // ✅ initialize router

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    startLoading(); // Start loading state

    try {
      const response = await axios.post<{ token: string }>(
        HttpUrlConfig.getLoginUrl(),
        {
          email,
          password,
        }
      );
      const token = response.data.token;
      // Save token in localStorage
      setToken(token); // Update local state with the token
      setError(""); // Clear any previous error
      LazyInvoke({ callback: () => router.push("/") });
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.response && err.response.status === 401) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred while logging in. Please try again.");
        }
        stopLoading();
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={AppConstants.GAP}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              loading={loading}
            >
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don&apos;t have an account?&nbsp;
              <a
                href="/signup"
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                Sign up
              </a>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
