import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { TrialBannerWrapper } from "./trial-banner-wrapper";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Encrypted Journal - Private & Secure",
  description: "A completely local, encrypted personal journal with no cloud sync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts fallback for book mode */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Merriweather:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <TrialBannerWrapper />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
