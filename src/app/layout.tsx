import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from 'react-hot-toast';
import Navbar from "../components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskMaster ",
  description: "An advanced platform for intelligently managing your daily tasks"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // قمت بتثبيت اللغة العربية واتجاه اليمين لليسار
    <html lang="en" dir="ltr" suppressHydrationWarning>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
        suppressHydrationWarning
      >
        
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
          <main className="min-h-screen pt-20"> {/* أضفت pt-20 لضمان عدم اختفاء المحتوى خلف الناف بار الثابت */}
            {children}
          </main>
          
      </body>
    </html>
  );
}
