import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Tailgate Scooters - Cornell's Premier Scooter Marketplace",
  description: "Lease quality scooters for the semester at Cornell University. Affordable, convenient, and reliable transportation for students.",
  keywords: "Cornell, scooter, rental, lease, campus, transportation, Ithaca",
  authors: [{ name: "Tailgate Scooters" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tailgate Scooters",
    startupImage: [
      {
        url: "/app-icon-1024.png",
        media: "(device-width: 768px) and (device-height: 1024px)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/app-icon-1024.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Tailgate Scooters - Cornell's Premier Scooter Marketplace",
    description: "Lease quality scooters for the semester at Cornell University",
    type: "website",
    locale: "en_US",
    siteName: "Tailgate Scooters",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#B31B1B" },
    { media: "(prefers-color-scheme: dark)", color: "#B31B1B" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Tailgate Scooters" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tailgate Scooters" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#B31B1B" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/app-icon-1024.png" />
        <link rel="apple-touch-startup-image" href="/app-icon-1024.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#B31B1B" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}