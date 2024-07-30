import { Box, Typography } from "@mui/material";
import HomophonesFinder from "homophones";
import React, { createRef, useEffect, useState } from "react";
import {
  AudioBarColoredSvg,
  AudioBarSvg,
  AudioPlayerSvg,
  PlayAudioButton,
  StopAudioButton,
  SubmitButton,
  getLocalData,
  randomizeArray,
} from "../../utils/constants";
import MainLayout from "../Layouts.jsx/MainLayout";
import correctSound from "../../assets/audio/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import VoiceAnalyser from "../../utils/VoiceAnalyser";

const Mechanics2 = ({
  page,
  setPage,
  type,
  handleNext,
  background,
  header,
  parentWords,
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
  allWords,
  setEnableNext,
  loading,
  setOpenMessageDialog,
}) => {
  const [words, setWords] = useState([]);
  const [sentences, setSentences] = useState([]);

  const [selectedWord, setSelectedWord] = useState("");
  // const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [wordToFill, setWordToFill] = useState("");
  const [disabledWords, setDisabledWords] = useState(false);
  const lang = getLocalData("lang");
  let wordToCheck = type == "audio" ? parentWords : wordToFill;

  useEffect(() => {
    const initializeFillInTheBlank = async () => {
      if (type === "fillInTheBlank" && parentWords?.length) {
        let wordsArr = parentWords.split(" ");
        let randomIndex = Math.floor(Math.random() * wordsArr.length);
        try {
          await getSimilarWords(wordsArr[randomIndex]);
          setWordToFill(wordsArr[randomIndex]);
          wordsArr[randomIndex] = "dash";
          setSentences(wordsArr);
          setSelectedWord("");
        } catch (error) {
          console.error("Error in initializeFillInTheBlank:", error);
        }
      }
    };
    initializeFillInTheBlank();
  }, [contentId, parentWords]);

  useEffect(() => {
    const initializeAudio = async () => {
      if (type === "audio" && parentWords) {
        setDisabledWords(true);
        setSelectedWord("");
        try {
          await getSimilarWords(parentWords);
        } catch (error) {
          console.error("Error in initializeAudio:", error);
        }
      }
    };
    initializeAudio();
  }, [contentId, parentWords]);

  const getSimilarWords = async (wordForFindingHomophones) => {
    const lang = getLocalData("lang");
    // const isFillInTheBlanks = type == "fillInTheBlank";
    const wordToSimilar = wordForFindingHomophones
      ? wordForFindingHomophones
      : parentWords;

    if (lang == "en") {
      const finder = new HomophonesFinder();
      const homophones = await finder.find(wordToSimilar);
      let wordsArr = [homophones[8], wordToSimilar, homophones[6]];
      setWords(randomizeArray(wordsArr));
    } else {
      let wordsToShow = [];
      if (type == "audio") {
        wordsToShow = allWords?.filter((elem) => elem != wordToSimilar);
      }
      if (type == "fillInTheBlank") {
        wordsToShow = allWords
          ?.join(" ")
          ?.split(" ")
          .filter((elem) => elem != wordToSimilar && elem.length > 2);
      }

      wordsToShow = randomizeArray(wordsToShow).slice(0, 2);
      wordsToShow.push(wordToSimilar);
      setWords(randomizeArray(wordsToShow));
    }
  };

  const handleWord = (word, removeWord) => {
    if (removeWord) {
      setWords([...words, word]);
      setSelectedWord("");
    } else {
      let wordsArr = [...words];

      if (type !== "audio") {
        let index = wordsArr?.findIndex((elem) => elem == word);
        wordsArr?.splice(index, 1);
      }

      if (selectedWord && type !== "audio") {
        wordsArr.push(selectedWord);
      }

      // if (type == "audio") {

      var audio = new Audio(word == wordToCheck ? correctSound : wrongSound);
      audio.play();
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 800);
      // }

      setWords(wordsArr);
      setSelectedWord(word);
    }
  };

  const audioRef = createRef(null);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = React.useState(false);

  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const [currrentProgress, setCurrrentProgress] = React.useState(0);
  const progressBarWidth = isNaN(currrentProgress / duration)
    ? 0
    : currrentProgress / duration;

  const handleSubmit = () => {};
  const getEnableButton = () => {
    if (type == "fillInTheBlank") {
      return enableNext;
    }
    if (type == "audio") {
      return selectedWord == wordToCheck;
    }
  };
  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={getEnableButton()}
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
        disableScreen,
        loading,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "60px",
          letterSpacing: "5px",
          height: "100%",
        }}
      >
        {type == "audio" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {/* <ReactAudioPlayer src={v11} controls /> */}

            {contentId && (
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
                <source
                  type="audio/mp3"
                  src={
                    contentId
                      ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
                      : ""
                  }
                />
              </audio>
            )}

            <Box position="relative" sx={{ width: "403px" }}>
              <AudioPlayerSvg />
              <Box
                position="absolute"
                sx={{ cursor: "pointer", top: "13px", left: "96px" }}
              >
                <AudioBarSvg />
              </Box>
              <Box
                position="absolute"
                sx={{ cursor: "pointer", top: "13px", left: "96px" }}
              >
                <AudioBarColoredSvg width={progressBarWidth * 275} />
              </Box>
              <Box
                position="absolute"
                sx={{ cursor: "pointer", top: "15px", left: "25px" }}
                onClick={() => {
                  togglePlayPause();
                  setDisabledWords(false);
                }}
              >
                {isReady && (
                  <>{isPlaying ? <StopAudioButton /> : <PlayAudioButton />}</>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <>
            {sentences?.map((elem, index) => (
              <>
                {elem == "dash" ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginLeft: index > 0 && "10px",
                      minWidth: "120px",
                      height: "80px",
                      borderBottom: "3px solid #5F6C92",
                      position: "relative",
                    }}
                  >
                    {selectedWord && (
                      <Box
                        onClick={() => handleWord(selectedWord, true)}
                        className={
                          elem == "dash"
                            ? selectedWord == wordToCheck
                              ? `audioSelectedWord`
                              : `audioSelectedWrongWord ${
                                  shake ? "shakeImage" : ""
                                }`
                            : ""
                        }
                        sx={{
                          textAlign: "center",
                          px: "25px",
                          py: "12px",
                          background: "transparent",
                          m: 1,
                          textTransform: "none",
                          borderRadius: "12px",
                          border: `1px solid ${
                            elem == "dash"
                              ? selectedWord == wordToCheck
                                ? "#58CC02"
                                : "#C30303"
                              : "#333F61"
                          }`,
                          background: "#FFF",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            color:
                              elem == "dash"
                                ? selectedWord == wordToCheck
                                  ? "#58CC02"
                                  : "#C30303"
                                : "#333F61",
                            fontWeight: 600,
                            fontSize: "32px",
                            fontFamily: "Quicksand",
                          }}
                        >
                          {selectedWord}
                        </span>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginLeft: index > 0 && "10px",
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{
                        mb: 4,
                        mt: 4,
                        fontSize: "40px",
                        color: "#303050",
                        textAlign: "center",
                        fontFamily: "Quicksand",
                      }}
                    >
                      {elem}
                    </Typography>
                  </Box>
                )}
              </>
            ))}
          </>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        {words?.map((elem) => (
          <Box
            className={`${
              type == "audio" && selectedWord == elem
                ? selectedWord == parentWords
                  ? `audioSelectedWord`
                  : `audioSelectedWrongWord ${shake ? "shakeImage" : ""}`
                : ""
            }`}
            onClick={() => handleWord(elem)}
            sx={{
              textAlign: "center",
              px: "25px",
              py: "12px",
              background: "transparent",
              m: 1,
              textTransform: "none",
              borderRadius: "12px",
              border: `1px solid rgba(51, 63, 97, 0.10)`,
              background: "#FFF",
              cursor: "pointer",
              opacity: disabledWords ? 0.25 : 1,
              pointerEvents: disabledWords ? "none" : "initial",
            }}
          >
            <span
              style={{
                color:
                  type == "audio" && selectedWord == elem
                    ? selectedWord == parentWords
                      ? "#58CC02"
                      : "#C30303"
                    : "#333F61",
                fontWeight: 600,
                fontSize: "32px",
                fontFamily: "Quicksand",
              }}
            >
              {elem}
            </span>
          </Box>
        ))}
      </Box>
      {selectedWord == wordToCheck && type == "fillInTheBlank" && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <VoiceAnalyser
            setVoiceText={setVoiceText}
            setRecordedAudio={setRecordedAudio}
            setVoiceAnimate={setVoiceAnimate}
            storyLine={storyLine}
            // updateStory={updateStory}
            originalText={parentWords}
            {...{
              contentId,
              contentType,
              currentLine: currentStep - 1,
              playTeacherAudio,
              callUpdateLearner,
              isShowCase,
              setEnableNext,
              setOpenMessageDialog,
            }}
          />
        </Box>
      )}
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "22px",
          cursor: selectedWord ? "pointer" : "not-allowed",
        }}
        onClick={handleNext}
      >
        <SubmitButton opacity={selectedWord ? 1 : 0.3} />
      </Box> */}
    </MainLayout>
  );
};

export default Mechanics2;
