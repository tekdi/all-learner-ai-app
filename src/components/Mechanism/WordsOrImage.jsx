import { Box, CardContent, Typography } from "@mui/material";
import { createRef, useState } from "react";
import v11 from "../../assets/audio/V10.mp3";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import { PlayAudioButton, StopAudioButton } from "../../utils/constants";
import MainLayout from "../Layouts.jsx/MainLayout";
import { CircularProgress } from "../../../node_modules/@mui/material/index";

const WordsOrImage = ({
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
}) => {
  const audioRef = createRef(null);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const [currrentProgress, setCurrrentProgress] = useState(0);
  const progressBarWidth = isNaN(currrentProgress / duration)
    ? 0
    : currrentProgress / duration;

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
      <CardContent
        sx={{
          overflow: "hidden",
          pt: "100px",
          opacity: disableScreen ? 0.25 : 1,
          pointerEvents: disableScreen ? "none" : "initial",
        }}
      >
        {type == "image" ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={image}
              alt="image"
              style={{
                maxWidth: "450px",
                maxHeight: "130px",
                marginBottom: "40px",
              }}
            />
          </Box>
        ) : type == "phonics" ? (
          <Box
            position="relative"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mb: "40px",
            }}
          >
            <Box
              position="relative"
              sx={{
                minWidth: "403px",
                borderRadius: "15px",
                background: "rgba(255, 161, 50, 0.1)",
                height: "88px",
                display: "flex",
              }}
            >
              <audio
                ref={audioRef}
                preload="metadata"
                onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                onCanPlay={(e) => {
                  setIsReady(true);
                }}
                onPlaying={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => {
                  setCurrrentProgress(e.currentTarget.currentTime);
                }}
              >
                <source type="audio/mp3" src={v11} />
              </audio>
              {/* <AudioPlayerSvg color="#FFA132" /> */}

              <Box
                sx={{
                  height: "88px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                    marginLeft: "20px",
                    marginTop: "5px",
                  }}
                  onClick={() => {
                    togglePlayPause();
                  }}
                >
                  {isReady && (
                    <>
                      {isPlaying ? (
                        <StopAudioButton color="#FFA132" />
                      ) : (
                        <PlayAudioButton color="#FFA132" />
                      )}
                    </>
                  )}
                </Box>
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    color: "#333F61",
                    fontSize: "44px",
                    lineHeight: "normal",
                    letterSpacing: "2.2px",
                    lineHeight: "normal",
                    fontWeight: 600,
                    fontFamily: "Quicksand",
                    marginLeft: "20px",
                  }}
                >
                  {"REF LECTION"}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            {!words && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
              </Box>
            )}
            {words && !matchedChar && (
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  mb: 4,
                  color: "#333F61",
                  textAlign: "center",
                  fontSize: "40px",
                  paddingX: "140px",
                  lineHeight: "normal",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                }}
              >
                {words || ""}
              </Typography>
            )}
            {matchedChar && (
              <Box
              display={"flex"}
              mb={4}
              sx={{
                width: "100%",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
                {highlightWords(words, matchedChar)}
              </Box>
            )}
         </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <VoiceAnalyser
            setVoiceText={setVoiceText}
            setRecordedAudio={setRecordedAudio}
            setVoiceAnimate={setVoiceAnimate}
            storyLine={storyLine}
            dontShowListen={type == "image" || isDiscover}
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
            }}
          />
        </Box>
      </CardContent>
    </MainLayout>
  );
};

export default WordsOrImage;
