import type { Metadata } from "next";
import { Open_Sans, Special_Elite } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { MusicPlayerProvider } from "./components/MusicPlayer";
import { DockedPlayer } from "./components/PlayButton";


const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  variable: "--font-special-elite",
  weight: "400",
});

export const metadata: Metadata = {
  title: "ilusiv",
  description:
    "A software studio that builds Fugue, a tool for composing generative music, and takes on consulting work in music, media and creator tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`tracking-wide font-light ${openSans.className} ${openSans.variable} ${specialElite.variable}`}
      >
        <MusicPlayerProvider>
          <Navbar />
          {children}
          <Footer />
          <DockedPlayer />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
