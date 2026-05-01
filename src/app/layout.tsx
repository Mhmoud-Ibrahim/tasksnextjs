import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; // تم تعديل المسار ليتناسب مع الصورة (الرجوع لمجلد src)

import { Toaster } from 'react-hot-toast';
import Navbar from "../components/Navbar";
// استيراد الـ AuthProvider من المجلد الذي أنشأته
import { AuthProvider } from "../context/AuthContext"; 

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
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
        suppressHydrationWarning
      >
        {/* تغليف التطبيق بالكامل لتمكين التحقق من المستخدم في كل الصفحات */}
          <Navbar />
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <main className="min-h-screen pt-20"> 
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
