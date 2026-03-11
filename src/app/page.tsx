"use client";

import React, { useEffect, useState } from 'react';
// استيراد Link من ملف الـ routing الخاص بك ليدعم اللغات تلقائياً
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link.js';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, [pathname]);

  const checkAuth = () => {
    const auth = localStorage.getItem('is_auth'); 
    setIsLoggedIn(!!auth);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center">
      {/* الخلفية المتحركة */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"
        />
      </div>

      <main className="relative z-10 max-w-5xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-medium text-indigo-200 tracking-wider uppercase">Beta</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1]"
        >
         Organize your life smartly with<br />
          <span className="bg-linear-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            TaskS
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
         The integrated platform for managing your daily tasks, tracking your achievements, and turning your goals into tangible reality.
        </motion.p>

        {/* Buttons */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isLoggedIn ? (
            <> 
              <Link 
                href="/register" // تأكد أن المجلد اسمه register صغير
                className="group relative px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition-all"
              >
              Start your journey of achievement for free
              </Link>
              
              <Link 
                href="/login" // تأكد أن المجلد اسمه login صغير
                className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all"
              >
               login
              </Link>
            </>
          ) : (
            <Link 
              href="/tasks" 
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl"
            >
            Go to the task board
            </Link>
          )}
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-24 pt-12 border-t border-white/5">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-medium text-slate-500">Ultra-fast performance</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-sm font-medium text-slate-500">Complete data security</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">☁️</span>
            <span className="text-sm font-medium text-slate-500">Cloud synchronizationم</span>
          </div>
        </div>
      </main>
    </div>
  );
}
