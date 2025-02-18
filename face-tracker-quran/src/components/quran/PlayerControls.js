// src/components/quran/PlayerControls.js
export const PlayerControls = ({
  audio,
  isPaused,
  isContinuing,
  onTogglePause,
  onStopContinuing,
  onReplayLastVerse,
  onStartContinuing
}) => (
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
    {audio ? (
      <>
        <button
          onClick={onTogglePause}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        {isContinuing ? (
          <button
            onClick={onStopContinuing}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={onStartContinuing}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md"
          >
            Continue Surah
          </button>
        )}
      </>
    ) : (
      <>
        <button
          onClick={onReplayLastVerse}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md"
        >
          Replay Last Verse
        </button>
        <button
          onClick={onStartContinuing}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md"
        >
          Continue Surah
        </button>
      </>
    )}
  </div>
);
