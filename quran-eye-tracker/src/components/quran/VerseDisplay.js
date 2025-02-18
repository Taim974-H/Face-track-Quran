// src/components/quran/VerseDisplay.js
export const VerseDisplay = ({ verse, translation }) => (
  <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-xl text-center w-4/5 md:w-1/2">
    <p className="text-3xl font-arabic text-gray-900">{verse.text}</p>
    <p className="mt-4 text-xl text-gray-700 italic">{translation}</p>
    <p className="mt-4 text-lg text-gray-600">
      Surah {verse.surahNumber}, Verse {verse.verseNumber}
    </p>
  </div>
);
