import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import {
  BASE_URL,
  SITE_OG_IMAGE,
  getSiteDescription,
  getSiteTitle,
} from "@/lib/seo";
import { defaultLocale } from "@/lib/i18n";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plex",
  display: "swap",
  preload: true,
});

const ogImage = `${BASE_URL}${SITE_OG_IMAGE}`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: getSiteTitle(defaultLocale),
    template: "%s",
  },
  description: getSiteDescription(defaultLocale),
  icons: {
    icon: SITE_OG_IMAGE,
    apple: SITE_OG_IMAGE,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
    siteName: getSiteTitle(defaultLocale),
    images: [{ url: ogImage, width: 512, height: 512, alt: "Swift Horse" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plex.variable} ${plexMono.variable}`}
    >
      <body
        className="font-sans antialiased"
        style={{ backgroundColor: "#f7f8fb", color: "#0c1222" }}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
