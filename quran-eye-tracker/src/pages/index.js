import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import FaceTracker from '@/components/FaceTracker';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <FaceTracker />
    </main>
  );
}
