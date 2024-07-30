import React from "react";
import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";
import RunnungBoy from '../../assets/images/boy-running.gif'

const ProgressOverlay = ({
  size,
  color = "#ffffff",
  showLinearProgress = false,
  downloadProgress = 0,
}) => (
  <Box
    sx={{
      display: "flex",
      position: "absolute",
      zIndex: 999,
      justifyContent: "center",
      width: "100%",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "rgb(0 0 0 /36%)",
    }}
  >
    {showLinearProgress ? (
      <Box sx={{ position: "relative", width: '40%' }}>
        <LinearProgress
          variant="determinate"
          value={downloadProgress}
          sx={{
            borderRadius: 5,
            height: 20,
            '& .MuiLinearProgress-bar': {
              backgroundColor: "#000000",
            },
          }}
        />
         <Box
          sx={{
            position: "absolute",
            top: -55, // Adjust the vertical position of the emoji
            left: `${downloadProgress}%`,
            transform: 'translateX(-50%)',
            transition: 'left 0.2s linear', // Smooth transition for emoji movement
            fontSize: 24, // Adjust the size of the emoji
          }}
        >
          <img style={{height:'57px', paddingBottom:'10px'}} src={RunnungBoy}/>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none", // Prevents interaction with the overlay
            textAlign: "center", // Center the text horizontally
          }}
        >
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{
              color: "common.white",
              mixBlendMode: 'difference',
            }}
          >
            LOADING… {`${Math.round(Number(downloadProgress))}%`}
          </Typography>
        </Box>
      </Box>
    ) : (
      <CircularProgress size={size} sx={{ color: color }} />
    )}
  </Box>
);

export default ProgressOverlay;
