import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import axios from "../../../node_modules/axios/index";
import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import back from "../../assets/images/back-arrow.svg";
import discoverEndLeft from "../../assets/images/discover-end-left.svg";
import discoverEndRight from "../../assets/images/discover-end-right.svg";
import textureImage from "../../assets/images/textureImage.png";
import {
  LetsStart,
  getLocalData,
  setLocalData,
} from "../../utils/constants";
import config from '../../utils/urlConstants.json';

const sectionStyle = {
  backgroundImage: `url(${textureImage})`,
  backgroundSize: "cover", // Cover the entire viewport
  backgroundPosition: "center center", // Center the image
  width: "85vw",
  height: "80vh",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
  backdropFilter: "blur(25px)",
};

const SpeakSentenceComponent = () => {
  const [shake, setShake] = useState(true);
  const [level, setLevel] = useState("");

  useEffect(() => {
    
    (async () => {
      let audio = new Audio(LevelCompleteAudio);
      audio.play();
      const virtualId = getLocalData("virtualId");
      const lang = getLocalData("lang");
      const getMilestoneDetails = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}/${virtualId}?language=${lang}`
      );
      const { data } = getMilestoneDetails;
      setLevel(data.data.milestone_level);
      setLocalData("userLevel", data.data.milestone_level?.replace("m", ""));
    })();
    setTimeout(() => {
      setShake(false);
    }, 4000);
  }, []);

  const handleProfileBack = () => {
    try {
      if (process.env.REACT_APP_IS_APP_IFRAME === 'true') {
        navigate("/")
      } else {
        navigate("/discover-start")
      }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  let width = window.innerWidth * 0.85;
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: "linear-gradient(45deg, #5FDF9A 30%, #35C57C 90%)",
        minHeight: "100vh",
        padding: "20px 100px",
        boxSizing: "border-box",
      }}
    >
      <IconButton>
        <img src={back} alt="back" style={{ height: "30px" }} />
      </IconButton>
      <Card sx={sectionStyle}>
        <Box sx={{ position: "absolute", left: "3px", bottom: "0px" }}>
          <img
            src={discoverEndLeft}
            alt="timer"
            className={shake && "shakeImage"}
          />
        </Box>
        <Box sx={{ position: "absolute", right: "3px", bottom: "0px" }}>
          <img
            src={discoverEndRight}
            alt="timer"
            className={shake && "shakeImage"}
          />
        </Box>
        <Box>
          {/* {!shake && <img src={discoverEndTop} alt="timer" className={shake && 'shakeImage'} />} */}
          {shake && <Confetti width={width} height={"600px"} />}
        </Box>
        <CardContent>
          <Typography
            className="successHeader"
            sx={{
              mb: 4,
              mt: 5,
              textAlign: "center",
            }}
          >
            Hurray!!!
          </Typography>
          <Typography
            variant="h4"
            component="p"
            sx={{
              mb: 4,
              color: "#50507D",
              textAlign: "center",
              fontSize: "18px",
              width: "60%",
              margin: "0 auto",
              fontWeight: 600,
              fontFamily: "Quicksand",
              letterSpacing: "0.56px",
            }}
          >
            {`You have good language skills. You can start from Level ${level.replace(
              "m",
              ""
            )}. Let the learning journey begin!`}
            <br /> <br />
          </Typography>

          <Box
           onClick={() => handleProfileBack()}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "60%",
              margin: "0 auto",
              cursor: "pointer",
            }}
          >
            <LetsStart />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SpeakSentenceComponent;
