// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// // const geistSans = Geist({
// //   variable: "--font-geist-sans",
// //   subsets: ["latin"],
// // });

// // const geistMono = Geist_Mono({
// //   variable: "--font-geist-mono",
// //   subsets: ["latin"],
// // });
// // app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Stock Vision',
  description: 'Track stock charts easily',
  icons: {
    icon: '/stock-market.png',
    shortcut: '/stock-market.png',
    apple: '/stock-market.png',
  },
  manifest: '/manifest.json' // Optional for PWA
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white font-sans">
        {children}
      </body>
    </html>
  )
}


