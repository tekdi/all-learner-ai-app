import React, { useState } from "react";
import AudioAnalyser from "react-audio-analyser";
import { Box } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";
import useAudioDetection from "./useAudioDetection";

const AudioRecorderCompair = (props) => {
  const { startDetection, stopDetection, isSilent, isRunning, audioDetected } = useAudioDetection();
  const [status, setStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [recordingInitialized, setRecordingInitialized] = useState(false);
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

  const handleStop = () => {
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
      } else {
        props.setRecordedAudio(temp_audioSrc);
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
      <div>
        {(() => {
          if (status === "recording" && recordingInitialized) {
            return (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", margin: "0 auto" }}>
                <Box sx={{ cursor: "pointer", height: "38px" }} onClick={handleStop}>
                  <StopButton />
                </Box>
                <Box style={{ marginTop: "50px", marginBottom: "50px" }}>
                  <RecordVoiceVisualizer />
                </Box>
              </div>
            );
          } else {
            return (
              <div style={{ display: "flex", justifyContent: "space-between", margin: "0 auto" }} className="game-action-button">
                {(!props.dontShowListen || props.recordedAudio) && (
                  <>
                    {!props.pauseAudio ? (
                      <div role="button" tabIndex="0" onClick={() => { props.playAudio(true); }} aria-label="Play audio">
                        <Box sx={{ cursor: "pointer" }}>
                          <ListenButton />
                        </Box>
                      </div>
                    ) : (
                      <Box sx={{ cursor: "pointer" }} onClick={() => { props.playAudio(false); }}>
                        <StopButton />
                      </Box>
                    )}
                  </>
                )}

                <div>
                  {!props.showOnlyListen && (
                    <Box marginLeft={!props.dontShowListen || props.recordedAudio ? "32px" : "0px"} sx={{ cursor: "pointer" }} onClick={handleMic}>
                      {!props.recordedAudio ? <SpeakButton /> : <RetryIcon />}
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
            <button className="btn" id="startaudio_compair" onClick={() => controlAudio("recording")}>
              Start
            </button>
            <button className="btn" id="stopaudio_compair" onClick={() => controlAudio("inactive")}>
              Stop
            </button>
          </div>
        </AudioAnalyser>
      </div>
    </div>
  );
};

export default AudioRecorderCompair;
