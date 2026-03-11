"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../lib/api';

// مخطط التحقق الخاص بالدخول
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('البريد الإلكتروني غير صالح')
        .required('البريد الإلكتروني مطلوب'),
    password: Yup.string()
        .min(6, 'كلمة المرور قصيرة جداً')
        .required('كلمة المرور مطلوبة'),
});

export default function LoginPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            {/* حركة دخول الصفحة */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-100"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Login</h1>
                    <p className="text-slate-500 text-sm">Welcome back to the Tasks Platform</p>
                </div>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                        try {
                            // إرسال الطلب إلى الـ API
                            const response = await api.post('/signin', values);

                            if (response.data.message === 'success') {
                                localStorage.setItem('is_auth', 'true');  // 1. إرسال حدث لتنبيه الـ Navbar ليقوم بفحص الكوكيز فوراً
                                window.dispatchEvent(new Event("authChange"));
                                // 2. التوجيه لصفحة المهام
                                router.push('/tasks');
                            }
                        } catch (error: any) {
                            setStatus(error.response?.data?.message || 'email or password is incorrect');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting, status }) => (
                        <Form className="space-y-4">
                            {status && (
                                <motion.div
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-amber-50 text-amber-700 p-3 rounded-lg text-sm border border-amber-100 text-center font-medium"
                                >
                                    {status}
                                </motion.div>
                            )}

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">ُEmail</label>
                                <Field
                                    name="email"
                                    type="email"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-slate-700"> Password</label>
                                    <Link href="/forgotpassword" className="text-xs text-indigo-600 hover:underline">  Forget Password</Link>
                                </div>
                                <Field
                                    name="password"
                                    type="password"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-70 mt-2"
                            >
                                {isSubmitting ? 'جاري التحقق...' : 'login'}
                            </motion.button>
                        </Form>
                    )}
                </Formik>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">أو</span></div>
                </div>

                <p className="text-center text-sm text-slate-600">
                   Don't have an account?{' '}
                    <Link href="/register" className="text-indigo-600 font-bold hover:underline">
                       Create your account now
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
