import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { Select, MenuItem, FormHelperText } from "@mui/material";
import axios from "axios";
import config from "../config.js";

const defaultTheme = createTheme();

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(true);
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const input = e.target.value;
    setPassword(input);
    setValidPassword(input.length === 0 || input.length >= 8);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setJustVerify(true);
    setIsAlert(false);

    if (username.trim() === "") {
      setIsAlert(true);
      setAlertMessage("Username cannot be empty");
      return;
    }

    if (name.trim() === "") {
      setIsAlert(true);
      setAlertMessage("Name cannot be empty");
      return;
    }

    if (email.trim() === "") {
      setIsAlert(true);
      setAlertMessage("Email cannot be empty");
      return;
    }

    if (!validateEmail(email.trim())) {
      setIsAlert(true);
      setAlertMessage("Please enter a valid email address");
      return;
    }

    if (password === "") {
      setIsAlert(true);
      setAlertMessage("Password cannot be empty");
      return;
    }

    if (!validPassword) {
      setIsAlert(true);
      setAlertMessage("Password must be at least 8 characters long");
      return;
    }

    if (password !== repassword) {
      setIsAlert(true);
      setAlertMessage("Passwords do not match");
      return;
    }

    if (role === "") {
      setIsAlert(true);
      setAlertMessage("Please select a role");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${config.BACKEND_API}/signup`, {
        username: username.trim(),
        email: email.trim(),
        name: name.trim(),
        password,
        role,
      });

      if (response.status === 201 && response.data.success) {
        navigate("/login");
      } else {
        setIsAlert(true);
        setAlertMessage(response.data.message || "Registration failed");
      }
    } catch (error) {
      setIsAlert(true);
      setAlertMessage(error.response?.data?.message || "Registration failed");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-glass-effect">
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="sm"
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 12,
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              borderRadius: "2em",
              padding: "3em",
              height: "auto",
              boxShadow: "0px 4px 8px #caf0f8",
            }}
          >
            <Avatar sx={{ m: 1 }} style={{ backgroundColor: "#25396F" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
            >
              Create A New Account
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                  },
                }}
                error={justVerify && username.trim() === ""}
                helperText={
                  justVerify && (username.trim() === "" ? "This field cannot be empty." : "")
                }
                autoComplete="off"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                  },
                }}
                error={justVerify && name.trim() === ""}
                helperText={
                  justVerify && (name.trim() === "" ? "This field cannot be empty." : "")
                }
                autoComplete="off"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                  },
                }}
                error={justVerify && (email.trim() === "" || !validateEmail(email.trim()))}
                helperText={
                  justVerify &&
                  (email.trim() === ""
                    ? "This field cannot be empty."
                    : !validateEmail(email.trim())
                    ? "Please enter a valid email address"
                    : "")
                }
                autoComplete="off"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={handlePasswordChange}
                value={password}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                    color: !validPassword ? "#f44336" : "#25396F",
                  },
                }}
                error={justVerify && (!validPassword || password === "")}
                helperText={
                  justVerify &&
                  (password === ""
                    ? "This field cannot be empty."
                    : !validPassword
                    ? "The password must contain at least 8 characters."
                    : "")
                }
                autoComplete="off"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                onChange={(e) => setRePassword(e.target.value)}
                value={repassword}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                    color: repassword !== password ? "#f44336" : "#25396F",
                  },
                }}
                error={justVerify && repassword !== password}
                helperText={
                  justVerify && (repassword !== password ? "Passwords do not match" : "")
                }
                autoComplete="off"
              />
              <Grid
                item
                xs={10}
                style={{ marginTop: "0.4em", fontFamily: "Quicksand" }}
                sx={{ fontWeight: "bold" }}
              >
                Role *
              </Grid>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ fontWeight: "bold", fontFamily: "Quicksand" }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
                error={justVerify && role === ""}
              >
                <MenuItem value="" disabled>
                  <em>Select a role</em>
                </MenuItem>
                <MenuItem value="compostAgency">Compost Agency</MenuItem>
                <MenuItem value="ngo">NGO</MenuItem>
                <MenuItem value="donor">Donor</MenuItem>
              </Select>
              {justVerify && role === "" && (
                <FormHelperText error>Please select a role</FormHelperText>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{
                  fontFamily: "Quicksand",
                  fontWeight: "bold",
                  backgroundColor: "#25396F",
                }}
                disabled={loading}
              >
                {!loading ? "Sign Up" : "Signing Up...."}
              </Button>
              <Grid container>
                <Grid item xs={12}>
                  {isAlert && (
                    <Alert
                      variant="filled"
                      severity="error"
                      style={{ fontFamily: "Quicksand", fontWeight: "600" }}
                    >
                      {alertMessage}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={() => navigate("/login")}
                    variant="text"
                    style={{
                      fontFamily: "Quicksand",
                      fontWeight: "bold",
                      color: "#03045e",
                      textDecoration: "underline",
                    }}
                  >
                    Already have an account? Sign In
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
