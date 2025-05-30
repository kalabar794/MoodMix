import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "MoodMix - Music for Your Mood",
  description: "Discover the perfect playlist for your current mood. MoodMix uses AI to match music to your emotions.",
  keywords: "music, mood, playlist, spotify, emotion, AI, music discovery",
  authors: [{ name: "MoodMix" }],
  openGraph: {
    title: "MoodMix - Music for Your Mood",
    description: "Discover the perfect playlist for your current mood",
    type: "website",
    url: "https://moodmix.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MoodMix - Music for Your Mood",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMix - Music for Your Mood",
    description: "Discover the perfect playlist for your current mood",
    images: ["/og-image.png"],
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
