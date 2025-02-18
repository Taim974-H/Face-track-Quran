// src/components/WelcomeModal.js
import React from 'react';

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Welcome to Quran Recitation!</h2>
        <p className="mb-2">
          Ramadan is approaching and we know how busy you are with work, studies, and daily life.
          This app is designed to transform those distracting moments into opportunities for Quran recitation.
        </p>
        <p className="mb-2">
          Here's how it works:
        </p>
        <ul className="list-disc list-inside mb-2">
          <li><strong>Left:</strong> Indicates you are looking to your left.</li>
          <li><strong>Center:</strong> Indicates you are looking straight ahead.</li>
          <li><strong>Right:</strong> Indicates you are looking to your right.</li>
        </ul>
        <p className="mb-2">
          Each time you glance at your phone (placed on your desk), the app detects your face direction and
          plays a random verse from the Quran with its translation, turning your distraction into a blessing.
        </p>
        <p className="mb-4">Enjoy your recitations and have a blessed Ramadan!</p>
        <button 
          onClick={onClose} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
