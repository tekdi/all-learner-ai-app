import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";
import config from "../../utils/urlConstants.json";
import "./LoginPage.css"; // Import the CSS file

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Initialize with empty string
  const [password, setPassword] = useState(""); // Initialize with empty string
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!searchParams.get("username")) {
      alert("Add username in URL");
      return;
    }

    localStorage.clear();

    try {
      const usernameDetails = await axios.post(
        `${process.env.REACT_APP_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}`
      );

      if (usernameDetails?.data?.result?.virtualID) {
        localStorage.setItem("profileName", username);
        localStorage.setItem(
          "virtualId",
          usernameDetails?.data?.result?.virtualID
        );
        navigate("/discover-start");
      } else {
        alert("Enter correct username and password");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    const usernameFromURL = searchParams.get("username");
    if (usernameFromURL) {
      setUsername(usernameFromURL);
    }
  }, [searchParams]);

  useEffect(() => {
    if (username) {
      handleSubmit(); // Automatically submit the form if username exists
    }
    if (!searchParams.get("username")) {
      alert("Add username in URL");
    }
  }, [username]);

  return (
    <Container className="container">
      <div className="loginBox">
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="Username"
                variant="outlined"
                fullWidth
                value={username || ""} // Ensure it has a value
                InputProps={{
                  inputProps: {
                    readOnly: true, // Ensures the field is read-only
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="*****"
                variant="outlined"
                type="*****"
                fullWidth
                value={password || ""} // Ensure it has a value
                InputProps={{
                  inputProps: {
                    readOnly: true, // Ensures the field is read-only
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default LoginPage;
