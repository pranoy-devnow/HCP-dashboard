import type { Metadata } from "next";
import "./globals.css";

const baseUrl =
  typeof process !== "undefined" && process.env?.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : typeof process !== "undefined" && process.env?.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL
      : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "HCP Dashboard",
    template: "%s | HCP Dashboard",
  },
  description:
    "Healthcare Professional Dashboard for Medela – manage case files and daily workflows in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{
          // Fallback when next/font is not used (avoids layout shift)
          ["--font-geist-sans" as string]: "ui-sans-serif, system-ui, sans-serif",
          ["--font-geist-mono" as string]: "ui-monospace, monospace",
        }}
      >
        {children}
      </body>
    </html>
  );
}
