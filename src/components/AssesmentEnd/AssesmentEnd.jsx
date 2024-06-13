import MainLayout from "../Layouts.jsx/MainLayout";
import { Box } from "@mui/material";
import {
  AssesmentCompletePlane,
  AverageMood,
  BadMood,
  GoodMood,
  getLocalData,
  setLocalData,
} from "../../utils/constants";
import homeBackground from "../../assets/images/homeBackground.png";
import { Typography } from "../../../node_modules/@mui/material/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import { ProfileHeader } from "../Assesment/Assesment";
import desktopLevel5 from "../../assets/images/assesmentComplete.png";
import config from '../../utils/urlConstants.json';
import { uniqueId } from "../../services/utilService";

const AssesmentEnd = () => {
  const [shake, setShake] = useState(true);
  const [level, setLevel] = useState("");
  const [previousLevel, setPreviousLevel] = useState("");
  const [points, setPoints] = useState(0);

  useEffect(() => {
    (async () => {
      let audio = new Audio(LevelCompleteAudio);
      audio.play();
      const virtualId = getLocalData("virtualId");
      const lang = getLocalData("lang");
      const previous_level = getLocalData("previous_level");
      setPreviousLevel(previous_level?.replace("m", ""));
      const getMilestoneDetails = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}/${virtualId}?language=${lang}`
      );
      const { data } = getMilestoneDetails;
      setLevel(data.data.milestone_level);
      setLocalData("userLevel", data.data.milestone_level?.replace("m", ""));
      const sessionId = getLocalData("sessionId");
      if (!sessionId){
        sessionId = uniqueId();
        localStorage.setItem("sessionId", sessionId)
      }
      const getPointersDetails = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_POINTER}/${virtualId}/${sessionId}?language=${lang}`
      );
      setPoints(getPointersDetails?.data?.result?.totalLanguagePoints || 0);
    })();
    setTimeout(() => {
      setShake(false);
    }, 4000);
  }, []);

  const navigate = useNavigate();
  let newLevel = level.replace("m", "");

  const sectionStyle = {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${desktopLevel5})`,
    backgroundSize: "contain", // Cover the entire viewport
    backgroundRepeat: "round", // Center the image
    position: "relative",
  };

  const handleRedirect = () => {
    navigate("/practice");
  };
  return true ? (
    <Box style={sectionStyle}>
      <ProfileHeader {...{ level: newLevel, points }} />
      <Box sx={{ position: "absolute", top: 5, left: 0 }}>
        <Box sx={{ position: "relative" }} className="plane">
          <AssesmentCompletePlane />
          <Box sx={{ position: "absolute", bottom: 135, left: 120 }}>
            <span
              style={{
                color: "#00B359",
                fontWeight: 700,
                fontSize: "22px",
                fontFamily: "Quicksand",
                lineHeight: "32.5px",
                letterSpacing: "2%",
              }}
            >
              {newLevel === previousLevel ? "Amost There.!" : `Hurray.!`}
            </span>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 105,
              left: 40,
              transform: "rotate(-12deg)",
            }}
          >
            <span
              style={{
                color: "#183346",
                fontWeight: 700,
                fontSize: "18px",
                fontFamily: "Quicksand",
                lineHeight: "30px",
              }}
            >
              {newLevel === previousLevel
                ? "more"
                : `Level ${previousLevel || ""}`}
            </span>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 110,
              left: 105,
              // transform: "rotate(-2deg)",
            }}
          >
            <span
              style={{
                color: "#183346",
                fontWeight: 700,
                fontSize: "18px",
                fontFamily: "Quicksand",
                lineHeight: "30px",
              }}
            >
              {newLevel === previousLevel ? "practice" : `completed`}
            </span>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: newLevel === previousLevel ? 115 : 125,
              left: newLevel === previousLevel ? 190 : 200,
              transform:
                newLevel === previousLevel ? "rotate(-5deg)" : "rotate(-18deg)",
            }}
          >
            <span
              style={{
                color: "#183346",
                fontWeight: 700,
                fontSize: "18px",
                fontFamily: "Quicksand",
                lineHeight: "30px",
              }}
            >
              {newLevel === previousLevel ? "required" : `successfully`}
            </span>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100px",
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          zIndex: 5555,
          justifyContent: "space-between",
        }}
      >
        <Box
          ml={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Box>
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "18px",
                fontFamily: "Quicksand",
                lineHeight: "24.5px",
              }}
            >
              {`Rate your experience for Level ${previousLevel}`}
            </span>
          </Box>
          <Box display="flex" mt={1}>
            <Box>
              <GoodMood />
            </Box>
            <Box ml={3}>
              <AverageMood />
            </Box>
            <Box ml={3}>
              <BadMood />
            </Box>
          </Box> */}
        </Box>
        <Box
          mr={8}
          sx={{
            display: "flex",
          }}
        >
          {/* <Box
            sx={{
              cursor: "pointer",
              background: "linear-gradient(90deg, #8585A2 0%, #39394F 85%)",
              minWidth: "60px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
            onClick={handleRedirect}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "20px",
                fontFamily: "Quicksand",
              }}
            >
              {"Home"}
            </span>
          </Box> */}
          <Box
            ml={3}
            sx={{
              cursor: "pointer",
              background:
                "linear-gradient(90deg, rgba(255,144,80,1) 0%, rgba(225,84,4,1) 85%)",
              minWidth: "100px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
            onClick={handleRedirect}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "20px",
                fontFamily: "Quicksand",
              }}
            >
              {"Continue"}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : (
    <MainLayout
      showNext={true}
      showTimer={false}
      backgroundImage={homeBackground}
      enableNext={true}
      {...{
        handleNext: () => {
          navigate(`/`);
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
        mt={5}
      >
        {/* <Box sx={{ position: "absolute", top: 5, right: 80 }}>
          <Box sx={{ position: "absolute", top: "center" }}></Box>
          <span
            style={{
              color: "#FFB118",
              fontWeight: 400,
              fontSize: "30px",
              fontFamily: "'Bad Comic', sans-serif",
              lineHeight: "30px",
              marginLeft: "10px",
            }}
          >
            {"Level"}
          </span>
          <LevelRight />
        </Box> */}
        <Typography
          className="successHeader"
          sx={{
            mt: 5,
            textAlign: "center",
          }}
        >
          {newLevel === previousLevel ? `Almost There!!!` : `Hurray!!!`}
        </Typography>
        <Box mt={1}>
          <span
            style={{
              color: "#50507D",
              fontWeight: 600,
              fontSize: "30px",
              fontFamily: "Quicksand",
              lineHeight: "37.5px",
              letterSpacing: "2%",
            }}
          >
            {newLevel === previousLevel
              ? `Some more practice required to complete ${previousLevel}`
              : `You completed Level ${previousLevel} successfully`}
          </span>
        </Box>
        {/* <Box display="flex" mt={2}>
          <span
            style={{
              color: "#FFB118",
              fontWeight: 500,
              fontSize: "28px",
              fontFamily: "Quicksand",
              lineHeight: "30px",
              marginLeft: "10px",
            }}
          >
            {"You Earned"}
          </span>
          <Box ml={1}>
            <img src={coinStar} height={34} width={34} />
          </Box>
          <span
            style={{
              color: "#FFB118",
              fontWeight: 700,
              fontSize: "28px",
              fontFamily: "Quicksand",
              lineHeight: "30px",
              marginLeft: "10px",
            }}
          >
            {"46"}
          </span>
          <span
            style={{
              color: "#FFB118",
              fontWeight: 500,
              fontSize: "28px",
              fontFamily: "Quicksand",
              lineHeight: "30px",
              marginLeft: "10px",
            }}
          >
            {"Coins"}
          </span>
        </Box> */}
        <Box mt={5}>
          <span
            style={{
              color: "#5C5C84",
              fontWeight: 400,
              fontSize: "26px",
              fontFamily: "Quicksand",
              lineHeight: "28.5px",
            }}
          >
            {`Rate your experience for Level ${previousLevel}`}
          </span>
        </Box>
        <Box display="flex" mt={2}>
          <Box>
            <GoodMood />
          </Box>
          <Box ml={2}>
            <AverageMood />
          </Box>
          <Box ml={2}>
            <BadMood />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default AssesmentEnd;
