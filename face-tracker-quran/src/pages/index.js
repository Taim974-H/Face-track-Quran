// pages/index.js (or your welcome/introduction page)
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Welcome() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleGetStarted = () => router.push('/home');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      {step === 0 && (
        <div className="text-center transition-all duration-500">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to Quran Recitation!
          </h1>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Transform moments of distraction into opportunities for reflection.
            Place this app on your desk and every time you glance at it, a beautiful verse from the Quran will be recited.
          </p>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="w-full max-w-5xl mx-auto transition-all duration-500">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            How It Works
          </h2>

          {/* Row 1: For "Looking Right" */}
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/images/face-right.jpg"
                alt="Looking Right"
                className="w-32 h-32 md:w-48 md:h-48"
                style={{ borderRadius: '15px' }}
              />
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0 md:pl-8">
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                Looking Right
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                This indicates your face is turned so that your nose points toward the right side of the screen. In other words, the right side of your face is more visible.
              </p>
            </div>
          </div>

          {/* Row 2: For "Looking Center" */}
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/images/face-center.jpg"
                alt="Looking Center"
                className="w-32 h-32 md:w-48 md:h-48"
                style={{ borderRadius: '15px' }}
              />
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0 md:pl-8">
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                Looking Center
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                This means your face is directly in front of the camera. Your nose is pointing straight ahead, and you're aligned with the center of the screen.
              </p>
            </div>
          </div>

          {/* Row 3: For "Looking Left" */}
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/images/face-left.jpg"
                alt="Looking Left"
                className="w-32 h-32 md:w-48 md:h-48"
                style={{ borderRadius: '15px' }}
              />
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0 md:pl-8">
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                Looking Left
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                This indicates your face is turned so that your nose points toward the left side of the screen. In other words, the left side of your face is more visible.
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="mt-6 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 block mx-auto"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center transition-all duration-500">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Enjoy Your Recitations
          </h2>
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            Every glance becomes an opportunity to recite and reflect. Turn distractions into moments of spiritual enrichment.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
}
