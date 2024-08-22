import React, { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { Box } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";

const AudioRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    setStatus("recording");
    if (props.setEnableNext) {
      props.setEnableNext(false);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      recorderRef.current = new RecordRTC(stream, { type: "audio" });
      recorderRef.current.startRecording();

      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = () => {
    setStatus("inactive");
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();

        if (blob) {
          setAudioBlob(blob);
          saveBlob(blob); // Persist the blob
        } else {
          console.error("Failed to retrieve audio blob.");
        }

        // Stop the media stream
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        setIsRecording(false);
      });
    }
    if (props.setEnableNext) {
      props.setEnableNext(true);
    }
  };

  const saveBlob = (blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      playRecording(base64Data);
    };
    reader.readAsDataURL(blob);
  };

  const playRecording = (base64Data) => {
    if (base64Data) {
      fetch(base64Data)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          props?.setRecordedAudio(url);
        });
    } else {
      console.error("No saved audio found.");
    }
  };

  return (
    <div>
      <div>
        {(() => {
          if (status === "recording") {
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
                  onClick={stopRecording}
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
                {(!props.dontShowListen || props.recordedAudio) && (
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
                      onClick={startRecording}
                    >
                      {!props.recordedAudio ? <SpeakButton /> : <RetryIcon />}
                    </Box>
                  )}
                </div>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default AudioRecorder;
