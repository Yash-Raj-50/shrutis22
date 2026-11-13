import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

// Apply the saved theme before React hydrates to prevent a light-theme flash.
const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('22shrutis-theme');
      const shouldUseDarkTheme = theme === 'dark'
        || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (shouldUseDarkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
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
        <meta
          name="google-site-verification"
          content="xgDmSek1o0dc4UG5BhRiKi7eB-0jcQmZTNkLP6zhVXM"
        />
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
