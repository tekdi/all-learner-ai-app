import React, { useEffect, useState } from "react";
import AudioAnalyser from "react-audio-analyser";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";
import useAudioDetection from "./useAudioDetection";
import { Box, CircularProgress } from "@mui/material";

const AudioRecorderCompair = (props) => {
  const { startDetection, stopDetection, isSilent, isRunning, audioDetected } =
    useAudioDetection();
  const [status, setStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [recordingInitialized, setRecordingInitialized] = useState(false);
  const [loader,setLoader] = useState(false);
  const audioType = "audio/wav";

  const controlAudio = async (status) => {
    if (status === "recording") {
      await startDetection();
    } else {
      stopDetection();
    }
    setStatus(status);
  };

  const resetRecording = () => {
    setAudioSrc("");
    setRecordingInitialized(false);
  };
  
  const handleMic = async () => {
    if (props.setEnableNext) {
      props.setEnableNext(false);
    }
    document.getElementById("startaudio_compair").click();
    resetRecording();
  };

  useEffect(()=>{
    if(!!props.recordedAudio){
      setLoader(false);
    }
  },[props.recordedAudio])
  

  const handleStop = () => {
    setLoader(true);
    if (props.setEnableNext) {
      props.setEnableNext(true);
    }
    document.getElementById("stopaudio_compair").click();
  };

  const audioProps = {
    audioType,
    status,
    audioSrc,
    timeslice: 1000,
    startCallback: (e) => {
      setAudioSrc("");
      setRecordingInitialized(true);
      props.setRecordedAudio("");
    },
    pauseCallback: (e) => {},
    stopCallback: (e) => {
      const temp_audioSrc = window.URL.createObjectURL(e);
      setAudioSrc(temp_audioSrc);
      if (!audioDetected) {
        props?.setOpenMessageDialog({
          message: "Please Speak Louder and Clear",
          isError: true,
        });
        if (props.setEnableNext) {
          props.setEnableNext(false);
        }
        setLoader(false);
      } else {
        if (localStorage.getItem("isOfflineModel") === "true") {
          props.handleProcess(temp_audioSrc);
        } else {
          props.setRecordedAudio(temp_audioSrc);
        }
      }
      setRecordingInitialized(false);
    },
    onRecordCallback: (e) => {},
    errorCallback: (err) => {},
    backgroundColor: "hsla(0, 100%, 0%, 0)",
    strokeColor: "#73DD24",
  };

  return (
    <div>
      {loader && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
        </Box>
      )}
      <div>
        {(() => {
          if (status === "recording" && recordingInitialized) {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <Box
                  sx={{ cursor: "pointer", height: "38px" }}
                  onClick={handleStop}
                >
                  <StopButton />
                </Box>
                <Box style={{ marginTop: "50px", marginBottom: "50px" }}>
                  <RecordVoiceVisualizer />
                </Box>
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "0 auto",
                }}
                className="game-action-button"
              >
                {!loader && (!props.dontShowListen || props.recordedAudio) && (
                  <>
                    {!props.pauseAudio ? (
                      <div
                        onClick={() => {
                          props.playAudio(true);
                        }}
                      >
                        <Box sx={{ cursor: "pointer" }}>
                          <ListenButton />
                        </Box>
                      </div>
                    ) : (
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          props.playAudio(false);
                        }}
                      >
                        <StopButton />
                      </Box>
                    )}
                  </>
                )}

                <div>
                  {!props.showOnlyListen && (
                    <Box
                      marginLeft={
                        !props.dontShowListen || props.recordedAudio
                          ? "32px"
                          : "0px"
                      }
                      sx={{ cursor: "pointer" }}
                      onClick={handleMic}
                    >
                      {!loader &&
                        (!props.recordedAudio ? (
                          <SpeakButton />
                        ) : (
                          <RetryIcon />
                        ))}
                    </Box>
                  )}
                </div>
              </div>
            );
          }
        })()}
        <AudioAnalyser {...audioProps} className="hide">
          <div className="btn-box">
            <br />
            <button
              className="btn"
              id="startaudio_compair"
              onClick={() => controlAudio("recording")}
            >
              Start
            </button>
            <button
              className="btn"
              id="stopaudio_compair"
              onClick={() => controlAudio("inactive")}
            >
              Stop
            </button>
          </div>
        </AudioAnalyser>
      </div>
    </div>
  );
};

export default AudioRecorderCompair;
