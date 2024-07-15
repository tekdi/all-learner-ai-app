const loadWhisperModule = async () => {
    try {
      window.whisperModule = Module;
    } catch (error) {
      console.error('Failed to load WASM module', error);
    }
  };
  
  loadWhisperModule();