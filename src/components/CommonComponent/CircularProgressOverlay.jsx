import React from "react";
import { Box, CircularProgress } from "@mui/material";

const CircularProgressOverlay = ({ size, color }) => (
  <Box
    sx={{
      display: "flex",
      position: "absolute",
      zIndex: 999,
      justifyContent: "center",
      width: "100%",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "rgb(0 0 0 / 56%)",
    }}
  >
    <CircularProgress size={size} sx={{ color: color }} />
  </Box>
);

export default CircularProgressOverlay;
