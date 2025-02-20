// src/components/quran/DirectionSelector.js

const DirectionButton = ({ direction, isActive, onClick, className = '' }) => (
  <button
    onClick={() => onClick(direction)}
    className={`px-4 py-2 rounded-lg ${
      isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
    } ${className}`}
  >
    {direction.charAt(0).toUpperCase() + direction.slice(1)}
  </button>
);

export const DirectionSelector = ({
  preferredDirection,
  setPreferredDirection,
  className = '',
}) => (
  <div className={`mb-4 flex gap-4 justify-center ${className}`}>
    {['left', 'center', 'right'].map((direction) => (
      <DirectionButton
        key={direction}
        direction={direction}
        isActive={preferredDirection === direction}
        onClick={setPreferredDirection}
      />
    ))}
  </div>
);
