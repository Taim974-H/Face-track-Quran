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
      
      // Detect a single face in the current video frame using the Tiny Face Detector.
      // The detection is performed on the video element referenced by videoRef.current.
      // The 'inputSize' of 128 is chosen to speed up detection (smaller input sizes are faster).
      // The .withFaceLandmarks() call enriches the detection result with landmark positions (like eyes, nose, mouth, etc.).
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 128 })
        )
        .withFaceLandmarks();
  
      // If a face is detected, proceed to calculate its direction.
      if (detection) {
        // Get the array of points corresponding to the nose landmarks.
        // face-api.js returns several points for the nose; typically, one of these is the tip.
        const nose = detection.landmarks.getNose();

        // Choose the nose tip based on a typical index (here index 3 is assumed to be the tip).
        // Note: This index might differ depending on the model; adjust as necessary.
        const noseTip = nose[3].x;// Get the x-coordinate of the nose tip.

        // Calculate the horizontal midpoint of the video frame.
        // This gives us a reference to determine if the face is shifted left or right.
        const midpoint = videoRef.current.videoWidth / 2;

        // Initialize the direction to "center" by default.
        let newDirection = 'center';

        // Compare the nose tip position to the midpoint with a tolerance of 40 pixels.
        // If the nose tip is to the left of the center (with tolerance), then the face is considered to be looking right.
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
