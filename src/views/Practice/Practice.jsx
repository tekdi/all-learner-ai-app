import React, { useEffect, useState } from "react";
import Mechanics1 from "../../components/Practice/Mechanics1";
import Mechanics2 from "../../components/Practice/Mechanics2";
import Mechanics3 from "../../components/Practice/Mechanics3";
import Mechanics4 from "../../components/Practice/Mechanics4";
import Mechanics5 from "../../components/Practice/Mechanics5";

import {
  useLocation,
  useNavigate,
} from "../../../node_modules/react-router-dom/dist/index";
import {
  callConfetti,
  getLocalData,
  levelGetContent,
  practiceSteps,
  setLocalData,
} from "../../utils/constants";
import axios from "../../../node_modules/axios/index";
import WordsOrImage from "../../components/Mechanism/WordsOrImage";
import { uniqueId } from "../../services/utilService";
import useSound from "use-sound";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import { splitGraphemes } from "split-graphemes";
import { Image } from "@mui/icons-material";
import { Typography } from "@mui/material";
import config from "../../utils/urlConstants.json";
import { MessageDialog } from "../../components/Assesment/Assesment";

const Practice = () => {
  const [page, setPage] = useState("");
  const [recordedAudio, setRecordedAudio] = useState("");
  const [Story, setStory] = useState([]);
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");

  const [points, setPoints] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [enableNext, setEnableNext] = useState(false);
  const [sentencePassedCounter, setSentencePassedCounter] = useState(0);
  const [progressData, setProgressData] = useState({});
  const [level, setLevel] = useState("");
  const [isShowCase, setIsShowCase] = useState(false);
  const [startShowCase, setStartShowCase] = useState(false);
  const limit = 5;
  const [disableScreen, setDisableScreen] = useState(false);
  const [mechanism, setMechanism] = useState("");
  const [play] = useSound(LevelCompleteAudio);
  const [livesData, setLivesData] = useState();
  const [gameOverData, setGameOverData] = useState();
  const [loading, setLoading] = useState();
  const LIVES = 5;
  const TARGETS_PERCENTAGE = 0.3;
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const { state } = useLocation();
  const lang = getLocalData("lang");
  const [totalSyllableCount, setTotalSyllableCount] = useState('');
  const [percentage, setPercentage] = useState('');
  const [fluency, setFluency] = useState('');

  const gameOver = (data, isUserPass) => {
    let userWon = isUserPass ? true : false;
    const meetsFluencyCriteria = livesData.meetsFluencyCriteria ? true : false;
    setGameOverData({ gameOver: true, userWon, ...data, meetsFluencyCriteria});

  };

  useEffect(() => {
    if (startShowCase) {
      setLivesData({ ...livesData, lives: LIVES });
    }
  }, [startShowCase]);
  const callConfettiAndPlay = () => {
    play();
    callConfetti();
  };

  useEffect(() => {
    let currentPracticeStep = progressData.currentPracticeStep;
    let fromBack = progressData.fromBack;
    if (
      questions?.length &&
      Number(currentPracticeStep + 1) > 0 &&
      currentQuestion == 0 &&
      !fromBack
      // !state?.refresh
    ) {
      setDisableScreen(true);
      callConfettiAndPlay();

      setTimeout(() => {
        // alert(
        //   `You have successfully completed ${practiceSteps[currentPracticeStep].fullName} `
        // );
        setOpenMessageDialog({
          message: `You have successfully completed ${practiceSteps[currentPracticeStep].fullName} `,
        });
        // setDisableScreen(false);
      }, 1200);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isShowCase) {
      setLocalData("sub_session_id", uniqueId());
    }
  }, [isShowCase]);

  useEffect(() => {
    if (voiceText === "error") {
      alert("Sorry I couldn't hear a voice. Could you please speak again?");
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText == "success") {
      setEnableNext(true);
      // go_to_result(voiceText);
      setVoiceText("");
    }
    //eslint-disable-next-line
  }, [voiceText]);

  const send = (score) => {
    if (window && window.parent) {
      window.parent.postMessage({
        score: score,
        message: "all-test-rig-score",
      });
    }
  };

  const checkFluency = (contentType, fluencyScore) => {
      switch (contentType.toLowerCase()) {
          case 'word':
            setFluency(fluencyScore < 2);
              break;
          case 'sentence':
            setFluency(fluencyScore < 6);
              break;
          case 'paragraph':
            setFluency(fluencyScore < 10);
              break;
          default:
            setFluency(true);
      }
  }
  const handleNext = async (isGameOver) => {
    setEnableNext(false);

    try {
      const lang = getLocalData("lang");
      if (localStorage.getItem("contentSessionId") !== null) {
        setPoints(1);
        if (isShowCase) {
          send(1);
        }
      } else {
        const pointsRes = await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_POINTER}`,
          {
            userId: localStorage.getItem("virtualId"),
            sessionId: localStorage.getItem("sessionId"),
            points: 1,
            language: lang,
            milestone: `m${level}`,
          }
        );
        setPoints(pointsRes?.data?.result?.totalLanguagePoints || 0);
      }

      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");

      let practiceProgress = getLocalData("practiceProgress");

      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      let currentPracticeStep = "";
      let currentPracticeProgress = "";

      if (practiceProgress?.[virtualId]) {
        currentPracticeStep = practiceProgress[virtualId].currentPracticeStep;
        currentPracticeProgress = Math.round(
          ((currentQuestion + 1 + currentPracticeStep * limit) /
            (practiceSteps.length * limit)) *
            100
        );
      }

      let showcasePercentage = ((currentQuestion + 1) * 100) / questions.length;

      await axios.post(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
        {
          userId: virtualId,
          sessionId: sessionId,
          milestone: isShowCase ? "showcase" : `practice`,
          lesson: currentPracticeStep,
          progress: isShowCase ? showcasePercentage : currentPracticeProgress,
          language: lang,
          milestoneLevel: `m${level}`,
        }
      );

      let newPracticeStep =
        currentQuestion == questions.length - 1 || isGameOver
          ? currentPracticeStep + 1
          : currentPracticeStep;
      let newQuestionIndex =
        currentQuestion == questions.length - 1 ? 0 : currentQuestion + 1;

      if (currentQuestion == questions.length - 1 || isGameOver) {
        // navigate or setNextPracticeLevel
        let currentPracticeStep =
          practiceProgress[virtualId].currentPracticeStep;
        let isShowCase = currentPracticeStep == 4 || currentPracticeStep == 9; // P4 or P8
        if (isShowCase || isGameOver) {
          // assesment

          const sub_session_id = getLocalData("sub_session_id");
          const getSetResultRes = await axios.post(
            `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
            {
              sub_session_id: sub_session_id,
              contentType: currentContentType,
              session_id: sessionId,
              user_id: virtualId,
              totalSyllableCount: totalSyllableCount,
              language: localStorage.getItem("lang"),
            }
          );
          const { data: getSetData } = getSetResultRes;
          setPercentage(getSetData?.data?.percentage);
          checkFluency(currentContentType, getSetData?.data?.fluency);
          await axios.post(
            `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.CREATE_LEARNER_PROGRESS}`,
            {
              userId: virtualId,
              sessionId: sessionId,
              subSessionId: sub_session_id,
              milestoneLevel: getSetData?.data?.currentLevel,
              totalSyllableCount: totalSyllableCount,
              language: localStorage.getItem("lang"),
            }
          );
          setLocalData("previous_level", getSetData.data.previous_level);
          if (getSetData.data.sessionResult == "pass") {
            await axios.post(
              `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
              {
                userId: virtualId,
                sessionId: sessionId,
                milestone: `practice`,
                lesson: "0",
                progress: 0,
                language: lang,
                milestoneLevel: getSetData.data.currentLevel,
              }
            );
            gameOver({ link: "/assesment-end" }, true);
            return;
          }

          // navigate("/assesment-end");
        }

        let quesArr = [];

        if (newPracticeStep == 10) {
          newPracticeStep = 0;
          currentPracticeProgress = 0;
        }

        const currentGetContent = levelGetContent?.[level]?.find(
          (elem) => elem.title == practiceSteps?.[newPracticeStep].name
        );

        await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
          {
            userId: virtualId,
            sessionId: sessionId,
            milestone: `practice`,
            lesson: newPracticeStep,
            progress: currentPracticeProgress,
            language: lang,
            milestoneLevel: `m${level}`,
          }
        );

        if (newPracticeStep == 0 || newPracticeStep == 5 || isGameOver) {
          gameOver();
          return;
          // navigate("/assesment-end");
        }
        const resGetContent = await axios.get(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`
        );

        setTotalSyllableCount(resGetContent?.data?.totalSyllableCount)
        setLivesData({
          ...livesData,
          totalTargets: resGetContent?.data?.totalSyllableCount,
          targetsForLives:
            resGetContent?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE,
          targetPerLive:
            (resGetContent?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
        });

        let showcaseLevel =
          currentPracticeStep == 3 || currentPracticeStep == 8;
        setIsShowCase(showcaseLevel);

        quesArr = [...quesArr, ...(resGetContent?.data?.content || [])];
        setCurrentContentType(resGetContent?.data?.content?.[0]?.contentType);
        setCurrentCollectionId(resGetContent?.data?.content?.[0]?.collectionId);
        setAssessmentResponse(resGetContent);
        setCurrentQuestion(0);
        practiceProgress[virtualId] = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress[virtualId]);
        localStorage.setItem("storyTitle", resGetContent?.name);

        setQuestions(quesArr);
        setTimeout(() => {
          setMechanism(currentGetContent.mechanism);
        }, 1000);
      } else if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        practiceProgress[virtualId] = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress[virtualId]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [temp_audio, set_temp_audio] = useState(null);
  const [audioPlayFlag, setAudioPlayFlag] = useState(true); // base64url of teachertext

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setAudioPlayFlag(!audioPlayFlag);
      temp_audio.addEventListener("ended", () => setAudioPlayFlag(true));
    }
  };

  const playAudio = () => {
    // const myAudio = localStorage.getItem("recordedAudio");
    set_temp_audio(new Audio(recordedAudio));
  };

  useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playTeacherAudio = () => {
    const contentId = questions[currentQuestion]?.contentId;
    var audio = new Audio(
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
    );
    audio.addEventListener("canplaythrough", () => {
      set_temp_audio(
        new Audio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
        )
      );
    });
  };

  const fetchDetails = async () => {
    let quesArr = [];
    try {
      setLoading(true);
      const lang = getLocalData("lang");
      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");

      if (!sessionId){
        sessionId = uniqueId();
        localStorage.setItem("sessionId", sessionId)
      }

      const getMilestoneDetails = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}/${virtualId}?language=${lang}`
      );
      setLocalData(
        "getMilestone",
        JSON.stringify({ ...getMilestoneDetails.data })
      );

      let level =
        Number(
          getMilestoneDetails?.data.data?.milestone_level?.replace("m", "")
        ) || 1;

      setLevel(level);

      const resLessons = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_LESSON_PROGRESS_BY_ID}/${virtualId}?language=${lang}`
      );
      const getPointersDetails = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_POINTER}/${virtualId}/${sessionId}?language=${lang}`
      );
      setPoints(getPointersDetails?.data?.result?.totalLanguagePoints || 0);

      let userState = Number.isInteger(
        Number(resLessons.data?.result?.result?.lesson)
      )
        ? Number(resLessons.data?.result?.result?.lesson)
        : 0;

      let practiceProgress = getLocalData("practiceProgress");
      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      practiceProgress[virtualId] = {
        currentQuestion: 0,
        currentPracticeProgress: (userState / practiceSteps.length) * 100,
        currentPracticeStep: userState || 0,
      };

      const currentGetContent = levelGetContent?.[level]?.find(
        (elem) => elem.title == practiceSteps?.[userState].name
      );

      const resWord = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`
      );
      setTotalSyllableCount(resWord?.data?.totalSyllableCount)
      setLivesData({
        ...livesData,
        totalTargets: resWord?.data?.totalSyllableCount,
        targetsForLives: resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE,
        targetPerLive:
          (resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
      });
      quesArr = [...quesArr, ...(resWord?.data?.content || [])];
      setCurrentContentType(currentGetContent.criteria);
      setCurrentCollectionId(resWord?.data?.content?.[0]?.collectionId);
      setAssessmentResponse(resWord);

      localStorage.setItem("storyTitle", resWord?.name);

      setQuestions(quesArr);
      setMechanism(currentGetContent.mechanism);

      let showcaseLevel = userState == 4 || userState == 9;
      setIsShowCase(showcaseLevel);

      if (showcaseLevel) {
        await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
          {
            userId: virtualId,
            sessionId: sessionId,
            milestone: "showcase",
            lesson: userState,
            progress: 0,
            language: lang,
            milestoneLevel: `m${level}`,
          }
        );
      }

      setCurrentQuestion(practiceProgress[virtualId]?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
      setProgressData(practiceProgress[virtualId]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("err", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // useEffect(() => {
  //   if (state?.refresh) {
  //     setGameOverData(undefined);
  //     fetchDetails();
  //   }
  // }, [state]);

  const handleBack = async () => {
    if (progressData.currentPracticeStep > 0) {
      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");
      const lang = getLocalData("lang");
      let practiceProgress = {};
      let newCurrentPracticeStep =
        progressData.currentPracticeStep == 5
          ? 3
          : progressData.currentPracticeStep - 1;
      practiceProgress[virtualId] = {
        currentQuestion: 0,
        currentPracticeProgress:
          (newCurrentPracticeStep / practiceSteps.length) * 100,
        currentPracticeStep: newCurrentPracticeStep,
        fromBack: true,
      };

      await axios.post(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
        {
          userId: virtualId,
          sessionId: sessionId,
          milestone: "practice",
          lesson: newCurrentPracticeStep,
          progress: (newCurrentPracticeStep / practiceSteps.length) * 100,
          language: lang,
          milestoneLevel: `m${level}`,
        }
      );

      setProgressData(practiceProgress[virtualId]);

      const currentGetContent = levelGetContent?.[level]?.find(
        (elem) => elem.title == practiceSteps?.[newCurrentPracticeStep].name
      );
      let quesArr = [];
      const resWord = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`
      );
      setTotalSyllableCount(resWord?.data?.totalSyllableCount)
      setLivesData({
        ...livesData,
        totalTargets: resWord?.data?.totalSyllableCount,
        targetsForLives: resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE,
        targetPerLive:
          (resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
      });
      quesArr = [...quesArr, ...(resWord?.data?.content || [])];
      setCurrentContentType(currentGetContent.criteria);
      setCurrentCollectionId(resWord?.data?.content?.[0]?.collectionId);
      setAssessmentResponse(resWord);

      localStorage.setItem("storyTitle", resWord?.name);
      setQuestions(quesArr);
      setTimeout(() => {
        setMechanism(currentGetContent.mechanism);
      }, 1000);
      setCurrentQuestion(practiceProgress[virtualId]?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (livesData?.scoreData) {
      if (livesData?.redLivesToShow <= 0) {
        handleNext(true);
      }
    }
  }, [livesData]);

  function highlightWords(sentence, matchedChar) {
    let isFirstImageDisplayed = false;
    const words = sentence.split(" ");
    matchedChar.sort(function (str1, str2) {
      return str2.length - str1.length;
    });

    let fontSize =
      questions[currentQuestion]?.contentType?.toLowerCase() == "paragraph"
        ? 30
        : 40;
    let type = currentContentType?.toLowerCase();
    if (type == "char" || type == "word") {
      const word = splitGraphemes(words[0].toLowerCase()).filter(
        (item) => item !== "‌" && item !== "" && item !== " "
      );
      let highlightedString = [];
      for (let i = 0; i < word.length; i++) {
        let matchFound = false;
        for (let j = 0; j < matchedChar.length; j++) {
          let length = splitGraphemes(matchedChar[j]).filter(
            (item) => item !== "‌" && item !== "" && item !== " "
          ).length;
          const substr = word.slice(i, i + length).join("");
          if (substr.includes(matchedChar[j])) {
            highlightedString.push(
              <React.Fragment key={i}>
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{                  
                    fontSize: `${fontSize}px`,
                    lineHeight: "normal",
                    fontWeight: 700,
                    fontFamily: "Quicksand",
                    lineHeight: "50px",
                    background: "#FFF0BD",
                  }}
                >
                  {substr}
                </Typography>
              </React.Fragment>
            );
            i += length - 1;
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          highlightedString.push(
            <React.Fragment key={i}>
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  color: "#333F61",
                  fontSize: `${fontSize}px`,
                  lineHeight: "normal",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                }}
              >
                {word[i]}
              </Typography>
            </React.Fragment>
          );
        }
      }
      return highlightedString;
    } else {
      const highlightedSentence = words.map((word, index) => {
        const isMatched = matchedChar.some((char) =>
          word.toLowerCase().includes(char)
        );
        if (isMatched) {
          return (
            <React.Fragment key={index}>
              <Typography
                variant="h5"
                component="h4"
                ml={1}
                sx={{
                  fontSize: `${fontSize}px`,
                  lineHeight: "normal",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                  background: "#FFF0BD",
                }}
              >
                {word}
              </Typography>{" "}
            </React.Fragment>
          );
        } else {
          return (
            <Typography
              variant="h5"
              component="h4"
              ml={1}
              sx={{
                color: "#333F61",
                fontSize: `${fontSize}px`,
                lineHeight: "normal",
                fontWeight: 700,
                fontFamily: "Quicksand",
                lineHeight: "50px",
              }}
              key={index}
            >
              {word + " "}
            </Typography>
          );
        }
      });
      return highlightedSentence;
    }
  }
  useEffect(() => {
    if (questions[currentQuestion]?.contentSourceData) {
      if (window !== window.parent) {
        const contentSourceData = questions[currentQuestion]?.contentSourceData || [];
        const stringLengths = contentSourceData.map(item => item.text.length);
        const length = stringLengths[0];
        window.parent.postMessage({ type: 'stringLengths', length }, '*');
      }
    }
  }, [questions[currentQuestion]]);

  const renderMechanics = () => {
    if (!mechanism) {
      return (
        <WordsOrImage
          {...{
            level: !isShowCase && level,
            header:
              questions[currentQuestion]?.contentType == "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            words: questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: questions[currentQuestion]?.contentType,
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            startShowCase,
            setStartShowCase,
            handleBack: !isShowCase && handleBack,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            loading,
            percentage,
            fluency,
            setOpenMessageDialog,
          }}
        />
      );
    } else if (mechanism == "fillInTheBlank" || mechanism == "audio") {
      return (
        <Mechanics3
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              questions[currentQuestion]?.contentType == "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
          }}
        />
      );
    } else if (mechanism == "formAWord") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              questions[currentQuestion]?.contentType == "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
          }}
        />
      );
    } else if (mechanism == "readTheImage") {
      return (
        <Mechanics5
          page={page}
          setPage={setPage}
          {...{ setVoiceText, setRecordedAudio, setVoiceAnimate, storyLine }}
        />
      );
    } else if (mechanism == "FormASentence") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{ setVoiceText, setRecordedAudio, setVoiceAnimate, storyLine }}
        />
      );
    } else if (page == 1) {
      return <Mechanics2 page={page} setPage={setPage} />;
    }
  };

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
            setDisableScreen(false);
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      {renderMechanics()}
    </>
  );
};

export default Practice;
