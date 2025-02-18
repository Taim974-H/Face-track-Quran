// src/components/quran/VerseDisplay.js
export const VerseDisplay = ({ verse, translation }) => (
  <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-xl text-center w-11/12 sm:w-3/4 md:w-1/2">
    <p className="text-xl sm:text-2xl md:text-3xl font-arabic text-gray-900">
      {verse.text}
    </p>
    <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 italic">
      {translation}
    </p>
    <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600">
      Surah {verse.surahNumber}, Verse {verse.verseNumber}
    </p>
  </div>
);
