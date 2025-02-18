// src/components/quran/VideoFeed.js
export const VideoFeed = ({ videoRef, onPlay }) => (
  <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
    onPlay={onPlay}
    className="w-full max-w-md object-cover border border-gray-300 rounded-lg shadow-md"
  />
);
