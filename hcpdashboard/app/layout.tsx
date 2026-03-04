import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FALLBACK_APP_URL, LOGIN_HERO_IMAGE } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK_APP_URL;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "HCP Dashboard",
    template: "%s | HCP Dashboard",
  },
  description:
    "Healthcare Professional Dashboard for Medela – manage case files, notifications, learning, and documents in one place.",
  openGraph: {
    type: "website",
    title: "HCP Dashboard",
    description:
      "Healthcare Professional Dashboard for Medela – manage case files, notifications, learning, and documents in one place.",
    url: "/",
    siteName: "HCP Dashboard",
    images: [
      {
        url: LOGIN_HERO_IMAGE,
        width: 1200,
        height: 630,
        alt: "HCP Dashboard – Healthcare Professional Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HCP Dashboard",
    description:
      "Healthcare Professional Dashboard for Medela – manage case files, notifications, learning, and documents in one place.",
    images: [LOGIN_HERO_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
