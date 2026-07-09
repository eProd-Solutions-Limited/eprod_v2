import { getPayloadClient } from '@/lib/payload-client'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PopupClient, type SerializedPopup } from "@/components/PopupClient";
import { DemoRequestFAB } from "@/components/DemoRequestFAB";
import { LanguageProvider, LANG_COOKIE } from "@/lib/i18n/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { Lang } from "@/lib/i18n/dictionary";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getPayload } from "payload";
import payloadConfig from "@/payload.config";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eprod-solutions.com'),
  title: {
    default: 'eProd — Empowering Your Agribusiness',
    template: '%s | eProd',
  },
  description:
    'All-in-one agribusiness management platform for smallholder farmers, cooperatives, and agri-enterprises across Africa. Farm management, input financing, produce aggregation, and market linkages.',
  openGraph: {
    type: 'website',
    siteName: 'eProd Solutions',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'eProd Solutions — Empowering Your Agribusiness' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
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

  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANG_COOKIE)?.value;
  const initialLang: Lang = langCookie === "fr" ? "fr" : "en";

  return (
    <html
      lang={initialLang}
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider initialLang={initialLang}>
          <Navbar />
          {children}
          <Footer />
          <PopupClient popups={popups} />
          <LanguageToggle />
          <DemoRequestFAB />
        </LanguageProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
