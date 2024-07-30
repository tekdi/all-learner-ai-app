const loadWhisperModule = async () => {
    try {
      if (typeof Module === 'undefined') {
        throw new Error('Module is not defined');
      }
      window.whisperModule = Module;
    } catch (error) {
      console.error('Failed to load WASM module', error);
    }
  };
  
  loadWhisperModule();