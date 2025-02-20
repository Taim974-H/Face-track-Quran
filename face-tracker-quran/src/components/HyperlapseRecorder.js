'use client';

import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const HyperlapseRecorder = ({
  containerClass = "", // Additional classes for the container wrapper
  startStopButtonClass = "fixed top-4 right-4 z-50 px-4 py-2 rounded text-white transition-all",
  downloadLinkClass = "fixed top-16 right-4 z-50 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700",
  errorClass = "text-red-500 mt-2 fixed bottom-4 right-4 z-50 bg-white p-2 rounded shadow"
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const streamRef = useRef(null);
  const ffmpegRef = useRef(null);

  const toBlobURL = async (url, mimeType) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(new Blob([await blob.arrayBuffer()], { type: mimeType }));
  };

  // FFmpeg initialization
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const ffmpeg = new FFmpeg();
        ffmpegRef.current = ffmpeg;
  
        ffmpeg.on("log", ({ message }) => console.debug("FFmpeg:", message));
        ffmpeg.on("progress", ({ progress }) =>
          console.log(`Processing: ${(progress * 100).toFixed(1)}%`)
        );
  
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        await ffmpeg.load({
          coreURL: `${baseURL}/ffmpeg-core.js`,
          wasmURL: `${baseURL}/ffmpeg-core.wasm`
        });
        
  
        setFfmpegReady(true);
      } catch (err) {
        console.error("FFmpeg init failed:", err);
        setError(`Failed to initialize video processor: ${err.message}`);
      }
    };
  
    loadFFmpeg();
  }, []);

  const processVideo = async (blob) => {
    if (!ffmpegReady) return;

    setProcessing(true);
    try {
      const ffmpeg = ffmpegRef.current;

      // Write input file
      await ffmpeg.writeFile("input.webm", await fetchFile(blob));

      // Run FFmpeg command to produce a hyperlapse (10x speedup)
      await ffmpeg.exec([
        "-i",
        "input.webm",
        "-filter:v",
        "setpts=0.1*PTS", // 10x video speedup
        "-filter:a",
        "atempo=10", // 10x audio speedup
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "28",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-movflags",
        "+faststart",
        "-r",
        "30",
        "-threads",
        "0",
        "output.mp4"
      ]);

      // Read output
      const data = await ffmpeg.readFile("output.mp4");
      const url = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));
      setDownloadUrl(url);

      // Cleanup
      await ffmpeg.deleteFile("input.webm");
      await ffmpeg.deleteFile("output.mp4");
    } catch (err) {
      console.error("Processing failed:", err);
      setError("Video processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        //  {
        //   width: { ideal: 1280 },
        //   height: { ideal: 720 },
        //   frameRate: { ideal: 60, max: 60 }
        // },
        audio: true
      });

      streamRef.current = stream;
      recordedChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("video/mp4; codecs=h264")
    ? "video/mp4; codecs=h264"
    : MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : MediaRecorder.isTypeSupported("video/webm; codecs=vp8")
    ? "video/webm; codecs=vp8"
    : "";


      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        await processVideo(blob);
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Recording failed:", err);
      setError("Camera access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  return (
    <div className={containerClass}>
      {/* Start/Stop button in the top-right corner */}
      <button
        onClick={handleButtonClick}
        disabled={!ffmpegReady || processing}
        className={`${startStopButtonClass} ${
          !ffmpegReady || processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {processing
          ? "Processing"
          : isRecording
          ? "Stop Time-Lapse"
          : "Start Time-Lapse"}
      </button>

      {/* Download button appears after recording is stopped */}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="timelapse.mp4"
          className={downloadLinkClass}
        >
          Download Time-Lapse
        </a>
      )}

      {error && (
        <div className={errorClass}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default HyperlapseRecorder;
