import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "22 Shrutis | २२ श्रुति - Digital Tanpura",
  description: "A digital tanpura app featuring all 22 shrutis (microtones) of Indian classical music. Perfect for practice and performance.",
  keywords: ["tanpura", "shruti", "indian classical music", "drone", "raag", "raga", "music practice"],
};

// Script to prevent flash of wrong theme
const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('22shrutis-theme');
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        // System preference or no saved theme
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
