import type { Metadata } from "next";
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
  openGraph: {
    title: "Tailgate Scooters - Cornell's Premier Scooter Marketplace",
    description: "Lease quality scooters for the semester at Cornell University",
    type: "website",
    locale: "en_US",
    siteName: "Tailgate Scooters",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}