import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "thequiet - Sobriety & Habit Tracker",
  description: "Track your sobriety journey and build better habits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
