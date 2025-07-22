import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "URL Shortener - Fast & Reliable Link Shortening",
  description: "Create short URLs instantly with our modern, fast, and reliable URL shortener. Track clicks, manage links, and boost your productivity.",
  keywords: ["url shortener", "link shortener", "short links", "link management", "analytics"],
  authors: [{ name: "URL Shortener App" }],
  creator: "URL Shortener App",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', sizes: '32x32', type: 'image/x-icon' }
    ],
    apple: '/icon.svg',
    shortcut: '/icon.svg'
  },
  openGraph: {
    title: "URL Shortener - Fast & Reliable Link Shortening",
    description: "Create short URLs instantly with our modern, fast, and reliable URL shortener.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Shortener - Fast & Reliable Link Shortening",
    description: "Create short URLs instantly with our modern, fast, and reliable URL shortener.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
