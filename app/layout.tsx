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
          <div className="w-full flex justify-center mt-4 mb-6">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
              alt="Nature journal inspiration"
              className="rounded-xl shadow-lg max-h-56 object-cover"
              style={{ width: '90%', maxWidth: 900 }}
            />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
