import { useEffect, useState } from "react";
import { Box, CircularProgress } from "../../node_modules/@mui/material/index";
import axios from "../../node_modules/axios/index";
import calcCER from "../../node_modules/character-error-rate/index";
import s1 from "../assets/audio/S1.m4a";
import s2 from "../assets/audio/S2.m4a";
import s3 from "../assets/audio/S3.m4a";
import s4 from "../assets/audio/S4.m4a";
import s5 from "../assets/audio/S5.m4a";
import s6 from "../assets/audio/S6.m4a";
import v1 from "../assets/audio/V1.m4a";
import v10 from "../assets/audio/V10.mp3";
import v2 from "../assets/audio/V2.m4a";
import v3 from "../assets/audio/V3.m4a";
import v4 from "../assets/audio/V4.m4a";
import v5 from "../assets/audio/V5.m4a";
import v6 from "../assets/audio/V6.m4a";
import v7 from "../assets/audio/V7.m4a";
import v8 from "../assets/audio/V8.m4a";
import livesAdd from "../assets/audio/livesAdd.wav";
import livesCut from "../assets/audio/livesCut.wav";

import { response } from "../services/telementryService";
import AudioCompare from "./AudioCompare";
import {
  SpeakButton,
  compareArrays,
  getLocalData,
  replaceAll,
} from "./constants";
import config from "./urlConstants.json";
import { filterBadWords } from "./Badwords";
// import S3Client from '../config/awsS3';
/* eslint-disable */

const AudioPath = {
  1: {
    0: v1,
    1: v2,
    2: v3,
    3: v4,
    4: v5,
    5: v6,
    6: v7,
    7: v8,
    10: v10,
  },
  2: {
    0: s1,
    1: s2,
    2: s3,
    3: s4,
    4: s5,
    5: s6,
  },
};
const currentIndex = localStorage.getItem("index") || 1;
function VoiceAnalyser(props) {
  const [loadCnt, setLoadCnt] = useState(0);
  const [loader, setLoader] = useState(false);
  const [pauseAudio, setPauseAudio] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState("");
  const [recordedAudioBase64, setRecordedAudioBase64] = useState("");
  const [audioPermission, setAudioPermission] = useState(null);
  const [apiResponse, setApiResponse] = useState("");
  const [currentIndex, setCurrentIndex] = useState();
  const [temp_audio, set_temp_audio] = useState(null);
  const { callUpdateLearner } = props;
  const lang = getLocalData("lang");
  const { livesData, setLivesData } = props;
  const [isAudioPreprocessing, setIsAudioPreprocessing] = useState(
    process.env.REACT_APP_IS_AUDIOPREPROCESSING === "true"
  );

  const initiateValues = async () => {
    const currIndex = (await localStorage.getItem("index")) || 1;
    setCurrentIndex(currIndex);
  };

  useEffect(() => {
    setRecordedAudio("");
  }, [props.contentId]);

  const playAudio = (val) => {
    try {
      var audio = new Audio(
        recordedAudio
          ? recordedAudio
          : props.contentId
            ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${props.contentId}.wav`
            : AudioPath[1][10]
      );
      set_temp_audio(audio);
      setPauseAudio(val);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (temp_audio !== null) {
      if (!pauseAudio) {
        temp_audio.pause();
        props.setVoiceAnimate(false);
      } else {
        temp_audio.play();
        props.setVoiceAnimate(true);
      }
      temp_audio.onended = function () {
        setPauseAudio(false);
        props.setVoiceAnimate(false);
      };
      //temp_audio.addEventListener("ended", () => alert("end"));
    }
    return () => {
      if (temp_audio !== null) {
        temp_audio.pause();
      }
    };
  }, [temp_audio]);

  useEffect(() => {
    initiateValues();
  }, []);

  useEffect(() => {
    if (loadCnt === 0) {
      getpermision();
      setLoadCnt((loadCnt) => Number(loadCnt + 1));
    }
  }, [loadCnt]);

  function hasVoice(base64String) {
    // Convert base64 string to ArrayBuffer
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decode ArrayBuffer to audio buffer
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    return new Promise((resolve) => {
      audioContext.decodeAudioData(bytes.buffer, (buffer) => {
        // Analyze the audio buffer to check for voice
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        source.start();

        // Wait for a moment and check if there is any voice
        setTimeout(() => {
          analyser.getByteFrequencyData(dataArray);
          const hasVoice = dataArray.some((value) => value > 0);
          resolve(hasVoice);
        }, buffer.duration * 1000);
      });
    });
  }

  useEffect(() => {
    if (recordedAudio !== "") {
      // setLoader(true);
      let uri = recordedAudio;
      var request = new XMLHttpRequest();
      request.open("GET", uri, true);
      request.responseType = "blob";
      request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
          var base64Data = e.target.result.split(",")[1];
          setRecordedAudioBase64(base64Data);
        };
      };
      request.send();
    } else {
      setLoader(false);
      setRecordedAudioBase64("");
      setApiResponse("");
    }
  }, [recordedAudio]);

  useEffect(()=>{
    if(props.isNextButtonCalled){
      if (recordedAudioBase64 !== "") {
        const lang = getLocalData("lang") || "ta";
        fetchASROutput(lang, recordedAudioBase64);
        setLoader(true)
      }
    }
      },[props.isNextButtonCalled])

  useEffect(() => {
    if (recordedAudioBase64 !== "") {
      if( props.setIsNextButtonCalled){
        props.setIsNextButtonCalled(false);
      }
    }
  }, [recordedAudioBase64]);

  useEffect(() => {
    // props.updateStory();
    props.setVoiceText(apiResponse);
    props.setRecordedAudio(recordedAudio);
  }, [apiResponse]);

  const fetchASROutput = async (sourceLanguage, base64Data) => {
    // let samplingrate = 30000;
    // var myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');
    // var payload = JSON.stringify({
    //     config: {
    //         language: {
    //             sourceLanguage: sourceLanguage,
    //         },
    //         transcriptionFormat: {
    //             value: 'transcript',
    //         },
    //         audioFormat: 'wav',
    //         samplingRate: samplingrate,
    //         postProcessors: null,
    //     },
    //     audio: [
    //         {
    //             audioContent: base64Data,
    //         },
    //     ],
    // });
    // var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: payload,
    //     redirect: 'follow',
    // };
    // const apiURL = `https://asr-api.apiResponse.org/asr/v1/recognize/en`;
    // fetch(apiURL, requestOptions)
    //     .then((response) => response.text())
    //     .then((result) => {
    //         var apiResponse = JSON.parse(result);
    //         setApiResponse(apiResponse['output'][0]['source'] != '' ? apiResponse['output'][0]['source'] : '-');
    //         setLoader(false);
    //     });

    try {
      const lang = getLocalData("lang");
      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");
      const sub_session_id = getLocalData("sub_session_id");
      const { originalText, contentType, contentId, currentLine } = props;
      const responseStartTime = new Date().getTime();
      let responseText = "";
      let profanityWord = ""
      let newThresholdPercentage = 0;
      let data = {};

      if (callUpdateLearner) {
        const { data: updateLearnerData } = await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.UPDATE_LEARNER_PROFILE}/${lang}`,
          {
            original_text: originalText,
            audio: base64Data,
            user_id: virtualId,
            session_id: sessionId,
            language: lang,
            date: new Date(),
            sub_session_id,
            contentId,
            contentType,
          }
        );
        data = updateLearnerData;
        responseText = data.responseText;
         profanityWord = await filterBadWords(data.responseText);
        if (profanityWord !== data.responseText) {
          props?.setOpenMessageDialog({
            message: "Please avoid using inappropriate language.",
            isError: true,
          });
        } 
        newThresholdPercentage = data?.subsessionTargetsCount || 0;
        if (contentType.toLowerCase() !== 'word') {
          handlePercentageForLife(newThresholdPercentage, contentType, data?.subsessionFluency, lang);
        }
      }

      const responseEndTime = new Date().getTime();
      const responseDuration = Math.round(
        (responseEndTime - responseStartTime) / 1000
      );

      let texttemp = responseText.toLowerCase();
      texttemp = replaceAll(texttemp, ".", "");
      texttemp = replaceAll(texttemp, "'", "");
      texttemp = replaceAll(texttemp, ",", "");
      texttemp = replaceAll(texttemp, "!", "");
      texttemp = replaceAll(texttemp, "|", "");
      texttemp = replaceAll(texttemp, "?", "");
      const studentTextArray = texttemp.split(" ");

      let tempteacherText = originalText.toLowerCase();
      tempteacherText = tempteacherText.replace(/\u00A0/g, " ");
      tempteacherText = tempteacherText.trim();
      tempteacherText = replaceAll(tempteacherText, ".", "");
      tempteacherText = replaceAll(tempteacherText, "'", "");
      tempteacherText = replaceAll(tempteacherText, ",", "");
      tempteacherText = replaceAll(tempteacherText, "!", "");
      tempteacherText = replaceAll(tempteacherText, "|", "");
      tempteacherText = replaceAll(tempteacherText, "?", "");
      const teacherTextArray = tempteacherText.split(" ");

      let student_correct_words_result = [];
      let student_incorrect_words_result = [];
      let originalwords = teacherTextArray.length;
      let studentswords = studentTextArray.length;
      let wrong_words = 0;
      let correct_words = 0;
      let result_per_words = 0;
      let result_per_words1 = 0;
      let occuracy_percentage = 0;

      let word_result_array = compareArrays(teacherTextArray, studentTextArray);

      for (let i = 0; i < studentTextArray.length; i++) {
        if (teacherTextArray.includes(studentTextArray[i])) {
          correct_words++;
          student_correct_words_result.push(studentTextArray[i]);
        } else {
          wrong_words++;
          student_incorrect_words_result.push(studentTextArray[i]);
        }
      }
      //calculation method
      if (originalwords >= studentswords) {
        result_per_words = Math.round(
          Number((correct_words / originalwords) * 100)
        );
      } else {
        result_per_words = Math.round(
          Number((correct_words / studentswords) * 100)
        );
      }

      const errorRate = calcCER(responseText, tempteacherText);
      let finalScore = 100 - errorRate * 100;

      finalScore = finalScore < 0 ? 0 : finalScore;

      let word_result = finalScore === 100 ? "correct" : "incorrect";

      // TODO: Remove false when REACT_APP_AWS_S3_BUCKET_NAME and keys added
      var audioFileName = "";
      if (process.env.REACT_APP_CAPTURE_AUDIO === "true" && false) {
        let getContentId = currentLine;
        audioFileName = `${process.env.REACT_APP_CHANNEL
          }/${sessionId}-${Date.now()}-${getContentId}.wav`;

        const command = new PutObjectCommand({
          Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
          Key: audioFileName,
          Body: Uint8Array.from(window.atob(base64Data), (c) =>
            c.charCodeAt(0)
          ),
          ContentType: "audio/wav",
        });
        try {
          const response = await S3Client.send(command);
        } catch (err) { }
      }

      response(
        {
          // Required
          target:
            process.env.REACT_APP_CAPTURE_AUDIO === "true"
              ? `${audioFileName}`
              : "", // Required. Target of the response
          //"qid": "", // Required. Unique assessment/question id
          type: "SPEAK", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
          values: [
            { original_text: originalText },
            { response_text: responseText },
            { response_correct_words_array: student_correct_words_result },
            { response_incorrect_words_array: student_incorrect_words_result },
            { response_word_array_result: word_result_array },
            { response_word_result: word_result },
            { accuracy_percentage: finalScore },
            { duration: responseDuration },
          ],
        },
        "ET"
      );

      setApiResponse(callUpdateLearner ? data.status : "success");
      if(props.handleNext){
        props.handleNext();
        if(temp_audio !== null){
          temp_audio.pause();
          setPauseAudio(false);
        }
      }
      setLoader(false);
      if( props.setIsNextButtonCalled){ 
        props.setIsNextButtonCalled(false);
      }
    } catch (error) {
      setLoader(false);
      if(props.handleNext){
        props.handleNext();
      }
      if( props.setIsNextButtonCalled){ 
        props.setIsNextButtonCalled(false);
      }
      setRecordedAudioBase64("");
      setApiResponse("error");
      console.log("err", error);
    }
  };

  const handlePercentageForLife = (percentage, contentType, fluencyScore, language) => {
    try {
        if (livesData) {
          let totalSyllables = livesData.totalTargets;
          if (language === "en") {
             if (totalSyllables > 50) {
              totalSyllables = 50;
             }
          }
            // Calculate the current percentage based on total targets.
            percentage = Math.round((percentage / totalSyllables) * 100);

            // Define the total number of lives and adjust the threshold based on syllables.
            const totalLives = 5;
            let threshold = 30; // Default threshold

            // Adjust the threshold based on total syllables.
            if (totalSyllables <= 100) threshold = 30;
            else if (totalSyllables > 100 && totalSyllables <= 150) threshold = 25;
            else if (totalSyllables > 150 && totalSyllables <= 175) threshold = 20;
            else if (totalSyllables > 175 && totalSyllables <= 250) threshold = 15;
            else if (totalSyllables > 250 && totalSyllables <= 500) threshold = 10;
            else if (totalSyllables > 500) threshold = 5;

            // Calculate lives lost based on percentage.
            let livesLost = Math.floor(percentage / (threshold / totalLives));

            // Check fluency criteria and adjust lives lost accordingly.
            let meetsFluencyCriteria;
            switch (contentType.toLowerCase()) {
                case 'word':
                    meetsFluencyCriteria = fluencyScore < 2;
                    break;
                case 'sentence':
                    meetsFluencyCriteria = fluencyScore < 6;
                    break;
                case 'paragraph':
                    meetsFluencyCriteria = fluencyScore < 10;
                    break;
                default:
                    meetsFluencyCriteria = true; // Assume criteria met if not specified.
            }

            // If fluency criteria are not met, reduce an additional life, but ensure it doesn't exceed the total lives.
            if (!meetsFluencyCriteria && livesLost < totalLives) {
                livesLost = Math.min(livesLost + 1, totalLives);
            }

            // Determine the number of red and black lives to show.
            const redLivesToShow = totalLives - livesLost;
            let blackLivesToShow = 5;
            if(livesLost <= 5){
               blackLivesToShow = livesLost;
            }

            // Prepare the new lives data.
            let newLivesData = {
                ...livesData,
                blackLivesToShow,
                redLivesToShow,
                meetsFluencyCriteria: meetsFluencyCriteria,
            };

            // Play audio based on the change in lives.
            const HeartGaain =
              livesData.redLivesToShow === undefined
                ? 5 - newLivesData.redLivesToShow
                : livesData.redLivesToShow - newLivesData.redLivesToShow;
            let isLiveLost;
            if (HeartGaain > 0) {
              isLiveLost = true;
            } else {
              isLiveLost = false;
            }
            const audio = new Audio(isLiveLost ? livesCut : livesAdd);
            audio.play();

            // Update the state or data structure with the new lives data.
            setLivesData(newLivesData);
        }
    } catch (e) {
        console.log("error", e);
    }
};



  // const getpermision = () => {
  //   navigator.getUserMedia =
  //     navigator.getUserMedia ||
  //     navigator.webkitGetUserMedia ||
  //     navigator.mozGetUserMedia ||
  //     navigator.msGetUserMedia;
  //   navigator.getUserMedia(
  //     { audio: true },
  //     () => {
  //       console.log("Permission Granted");
  //       setAudioPermission(true);
  //     },
  //     () => {
  //       console.log("Permission Denied");
  //       setAudioPermission(false);
  //       //alert("Microphone Permission Denied");
  //     }
  //   );
  // };
  const getpermision = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setAudioPermission(true);
      })
      .catch((error) => {
        console.log("Permission Denied");
        setAudioPermission(false);
        //alert("Microphone Permission Denied");
      });
  };
  return (
    <div>
      {loader ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
        </Box>
      ) : (
        (() => {
          if (audioPermission != null) {
            if (audioPermission) {
              return (
                <>
                  <AudioCompare
                    setRecordedAudio={setRecordedAudio}
                    playAudio={playAudio}
                    pauseAudio={pauseAudio}
                    dontShowListen={
                      props.isShowCase
                        ? props.isShowCase && !recordedAudio
                        : props.dontShowListen
                    }
                    isAudioPreprocessing={isAudioPreprocessing}
                    recordedAudio={recordedAudio}
                    setEnableNext={props.setEnableNext}
                    showOnlyListen={props.showOnlyListen}
                    setOpenMessageDialog={props.setOpenMessageDialog}
                  />
                  {/* <RecordVoiceVisualizer /> */}
                </>
              );
            } else {
              return (
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    // alert(
                    //   "Microphone is blocked. Enable microphone to continue."
                    // );
                    props.setOpenMessageDialog({
                      message:
                        "Microphone is blocked. Enable microphone to continue.",
                      isError: true,
                    });
                  }}
                >
                  <SpeakButton />
                </Box>
              );
            }
          }
        })()
      )}
    </div>
  );
}

export default VoiceAnalyser;
