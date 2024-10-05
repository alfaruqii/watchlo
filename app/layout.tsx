import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import ModalSearch from "./components/search/ModalSearch";
import ModalDocs from "./components/docs/ModalDocs";
import "./globals.css";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

const dmSans = DM_Sans({ subsets: ["latin"] });

const magnatBold = localFont({
  src: "./fonts/MagnatBold.woff",
  variable: "--font-magnatBold",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Watchmilo",
  description: "Free streaming website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} ${magnatBold.variable} font-medium antialiased `}
      >
        <Navbar />
        <div className="min-h-screen">
          <ModalDocs />
          {children}
          <Analytics />
          <SpeedInsights />
        </div>
        <Footer />
        <ModalSearch />
      </body>
    </html >
  );
}
