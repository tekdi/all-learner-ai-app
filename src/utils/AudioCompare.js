import React, { Component } from "react";
import AudioAnalyser from "react-audio-analyser";
import mic from "../assets/mic.png";
import listen from "../assets/listen.png";
import pause from "../assets/pause.png";
import mic_on from "../assets/mic.png";
import { Box } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";

// Import statements remain the same

export default class AudioRecorderCompair extends Component {
  MIN_DECIBELS = Number(-45);
  MEDIARECORDER = {};

  constructor(props) {
    super(props);
    this.state = {
      status: "",
      pauseAudio: false,
      soundDetected: false,
      stopDetection: false,
      audioSrc: "", // Added to store recorded audio
    };
  }

  controlAudio(status) {
    this.setState({
      status,
    });
  }

  resetRecording() {
    this.setState({
      audioSrc: "",
      recordingInitialized: false,
    });
  }

  componentDidMount() {
    this.setState({
      audioType: "audio/wav",
    });
  }

  handleMic() {
    if (this.props.setEnableNext) {
      this.props.setEnableNext(false);
    }

    if (this.props.isAudioPreprocessing) {
      this.setState({ soundDetected: false, stopDetection: false });
      document.getElementById("startaudio_compair").click();
      this.startSoundDetection();
    } else {
      document.getElementById("startaudio_compair").click();
    }

    this.resetRecording(); // Reset recording state before starting a new recording
  }

  handleStop() {
    if (this.props.setEnableNext) {
      this.props.setEnableNext(true);
    }

    if (this.props.isAudioPreprocessing) {
      document.getElementById("stopaudio_compair").click();
      this.setState({ stopDetection: true });
    } else {
      document.getElementById("stopaudio_compair").click();
    }
    this.MEDIARECORDER.stop();
  }

  startSoundDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { sampleRate: 22050 });

      this.MEDIARECORDER = mediaRecorder;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.minDecibels = this.MIN_DECIBELS;

      const audioStreamSource = audioContext.createMediaStreamSource(stream);
      audioStreamSource.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const domainData = new Float32Array(bufferLength); // Use Float32Array instead of Uint8Array

      let soundDetected = false;

      const ambientNoiseLevel = -70; // Example ambient noise level in dB
      const humanVoiceThreshold = -40; // Example threshold for human voice detection

      let threshold = Math.max(ambientNoiseLevel, humanVoiceThreshold);

      const SILENCE_THRESHOLD = -60; // Adjust as needed

      const detectSound = () => {
        if (this.state.stopDetection || this.state.soundDetected) {
          return;
        }

        analyser.getFloatFrequencyData(domainData);

        const isSilence = domainData.every((val) => val < SILENCE_THRESHOLD);

        if (isSilence) {
          this.setState({ soundDetected: false });
        } else {
          this.setState({ soundDetected: true });
        }

        if (!this.state.soundDetected) {
          window.requestAnimationFrame(detectSound);
        }
      };

      mediaRecorder.start();
      window.requestAnimationFrame(detectSound);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  render() {
    const { status, audioSrc, audioType, recordingInitialized } = this.state;
    const audioProps = {
      audioType,
      status,
      audioSrc,
      timeslice: 1000, // timeslice
      startCallback: (e) => {
        this.setState({
          audioSrc: "",
        });
        this.props.setRecordedAudio("");
        this.setState({
          recordingInitialized: true,
        });
      },
      pauseCallback: (e) => {},
      stopCallback: (e) => {
        let temp_audioSrc = window.URL.createObjectURL(e);
        this.setState({
          audioSrc: temp_audioSrc,
        });

        if (!this.props.isAudioPreprocessing) {
          this.props.setRecordedAudio(temp_audioSrc);
        } else {
          if (this.state.soundDetected) {
            this.props.setRecordedAudio(temp_audioSrc);
          } else {
            // this.props.setRecordedAudio(temp_audioSrc);
            this.props?.setOpenMessageDialog({
              message: "Please Speak Louder and Clear",
              isError: true,
            });
          }
        }

        this.setState({
          recordingInitialized: false,
        });
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
                    sx={{
                      cursor: "pointer",
                      height: "38px",
                    }}
                    onClick={() => this.handleStop()}
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
                  {(!this.props.dontShowListen || this.props.recordedAudio) && (
                    <>
                      {!this.props.pauseAudio ? (
                        <div
                          onClick={() => {
                            this.props.playAudio(true);
                          }}
                        >
                          <Box sx={{ cursor: "pointer" }}>
                            <ListenButton />
                          </Box>
                        </div>
                      ) : (
                        <>
                          <Box
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              this.props.playAudio(false);
                            }}
                          >
                            <StopButton />
                          </Box>
                        </>
                      )}
                    </>
                  )}

                  <div>
                    {!this.props.showOnlyListen && (
                      <Box
                        marginLeft={
                          !this.props.dontShowListen || this.props.recordedAudio
                            ? "32px"
                            : "0px"
                        }
                        sx={{ cursor: "pointer" }}
                        onClick={() => this.handleMic()}
                      >
                        {!this.props.recordedAudio ? (
                          <SpeakButton />
                        ) : (
                          <RetryIcon />
                        )}
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
                onClick={() => this.controlAudio("recording")}
              >
                Start
              </button>
              <button
                className="btn"
                id="stopaudio_compair"
                onClick={() => this.controlAudio("inactive")}
              >
                Stop
              </button>
            </div>
          </AudioAnalyser>
        </div>
      </div>
    );
  }
}
