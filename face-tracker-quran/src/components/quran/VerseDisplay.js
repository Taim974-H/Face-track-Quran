// src/components/quran/VerseDisplay.js
export const VerseDisplay = ({ verse, translation }) => (
  <div className="w-full p-4 sm:p-6 rounded-lg shadow-xl text-center bg-white dark:bg-gray-700">
    <p className="text-xl sm:text-2xl md:text-3xl font-arabic text-gray-900 dark:text-white">
      {verse.text}
    </p>
    <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 italic">
      {translation}
    </p>
    <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-200">
      Surah {verse.surahNumber}, Verse {verse.verseNumber}
    </p>
  </div>
);
