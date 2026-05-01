"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth(); // جلب البيانات من الكونتكست

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // التأكد من أن المكون تم تحميله في المتصفح لمنع أخطاء الهيدريشن
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // متغير مساعد للتأكد من حالة تسجيل الدخول
  const isLoggedIn = !!user;

  // إذا لم يتم التحميل بعد، نعرض ناف بار فارغ بنفس الارتفاع للحفاظ على التنسيق
  if (!mounted) return <div className="h-20 bg-white border-b border-slate-100" />;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* الجانب الأيسر: اللوجو وزر الموبايل */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMenuOpen ? <line x1="18" y1="6" x2="6" y2="18" /> : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
            <Link href="/" className="text-lg md:text-2xl font-bold bg-linear-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent shrink-0">
              Tasks
            </Link>
          </div>

          {/* روابط التنقل (شاشات كبيرة) */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/" active={pathname === '/'}>Home</NavLink>
            {isLoggedIn && (
              <>
                <NavLink href="/tasks" active={pathname === '/tasks'}>Tasks</NavLink>
                <NavLink href="/addTask" active={pathname === '/addTask'}>Add</NavLink>
              </>
            )}
          </div>

          {/* الجانب الأيمن: أزرار الدخول أو بروفايل المستخدم */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {!isLoggedIn ? (
                <motion.div key="guest" className="flex items-center gap-3">
                  <Link href="/login" className="text-slate-600 hover:text-indigo-600 font-bold text-xs md:text-sm">Login</Link>
                  <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold hover:bg-indigo-700 text-xs md:text-sm transition-all shadow-lg">Start</Link>
                </motion.div>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-full transition-all"
                  >
                    <img 
                      src={user?.userImage} 
                      
                      loading="lazy"
                  alt="Profile"
                  referrerPolicy="no-referrer"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-indigo-100 object-cover"
                    />
                    <svg className={`w-4 h-4 text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {/* القائمة المنسدلة */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                          <p className="text-xs text-slate-400">Welcome,</p>
                          <p className="text-sm font-bold text-slate-700 truncate">{user?.name}</p>
                        </div>
                        <button 
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://w3.org" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* موبايل منيو */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-60 md:hidden" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-70 md:hidden p-6 pt-24">
              {isLoggedIn && (
                <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-2xl">
                  <img src={user?.userImage}
                  loading="lazy"
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500">Active Account</p>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-6">
                <Link href="/" className={`text-lg font-bold ${pathname === '/' ? 'text-indigo-600' : 'text-slate-600'}`}>Home</Link>
                {isLoggedIn && (
                  <>
                    <Link href="/tasks" className={`text-lg font-bold ${pathname === '/tasks' ? 'text-indigo-600' : 'text-slate-600'}`}>Tasks</Link>
                    <Link href="/addTask" className={`text-lg font-bold ${pathname === '/addTask' ? 'text-indigo-600' : 'text-slate-600'}`}>Add Task</Link>
                    <button onClick={logout} className="text-lg font-bold text-red-500 text-left mt-4 flex items-center gap-2">
                       Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link href={href} className={`relative py-1 text-xs md:text-sm font-bold transition-colors ${active ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
      {children}
      {active && <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
    </Link>
  );
}
