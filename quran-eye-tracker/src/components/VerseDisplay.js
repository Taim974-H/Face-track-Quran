import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerseDisplay({ eyesClosed }) {
  const [verse, setVerse] = useState(null);
  const [audio, setAudio] = useState(null);

  const fetchRandomVerse = async () => {
    const surah = Math.floor(Math.random() * 114) + 1;
    const response = await axios.get(
      `https://api.alquran.cloud/v1/surah/${surah}/editions/quran-simple,ar.alafasy`
    );
    
    const verses = response.data.data[0].ayahs;
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    
    setVerse({
      text: randomVerse.text,
      audio: response.data.data[1].ayahs[randomVerse.numberInSurah - 1].audio
    });
  }

  useEffect(() => {
    if(eyesClosed) {
      fetchRandomVerse();
      const audioElement = new Audio(verse.audio);
      audioElement.play();
      setAudio(audioElement);
    } else {
      audio?.pause();
    }
  }, [eyesClosed]);

  return (
    // <div className="verse-container">
    //   {verse && <div className="verse-text">{verse.text}</div>}
    // </div>
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg text-center max-w-2xl">
        {verse && (
          <p className="text-2xl arabic-font">{verse.text}</p>
        )}
      </div>
    </div>
    
  );
}