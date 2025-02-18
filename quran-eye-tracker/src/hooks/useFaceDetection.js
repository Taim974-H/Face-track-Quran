// src/hooks/useFaceDetection.js
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export const useFaceDetection = (onDirectionMatch, audioRef, preferredDirectionRef) => {
  const videoRef = useRef(null);
  const [faceDirection, setFaceDirection] = useState('center');
  const detectionIntervalRef = useRef(null);

  // Loads models and starts video
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
        }
      })
      .catch(console.error);
  };

  // Stops the video stream
  const stopVideoStream = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const loadModels = async () => {
    console.log('Loading models...');
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    console.log('Models loaded successfully!');
  };

  const handleVideoOnPlay = () => {
    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || audioRef.current) return;
      
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 128 })
        )
        .withFaceLandmarks();
      
      if (detection) {
        const nose = detection.landmarks.getNose();
        const noseTip = nose[3].x;
        const midpoint = videoRef.current.videoWidth / 2;
        let newDirection = 'center';
        if (noseTip < midpoint - 40) newDirection = 'right';
        else if (noseTip > midpoint + 40) newDirection = 'left';
        
        setFaceDirection(newDirection);
        if (newDirection === preferredDirectionRef.current) {
          onDirectionMatch();
        }
      }
    }, 500);
  };

  useEffect(() => {
    loadModels().then(startVideo);
    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { videoRef, faceDirection, handleVideoOnPlay, stopVideoStream, startVideo };
};
