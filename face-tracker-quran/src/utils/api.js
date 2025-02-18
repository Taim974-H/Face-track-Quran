// src/utils/api.js
import axios from 'axios';

const API_BASE = 'https://api.alquran.cloud/v1';

export const fetchSurah = async (surahNumber) => {
  try {
    const response = await axios.get(
      `${API_BASE}/surah/${surahNumber}/editions/quran-simple,ar.alafasy,en.sahih`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw error;
  }
};
