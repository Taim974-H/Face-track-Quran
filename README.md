# Face Track Quran

Face Track Quran is a web app that transforms moments of distraction into opportunities for spiritual enrichment. Built with Next.js, this app uses real-time face detection to randomly select and recite Quranic verses based on the user's face direction. Whether you’re at your desk or on the go, this app helps you incorporate Quran recitations into your daily routine seamlessly.

## Live Demo

Check out the production version here: [https://face-track-quran.vercel.app/](https://face-track-quran.vercel.app/)

## Features

- **Face Detection:**  
  Uses [face-api.js](https://github.com/justadudewhohacks/face-api.js) to detect whether your face is looking left, center, or right. The app then selects a random verse based on the detected direction.

- **Audio Playback & Translation:**  
  Each selected verse is recited with audio playback and accompanied by its translation for enhanced understanding.

- **Continuous Surah Playback:**  
  Users can choose to replay a verse, or continue sequentially to play the next verse in the Surah—without needing further face detection until the user stops.

- **Reciter Selection:**  
  Customize your experience by choosing your preferred reciter from a dropdown list. The app fetches valid reciters dynamically from the API.

- **Hyperlapse Recorder:**  
  Record a hyperlapse (fast-motion) video of the recitations using the in-browser FFmpeg (FFmpeg-wasm) integration. You can start and stop recording and directly download the processed MP4 video.

- **Responsive Design:**  
  Designed to work seamlessly across desktops, mobile devices, and iOS, ensuring a neat and intuitive UI on every platform.

- **User-Friendly Menu:**  
  A dedicated menu card guides users to choose their direction and reciter before starting face detection, making the experience easy and customizable.

## Use Cases

- **Spiritual Focus at Work:**  
  With busy schedules and constant distractions, Face Track Quran lets you turn idle moments into opportunities for Quran recitation, adding spiritual value to your day.

- **On-the-Go Recitation:**  
  Simply open the app on your mobile device, leave it on your desk or table, and let it recite a verse every time you glance at it.

- **Personal Reflection:**  
  The app encourages reflection by pairing each verse with its translation, making it an excellent tool for daily meditation and learning.

- **Creative Hyperlapse Videos:**  
  Capture and share fast-motion videos of your work or study session with the built-in hyperlapse recorder.

- **More to come..**

## Technologies Used

- **Next.js:** Modern React framework for building fast, scalable web applications.
- **React:** For component-based UI development.
- **face-api.js:** For real-time face detection.
- **Axios:** For API calls to fetch Quranic data and reciter editions.
    - Contribute to the open source project: [https://github.com/islamic-network/alquran.cloud](https://github.com/islamic-network/alquran.cloud)
- **FFmpeg-wasm:** To process and convert recorded video into hyperlapse MP4 format.
- **Tailwind CSS:** For rapid, responsive styling.
