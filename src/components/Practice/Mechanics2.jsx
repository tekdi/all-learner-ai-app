import React from 'react';
import { Box, Card, CardContent,  Typography } from '@mui/material';
import Confetti from "react-confetti";
import elephant from '../../assets/images/elephant.svg';
import { useState } from "react";
import VoiceAnalyser from '../../utils/VoiceAnalyser';
import MainLayout from '../Layouts.jsx/MainLayout';
import discoverEndRight from '../../assets/images/discover-end-right.svg'

const Mechanics2 = ({
  page,
  setPage,
  handleNext,
  background,
  header,
  type,
  words,
  image,
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  enableNext,
  showTimer,
  points,
  steps,
  currentStep,
  contentId,
  contentType,
  level,
  isDiscover,
  progressData,
  showProgress,
  playTeacherAudio = () => {},
  callUpdateLearner,
  disableScreen,
  isShowCase,
  handleBack,
  setEnableNext,
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  gameOverData,
  highlightWords,
  matchedChar,
  loading,
  setOpenMessageDialog,
}) => {

  const [shake, setShake] = useState(false);

  const fetchImage = () => {
   return contentId? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-image-files/${contentId}.png`:elephant
  }
  let width = window.innerWidth * 0.85;
  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        playTeacherAudio,
        handleBack,
        isShowCase,
        startShowCase,
        setStartShowCase,
        disableScreen,
        livesData,
        gameOverData,
        loading,
      }}
    >
      <Box sx={{display:"flex" , justifyContent:'center'}}>

        {!enableNext && (
          <Card
            sx={{
              width: "70vw",
              height: "70vh",
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {words && (
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    // color: "#61dafb",
                    textAlign: "center",
                    fontSize: "clamp(45px, 6vw, 100px)",
                    paddingX: "140px",
                    fontWeight: 700,
                    fontFamily: "Quicksand",
                    lineHeight: "50px",
                    marginTop: "40px",
                  }}
                >
                  {words && words.length > 0 ? (
                    <>
                      <span style={{ backgroundColor: "yellow" }}>
                        {words[0]}
                      </span>{" "}
                      -{" "}
                      <span style={{ backgroundColor: "yellow" }}>
                        {words[0]}
                      </span>
                      {words.slice(1)}
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              )}
            </Box>
            <CardContent>
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  mb: 2,
                  fontSize: "20px",
                  color: "#333F61",
                  textAlign: "center",
                }}
              >
                Guess the below image
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <img
                  style={{ width: "20%" }}
                  src={fetchImage()}
                  alt="content"
                  loading="lazy"
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <VoiceAnalyser
                  setVoiceText={setVoiceText}
                  setRecordedAudio={setRecordedAudio}
                  setVoiceAnimate={setVoiceAnimate}
                  storyLine={storyLine}
                  dontShowListen={type === "image" || isDiscover}
                  mechanism={'flashcard'}
                  // updateStory={updateStory}
                  originalText={words}
                  {...{
                    contentId,
                    contentType,
                    currentLine: currentStep - 1,
                    playTeacherAudio,
                    callUpdateLearner,
                    isShowCase,
                    setEnableNext,
                    livesData,
                    setLivesData,
                    setOpenMessageDialog,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        )}
        {enableNext && (
          <Card
            sx={{
              width: "70vw",
              height: "70vh",
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {enableNext && <Confetti width={width} height={"600px"} />}
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "33%",
                  }}
                >
                  <img
                    style={{ width: "100%" }}
                    src={fetchImage()}
                    alt="content"
                    loading="lazy"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "33%",
                  }}
                >
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      textAlign: "center",
                      fontSize: "50px",
                      fontWeight: 700,
                      fontFamily: "Quicksand",
                      marginTop: "40px",
                      marginBottom: "20px",
                      color: "#6CC227",
                    }}
                  >
                    Good Job.!
                  </Typography>
                  <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                      textAlign: "center",
                      fontSize: "30px",
                      fontWeight: 600,
                      fontFamily: "Quicksand",
                      lineHeight: "40px",
                      marginBottom: "20px",
                    }}
                  >
                    You have good Pronunciation Skills.
                  </Typography>
                  {words && (
                    <Typography
                      variant="h3"
                      component="h3"
                      sx={{
                        textAlign: "center",
                        fontSize: "40px",
                        fontWeight: 700,
                        fontFamily: "Quicksand",
                        lineHeight: "40px",
                        marginBottom: "20px",
                      }}
                    >
                      {words}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "33%",
                  }}
                >
                  <img
                    src={discoverEndRight}
                    alt="timer"
                    className={shake && "shakeImage"}
                    loading="lazy"
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <VoiceAnalyser
                  setVoiceText={setVoiceText}
                  setRecordedAudio={setRecordedAudio}
                  setVoiceAnimate={setVoiceAnimate}
                  storyLine={storyLine}
                  dontShowListen={type === "image" || isDiscover}
                  shake={shake || false}
                  originalText={words}
                  mechanism={'flashcard'}
                  {...{
                    contentId,
                    contentType,
                    currentLine: currentStep - 1,
                    playTeacherAudio,
                    callUpdateLearner,
                    isShowCase,
                    setEnableNext,
                    livesData,
                    setLivesData,
                    setOpenMessageDialog,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </MainLayout>
  );
};

export default Mechanics2;
