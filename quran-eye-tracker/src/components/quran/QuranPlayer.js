// src/components/quran/QuranPlayer.js
import { useEffect } from 'react';
import { useDirection } from '../../hooks/useDirection';
import { useFaceDetection } from '../../hooks/useFaceDetection';
import { useQuranPlayer } from '../../hooks/useQuranPlayer';
import { DirectionSelector } from './DirectionSelector';
import { VideoFeed } from './VideoFeed';
import { VerseDisplay } from './VerseDisplay';
import { PlayerControls } from './PlayerControls';

export default function QuranPlayer() {
  const {
    preferredDirection,
    setPreferredDirection,
    preferredDirectionRef,
    hasChosenDirection,
  } = useDirection();
  const quranPlayer = useQuranPlayer();
  const { videoRef, faceDirection, handleVideoOnPlay, stopVideoStream, startVideo } =
    useFaceDetection(
      quranPlayer.fetchRandomVerse,
      quranPlayer.audioRef,
      preferredDirectionRef
    );

  // Monitor the isContinuing flag to stop/start the video stream.
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
      {/* Show DirectionSelector only if no verse is being played */}
      {!quranPlayer.audio && (
        <DirectionSelector
          preferredDirection={preferredDirection}
          setPreferredDirection={setPreferredDirection}
        />
      )}

      <div className="mb-4 text-lg">
        {quranPlayer.audio ? (
          <span className="font-bold">Verse is being recited</span>
        ) : !hasChosenDirection ? (
          <span className="font-bold">Choose your direction</span>
        ) : (
          <>
            Detected Direction: <span className="font-bold">{faceDirection}</span> | Preferred Direction:{' '}
            <span className="font-bold text-blue-600">{preferredDirection}</span>
          </>
        )}
      </div>

      {/* Only attach the onPlay handler and the whole videoFeed component when a direction is chosen */}
      {hasChosenDirection && (
        <VideoFeed
        videoRef={videoRef}
        onPlay={hasChosenDirection ? handleVideoOnPlay : undefined}
      />
      )}

      {quranPlayer.verse && (
        <VerseDisplay verse={quranPlayer.verse} translation={quranPlayer.translation} />
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
