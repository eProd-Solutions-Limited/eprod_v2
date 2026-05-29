import { getPayloadClient } from '@/lib/payload-client'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PopupClient, type SerializedPopup } from "@/components/PopupClient";
import { DemoRequestFAB } from "@/components/DemoRequestFAB";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { getPayload } from "payload";
import payloadConfig from "@/payload.config";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eProd - Empowering Your Agribusiness",
  description: "All in one solution for your business",
};

async function fetchActivePopups(): Promise<SerializedPopup[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'popups',
      where: { isActive: { equals: true } },
      limit: 10,
    });
    return docs as unknown as SerializedPopup[];
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const popups = await fetchActivePopups();

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
        <PopupClient popups={popups} />
        <DemoRequestFAB />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
