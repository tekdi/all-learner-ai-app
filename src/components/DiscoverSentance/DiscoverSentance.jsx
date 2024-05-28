import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../node_modules/axios/index";
import elephant from "../../assets/images/elephant.svg";
import {
  callConfetti,
  getLocalData,
  setLocalData,
} from "../../utils/constants";
import WordsOrImage from "../Mechanism/WordsOrImage";
import { uniqueId } from "../../services/utilService";
import useSound from "use-sound";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import config from "../../utils/urlConstants.json";
import { MessageDialog } from "../Assesment/Assesment";

const SpeakSentenceComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [points, setPoints] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [enableNext, setEnableNext] = useState(false);
  const [sentencePassedCounter, setSentencePassedCounter] = useState(0);
  const [assesmentCount, setAssesmentcount] = useState(0);
  const [initialAssesment, setInitialAssesment] = useState(true);
  const [disableScreen, setDisableScreen] = useState(false);
  const [play] = useSound(LevelCompleteAudio);
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const [totalSyllableCount, setTotalSyllableCount] = useState('');
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);


  const callConfettiAndPlay = () => {
    play();
    callConfetti();
  };

  useEffect(() => {
    if (questions?.length) setAssesmentcount(assesmentCount + 1);
  }, [questions]);

  useEffect(() => {
    if (questions?.length && !initialAssesment && currentQuestion === 0) {
      setDisableScreen(true);
      callConfettiAndPlay();
      setTimeout(() => {
        // alert();
        setOpenMessageDialog({
          message:
            "You have successfully completed assessment " + assesmentCount,
        });
        // setDisableScreen(false);
      }, 1200);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (!(localStorage.getItem("contentSessionId") !== null)) {
      (async () => {
        const sessionId = getLocalData("sessionId");
        const virtualId = getLocalData("virtualId");
        const lang = getLocalData("lang");
        const getPointersDetails = await axios.get(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_POINTER}/${virtualId}/${sessionId}?language=${lang}`
        );
        setPoints(getPointersDetails?.data?.result?.totalLanguagePoints || 0);
      })();
    }
  }, []);

  useEffect(() => {
    if (questions?.length) {
      setLocalData("sub_session_id", uniqueId());
    }
  }, [questions]);

  useEffect(() => {
    if (voiceText === "error") {
      // alert("");
      setOpenMessageDialog({
        message: "Sorry I couldn't hear a voice. Could you please speak again?",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText == "success") {
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

  const handleNext = async () => {
    setIsNextButtonCalled(true)
    setEnableNext(false);

    try {
      const lang = getLocalData("lang");

      if (!(localStorage.getItem("contentSessionId") !== null)) {
        const pointsRes = await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_POINTER}`,
          {
            userId: localStorage.getItem("virtualId"),
            sessionId: localStorage.getItem("sessionId"),
            points: 1,
            language: lang,
            milestone: "m0",
          }
        );
        setPoints(pointsRes?.data?.result?.totalLanguagePoints || 0);
      } else {
        send(1);
        // setPoints(localStorage.getItem("currentLessonScoreCount"));
      }

      await axios.post(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
        {
          userId: localStorage.getItem("virtualId"),
          sessionId: localStorage.getItem("sessionId"),
          milestone: `discoveryList/discovery/${currentCollectionId}`,
          lesson: localStorage.getItem("storyTitle"),
          progress: ((currentQuestion + 1) * 100) / questions.length,
          language: lang,
          milestoneLevel: "m0",
        }
      );

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentQuestion === questions.length - 1) {
        const sub_session_id = getLocalData("sub_session_id");
        const getSetResultRes = await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
          {
            sub_session_id: sub_session_id,
            contentType: currentContentType,
            session_id: localStorage.getItem("sessionId"),
            user_id: localStorage.getItem("virtualId"),
            collectionId: currentCollectionId,
            totalSyllableCount: totalSyllableCount,
            language: localStorage.getItem("lang"),
          }
        );
        setInitialAssesment(false);
        const { data: getSetData } = getSetResultRes;
        await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.CREATE_LEARNER_PROGRESS}`,
          {
            userId: localStorage.getItem("virtualId"),
            sessionId: localStorage.getItem("sessionId"),
            subSessionId: sub_session_id,
            milestoneLevel: getSetData?.data?.currentLevel,
            language: localStorage.getItem("lang"),
          }
        );
        if (
          getSetData.data.sessionResult === "pass" &&
          currentContentType === "Sentence" &&
          sentencePassedCounter < 2
        ) {
          if (getSetData.data.currentLevel !== "m0") {
            navigate("/discover-end");
          }
          const newSentencePassedCounter = sentencePassedCounter + 1;
          const sentences = assessmentResponse?.data?.data?.filter(
            (elem) => elem.category === "Sentence"
          );
          const resSentencesPagination = await axios.get(
            `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_PAGINATION}?page=1&limit=5&collectionId=${sentences?.[newSentencePassedCounter]?.content?.[0]?.collectionId}`
          );
          setCurrentContentType("Sentence");
          setTotalSyllableCount(resSentencesPagination?.data?.totalSyllableCount);
          setCurrentCollectionId(
            sentences?.[newSentencePassedCounter]?.content?.[0]?.collectionId
          );
          let quesArr = [...(resSentencesPagination?.data?.data || [])];
          setCurrentQuestion(0);
          setSentencePassedCounter(newSentencePassedCounter);
          setQuestions(quesArr);
        } else if (getSetData.data.sessionResult === "pass") {
          navigate("/discover-end");
        } else if (
          getSetData.data.sessionResult === "fail" &&
          currentContentType === "Sentence"
        ) {
          if (getSetData.data.currentLevel !== "m0") {
            navigate("/discover-end");
          }
          const words = assessmentResponse?.data?.data?.find(
            (elem) => elem.category === "Word"
          );
          const resWordsPagination = await axios.get(
            `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_PAGINATION}?page=1&limit=5&collectionId=${words?.content?.[0]?.collectionId}`
          );
          setCurrentContentType("Word");
          setTotalSyllableCount(resWordsPagination?.data?.totalSyllableCount);
          setCurrentCollectionId(words?.content?.[0]?.collectionId);
          let quesArr = [...(resWordsPagination?.data?.data || [])];
          setCurrentQuestion(0);
          setQuestions(quesArr);
        } else if (
          getSetData.data.sessionResult === "fail" &&
          currentContentType === "Word"
        ) {
          navigate("/discover-end");

          // const char = assessmentResponse?.data?.data?.find(
          //   (elem) => elem.category === "Char"
          // );
          // const resCharPagination = await axios.get(
          //   `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/content-service/v1/content/pagination?page=1&limit=5&collectionId=${char?.content?.[0]?.collectionId}`
          // );
          // setCurrentContentType("Char");
          // setCurrentCollectionId(char?.content?.[0]?.collectionId);
          // setCurrentQuestion(0);
          // let quesArr = [...(resCharPagination?.data?.data || [])];
          // setQuestions(quesArr);
        } else {
          navigate("/discover-end");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      let quesArr = [];
      try {
        // const resSentence = await axios.get(`${process.env.REACT_APP_LEARNER_AI_APP_HOST}/scores/GetContent/sentence/${UserID}`);
        // quesArr = [...quesArr, ...(resSentence?.data?.content?.splice(0, 5) || [])];
        // const resWord = await axios.get(`${process.env.REACT_APP_LEARNER_AI_APP_HOST}/scores/GetContent/word/${UserID}`);
        // quesArr = [...quesArr, ...(resWord?.data?.content?.splice(0, 5) || [])];
        // const resPara = await axios.get(`${process.env.REACT_APP_LEARNER_AI_APP_HOST}/scores/GetContent/paragraph/${UserID}`);
        // quesArr = [...quesArr, ...(resPara?.data?.content || [])];
        const lang = getLocalData("lang");
        const resAssessment = await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_ASSESSMENT}`,
          {
            ...{ tags: ["ASER"], language: lang },
          }
        );

        const sentences = resAssessment?.data?.data?.find(
          (elem) => elem.category === "Sentence"
        );

        const resPagination = await axios.get(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_PAGINATION}?page=1&limit=5&collectionId=${sentences?.content?.[0]?.collectionId}`
        );
        setCurrentContentType("Sentence");
        setTotalSyllableCount(resPagination?.data?.totalSyllableCount)
        setCurrentCollectionId(sentences?.content?.[0]?.collectionId);
        setAssessmentResponse(resAssessment);
        localStorage.setItem("storyTitle", sentences?.name);
        quesArr = [...quesArr, ...(resPagination?.data?.data || [])];
        // quesArr[1].contentType = 'image';
        // quesArr[0].contentType = 'phonics';
        console.log("quesArr", quesArr);
        setQuestions(quesArr);
      } catch (error) {
        console.log("err", error);
      }
    })();
  }, []);
  const handleBack = () => {
    navigate("/");
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
      <WordsOrImage
        {...{
          background: "linear-gradient(45deg, #FF730E 30%, #FFB951 90%)",
          header:
            questions[currentQuestion]?.contentType === "image"
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
          image: elephant,
          enableNext,
          showTimer: false,
          points,
          steps: questions?.length,
          currentStep: currentQuestion + 1,
          isDiscover: true,
          callUpdateLearner: true,
          disableScreen,
          handleBack,
          setEnableNext,
          isNextButtonCalled,
          setIsNextButtonCalled,
          setOpenMessageDialog,
        }}
      />
    </>
  );
};

export default SpeakSentenceComponent;
