"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
 // تأكد أن مسار ملف axios صحيح
import { useRouter } from 'next/navigation';
import api from '../lib/api';

// 1. تعريف شكل بيانات المستخدم (User Interface)
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  userImage?: string;
}

// 2. تعريف شكل الـ Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkUserAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // دالة للتحقق من التوكن وجلب بيانات المستخدم
  const checkUserAuth = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me'); // نداء راوت الـ getMe في الباك إند
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // دالة تسجيل الخروج
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // التحقق من المستخدم أول ما الموقع يفتح
  useEffect(() => {
    checkUserAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkUserAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook مخصص عشان تستدعي البيانات بسهولة في أي صفحة
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
