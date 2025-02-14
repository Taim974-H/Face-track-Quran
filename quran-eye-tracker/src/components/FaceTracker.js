import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

export default function QuranPlayer() {
  const [faceDirection, setFaceDirection] = useState('center');
  const [verse, setVerse] = useState(null);
  const [audio, setAudio] = useState(null);
  const [translation, setTranslation] = useState(null); // Added translation state
  const [isPaused, setIsPaused] = useState(false);
  const [lastPlayedVerse, setLastPlayedVerse] = useState(null); // Store the last played verse
  const [isContinuing, setIsContinuing] = useState(false); // Track if Surah is being continued
  const videoRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const isProcessing = useRef(false);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    console.log('Models loaded');
  };

  const fetchRandomVerse = async () => {
    if (isProcessing.current || audio) return; // Prevent multiple triggers
    
    isProcessing.current = true;
    try {
      const surah = Math.floor(Math.random() * 114) + 1;
      const response = await axios.get(
        `https://api.alquran.cloud/v1/surah/${surah}/editions/quran-simple,ar.alafasy,en.sahih` // Added en.sahih for translation
      );
      const verses = response.data.data[0].ayahs;
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];

      const newVerse = {
        text: randomVerse.text,
        audio: response.data.data[1].ayahs[randomVerse.numberInSurah - 1].audio,
        surahNumber: surah,
        verseNumber: randomVerse.numberInSurah
      };

      // Fetch translation from en.sahih edition
      const translationText = response.data.data[2].ayahs[randomVerse.numberInSurah - 1].text;

      setVerse(newVerse);
      setLastPlayedVerse(newVerse); // Store the last played verse
      setTranslation(translationText); // Set translation
    } finally {
      isProcessing.current = false;
    }
  };

  const fetchNextVerse = async () => {
    if (!lastPlayedVerse || isProcessing.current || audio) return;

    isProcessing.current = true;
    try {
      const surah = lastPlayedVerse.surahNumber;
      const nextVerseNumber = lastPlayedVerse.verseNumber + 1;

      const response = await axios.get(
        `https://api.alquran.cloud/v1/surah/${surah}/editions/quran-simple,ar.alafasy,en.sahih` // Added en.sahih for translation
      );
      const verses = response.data.data[0].ayahs;

      if (nextVerseNumber > verses.length) {
        alert('End of Surah');
        stopContinuingSurah();
        return;
      }

      const nextVerse = verses[nextVerseNumber - 1];

      const newVerse = {
        text: nextVerse.text,
        audio: response.data.data[1].ayahs[nextVerseNumber - 1].audio,
        surahNumber: surah,
        verseNumber: nextVerseNumber
      };

      // Fetch translation from en.sahih edition
      const translationText = response.data.data[2].ayahs[nextVerseNumber - 1].text;

      setVerse(newVerse);
      setLastPlayedVerse(newVerse); // Store the last played verse
      setTranslation(translationText); // Set translation
    } finally {
      isProcessing.current = false;
    }
  };

  const replayLastVerse = () => {
    if (lastPlayedVerse) {
      setVerse(lastPlayedVerse); // Replay the last verse
    }
  };

  const startContinuingSurah = () => {
    setIsContinuing(true); // Start continuing the Surah
    if (lastPlayedVerse) {
      setVerse(lastPlayedVerse); // Play the last verse first
    }
  };

  const stopContinuingSurah = () => {
    setIsContinuing(false);
    setAudio(null);
    setVerse(null);
    setTranslation(null); // Clear translation

    // Forcefully restart face detection
    stopDetection(); // Clear any existing interval
    startVideo(); // Reinitialize the video stream to ensure onPlay triggers
  };

  // Cleanup function
  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const startVideo = () => {
    // Stop existing tracks if any
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    // Start fresh video stream
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error); // Explicitly play the video
        }
      })
      .catch(console.error);
  };

  const handleVideoOnPlay = () => {
    stopDetection(); // Clear any existing interval
    
    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || audio) return; // Stop if audio is playing

      const detection = await faceapi.detectSingleFace(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks();
      
      if (!detection) return;

      const nose = detection.landmarks.getNose();
      const noseTip = nose[3].x;
      const midpoint = videoRef.current.videoWidth / 2;

      let newDirection = 'center';
      if (noseTip < midpoint - 50) newDirection = 'right';
      else if (noseTip > midpoint + 50) newDirection = 'left';

      setFaceDirection(newDirection);
      if (newDirection !== 'center') fetchRandomVerse();
    }, 1000);
  };

  const togglePause = () => {
    if (!audio) return;
    if (isPaused) {
      audio.play();
    } else {
      audio.pause();
    }
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    loadModels().then(startVideo);
    return () => {
      stopDetection();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (verse?.audio) {
      stopDetection(); // Stop all detection when verse starts
      const audioElement = new Audio(verse.audio);
      setAudio(audioElement);
      
      audioElement.play();
      audioElement.onended = () => {
        setAudio(null);
        setVerse(null);
        setTranslation(null); // Clear translation

        if (isContinuing) {
          fetchNextVerse(); // Automatically fetch and play the next verse
        } else {
          handleVideoOnPlay(); // Restart detection if not continuing
        }
      };

      return () => {
        audioElement.pause();
        audioElement.currentTime = 0;
      };
    }
  }, [verse]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onPlay={handleVideoOnPlay}
        className="w-full max-w-md border border-gray-300 rounded-lg shadow-md"
      />
      {verse && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg text-center w-3/4 animate-pulse">
          <p className="text-2xl font-arabic">{verse.text}</p>
          <p className="mt-2 text-lg text-gray-600 italic">{translation}</p> {/* Display translation */}
          <p className="mt-2 text-lg">
            Surah {verse.surahNumber}, Verse {verse.verseNumber}
          </p>
        </div>
      )}
      {!audio && (
        <p className="mt-4 text-lg">Face Direction: {faceDirection}</p>
      )}
      {audio && (
        <p className="mt-4 text-lg">Verse being played...</p>
      )}
      {audio ? (
        <div className="flex space-x-4">
          <button 
            onClick={togglePause} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          {isContinuing && (
            <button 
              onClick={stopContinuingSurah} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md"
            >
              Stop
            </button>
          )}
        </div>
      ) : lastPlayedVerse && (
        <div className="flex space-x-4">
          <button 
            onClick={replayLastVerse} 
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md"
          >
            Replay Last Verse
          </button>
          <button 
            onClick={startContinuingSurah} 
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md"
          >
            Continue Surah
          </button>
        </div>
      )}
    </div>
  );
}