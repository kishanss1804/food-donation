import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

import { useAuth } from "../context/auth";
import config from "../config.js";

const Profile = () => {
  const imageURL =
    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");

  const [isValidPhone, setIsValidPhone] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setRole, LogOut } = useAuth();

  const validatePhoneNumber = (input) => {
    const value = input.replace(/\D/g, "");
    const isValid = /^\d{10}$/.test(value);
    setIsValidPhone(isValid);
  };

  const theme = createTheme({
    typography: {
      fontFamily: "Quicksand",
      body1: {
        fontWeight: "600",
      },
    },
  });

  const UpdateProfile = async () => {
    setJustVerify(true);
    if (name === "" || address === "" || !isValidPhone || location === "") return;

    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
    };
    try {
      await axios.post(
        (config.BACKEND_API || "http://localhost:8000") + "/update-profile",
        {
          name,
          username: userName,
          email,
          role: type,
          contact: phoneNumber,
          address,
          location,
        },
        { headers }
      );
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getProfile = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
    };
    try {
      const result = await axios.get(
        (config.BACKEND_API || "http://localhost:8000") + "/profile",
        { headers }
      );
      const { user } = result.data;
      setName(user.name);
      setEmail(user.email);
      setUserName(user.username);
      setType(user.role);
      setPhoneNumber(user.contact);
      setAddress(user.address);
      setLocation(user.location);
      validatePhoneNumber(user.contact);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!(token && role)) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setRole("");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    getProfile();
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  return (
    <div
      data-aos="fade-up"
      style={{ margin: "2em", fontFamily: "Quicksand", fontWeight: "600" }}
    >
      <ThemeProvider theme={theme}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <Card sx={{ maxWidth: "100%", textAlign: "center" }}>
              <CardMedia
                component="img"
                alt="profile"
                height="100"
                image={imageURL}
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  YOU
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {userName}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {email}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  +91 {phoneNumber}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Profile
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="First Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      error={justVerify && name === ""}
                      helperText={
                        justVerify && name === ""
                          ? "Please enter a valid name."
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      value={userName}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      value={email}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Type"
                      value={type}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      error={justVerify && address === ""}
                      helperText={
                        justVerify && address === ""
                          ? "Address cannot be empty."
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone No."
                      value={phoneNumber}
                      onChange={(e) => {
                        validatePhoneNumber(e.target.value);
                        setPhoneNumber(e.target.value);
                      }}
                      fullWidth
                      error={!isValidPhone && justVerify}
                      helperText={
                        justVerify && !isValidPhone
                          ? "Please enter a 10-digit number."
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="location"
                      label="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      fullWidth
                      error={justVerify && location === ""}
                      helperText={
                        justVerify && location === ""
                          ? "Please select your location."
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={UpdateProfile}
                      sx={{
                        mt: 2,
                        fontFamily: "Quicksand",
                        fontWeight: "bold",
                        backgroundColor: "#2A386B",
                      }}
                    >
                      {!loading ? "UPDATE" : "Updating..."}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container justifyContent="center" style={{ marginTop: "5em" }}>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              onClick={LogOut}
              sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
            >
              Logout &nbsp;
              <LogoutIcon />
            </Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default Profile;
