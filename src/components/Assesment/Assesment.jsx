import MainLayout from "../Layouts.jsx/MainLayout";
import assessmentBackground from "../../assets/images/assessmentBackground.png";
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "../../../node_modules/@mui/material/index";
import LogoutImg from "../../assets/images/logout.svg";
import { styled } from "@mui/material/styles";
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
import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";
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
import ProgressOverlay from "../CommonComponent/ProgressOverlay";
import { end } from "../../services/telementryService";

export const LanguageModal = ({
  lang,
  setLang,
  setOpenLangModal,
  setLoading,
  setDownloadProgress
}) => {
  const [selectedLang, setSelectedLang] = useState(lang);
  const [isOfflineModel, setIsOfflineModel] = useState(
    localStorage.getItem("isOfflineModel") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isOfflineModel", isOfflineModel);
  }, [isOfflineModel]);

  const dbName = "language-ai-models";
  const dbVersion = 1;
  let db;

  // Open IndexedDB
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, dbVersion);
      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.errorCode);
        reject(event.target.error);
      };
      request.onsuccess = (event) => {
        db = event.target.result;
        console.log("IndexedDB opened successfully");
        resolve();
      };
      request.onupgradeneeded = (event) => {
        db = event.target.result;
        console.log("Creating object store for models");
        if (!db.objectStoreNames.contains("models")) {
          db.createObjectStore("models");
        }
      };
    });
  };

  // Function to store model in IndexedDB
  const storeModel = async (modelName, modelURL) => {
    try {
      const response = await fetch(modelURL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');
      let receivedLength = 0;
      const chunks = [];
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
  
        // Update progress
        const percentage = ((receivedLength / contentLength) * 100);
        setDownloadProgress(percentage.toFixed());
      }
  
      const modelData = new Uint8Array(receivedLength);
      let position = 0;
      for (let chunk of chunks) {
        modelData.set(chunk, position);
        position += chunk.length;
      }
  
      const transaction = db.transaction(["models"], "readwrite");
      const store = transaction.objectStore("models");
  
      store.put(modelData, modelName);
      console.log(`Stored model ${modelName} in IndexedDB`);
    } catch (error) {
      console.error("Error storing model in IndexedDB:", error);
    }
  };

  // Function to check if the model is already stored in IndexedDB
  const isModelStored = (modelName) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["models"], "readonly");
      const store = transaction.objectStore("models");
      const request = store.get(modelName);

      request.onerror = function (event) {
        console.error(
          "Error checking model in IndexedDB:",
          event.target.errorCode
        );
        reject(event.target.error);
      };

      request.onsuccess = function (event) {
        resolve(!!event.target.result);
      };
    });
  };

  // Function to load model
  const loadModel = async () => {
    setLoading(true);
    try {
      await openDB();
      const modelName = "en-model";
      const modelURL = "./models/ggml-model-whisper-base.en-q5_1.bin";

      const stored = await isModelStored(modelName);
      if (!stored) {
        await storeModel(modelName, modelURL);
      } else {
        console.log(`Model ${modelName} is already stored in IndexedDB`);
        return;
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

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
            {languages?.map((elem, index) => {
              const isSelectedLang =
                isOfflineModel === elem.offline && elem.lang === selectedLang;
              return (
                <Grid xs={5} item key={index}>
                  <Box
                    onClick={() => {
                      setSelectedLang(elem.lang);
                      setIsOfflineModel(elem.offline);
                    }}
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
          mt={5}
          mb={1}
          // mr="110px"
        >
          <Box
            onClick={() => {
              setLang(selectedLang);
              setOpenLangModal(false);
              if (isOfflineModel) {
                loadModel();
              }
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
  loading,
  handleBack,
}) => {
  const language = lang || getLocalData("lang");
  const username = profileName || getLocalData("profileName");
  const navigate = useNavigate();
  const [openMessageDialog, setOpenMessageDialog] = useState("");

  const handleProfileBack = () => {
    try {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        window.parent.postMessage({ type: "restore-iframe-content" }, "*");
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const isOfflineModel = localStorage.getItem("isOfflineModel") === "true";

  const selectedLanguage = languages?.find(
    (elem) => elem.lang === language && elem.offline === isOfflineModel
  );

  const displayLanguage = selectedLanguage?.name || "Select Language";

  const handleLogout = () => {
    localStorage.clear();
    end({});
    navigate("/Login");
  };

  const CustomIconButton = styled(IconButton)({
    padding: "6px 20px",
    color: "white",
    fontSize: "20px",
    fontWeight: 500,
    borderRadius: "8px",
    marginRight: "10px",
    fontFamily: '"Lato", "sans-serif"',
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& .logout-img": {
      display: "block",
      filter: "invert(1)",
    },
  });

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .MuiTooltip-tooltip`]: {
      fontSize: "1.2rem", // Adjust the font size as needed
    },
  });

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
          height: { xs: "60px", sm: "70px" },
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(3px)",
          display: "flex",
          alignItems: "center",
          zIndex: 5555,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", sm: "50%" },
          }}
        >
          {handleBack && (
            <Box ml={{ xs: "10px", sm: "94px" }}>
              <IconButton onClick={handleBack}>
                <img src={back} alt="back" style={{ height: "30px" }} />
              </IconButton>
            </Box>
          )}
          {username && (
            <>
              <Box
                ml={
                  handleBack
                    ? { xs: "10px", sm: "12px" }
                    : { xs: "10px", sm: "94px" }
                }
                sx={{ cursor: "pointer" }}
                onClick={handleProfileBack}
              >
                <img
                  src={profilePic}
                  alt="profile-pic"
                  style={{ height: "30px" }}
                />
              </Box>
              <Box ml="12px">
                <span
                  style={{
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: { xs: "14px", sm: "16px" },
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
            width: { xs: "100%", sm: "50%" },
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
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
            mr={{ xs: "10px", sm: "90px" }}
            onClick={() =>
              setOpenLangModal
                ? setOpenLangModal(!loading)
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
                    fontSize: { xs: "14px", sm: "16px" },
                    fontFamily: "Quicksand",
                    lineHeight: "25px",
                  }}
                >
                  {displayLanguage}
                </span>
              </Box>
            </Box>
          </Box>
          {process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true" && (
            <CustomTooltip title="Logout">
              <Box>
                <CustomIconButton onClick={handleLogout}>
                  <img
                    className="logout-img"
                    style={{ height: 30, width: 35 }}
                    src={LogoutImg}
                    alt="Logout"
                  />
                </CustomIconButton>
              </Box>
            </CustomTooltip>
          )}
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
  const [loading, setLoading] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  // let lang = searchParams.get("lang") || "ta";
  const [level, setLevel] = useState("");
  const dispatch = useDispatch();
  const [openLangModal, setOpenLangModal] = useState(false);
  const [lang, setLang] = useState(getLocalData("lang") || "en");
  const [points, setPoints] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);

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
          `${process.env.REACT_APP_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}`
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

        if (!session_id) {
          session_id = uniqueId();
          localStorage.setItem("sessionId", session_id);
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
        let sessionId = getLocalData("sessionId");

        if (!sessionId || sessionId === "null") {
          sessionId = uniqueId();
          localStorage.setItem("sessionId", sessionId);
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

  const dbName = "language-ai-models";
  const dbVersion = 1;
  let db;

  // Function to check if the model is already stored in IndexedDB
  const isModelStored = async (modelName) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["models"], "readonly");
      const store = transaction.objectStore("models");
      const request = store.get(modelName);

      request.onerror = function (event) {
        console.error(
          "Error checking model in IndexedDB:",
          event.target.errorCode
        );
        reject(event.target.error);
      };

      request.onsuccess = function (event) {
        resolve(!!event.target.result);
      };
    });
  };

    // Function to load model in whisper cpp module
    const loadModelWhisper = async (modelName) => {
      try {
        window.whisperModule.FS_unlink("whisper.bin");
        await window.whisperModule.free(1)
      } catch (e) {
        console.log(e)
      }
      try {
        let transaction;
        let store;
        let request;
        try {
          transaction = await db.transaction(["models"], "readonly");
          store = transaction.objectStore("models");
          request = await store.get(modelName);
        } catch (error) {
          console.error("Error accessing IndexedDB:", error);
          return;
        }
  
        request.onsuccess = async () => {
          const modelData = request.result;
          let storeResponse = await window.whisperModule.FS_createDataFile(
            "/",
            "whisper.bin",
            modelData,
            true,
            true
          );
          setTimeout(console.log(window.whisperModule.init("whisper.bin")), 5000);
        };
  
        request.onerror = (err) => {
          console.error(`Error to get model data: ${err}`);
        };
  
        console.log(`Stored model in whisper cpp memory`);
      } catch (error) {
        console.error("Error storing model in IndexedDB:", error);
      }
    };

    // Function to store model in IndexedDB
    const storeModel = async (modelName, modelURL) => {
      try {
        const response = await fetch(modelURL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length');
        let receivedLength = 0;
        const chunks = [];
    
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
    
          // Update progress
          const percentage = ((receivedLength / contentLength) * 100);
          setDownloadProgress(percentage.toFixed());
        }
    
        const modelData = new Uint8Array(receivedLength);
        let position = 0;
        for (let chunk of chunks) {
          modelData.set(chunk, position);
          position += chunk.length;
        }
    
        const transaction = db.transaction(["models"], "readwrite");
        const store = transaction.objectStore("models");
    
        store.put(modelData, modelName);
        console.log(`Stored model ${modelName} in IndexedDB`);
      } catch (error) {
        console.error("Error storing model in IndexedDB:", error);
      }
    };

      // Function to load model
  const loadModel = async () => {
    setLoading(true);
    try {
      await openDB();
      const modelName = "en-model";
      const modelURL = "./models/ggml-model-whisper-base.en-q5_1.bin";

      const stored = await isModelStored(modelName);
      if (!stored) {
        await storeModel(modelName, modelURL);
      } else {
        console.log(`Model ${modelName} is already stored in IndexedDB`);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

    // Open IndexedDB

    const openDB = () => {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(dbName, dbVersion);
        request.onerror = (event) => {
          console.error("IndexedDB error:", event.target.errorCode);
          reject(event.target.error);
        };
        request.onsuccess = (event) => {
          db = event.target.result;
          console.log("IndexedDB opened successfully");
          resolve();
        };
        request.onupgradeneeded = (event) => {
          db = event.target.result;
          console.log("Creating object store for models");
          if (!db.objectStoreNames.contains("models")) {
            db.createObjectStore("models");
          }
        };
      });
    };

  const handleRedirect = async () => {
    if(localStorage.getItem('isOfflineModel') === 'true'){
    const modelName = "en-model";
    await openDB();
    const stored = await isModelStored(modelName);
    if (stored) {
      console.log(`Model ${modelName} is already stored in IndexedDB`);
    }
    else{
      alert(`you have to download en-offline model`)
      await loadModel();
      return;
    }
    await loadModelWhisper(modelName);
  }
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
    backgroundRepeat: "round",
    backgroundSize: "auto",
    position: "relative",
  };

  return (
    <>
      {loading && <ProgressOverlay size="4rem" color={"#ffffff"} showLinearProgress={true} downloadProgress={downloadProgress} />}
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
        <LanguageModal {...{ lang, setLang, setOpenLangModal, setLoading, setDownloadProgress }} />
      )}
      {level > 0 ? (
        <Box style={sectionStyle}>
          <ProfileHeader
            {...{
              level,
              lang,
              setOpenLangModal,
              points,
              loading,
              setOpenMessageDialog,
            }}
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
              right: { xs: 20, md: 200 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: { xs: 2, md: 5 },
            }}
          >
            <Typography
              sx={{
                color: "#322020",
                fontWeight: 700,
                fontSize: { xs: "24px", md: "40px" },
                fontFamily: "Quicksand",
                lineHeight: { xs: "36px", md: "62px" },
                textAlign: "center",
              }}
            >
              {discoverStart
                ? "Let's test your language skills"
                : "You have good language skills"}
            </Typography>
            <Box>
              <Typography
                sx={{
                  color: "#1CB0F6",
                  fontWeight: 600,
                  fontSize: { xs: "20px", md: "30px" },
                  fontFamily: "Quicksand",
                  lineHeight: { xs: "30px", md: "50px" },
                  textAlign: "center",
                }}
              >
                {level > 0
                  ? `Take the assessment to complete Level ${level}.`
                  : "Take the assessment to discover your level"}
              </Typography>
            </Box>
            <Box
              sx={{
                cursor: "pointer",
                mt: { xs: 1, md: 2 },
              }}
              onClick={handleRedirect}
            >
              <StartAssessmentButton />
            </Box>
          </Box>
        </MainLayout>
      )}
    </>
  );
};

export default Assesment;
