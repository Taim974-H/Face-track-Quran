// src/components/quran/DirectionSelector.js
const DirectionButton = ({ direction, isActive, onClick }) => (
  <button
    onClick={() => onClick(direction)}
    className={`px-4 py-2 rounded-lg ${
      isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
    }`}
  >
    {direction.charAt(0).toUpperCase() + direction.slice(1)}
  </button>
);

export const DirectionSelector = ({ preferredDirection, setPreferredDirection }) => (
  <div className="mb-4 flex gap-4">
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
