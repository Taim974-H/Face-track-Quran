// src/components/quran/QuranPlayer.js
import { useState, useEffect } from "react";
import { useDirection } from "../../hooks/useDirection";
import { useFaceDetection } from "../../hooks/useFaceDetection";
import { useQuranPlayer } from "../../hooks/useQuranPlayer";
import { DirectionSelector } from "./DirectionSelector";
import { ReciterSelector } from "./ReciterSelector";
import { VideoFeed } from "./VideoFeed";
import { VerseDisplay } from "./VerseDisplay";
import { PlayerControls } from "./PlayerControls";
import axios from "axios";
import dynamic from "next/dynamic";
// Dynamically import HyperlapseRecorder (no SSR)
const HyperlapseRecorder = dynamic(
  () => import("@/components/HyperlapseRecorder"),
  { ssr: false }
);

export default function QuranPlayer() {
  const [showWelcome, setShowWelcome] = useState(true);
  const {
    preferredDirection,
    setPreferredDirection,
    preferredDirectionRef,
    hasChosenDirection,
  } = useDirection();
  const [recitersList, setRecitersList] = useState([]);
  const [reciter, setReciter] = useState("ar.alafasy"); // Default value

  // Local state to control display of the menu card
  const [menuOpen, setMenuOpen] = useState(!hasChosenDirection);

  // Fetch the valid reciters once when the component mounts.
  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const response = await axios.get(
          "https://api.alquran.cloud/v1/edition"
        );
        const editions = response.data.data;
        // Filter for audio editions in Arabic.
        const audioReciters = editions.filter(
          (edition) => edition.format === "audio" && edition.language === "ar"
        );
        setRecitersList(audioReciters);
      } catch (error) {
        console.error("Error fetching reciters:", error);
      }
    };

    fetchReciters();
  }, []);

  // Update menuOpen based on hasChosenDirection changes.
  useEffect(() => {
    if (!hasChosenDirection) {
      setMenuOpen(true);
    }
  }, [hasChosenDirection]);

  // Pass the selected reciter into your player hook.
  const quranPlayer = useQuranPlayer(reciter);

  const {
    videoRef,
    faceDirection,
    handleVideoOnPlay,
    stopVideoStream,
    startVideo,
  } = useFaceDetection(
    quranPlayer.fetchRandomVerse,
    quranPlayer.audioRef,
    preferredDirectionRef
  );

  useEffect(() => {
    if (quranPlayer.isContinuing) {
      stopVideoStream();
    } else {
      if (!videoRef.current?.srcObject) {
        startVideo();
      }
    }
  }, [quranPlayer.isContinuing, stopVideoStream, startVideo, videoRef]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <HyperlapseRecorder />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg text-center">
        {menuOpen ? (
          // Menu Card: For setting direction/reciter with a Save button.
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Choose Your Direction</h2>
            <DirectionSelector
              preferredDirection={preferredDirection}
              setPreferredDirection={setPreferredDirection}
            />
            <ReciterSelector
              recitersList={recitersList}
              reciter={reciter}
              setReciter={setReciter}
            />
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        ) : (
          // Normal UI: Show video feed, verse, and controls.
          <div className="space-y-6">
            {/* Show detected direction text only when no verse is playing */}
            {!quranPlayer.audio && (
              <div className="text-lg">
                Detected Direction:{" "}
                <span className="font-bold">{faceDirection}</span> | Preferred
                Direction:{" "}
                <span className="font-bold text-blue-600">
                  {preferredDirection}
                </span>
              </div>
            )}
            <div className="mx-auto">
              <VideoFeed videoRef={videoRef} onPlay={handleVideoOnPlay} />
            </div>
            {quranPlayer.verse && (
              <VerseDisplay
                verse={quranPlayer.verse}
                translation={quranPlayer.translation}
              />
            )}
            {quranPlayer.lastPlayedVerse && (
              <PlayerControls
                audio={quranPlayer.audio}
                isPaused={quranPlayer.isPaused}
                isContinuing={quranPlayer.isContinuing}
                onTogglePause={quranPlayer.togglePause}
                onStopContinuing={quranPlayer.stopContinuingSurah}
                onReplayLastVerse={quranPlayer.replayLastVerse}
                onStartContinuing={quranPlayer.startContinuingSurah}
              />
            )}
            {/* Menu button to return to the settings, only when no verse is playing */}
            {!quranPlayer.audio && (
              <button
                onClick={() => setMenuOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Menu
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
