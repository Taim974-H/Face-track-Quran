// src/hooks/useQuranPlayer.js
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export const useQuranPlayer = (reciter) => {
  const [verse, setVerse] = useState(null);
  const [audio, setAudio] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [lastPlayedVerse, setLastPlayedVerse] = useState(null);
  const [isContinuing, setIsContinuing] = useState(false);
  const isProcessing = useRef(false);
  const audioRef = useRef(null);

  // Create a ref for the reciter value.
  const reciterRef = useRef(reciter);
  useEffect(() => {
    reciterRef.current = reciter;
  }, [reciter]);

  // Keep audioRef in sync with audio state.
  useEffect(() => {
    audioRef.current = audio;
  }, [audio]);

  // Fetch a random verse from the Quran
  const fetchRandomVerse = async () => {
    if (!reciterRef.current) {
      console.error("No reciter selected. Cannot fetch verse.");
      return;
    }
    if (isProcessing.current || audioRef.current) return;
    isProcessing.current = true;
    try {
      const surah = Math.floor(Math.random() * 114) + 1;
      const response = await axios.get(
        `https://api.alquran.cloud/v1/surah/${surah}/editions/quran-simple,${reciterRef.current},en.sahih`
      );
      const verses = response.data.data[0].ayahs;
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];

      const newVerse = {
        text: randomVerse.text,
        audio: response.data.data[1].ayahs[randomVerse.numberInSurah - 1].audio,
        surahNumber: surah,
        verseNumber: randomVerse.numberInSurah,
      };

      const translationText = response.data.data[2].ayahs[randomVerse.numberInSurah - 1].text;

      setVerse(newVerse);
      setLastPlayedVerse(newVerse);
      setTranslation(translationText);
    } catch (error) {
      console.error('Error fetching random verse:', error);
    } finally {
      isProcessing.current = false;
    }
  };

  // Fetch the next verse in the current Surah
  const fetchNextVerse = async () => {
    if (!lastPlayedVerse || isProcessing.current || audioRef.current) return;
    isProcessing.current = true;
    try {
      const surah = lastPlayedVerse.surahNumber;
      const nextVerseNumber = lastPlayedVerse.verseNumber + 1;
      console.log(reciterRef.current)
      const response = await axios.get(
        `https://api.alquran.cloud/v1/surah/${surah}/editions/quran-simple,${reciterRef.current},en.sahih`
      );
      const verses = response.data.data[0].ayahs;
      if (nextVerseNumber > verses.length) {
        alert('End of Surah');
        stopContinuingSurah();
        return;
      }
      const nextVerse = verses[nextVerseNumber - 1];
      const newVerse = {
        text: nextVerse.text,
        audio: response.data.data[1].ayahs[nextVerseNumber - 1].audio,
        surahNumber: surah,
        verseNumber: nextVerseNumber,
      };
      const translationText = response.data.data[2].ayahs[nextVerseNumber - 1].text;
      setVerse(newVerse);
      setLastPlayedVerse(newVerse);
      setTranslation(translationText);
    } catch (error) {
      console.error('Error fetching next verse:', error);
    } finally {
      isProcessing.current = false;
    }
  };

  // Replay the last played verse
  const replayLastVerse = () => {
    if (lastPlayedVerse) {
      setVerse(lastPlayedVerse);
    }
  };

  // Start continuing the current Surah
  const startContinuingSurah = () => {
    setIsContinuing(true);
    if (!verse && lastPlayedVerse) {
      fetchNextVerse();
    }
  };

  // Stop continuing the Surah and reset state (after current verse finishes)
  const stopContinuingSurah = () => {
    setIsContinuing(false);
  };

  // Toggle pause/resume for the audio
  const togglePause = () => {
    if (!audioRef.current) return;
    if (isPaused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPaused(!isPaused);
  };

  // Ref to always hold the current value of isContinuing.
  const isContinuingRef = useRef(isContinuing);
  useEffect(() => {
    isContinuingRef.current = isContinuing;
  }, [isContinuing]);

  // Handle audio playback whenever verse changes.
  useEffect(() => {
    if (verse?.audio) {
      const audioElement = new Audio(verse.audio);
      setAudio(audioElement);
      audioElement.play();

      audioElement.onended = () => {
        audioRef.current = null;
        if (isContinuingRef.current) {
          fetchNextVerse();
        } else {
          setAudio(null);
          setVerse(null);
          setTranslation(null);
        }
      };

      return () => {
        audioElement.pause();
        audioElement.currentTime = 0;
      };
    }
  }, [verse]);

  return {
    verse,
    translation,
    audio,
    isPaused,
    lastPlayedVerse,
    isContinuing,
    fetchRandomVerse,
    fetchNextVerse,
    replayLastVerse,
    startContinuingSurah,
    stopContinuingSurah,
    togglePause,
    audioRef,
  };
};
