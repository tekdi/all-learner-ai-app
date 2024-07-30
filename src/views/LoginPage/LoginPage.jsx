import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import config from "../../utils/urlConstants.json";
import './LoginPage.css'; // Import the CSS file

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
    localStorage.clear();

    try {
      const usernameDetails = await axios.post(
        `${process.env.REACT_APP_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}`
      );

      if (usernameDetails?.data?.result?.virtualID) {
        localStorage.setItem("profileName", username);
        localStorage.setItem("virtualId", usernameDetails?.data?.result?.virtualID);
        navigate("/discover-start");
      } else {
        alert("Enter correct username and password");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred. Please try again later.");
    }
  };

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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
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
