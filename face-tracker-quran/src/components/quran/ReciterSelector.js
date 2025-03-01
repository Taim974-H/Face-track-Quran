// src/components/quran/ReciterSelector.js
import React from "react";

export const ReciterSelector = ({ reciter, setReciter, recitersList }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="reciter-select"
        className="mr-2 font-bold dark:text-white"
      >
        Select Reciter:
      </label>
      <select
        id="reciter-select"
        value={reciter}
        onChange={(e) => setReciter(e.target.value)}
        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
      >
        {recitersList.map((r) => (
          <option key={r.identifier} value={r.identifier}>
            {r.englishName}
          </option>
        ))}
      </select>
    </div>
  );
};
