// src/components/quran/PlayerControls.js
export const PlayerControls = ({
  versePlaying,
  isPaused,
  isContinuing,
  onTogglePause,
  onStopContinuing,
  onReplayLastVerse,
  onStartContinuing,
  onSkip,
  onRestartSurah, // new prop
}) => (
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
    {versePlaying ? (
      <>
        <button
          onClick={onTogglePause}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-lg shadow-md"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        {isContinuing ? (
          <button
            onClick={onStopContinuing}
            className="px-4 py-2 bg-red-500 dark:bg-red-700 text-white rounded-lg shadow-md"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={onStartContinuing}
            className="px-4 py-2 bg-purple-500 dark:bg-purple-700 text-white rounded-lg shadow-md"
          >
            Continue Surah
          </button>
        )}
        {/* New Skip button */}
        <button
          onClick={onSkip}
          className="px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg shadow-md"
        >
          Skip
        </button>
        {/* New Restart Surah button */}
        <button
          onClick={onRestartSurah}
          className="px-4 py-2 bg-teal-500 dark:bg-teal-600 text-white rounded-lg shadow-md"
        >
          Restart Surah
        </button>
      </>
    ) : (
      <button
        onClick={onReplayLastVerse}
        className="px-4 py-2 bg-green-500 dark:bg-green-700 text-white rounded-lg shadow-md"
      >
        Replay Last Verse
      </button>
    )}
  </div>
);
