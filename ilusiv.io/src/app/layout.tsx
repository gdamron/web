import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Open_Sans, Special_Elite } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const MusicBox = dynamic(() => import("./components/MusicBox"), { ssr: false });

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
  description: "Generative music for all.",
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
        <Navbar />
        {children}
        <div className="fixed bottom-0 right-0 p-8">
          <MusicBox />
        </div>
      </body>
    </html>
  );
}
