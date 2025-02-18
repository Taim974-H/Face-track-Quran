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

export default function QuranPlayer() {
  const {
    preferredDirection,
    setPreferredDirection,
    preferredDirectionRef,
    hasChosenDirection,
  } = useDirection();
  const [recitersList, setRecitersList] = useState([]);
  const [reciter, setReciter] = useState("ar.alafasy"); // Default value

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
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      {/* Render direction selection only when verse is not playing */}
      {!quranPlayer.audio && (
        <>
          {/* Show "Choose your direction" above the selectors if no direction is chosen */}
          {!hasChosenDirection && (
            <div className="mb-4 text-lg">
              <span className="font-bold">Choose your direction</span>
            </div>
          )}
          <DirectionSelector
            preferredDirection={preferredDirection}
            setPreferredDirection={setPreferredDirection}
          />
          <ReciterSelector
            recitersList={recitersList}
            reciter={reciter}
            setReciter={setReciter}
          />
        </>
      )}

      <div className="mb-4 text-lg">
        {quranPlayer.audio ? (
          quranPlayer.isContinuing ? (
            <span className="font-bold">Surah is being recited</span>
          ) : (
            <span className="font-bold">Verse is being recited</span>
          )
        ) :hasChosenDirection && (
          <>
            Detected Direction:{" "}
            <span className="font-bold">{faceDirection}</span> | Preferred
            Direction:{" "}
            <span className="font-bold text-blue-600">
              {preferredDirection}
            </span>
          </>
        )}
      </div>

      {hasChosenDirection && !quranPlayer.isContinuing && (
        <VideoFeed videoRef={videoRef} onPlay={handleVideoOnPlay} />
      )}

      {quranPlayer.verse && (
        <VerseDisplay
          verse={quranPlayer.verse}
          translation={quranPlayer.translation}
        />
      )}

      {hasChosenDirection && quranPlayer.lastPlayedVerse && (
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
    </div>
  );
}
