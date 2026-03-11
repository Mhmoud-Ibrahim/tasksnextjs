// "use client";

// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Cookies from 'js-cookie';
// import { usePathname, useRouter } from 'next/navigation'; // استخدام المسار الصحيح للـ App Router
// import Link from 'next/link';

// export default function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   const checkAuth = () => {
//     const auth = localStorage.getItem('is_auth'); 
//     setIsLoggedIn(!!auth);
//   };

//   useEffect(() => {
//     setMounted(true);
//     checkAuth();
//     window.addEventListener('authChange', checkAuth);
//     return () => window.removeEventListener('authChange', checkAuth);
//   }, [pathname]);

//   const handleLogout = () => {
//     Cookies.remove('task_token');
//     localStorage.removeItem('is_auth');
//     setIsLoggedIn(false);
//     router.push('/login'); 
//     router.refresh();
//   };

//   if (!mounted) return <div className="h-20 bg-white border-b border-slate-100" />;

//   return (
//     <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-6 py-4 shadow-sm">
//       <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        
//         {/* الشعار */}
//         <Link 
//           href="/" 
//           className="text-lg md:text-2xl font-bold bg-linear-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent shrink-0"
//         >
//           Tasks
//         </Link>

//         {/* روابط التنقل الرئيسية */}
//         <div className="hidden md:flex items-center gap-8">
//          <NavLink href="/" active={pathname === '/'}>
//   <div className="flex items-center gap-1.5 group">
//     <svg 
//       xmlns="http://www.w3.org" 
//       width="18" 
//       height="18" 
//       viewBox="0 0 24 24" 
//       fill={pathname === '/' ? "currentColor" : "none"} 
//       stroke="currentColor" 
//       strokeWidth="2" 
//       strokeLinecap="round" 
//       strokeLinejoin="round"
//       className="transition-colors duration-200"
//     >
//       <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//       <polyline points="9 22 9 12 15 12 15 22"></polyline>
//     </svg>
//     <span>home</span>
//   </div>
// </NavLink>

//           {isLoggedIn && (
//             <>
//               <NavLink href="/tasks" active={pathname === '/Tasks'}>tasks</NavLink>
//               <NavLink href="/addTask" active={pathname === '/AddTask'}>add</NavLink>
              
//             </>
//           )}
          
//         </div>

//         <div className="flex items-center gap-3">
//           <AnimatePresence mode="wait">
//             {!isLoggedIn ? (
//               <motion.div key="guest" className="flex items-center gap-3">
//                 <Link href="/login" className="text-slate-600 hover:text-indigo-600 font-bold text-xs md:text-sm">
//                 login
//                 </Link>
//                 <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold hover:bg-indigo-700 text-xs md:text-sm transition-all shadow-lg shadow-indigo-200">
//                  start
//                 </Link>
             
//               </motion.div>
//             ) : (
//               <button 
//                 onClick={handleLogout} 
//                 className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl font-bold transition-all text-xs md:text-sm"
//               >
//                 <span>logout</span>
//               </button>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </nav>
//   );
// }

// function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
//   return (
//     <Link 
//       href={href} 
//       className={`relative py-1 text-xs md:text-sm font-bold transition-colors ${
//         active ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
//       }`}
//     >
//       {children}
//       {active && (
//         <motion.div 
//           layoutId="nav-underline" 
//           className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" 
//         />
//       )}
//     </Link>
//   );
// }

"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // حالة القائمة الجانبية

  const checkAuth = () => {
    const auth = localStorage.getItem('is_auth'); 
    setIsLoggedIn(!!auth);
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, [pathname]);

  // إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove('task_token');
    localStorage.removeItem('is_auth');
    setIsLoggedIn(false);
    router.push('/login'); 
    router.refresh();
  };

  if (!mounted) return <div className="h-20 bg-white border-b border-slate-100" />;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          <div className="flex items-center gap-4">
            {/* زر القائمة للموبايل */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMenuOpen ? <line x1="18" y1="6" x2="6" y2="18" /> : <line x1="3" y1="12" x2="21" y2="12" />}
                {!isMenuOpen && <line x1="3" y1="6" x2="21" y2="6" />}
                {!isMenuOpen && <line x1="3" y1="18" x2="21" y2="18" />}
              </svg>
            </button>

            {/* الشعار */}
            <Link 
              href="/" 
              className="text-lg md:text-2xl font-bold bg-linear-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent shrink-0"
            >
              Tasks
            </Link>
          </div>

          {/* روابط التنقل الرئيسية (للدسك توب فقط) */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/" active={pathname === '/'}>
              <div className="flex items-center gap-1.5 group">
                <svg xmlns="http://www.w3.org" width="18" height="18" viewBox="0 0 24 24" fill={pathname === '/' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-200">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>home</span>
              </div>
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink href="/tasks" active={pathname === '/tasks'}>tasks</NavLink>
                <NavLink href="/addTask" active={pathname === '/addTask'}>add</NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {!isLoggedIn ? (
                <motion.div key="guest" className="flex items-center gap-3">
                  <Link href="/login" className="text-slate-600 hover:text-indigo-600 font-bold text-xs md:text-sm">
                    login
                  </Link>
                  <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold hover:bg-indigo-700 text-xs md:text-sm transition-all shadow-lg shadow-indigo-200">
                    start
                  </Link>
                </motion.div>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl font-bold transition-all text-xs md:text-sm"
                >
                  <span>logout</span>
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* القائمة الجانبية للموبايل */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* خلفية معتمة */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] md:hidden"
            />
            {/* لوحة القائمة */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl z-[70] md:hidden p-6 pt-24"
            >
              <div className="flex flex-col gap-6">
                <Link href="/" className={`text-lg font-bold ${pathname === '/' ? 'text-indigo-600' : 'text-slate-600'}`}>
                  Home
                </Link>
                {isLoggedIn && (
                  <>
                    <Link href="/tasks" className={`text-lg font-bold ${pathname === '/tasks' ? 'text-indigo-600' : 'text-slate-600'}`}>
                      Tasks
                    </Link>
                    <Link href="/addTask" className={`text-lg font-bold ${pathname === '/addTask' ? 'text-indigo-600' : 'text-slate-600'}`}>
                      Add Task
                    </Link>
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
    <Link 
      href={href} 
      className={`relative py-1 text-xs md:text-sm font-bold transition-colors ${
        active ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
      }`}
    >
      {children}
      {active && (
        <motion.div 
          layoutId="nav-underline" 
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" 
        />
      )}
    </Link>
  );
}
