import { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let ffmpeg = null;

const useFFmpeg = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ffmpeg) {
      ffmpeg = createFFmpeg({ log: false });
      ffmpeg
        .load()
        .then(() => setLoading(false))
        .catch(console.error);
    } else {
      setLoading(false);
    }
  }, []);

  return { ffmpeg, loading };
};

export default useFFmpeg;
