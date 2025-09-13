// components/Header.js
"use client"; // needed if you're using App Router

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation"; // Use 'next/navigation' if using App Router
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useLocalStorage } from "usehooks-ts";
import { Home } from "@mui/icons-material";

export default function Header() {
  const router = useRouter();
  const [token, , removeToken] = useLocalStorage("token", null);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = () => {
    removeToken();
    router.push("/");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Expense
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {token ? (
            <>
              <Button
                color="inherit"
                startIcon={<Home />}
                onClick={() => router.push("/")}
              >
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                  }}
                >
                  Home
                </Box>
              </Button>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => router.push("/dashboard")}
              >
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                  }}
                >
                  Dashboard
                </Box>
              </Button>

              <Button
                color="inherit"
                onClick={handleLogoutClick}
                startIcon={<LogoutIcon />}
              >
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                  }}
                >
                  Logout
                </Box>
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
            >
              <Box
                component="span"
                sx={{
                  display: { xs: "none", sm: "inline" },
                }}
              >
                Login
              </Box>
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
