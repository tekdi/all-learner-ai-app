import MainLayout from "../Layouts.jsx/MainLayout";
import assessmentBackground from "../../assets/images/assessmentBackground.png";
import {
  Box,
  Grid,
  IconButton,
  Typography,
} from "../../../node_modules/@mui/material/index";
import {
  RoundTick,
  SelectLanguageButton,
  StartAssessmentButton,
  getLocalData,
  languages,
  levelConfig,
  setLocalData,
} from "../../utils/constants";
import practicebg from "../../assets/images/practice-bg.svg";
import {
  useNavigate,
} from "../../../node_modules/react-router-dom/dist/index";
import { useEffect, useState } from "react";
import axios from "../../../node_modules/axios/index";
// import { useDispatch } from 'react-redux';
import { setVirtualId } from "../../store/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import desktopLevel1 from "../../assets/images/desktopLevel1.png";
import desktopLevel2 from "../../assets/images/desktopLevel2.png";
import desktopLevel3 from "../../assets/images/desktopLevel3.jpg";
import desktopLevel4 from "../../assets/images/desktopLevel4.png";
import desktopLevel5 from "../../assets/images/desktopLevel5.png";
import desktopLevel6 from "../../assets/images/desktopLevel6.png";
import desktopLevel7 from "../../assets/images/desktopLevel7.png";
import desktopLevel8 from "../../assets/images/desktopLevel8.png";
import desktopLevel9 from "../../assets/images/desktopLevel9.png";
import profilePic from "../../assets/images/profile_url.png";
import textureImage from "../../assets/images/textureImage.png";
import back from "../../assets/images/back-arrow.png";
import { jwtDecode } from "jwt-decode";
import config from "../../utils/urlConstants.json";
import panda from "../../assets/images/panda.svg";
import cryPanda from "../../assets/images/cryPanda.svg";
import { uniqueId } from "../../services/utilService";

export const LanguageModal = ({ lang, setLang, setOpenLangModal }) => {
  const [selectedLang, setSelectedLang] = useState(lang);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: "600px",
          minHeight: "424px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${textureImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "round",
          boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
          backdropFilter: "blur(25px)",
        }}
      >
        <Box mt="32px">
          <span
            style={{
              color: "#000000",
              fontWeight: 600,
              fontSize: "36px",
              fontFamily: "Quicksand",
              lineHeight: "45px",
            }}
          >
            {`Select Language`}
          </span>
        </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Grid container justifyContent={"space-evenly"} sx={{ width: "80%" }}>
            {languages.map((elem) => {
              const isSelectedLang = elem.lang === selectedLang;
              return (
                <Grid xs={4} item>
                  <Box
                    onClick={() => setSelectedLang(elem.lang)}
                    sx={{
                      cursor: "pointer",
                      mt: "34px",
                      ml: "15px",
                      me: "15px",
                      height: "140px",
                      background: isSelectedLang ? "#EE6931" : "#EFEFEF",
                      borderRadius: "10px",
                      border: `3px solid ${
                        isSelectedLang ? "#A03D13" : "#DADADA"
                      }`,
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {isSelectedLang ? (
                        <Box mt={"-2px"} mr={"15px"}>
                          <RoundTick />
                        </Box>
                      ) : (
                        <Box
                          mt={"-2px"}
                          mr={"15px"}
                          sx={{
                            height: "18px",
                            width: "18px",
                            borderRadius: "15px",
                            border: "1.5px solid #999999",
                          }}
                        ></Box>
                      )}
                    </Box>
                    <Box mt="-2px">
                      <span
                        style={{
                          color: isSelectedLang ? "#FFFFFF" : "#000000",
                          fontWeight: 600,
                          fontSize: "50px",
                          fontFamily: "Quicksand",
                          lineHeight: "62px",
                        }}
                      >
                        {elem.symbol}
                      </span>
                    </Box>
                    <Box mt={1}>
                      <span
                        style={{
                          color: isSelectedLang ? "#FFFFFF" : "#000000",
                          fontWeight: 600,
                          fontSize: "20px",
                          fontFamily: "Quicksand",
                          lineHeight: "25px",
                        }}
                      >
                        {elem.name}
                      </span>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          mt="60px"
          // mr="110px"
        >
          <Box
            onClick={() => {
              setLang(selectedLang);
              setOpenLangModal(false);
            }}
            sx={{
              cursor: "pointer",
              background: "#6DAF19",
              minWidth: "173px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "20px",
                fontFamily: "Quicksand",
                display: "flex",
                alignItems: "center",
              }}
            >
              {"Confirm"}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const MessageDialog = ({
  message,
  closeDialog,
  isError,
  dontShowHeader,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: "600px",
          minHeight: "424px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${textureImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "round",
          boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
          backdropFilter: "blur(25px)",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", left: 10, bottom: 0 }}>
          {isError ? (
            <img src={cryPanda} alt="cryPanda" />
          ) : (
            <img src={panda} alt="panda" />
          )}
        </Box>

        <Box mt="32px">
          {!dontShowHeader && (
            <Typography
              className={isError ? "failureHeader" : "successHeader"}
              sx={{
                mt: 3,
                textAlign: "center",
              }}
            >
              {isError ? "Oops..." : "Hurray!!!"}
            </Typography>
          )}
        </Box>

        <Box
          mt="28px"
          display={"flex"}
          flexWrap={"wrap"}
          padding={"0px 10px 0px 10px"}
          width={"80%"}
        >
          <span
            style={{
              color: "#000000",
              fontWeight: 700,
              fontSize: "40px",
              fontFamily: "Quicksand",
              lineHeight: "62px",
              textAlign: "center",
            }}
          >
            {message || ``}
          </span>
        </Box>
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          mt="60px"
          // mr="110px"
          mb={2}
        >
          <Box
            onClick={() => {
              closeDialog();
            }}
            sx={{
              cursor: "pointer",
              background: "#6DAF19",
              minWidth: "173px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
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
  );
};

export const ProfileHeader = ({
  setOpenLangModal,
  lang,
  profileName,
  points = 0,
  handleBack,
}) => {
  const language = lang || getLocalData("lang");
  const username = profileName || getLocalData("profileName");
  const navigate = useNavigate();
  const [openMessageDialog, setOpenMessageDialog] = useState("");

  const handleProfileBack = () => {
    try {
      if (window !== window.parent) {
        window.parent.postMessage({ type: 'restore-iframe-content' }, '*');
      }
      navigate("/")
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "70px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(3px)",
          display: "flex",
          alignItems: "center",
          zIndex: 5555,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
          {handleBack && (
            <Box ml="94px">
              <IconButton onClick={handleBack}>
                <img src={back} alt="back" style={{ height: "30px" }} />
              </IconButton>
            </Box>
          )}
          {username && (
            <>
              <Box
                ml={handleBack ? "12px" : "94px"}
                sx={{ cursor: "pointer" }}
                onClick={handleProfileBack}
              >
                <img src={profilePic} alt="profile-pic"></img>
              </Box>
              <Box ml="12px">
                <span
                  style={{
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: "16px",
                    fontFamily: "Quicksand",
                    lineHeight: "25px",
                  }}
                >
                  {username || ""}
                </span>
              </Box>
            </>
          )}
        </Box>

        <Box
          sx={{
            justifySelf: "flex-end",
            width: "50%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <Box sx={{ position: "relative" }} mr="10px">
            <img
              src={scoreView}
              alt="scoreView"
              width={"86px"}
              height={"35px"}
            />
            <Box sx={{ position: "absolute", top: "6px", right: "16px" }}>
              <span
                style={{
                  color: "#FFDD39",
                  fontWeight: 700,
                  fontSize: "18px",
                  fontFamily: "Quicksand",
                }}
              >
                {points}
              </span>
            </Box>
          </Box> */}

          <Box
            mr={"90px"}
            onClick={() =>
              setOpenLangModal
                ? setOpenLangModal(true)
                : setOpenMessageDialog({
                    message: "go to homescreen to change language",
                    dontShowHeader: true,
                  })
            }
          >
            <Box sx={{ position: "relative", cursor: "pointer" }}>
              <SelectLanguageButton />
              <Box sx={{ position: "absolute", top: 9, left: 20 }}>
                <span
                  style={{
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: "16px",
                    fontFamily: "Quicksand",
                    lineHeight: "25px",
                  }}
                >
                  {languages?.find((elem) => elem.lang === language).name ||
                    `Select Language`}
                </span>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const Assesment = ({ discoverStart }) => {
  let username;
  if (localStorage.getItem("token") !== null) {
    let jwtToken = localStorage.getItem("token");
    var userDetails = jwtDecode(jwtToken);
    username = userDetails.student_name;
    setLocalData("profileName", username);
  }
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [profileName, setProfileName] = useState(username);
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  // let lang = searchParams.get("lang") || "ta";
  const [level, setLevel] = useState("");
  const dispatch = useDispatch();
  const [openLangModal, setOpenLangModal] = useState(false);
  const [lang, setLang] = useState(getLocalData("lang") || "en"); 
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // const level = getLocalData('userLevel');
    // setLevel(level);
    setLocalData("lang", lang);
    dispatch(setVirtualId(localStorage.getItem("virtualId")));
    let contentSessionId = localStorage.getItem("contentSessionId");
    localStorage.setItem("sessionId", contentSessionId);
    if (discoverStart && username && !localStorage.getItem("virtualId")) {
      (async () => {
        setLocalData("profileName", username);
        const usernameDetails = await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}`
        );
        const getMilestoneDetails = await axios.get(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}/${usernameDetails?.data?.result?.virtualID}?language=${lang}`
        );

        localStorage.setItem(
          "getMilestone",
          JSON.stringify({ ...getMilestoneDetails.data })
        );
        setLevel(
          getMilestoneDetails?.data.data?.milestone_level?.replace("m", "")
        );
        localStorage.setItem(
          "virtualId",
          usernameDetails?.data?.result?.virtualID
        );
        let session_id = localStorage.getItem("sessionId");

        if (!session_id){
          session_id = uniqueId();
          localStorage.setItem("sessionId", session_id)
        }
        
        localStorage.setItem("lang", lang || "ta");
        const getPointersDetails = await axios.get(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_POINTER}/${usernameDetails?.data?.result?.virtualID}/${session_id}?language=${lang}`
        );
        setPoints(getPointersDetails?.data?.result?.totalLanguagePoints || 0);

        dispatch(setVirtualId(usernameDetails?.data?.result?.virtualID));
      })();
    } else {
      (async () => {
        const virtualId = getLocalData("virtualId");
        const language = lang;
        const getMilestoneDetails = await axios.get(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}/${virtualId}?language=${language}`
        );
        localStorage.setItem(
          "getMilestone",
          JSON.stringify({ ...getMilestoneDetails.data })
        );
        setLevel(
          Number(
            getMilestoneDetails?.data.data?.milestone_level?.replace("m", "")
          )
        );
        const sessionId = getLocalData("sessionId");

        if (!sessionId){
          sessionId = uniqueId();
          localStorage.setItem("sessionId", sessionId)
        }

        if (virtualId) {
          const getPointersDetails = await axios.get(
            `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_POINTER}/${virtualId}/${sessionId}?language=${lang}`
          );
          setPoints(getPointersDetails?.data?.result?.totalLanguagePoints || 0);
        }
      })();
    }
  }, [lang]);

  const { virtualId } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const handleRedirect = () => {
    const profileName = getLocalData("profileName");
    if (!username && !profileName && !virtualId && level === 0) {
      // alert("please add username in query param");
      setOpenMessageDialog({
        message: "please add username in query param",
        isError: true,
      });
      return;
    }
    if (level === 0) {
      navigate("/discover");
    } else {
      navigate("/practice");
    }
  };

  const images = {
    desktopLevel1,
    desktopLevel2,
    desktopLevel3,
    desktopLevel4,
    desktopLevel5,
    desktopLevel6,
    desktopLevel7,
    desktopLevel8,
    desktopLevel9,
  };

  const sectionStyle = {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${images?.[`desktopLevel${level || 1}`]})`,
    backgroundSize: "contain", // Cover the entire viewport
    backgroundRepeat: "round", // Center the image
    position: "relative",
  };

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      {openLangModal && (
        <LanguageModal {...{ lang, setLang, setOpenLangModal }} />
      )}
      {level > 0 ? (
        <Box style={sectionStyle}>
          <ProfileHeader
            {...{ level, lang, setOpenLangModal, points, setOpenMessageDialog }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 60,
              right: 0,
              width: "237px",
              height: "112px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px 0px 0px 20px",
              backdropFilter: "blur(3px)",
            }}
          >
            <Box
              sx={{
                width: "165px",
                height: "64px",
                background: levelConfig[level].color,
                borderRadius: "10px",
                margin: "24px 48px 24px 24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: `3px 3px 10px ${levelConfig[level].color}80`,
              }}
              onClick={handleRedirect}
            >
              <span
                style={{
                  color: "#F0EEEE",
                  fontWeight: 600,
                  fontSize: "20px",
                  fontFamily: "Quicksand",
                  lineHeight: "25px",
                  textShadow: "#000 1px 0 10px",
                }}
              >
                {`Start Level ${level}`}
              </span>
            </Box>
          </Box>
        </Box>
      ) : (
        <MainLayout
          showNext={false}
          showTimer={false}
          cardBackground={assessmentBackground}
          backgroundImage={practicebg}
          {...{
            setOpenLangModal,
            lang,
            points,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            mt={5}
          >
            <span
              style={{
                color: "#322020",
                fontWeight: 700,
                fontSize: "40px",
                fontFamily: "Quicksand",
                lineHeight: "62px",
              }}
            >
              {discoverStart
                ? "Lets test your language skills"
                : "You have good language skills"}
            </span>
            <Box>
              <span
                style={{
                  color: "#1CB0F6",
                  fontWeight: 600,
                  fontSize: "30px",
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                }}
              >
                {level > 0
                  ? `Take the assessment to complete Level ${level}.`
                  : "Take the assessment to discover your level"}
              </span>
            </Box>
            <Box sx={{ cursor: "pointer" }} mt={2} onClick={handleRedirect}>
              <StartAssessmentButton />
            </Box>
          </Box>
        </MainLayout>
      )}
    </>
  );
};

export default Assesment;
