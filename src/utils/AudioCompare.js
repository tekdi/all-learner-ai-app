import React, { Component } from "react";
import AudioAnalyser from "react-audio-analyser";
import mic from "../assets/mic.png";
import listen from "../assets/listen.png";
import pause from "../assets/pause.png";
import mic_on from "../assets/mic.png";
import { Box } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";

export default class AudioRecorderCompair extends Component {
  MIN_DECIBELS = Number(-45);
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      pauseAudio: false,
      soundDetected: false,
      stopDetection: false,
    };
  }

  controlAudio(status) {
    this.setState({
      status,
    });
  }

  changeScheme(e) {
    this.setState({
      audioType: e.target.value,
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
  }

  startSoundDetection = async () => {
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        const audioContext = new AudioContext();
        const audioStreamSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.minDecibels = this.MIN_DECIBELS;
        audioStreamSource.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const domainData = new Uint8Array(bufferLength);

        let soundDetected = false;

        const detectSound = () => {
          if (this.state.stopDetection) {
            return; // Stop detection if stopDetection is true
          }
          if (this.state.soundDetected) {
            return;
          }

          analyser.getByteFrequencyData(domainData);

          for (let i = 0; i < bufferLength; i++) {
            const value = domainData[i];

            if (domainData[i] > 0) {
              this.setState({ soundDetected: true });
            }
          }

          window.requestAnimationFrame(detectSound);
        };

        window.requestAnimationFrame(detectSound);

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();

        });
      });
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
      pauseCallback: (e) => {
      },
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
            if(localStorage.getItem('contentSessionId')){
              const alertMessage = "Please Speak Louder and Clear";
              if (window && window.parent) {
                window.parent.postMessage({
                  alert: alertMessage,
                  icon:'warning',
                  message: 'storylingo-alert',
                });
              }
            }
            else{
              alert("Please Speak Louder and Clear");
            }
          }
        }

        this.setState({
          recordingInitialized: false,
        });
      },
      onRecordCallback: (e) => {
      },
      errorCallback: (err) => {
      },
      backgroundColor: "hsla(0, 100%, 0%, 0)",
      strokeColor: "#73DD24",
      /* path76 */
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
                    // width: '13%',
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
                    {/* <AudioAnalyser {...audioProps}></AudioAnalyser> */}
                  </Box>
                </div>
              );
            } else {
              return (
                <div
                  style={{
                    display: "flex",
                    // width: '13%',
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
                    {/* <img
                                            src={mic}
                                            className="micimg mic_record"
                                          
                                            style={{
                                                cursor: 'pointer',
                                                padding: '5px',
                                                height: '38px',
                                            }}
                                            alt="mic"
                                        />
                                        <div
                                            style={{
                                                color: 'white',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                            }}
                                        >
                                            SPEAK
                                        </div> */}
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
