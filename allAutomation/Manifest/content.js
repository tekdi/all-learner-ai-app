console.log("My Microphone Simulator Content Script Loaded");

// Simulate microphone input
function simulateMicrophoneInput(audioFile) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
    return new Promise((resolve, reject) => {
      if (constraints.audio) {
        const audioContext = new AudioContext();
        fetch(audioFile)
          .then(response => response.arrayBuffer())
          .then(data => audioContext.decodeAudioData(data))
          .then(buffer => {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            const destination = audioContext.createMediaStreamDestination();
            source.connect(destination);
            source.start();
            resolve(destination.stream);
          })
          .catch(err => reject(err));
      } else {
        reject(new Error("Only audio constraints are supported."));
      }
    });
  };
}

// Use the function to simulate microphone input with your audio file
simulateMicrophoneInput(chrome.runtime.getURL("output_audio.wav"));
